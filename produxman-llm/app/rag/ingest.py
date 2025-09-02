# app/rag/ingest.py
import os, re, requests, chromadb
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()
EMBED_URL   = os.getenv("OLLAMA_EMBED_URL", "http://localhost:11434/api/embeddings")
CHROMA_PATH = os.getenv("CHROMA_PATH", "storage/chroma")
COLLECTION  = os.getenv("COLLECTION_NAME", "documents")
EMBED_MODEL = "nomic-embed-text"

def _clean(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip()

def _read_text(path: str) -> str:
    if path.lower().endswith(".pdf"):
        pdf = PdfReader(path)
        return _clean("\n".join(_clean(p.extract_text()) for p in pdf.pages))
    return _clean(open(path, "r", encoding="utf-8").read())

def _chunk(text: str, max_chars=1600, min_chars=200):
    sents = re.split(r"(?<=[.!?])\s+", text)
    out, cur = [], ""
    for s in sents:
        if len(cur) + len(s) < max_chars: cur += (" " if cur else "") + s
        else:
            if len(cur) >= min_chars: out.append(cur)
            cur = s
    if len(cur) >= min_chars: out.append(cur)
    return out

def _embed(t: str):
    r = requests.post(EMBED_URL, json={"model": EMBED_MODEL, "prompt": t}, timeout=60)
    r.raise_for_status()
    return r.json()["embedding"]

def ingest(path: str):
    text = _read_text(path)
    chunks = _chunk(text)
    print(f"📦 chunks={len(chunks)} → collection={COLLECTION}")

    client = chromadb.PersistentClient(path=CHROMA_PATH)
    try: client.delete_collection(COLLECTION)
    except Exception: pass
    col = client.create_collection(COLLECTION)

    ids, embs, metas = [], [], []
    for i, ch in enumerate(chunks):
        ids.append(f"doc-{i}")
        embs.append(_embed(ch))
        metas.append({"source": os.path.basename(path), "i": i})
    col.add(ids=ids, embeddings=embs, documents=chunks, metadatas=metas)
    print(f"✅ Ingested {len(chunks)} into {CHROMA_PATH}/{COLLECTION}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m app.rag.ingest <path-to-file.pdf|.txt>")
        raise SystemExit(1)
    ingest(sys.argv[1])
