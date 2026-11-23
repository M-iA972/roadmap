// Fonctions communes du prototype : menu, badges, toasts, confirmations.
const $ = (s, root = document) => root.querySelector(s);
const params = new URLSearchParams(location.search);
const param = (k) => params.get(k);
const idParam = () => Number(param('id')) || null;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Libellés ---------- */
const STATUS = { backlog: 'Backlog', todo: 'À faire', in_progress: 'En cours', done: 'Terminé', cancelled: 'Annulé' };
const SPRINT_STATUS = { planning: 'Planification', active: 'Actif', done: 'Terminé' };
const PRIORITY = { critical: 'Critique', high: 'Haute', medium: 'Moyenne', low: 'Basse', nice_to_have: 'Bonus' };
const EFFORTS = [1, 2, 3, 5, 8, 13];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* ---------- Icônes au trait ---------- */
const ICONS = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  send: '<path d="M4 12l16-8-6 16-3-7-7-1z"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M16 4a4 4 0 010 8M22 21c0-3-2-5-4-6"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  logout: '<path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>',
  alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4M12 17h.01"/>',
};
const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
const PRIORITY_ICON = { critical: 'bolt', high: 'up', medium: 'right', low: 'down', nice_to_have: 'spark' };

/* ---------- Accès aux données ---------- */
const member = (id) => DB.members.find((m) => m.id === id) || null;
const moduleById = (id) => DB.modules.find((m) => m.id === id) || null;
const sprintById = (id) => DB.sprints.find((s) => s.id === id) || null;
const featureById = (id) => DB.features.find((f) => f.id === id) || null;
const fullName = (m) => `${m.firstName} ${m.lastName}`;
const activeSprint = () => DB.sprints.find((s) => s.status === 'active');

/* ---------- Formats ---------- */
function fmtDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
function fmtDateTime(iso) {
  return `${fmtDate(iso)} à ${iso.slice(11, 16).replace(':', ' h ')}`;
}
const fmtNumber = (n) => n.toLocaleString('fr-FR');

/* ---------- Petits composants ---------- */
const statusBadge = (s) => `<span class="badge st-${s}"><span class="dot"></span>${STATUS[s]}</span>`;
const sprintStatusBadge = (s) => `<span class="badge sp-${s}"><span class="dot"></span>${SPRINT_STATUS[s]}</span>`;
const priorityBadge = (p) => `<span class="badge pr-${p}">${icon(PRIORITY_ICON[p])}${PRIORITY[p]}</span>`;
const moduleDot = (m, cls = '') => `<span class="mdot ${cls}" style="background:${m.color}"></span>`;
const moduleTag = (m) => `<a class="module-tag" href="module.html?id=${m.id}">${moduleDot(m)}${esc(m.name)}</a>`;
const moduleChip = (m) => `<span class="module-tag">${moduleDot(m)}${esc(m.name)}</span>`; // sans lien

// Photo ronde ; sans photo : initiales sur fond violet clair
function avatar(m, large = false) {
  const cls = `avatar${large ? ' avatar-lg' : ''}`;
  if (m.photo) return `<span class="${cls}" title="${esc(fullName(m))}" style="background-image:url('${m.photo}')"></span>`;
  return `<span class="${cls}" title="${esc(fullName(m))}">${m.firstName[0] + m.lastName[0]}</span>`;
}

/* Champ photo : aperçu rond + bouton « Choisir une photo » (rien n'est envoyé) */
function photoField(person) {
  const preview = person ? avatar(person, true) : `<span class="avatar avatar-lg">${icon('user')}</span>`;
  return `
    <div class="field photo-field-wrap">
      <span class="label">Photo</span>
      <div class="photo-field">
        <span class="photo-preview">${preview}</span>
        <span class="photo-actions">
          <label class="btn btn-secondary btn-sm">Choisir une photo<input type="file" accept="image/*" class="photo-input" hidden></label>
          <span class="small photo-name">JPG ou PNG, carrée de préférence.</span>
        </span>
      </div>
    </div>`;
}
function bindPhotoField(root) {
  const input = root.querySelector('.photo-input');
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    root.querySelector('.photo-preview').innerHTML = `<span class="avatar avatar-lg" style="background-image:url('${url}')"></span>`;
    root.querySelector('.photo-name').textContent = file.name;
    root.dataset.photo = url;
  });
}
function personLink(id) {
  const m = member(id);
  if (!m) return '<span class="muted">Non assignée</span>';
  return `<a class="person" href="profil.html?id=${m.id}">${avatar(m)}${esc(fullName(m))}</a>`;
}
function sprintLink(id) {
  const s = sprintById(id);
  if (!s) return '<a class="backlog-link" data-backlog href="index.html?filter=backlog">Backlog</a>';
  return `<a href="sprint.html?id=${s.id}">${esc(s.goal)}</a>`;
}

/* Liste de features réutilisable (fiche module, sprint, profil).
   cols : colonnes en plus du titre, parmi 'status', 'priority', 'sprint', 'module', 'assignee'. */
function featureTable(features, cols) {
  if (!features.length) return '<div class="empty">Aucune feature pour le moment.</div>';
  const defs = {
    status:   { head: 'Statut',   w: '130px',   cell: (f) => statusBadge(f.status) },
    priority: { head: 'Priorité', w: '130px',   cell: (f) => priorityBadge(f.priority) },
    sprint:   { head: 'Sprint',   w: '1.2fr',   cell: (f) => sprintLink(f.sprintId) },
    module:   { head: 'Module',   w: '1fr',     cell: (f) => moduleTag(moduleById(f.moduleId)) },
    assignee: { head: 'Assignée', w: '1.2fr',   cell: (f) => personLink(f.assigneeId) },
  };
  const grid = ['minmax(0,2fr)', ...cols.map((c) => defs[c].w)].join(' ');
  const head = `<div class="thead"><span>Feature</span>${cols.map((c) => `<span>${defs[c].head}</span>`).join('')}</div>`;
  const rows = features.map((f) => `
    <div class="trow" data-href="feature.html?id=${f.id}">
      <a class="t-title" href="feature.html?id=${f.id}">${esc(f.title)}</a>
      ${cols.map((c) => `<div>${defs[c].cell(f)}</div>`).join('')}
    </div>`).join('');
  return `<div class="table" style="--cols:${grid}">${head}${rows}</div>`;
}

/* ---------- Menu du haut ---------- */
function renderNav(active) {
  const links = [
    ['dashboard', 'index.html', 'Dashboard'],
    ['sprints', 'sprints.html', 'Sprints'],
    ['modules', 'modules.html', 'Modules'],
    ['equipe', 'equipe.html', 'Équipe'],
  ];
  const me = member(DB.currentUserId);
  const html = `
    <div class="topbar-wrap"><header class="topbar">
      <a class="logo" href="index.html"><span class="logo-mark"></span>Roadmap</a>
      <nav>${links.map(([k, href, label]) => `<a href="${href}" class="${k === active ? 'active' : ''}">${label}</a>`).join('')}</nav>
      <div class="dropdown topbar-user" id="user-menu">
        <button type="button" class="user-btn" data-toggle aria-haspopup="menu" aria-expanded="false">
          ${avatar(me)}<span class="small">${esc(me.firstName)}</span>${icon('chevron')}
        </button>
        <div class="dd-panel dd-right" hidden role="menu">
          <div class="dd-head"><strong>${esc(fullName(me))}</strong><span class="small">${esc(me.email)}</span></div>
          <div class="dd-list">
            <a class="dd-item" role="menuitem" href="profil.html?id=${me.id}">${icon('user')} Mon profil</a>
            <a class="dd-item danger" role="menuitem" href="connexion.html?msg=${encodeURIComponent('Vous êtes déconnecté')}">${icon('logout')} Se déconnecter</a>
          </div>
        </div>
      </div>
    </header></div>`;
  document.querySelector('.topbar-wrap')?.remove(); // re-rendu (ex. : profil modifié)
  document.body.insertAdjacentHTML('afterbegin', html);
  bindPopover($('#user-menu'));
}

/* Petite liste déroulante : un bouton [data-toggle] + un panneau .dd-panel dans root.
   Se ferme au clic à l'extérieur ou avec Échap. */
function bindPopover(root) {
  const btn = root.querySelector('[data-toggle]');
  const panel = root.querySelector('.dd-panel');
  const set = (open) => { panel.hidden = !open; btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(panel.hidden));
  document.addEventListener('click', (e) => { if (!root.contains(e.target)) set(false); });
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  return set;
}

/* ---------- Message de confirmation (toast, 3 s) ---------- */
function toast(message, kind) {
  kind = kind || (/annul|déconnect/i.test(message) ? 'neutral' : 'ok');
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.setAttribute('role', 'status');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* Aller vers une page en affichant un message à l'arrivée */
function goWithMessage(page, message) {
  location.href = `${page}?msg=${encodeURIComponent(message)}`;
}

function showIncomingMessage() {
  const msg = param('msg');
  if (!msg) return;
  toast(msg);
  try {
    params.delete('msg');
    const q = params.toString();
    history.replaceState(null, '', location.pathname + (q ? `?${q}` : ''));
  } catch (e) { /* sans importance en file:// */ }
}

/* ---------- Fenêtre de confirmation ---------- */
function confirmBox({ title, text, okLabel = 'Supprimer', onOk, infoOnly = false }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="actions">
        ${infoOnly
          ? '<button class="btn btn-secondary" data-close>J\'ai compris</button>'
          : `<button class="btn btn-ghost" data-close>Annuler</button><button class="btn btn-danger" data-ok>${okLabel}</button>`}
      </div>
    </div>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-close]')) close();
    if (e.target.closest('[data-ok]')) { close(); onOk && onOk(); }
  });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
  });
  document.body.appendChild(overlay);
  (overlay.querySelector('[data-ok]') || overlay.querySelector('[data-close]')).focus();
}

/* ---------- Fenêtre avec formulaire (ex. : Assigner) ----------
   onOk(overlay) : renvoyer false pour garder la fenêtre ouverte (erreur de saisie). */
function openModal({ title, body, okLabel = 'Valider', onOk }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <form class="modal" role="dialog" aria-modal="true" novalidate>
      <h2>${title}</h2>
      ${body}
      <div class="actions">
        <button type="button" class="btn btn-ghost" data-close>Annuler</button>
        <button type="submit" class="btn btn-primary">${okLabel}</button>
      </div>
    </form>`;
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-close]')) close();
  });
  overlay.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (onOk(overlay) !== false) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  overlay.querySelector('input:not([type=file]), select, textarea').focus();
  return overlay;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* Comparaison de texte sans accents ni majuscules (recherche) */
const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* Lignes cliquables : un clic hors lien/bouton ouvre la fiche */
document.addEventListener('click', (e) => {
  const row = e.target.closest('.trow[data-href]');
  if (!row || e.target.closest('a, button')) return;
  location.href = row.dataset.href;
});

/* Petits utilitaires de formulaire */
function options(list, selected) {
  return list.map(([value, label]) => `<option value="${value}"${String(value) === String(selected) ? ' selected' : ''}>${esc(label)}</option>`).join('');
}
function setError(fieldEl, on) {
  fieldEl.classList.toggle('error', on);
}

document.addEventListener('DOMContentLoaded', showIncomingMessage);
