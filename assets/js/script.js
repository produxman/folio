// Footer year
document.getElementById("y").textContent = new Date().getFullYear();

// Theme toggle
const btn = document.getElementById("toggle-theme");
btn.addEventListener("click", () => {
  document.body.dataset.theme = document.body.dataset.theme === "light" ? "dark" : "light";
});

// Data: Projects per company
const projects = {
  "Meister": [
    { img: "assets/img/work1.webp", title: "Billing Re-architecture", desc: "Service-oriented billing; +12% ARR uplift" },
    { img: "assets/img/work2.webp", title: "AI Monetization", desc: "Pricing models for 0→1 AI rollout" }
  ],
  "Pelcro": [
    { img: "assets/img/work3.webp", title: "Campaign Builder", desc: "+20% conversions via segmentation" },
    { img: "assets/img/work4.webp", title: "WorldPay Integration", desc: "Expanded payments coverage" }
  ],
  "Dell": [
    { img: "assets/img/work5.webp", title: "PowerProtect Sizer", desc: "Infra sizing tool; +10% upsell" }
  ],
  "Zyda": [
    { img: "assets/img/work6.webp", title: "Deliverect Integration", desc: "+25% CSAT via POS sync" }
  ],
  "CIB": [
    { img: "assets/img/work7.webp", title: "Enterprise Backup", desc: "-50% RTO, -30% data loss risk" }
  ],
  "VeraSafe": [
    { img: "assets/img/work8.webp", title: "Preava Prevent", desc: "MVP email security plugin" }
  ]
};

// Render function
function renderProjects(company) {
  const container = document.getElementById("project-list");
  container.innerHTML = "";
  projects[company].forEach(p => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = "#"; // later we link to details
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Initial render (Meister)
renderProjects("Meister");

// Timeline click
document.querySelectorAll(".timeline li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll(".timeline li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");
    renderProjects(li.dataset.company);
  });
});
