from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import chromadb, os, requests, time, json, base64
from functools import wraps
import os
from dotenv import load_dotenv

# Load .env config
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# ---- Fingerprint (to confirm which build is running) ----
APP_VERSION = "v9-stream-live"
print(f"BOOT {APP_VERSION} file={__file__}", flush=True)

# ---- Config ----
# --- Resolve CHROMA_PATH relative to project root ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))      # .../produxman-llm/app
PROJECT_ROOT = os.path.dirname(BASE_DIR)                   # .../produxman-llm
_chroma_env = os.getenv("CHROMA_PATH", "storage/chroma")
CHROMA_PATH = _chroma_env if os.path.isabs(_chroma_env) else os.path.normpath(os.path.join(PROJECT_ROOT, _chroma_env))
OLLAMA_URL = os.getenv("OLLAMA_URL")
MODEL_NAME = os.getenv("MODEL_NAME")
USERNAME = os.getenv("BASIC_AUTH_USERNAME")
PASSWORD = os.getenv("BASIC_AUTH_PASSWORD")
OLLAMA_EMBED_URL = os.getenv("OLLAMA_EMBED_URL")
EMBED_MODEL = "nomic-embed-text"
COLLECTION = os.getenv("COLLECTION_NAME", "documents")
VECTOR_STORE = os.getenv("VECTOR_STORE", "chroma")

if not all([OLLAMA_URL, MODEL_NAME, USERNAME, PASSWORD, VECTOR_STORE, CHROMA_PATH, OLLAMA_EMBED_URL]):
    raise RuntimeError("❌ One or more required environment variables are missing.")

# --- RAG wiring (generic) ---
try:
    _chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    _docs_col = _chroma_client.get_collection(COLLECTION)
except Exception:
    _docs_col = None  # becomes available after ingest

def _load_collection():
    global _docs_col
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    _docs_col = client.get_collection(COLLECTION)
    return True

def _embed_query(q: str):
    r = requests.post(OLLAMA_EMBED_URL, json={"model": EMBED_MODEL, "prompt": q}, timeout=30)
    r.raise_for_status()
    return r.json()["embedding"]

def _retrieve(question: str, k: int = 5, max_chars: int = 3200):
    if _docs_col is None:
        try: _load_collection()
        except Exception: return [], []
    qv = _embed_query(question)
    res = _docs_col.query(query_embeddings=[qv], n_results=k, include=["documents","metadatas"])
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    out_docs, out_metas, used = [], [], 0
    for d, m in zip(docs, metas):
        if used + len(d) > max_chars: break
        out_docs.append(d); out_metas.append(m); used += len(d)
    return out_docs, out_metas

def _build_prompt(user_q: str, ctx_docs: list, ctx_metas: list) -> str:
    if not ctx_docs:
        return user_q  # fallback to normal generation
    numbered = []
    for i, (d, m) in enumerate(zip(ctx_docs, ctx_metas), start=1):
        tag = f"[{i} src={m.get('source','doc')}, chunk={m.get('i','?')}]"
        numbered.append(f"{tag}\n{d}")
    context = "\n\n---\n\n".join(numbered)
    return f"""Answer strictly using the CONTEXT. If the answer isn't in the context, say "I can't find that."

[CONTEXT]
{context}

[QUESTION]
{user_q}

End with sources like [1][2] if used.
"""

# ---- Basic Auth ----
def require_basic_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if not auth or not auth.startswith('Basic '):
            return jsonify({"code": 401, "message": "Missing authorization header"}), 401
        try:
            encoded = auth.split(' ')[1]
            decoded = base64.b64decode(encoded).decode('utf-8')
            user, pwd = decoded.split(':', 1)
            if user != USERNAME or pwd != PASSWORD:
                raise ValueError
        except Exception:
            return jsonify({"code": 403, "message": "Invalid credentials"}), 403
        return f(*args, **kwargs)
    return decorated

# ---- Routes ----
@app.route("/version")
def version():
    """Version endpoint - no auth required"""
    print("📍 HIT /version", flush=True)  # Debug log
    return jsonify({"ok": True, "version": APP_VERSION})

@app.route("/health/stream")
def health_stream():
    # Streams 5 ticks without touching Ollama (proves chunked streaming works)
    def gen():
        for i in range(5):
            yield json.dumps({"tick": i, "v": APP_VERSION}) + "\n"
            time.sleep(0.4)
    return Response(
        stream_with_context(gen()),
        headers={
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )

# 🧠 Endpoint: Generate with stream fix
@app.route('/api/generate', methods=['OPTIONS', 'POST'])
def generate():
    if request.method == 'OPTIONS':
        return Response(status=200)
    return protected_generate()

@app.route("/rag/status")
def rag_status():
    ok = _docs_col is not None
    if not ok:
        try:
            _load_collection()
            ok = True
        except Exception as e:
            return jsonify({"CHROMA_PATH": CHROMA_PATH, "COLLECTION": COLLECTION, "loaded": False, "error": str(e)})
    return jsonify({"CHROMA_PATH": CHROMA_PATH, "COLLECTION": COLLECTION, "loaded": ok})

@app.route("/rag/reload", methods=["POST"])
@require_basic_auth
def rag_reload():
    try:
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        col = client.get_collection(COLLECTION)
        # swap the global handle
        global _docs_col
        _docs_col = col
        # try to report a count (API varies by version)
        try:
            count = col.count()  # works on recent chromadb
        except Exception:
            count = None
        return jsonify({
            "reloaded": True,
            "collection": COLLECTION,
            "path": CHROMA_PATH,
            "count": count
        }), 200
    except Exception as e:
        return jsonify({
            "reloaded": False,
            "collection": COLLECTION,
            "path": CHROMA_PATH,
            "error": str(e)
        }), 500

@require_basic_auth
def protected_generate():
    if not request.is_json:
        return jsonify({"code": 400, "message": "Content-Type must be application/json"}), 400

    try:
        data = request.get_json(force=True)
        prompt = data.get("prompt", "").strip()
        if not prompt:
            return jsonify({"code": 400, "message": "Missing 'prompt' field"}), 400
    except Exception:
        return jsonify({"code": 400, "message": "Malformed JSON in request body"}), 400
    
    # --- RAG: opt-in via request body ---
    use_rag = bool(data.get("rag", False))
    top_k   = int(data.get("k", 5))

    if use_rag:
        if _docs_col is None and not _load_collection():
            # Collection not loaded (ingest not run / wrong COLLECTION_NAME)
            return jsonify({
                "code": 424,
                "message": "RAG requested but no collection is loaded. Run ingest or check COLLECTION_NAME."
            }), 424
        ctx_docs, ctx_metas = _retrieve(prompt, k=top_k)
        prompt = _build_prompt(prompt, ctx_docs, ctx_metas)
        print(f"🧠 RAG used: k={len(ctx_docs)} → prompt len={len(prompt)} chars", flush=True)

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": True  # still needed to avoid full wait timeout
    }

    try:
        ollama_response = requests.post(OLLAMA_URL, json=payload, stream=True, timeout=60)
        
        def stream_chunks():
            for line in ollama_response.iter_lines():
                if line:
                    try:
                        # Pass through the raw line from Ollama
                        yield line.decode("utf-8") + "\n"
                    except Exception:
                        continue

        return Response(
            stream_with_context(stream_chunks()),
            headers={
                "Content-Type": "application/x-ndjson",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            }
        )
    except requests.exceptions.RequestException as e:
        return jsonify({"code": 502, "message": "Ollama backend error", "details": str(e)}), 502
    except Exception as e:
        return jsonify({"code": 500, "message": "Unexpected error", "details": str(e)}), 500

# 🌐 Add CORS to every response
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
