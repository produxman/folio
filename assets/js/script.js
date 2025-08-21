// ===== Data =====
themeToggle.addEventListener('click', () => {
const current = document.documentElement.getAttribute('data-theme');
const next = current === 'light' ? '' : 'light';
if (next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
localStorage.setItem('theme', next);
});
}


// ===== Render timeline =====
function renderTimeline(activeKey = DATA[0].key) {
timelineList.innerHTML = '';
DATA.forEach((c) => {
const li = document.createElement('li');
li.dataset.key = c.key;
li.className = c.key === activeKey ? 'active' : '';


li.innerHTML = `
<div class="company">
<strong>${c.name}</strong>
<span class="dates">${c.dates}</span>
</div>
<div class="details">
<div class="title">${c.title}</div>
<div class="summary">${c.summary}</div>
</div>
`;


li.addEventListener('click', () => setActiveCompany(c.key));
timelineList.appendChild(li);
});
}


// ===== Render projects =====
function renderProjects(companyKey) {
const company = DATA.find((c) => c.key === companyKey);
projectsTitle.textContent = `${company.name} — Projects`;
projectGrid.innerHTML = '';


if (!company.projects || company.projects.length === 0) {
projectGrid.innerHTML = `<p class="muted">No public projects to show for this company yet.</p>`;
return;
}


company.projects.forEach((p) => {
const a = document.createElement('a');
a.className = 'card';
a.href = p.href || '#';
a.innerHTML = `
<div class="cover"><img src="${p.cover}" alt="${p.title}"></div>
<div class="body">
<h4>${p.title}</h4>
<p>${p.desc}</p>
</div>
`;
projectGrid.appendChild(a);
});
}


function setActiveCompany(key) {
// timeline active
document.querySelectorAll('#timelineList li').forEach((li) => li.classList.toggle('active', li.dataset.key === key));
// expand selected, collapse others (handled via CSS max-height)
renderProjects(key);
}


// ===== Init =====
renderTimeline(DATA[0].key);
renderProjects(DATA[0].key);
