// Makers – interface. Pas de framework : un routeur par hash, du HTML échappé, des événements délégués.

// `fields` : ce que le formulaire de partage demande pour chaque type (le titre et la description sont toujours là).
const TYPES = {
  skill: {
    label: 'Skill Claude', short: 'Skill', plural: 'Skills Claude',
    about: 'Des skills Claude prêts à installer, avec leur documentation.',
    hint: 'Un dossier : SKILL.md et sa doc.', example: 'Ex. : « Relecture avant commit »',
    fields: ['tree', 'url', 'images', 'tags'],
    titleEx: 'Relecture automatique avant chaque commit', descEx: 'À quoi il sert, ce qu’il fait, dans quel cas tu l’utilises.',
  },
  prompt: {
    label: 'Prompt', short: 'Prompt', plural: 'Prompts',
    about: 'Des prompts qui marchent, prêts à coller dans ta conversation.',
    hint: 'Un prompt à coller tel quel.', example: 'Ex. : « Explique-moi ce code »',
    fields: ['content', 'url', 'images', 'tags'],
    titleEx: 'Transformer une idée floue en cahier des charges', descEx: 'Ce qu’il donne en sortie, et sur quel modèle tu l’as testé.',
    contentLabel: 'Le prompt à copier', contentEx: 'Tu es… Ta mission est de…\n\nContraintes :\n- …',
  },
  idee: {
    label: 'Idée', short: 'Idée', plural: 'Idées',
    about: 'Des idées d’outils, d’automatisations et de projets à construire.',
    hint: 'Une idée à creuser, un truc à construire.', example: 'Ex. : « Un agent qui trie mes mails »',
    fields: ['content', 'url', 'images', 'tags'],
    titleEx: 'Un agent qui relit mes PR pendant la nuit', descEx: 'Le problème que ça réglerait, et pourquoi personne ne l’a fait.',
    contentLabel: 'Comment tu la vois <span class="muted">(facultatif)</span>', contentEx: 'Ce qu’il faudrait :\n- …\n\nCe qui bloque :\n- …',
  },
  sondage: {
    label: 'Sondage', short: 'Sondage', plural: 'Sondages',
    about: 'Des questions posées à la communauté. Un vote par membre.',
    hint: 'Une question, de 2 à 6 réponses.', example: 'Ex. : « Quel modèle pour coder ? »',
    fields: ['options', 'tags'],
    titleEx: 'Quel modèle tu utilises pour coder au quotidien ?', descEx: 'Pourquoi tu poses la question, et ce que tu feras du résultat.',
  },
  montage: {
    label: 'Technique de montage', short: 'Montage', plural: 'Techniques de montage',
    about: 'Des méthodes de montage expliquées étape par étape.',
    hint: 'Une méthode, un réglage, un workflow.', example: 'Ex. : « J-cut et L-cut »',
    fields: ['content', 'url', 'images', 'tags'],
    titleEx: 'J-cut et L-cut : faire respirer une interview', descEx: 'Le problème que ça règle et ce que ça change dans la vidéo.',
    contentLabel: 'Les étapes', contentEx: '1. Sépare l’audio de la vidéo.\n2. Décale la coupe de 6 à 12 images.\n3. …',
  },
  pdf: {
    label: 'PDF / papier', short: 'PDF', plural: 'PDF et papiers',
    about: 'Des guides, des fiches et des papiers de recherche à lire.',
    hint: 'Un guide, une fiche, un papier.', example: 'Ex. : « Attention Is All You Need »',
    fields: ['file', 'url', 'tags'],
    titleEx: 'Le guide du prompt engineering, en 68 pages', descEx: 'Ce que contient le document et à qui il sert.',
  },
  lien: {
    label: 'Lien', short: 'Lien', plural: 'Liens et dépôts',
    about: 'Des dépôts, des outils, des sites et des vidéos hébergées ailleurs.',
    hint: 'Un dépôt, un outil, une vidéo hébergée ailleurs.', example: 'Ex. : un dépôt GitHub, une vidéo',
    fields: ['url', 'images', 'tags'],
    titleEx: 'anthropics/skills : les skills officiels', descEx: 'Pourquoi ce lien est utile et ce qu’on y trouve.',
  },
  info: {
    label: 'Actu', short: 'Actu', plural: 'Actus et retours',
    about: 'Nouveautés des modèles, annonces et retours d’expérience.',
    hint: 'Une nouveauté, une annonce, un retour d’expérience.', example: 'Ex. : « J’ai testé X pendant un mois »',
    fields: ['url', 'images', 'tags'],
    titleEx: 'Retour d’expérience : trois mois d’agents en production', descEx: 'Ce que tu as constaté, avec des chiffres si tu en as.',
  },
};
const VIDEO_EXT = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', 'wmv', 'flv', 'mpeg', 'mpg', '3gp', 'ogv'];

// --- HTML échappé par défaut ---------------------------------------------
class Raw { constructor(s) { this.s = s; } }
const raw = s => new Raw(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = v => v == null || v === false ? '' : Array.isArray(v) ? v.map(val).join('') : v instanceof Raw ? v.s : esc(v);
const html = (st, ...v) => new Raw(st.reduce((a, s, i) => a + s + (i < v.length ? val(v[i]) : ''), ''));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Typographie française : espace insécable fine avant ; ! ? » et après «, insécable avant :.
// Empêche qu'un guillemet ou un point d'interrogation se retrouve seul en début de ligne.
// À n'appliquer qu'à du texte rédigé : jamais au contenu d'un skill, qui doit rester copiable tel quel.
const fr = s => String(s)
  .replace(/ ([;!?»])/g, ' $1')
  .replace(/« /g, '« ')
  .replace(/ :/g, ' :');

const svg = d => raw(`<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`);
const ICON = {
  up: svg('<path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/>'),
  file: svg('<path d="M3.5 1.5h6L13 5v9.5H3.5z"/><path d="M9.5 1.5V5H13"/>'),
  out: svg('<path d="M6.5 3.5H3v9.5h9.5V9.5M9.5 2.5H13.5V6.5M13.5 2.5 7.5 8.5"/>'),
  pin: svg('<path d="M9.5 1.5 14.5 6.5 12 7l-2.5 3.5-.5 3-7-7 3-.5L11 3.5z"/>'),
  plus: svg('<path d="M8 3v10M3 8h10"/>'),
  copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M10.5 5.5v-3h-8v8h3"/>'),
  gem: svg('<path d="M8 2 14 8 8 14 2 8z"/>'),
  star: svg('<path d="M8 1.8l1.85 3.9 4.15.6-3 3 .7 4.2L8 11.5l-3.7 2 .7-4.2-3-3 4.15-.6z"/>'),
  lock: svg('<rect x="2.8" y="7" width="10.4" height="7" rx="1.6"/><path d="M5.3 7V5a2.7 2.7 0 0 1 5.4 0v2"/>'),
  cup: svg('<path d="M4.5 2h7v3.5a3.5 3.5 0 0 1-7 0z"/><path d="M4.5 3H2.5v1a2.5 2.5 0 0 0 2 2.45M11.5 3h2v1a2.5 2.5 0 0 1-2 2.45"/><path d="M8 9v2.5M5.5 14h5l-.5-2.5h-4z"/>'),
  vote: svg('<path d="M3 8.5 6.5 12 13 4.5"/>'),
  dossier: svg('<path d="M1.8 12.8V3.6h4l1.4 1.8h7v7.4a.8.8 0 0 1-.8.8H2.6a.8.8 0 0 1-.8-.8z"/>'),
  ampoule: svg('<path d="M6 13h4M6.5 14.8h3"/><path d="M8 1.5a4.2 4.2 0 0 0-2.5 7.6c.4.3.6.8.6 1.3v.6h3.8v-.6c0-.5.2-1 .6-1.3A4.2 4.2 0 0 0 8 1.5z"/>'),
  sondage: svg('<path d="M3 13V8M8 13V3M13 13v-7"/>'),
  play: svg('<circle cx="8" cy="8" r="6.2"/><path d="M6.6 5.6 10.6 8l-4 2.4z"/>'),
  megaphone: svg('<path d="M2.5 6.5v3l8 3.5V3zM10.5 5.5a2.5 2.5 0 0 1 0 5"/>'),
  lignes: svg('<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>'),
  grille: svg('<rect x="2.2" y="2.2" width="5" height="5" rx="1"/><rect x="8.8" y="2.2" width="5" height="5" rx="1"/><rect x="2.2" y="8.8" width="5" height="5" rx="1"/><rect x="8.8" y="8.8" width="5" height="5" rx="1"/>'),
  doc: svg('<path d="M3.5 1.5h6L13 5v9.5H3.5z"/><path d="M9.5 1.5V5H13M5.8 8h4.4M5.8 10.5h4.4"/>'),
  code: svg('<path d="M5.8 5.8 3 8l2.8 2.2M10.2 5.8 13 8l-2.8 2.2M9 4l-2 8"/>'),
};

// --- Utilitaires ------------------------------------------------------------
// `limits` est renseigné par /api/me : le formulaire prévient avant l'envoi plutôt que
// de laisser partir 5 Mo pour un refus. Valeurs de repli si l'appel échoue.
const S = { me: null, admin: false, pending: 0, limits: { pdfKb: 200, fileMb: 15, imageMb: 10, images: 3 } };

// Une barre fine en haut de page dès le clic : la navigation demande un aller-retour
// réseau, et sans ce signal on a l'impression que le clic n'a rien fait.
let enCours = 0;
function charge(actif) {
  enCours = Math.max(0, enCours + (actif ? 1 : -1));
  document.body.classList.toggle('chargement', enCours > 0);
}

// Les réponses déjà obtenues sont réaffichées tout de suite, puis rafraîchies en fond.
// Revenir sur une page devient instantané, même si le réseau est lent.
const CACHE_MS = 60000;
const memo = new Map();
function duCache(cle) {
  const e = memo.get(cle);
  return e && Date.now() - e.at < CACHE_MS ? e.valeur : null;
}
function enCache(cle, valeur) {
  memo.set(cle, { valeur, at: Date.now() });
  // Après une gemme, une étoile ou un vote, les compteurs affichés sont périmés.
  if (memo.size > 40) memo.delete(memo.keys().next().value);
}
const videCache = () => memo.clear();

// --- Mode lecture seule -------------------------------------------------------------
// Une copie du site peut être publiée sur un hébergement de fichiers (GitHub Pages),
// sans serveur : tout est alors chargé une fois depuis donnees/, et les tris, filtres
// et recherches se font dans le navigateur. On lit tout, on n'écrit rien.
const STATIQUE = typeof window !== 'undefined' && window.MAKERS_STATIQUE === true;
let fondStatique = null;

async function chargeStatique() {
  if (fondStatique) return fondStatique;
  const r = await fetch('donnees/site.json');
  if (!r.ok) throw new Error('Données introuvables.');
  fondStatique = await r.json();
  return fondStatique;
}

// Rejoue côté navigateur ce que le serveur faisait : filtre, trie, découpe en pages.
async function apiStatique(chemin, method) {
  if (method !== 'GET') {
    throw Object.assign(new Error('Cette copie du site est en lecture seule. Elle sert à consulter la bibliothèque ; pour partager, voter ou créer un compte, il faut la version complète.'), { status: 403 });
  }
  const { posts, stats, limits } = await chargeStatique();
  const [base, qs] = chemin.split('?');
  const q = new URLSearchParams(qs || '');

  if (base === '/me') return { member: null, admin: false, pending: 0, limits };
  if (base === '/stats') return stats;

  const points = p => p.points;
  const ouverts = posts.filter(p => !p.premium);

  if (base === '/top') {
    const JOUR = 86400000;
    const fenetres = { semaine: 7 * JOUR, mois: 30 * JOUR, toujours: Infinity };
    const top = (nom) => {
      const depuis = fenetres[nom] === Infinity ? -Infinity : Date.now() - fenetres[nom];
      return ouverts.filter(p => (p.approvedAt || p.createdAt) >= depuis && points(p) > 0)
        .sort((a, b) => points(b) - points(a) || b.gems - a.gems || (b.approvedAt || 0) - (a.approvedAt || 0))
        .slice(0, 5);
    };
    const periode = q.get('periode');
    if (periode) return { periode, posts: top(periode) };
    return Object.fromEntries(Object.keys(fenetres).map(k => [k, top(k)]));
  }

  const unPost = base.match(/^\/posts\/([a-f0-9]+)$/);
  if (unPost) {
    const p = posts.find(x => x.id === unPost[1]);
    if (!p) throw Object.assign(new Error('Partage introuvable.'), { status: 404 });
    return { post: p };
  }

  if (base === '/posts') {
    const t = q.get('t') || '', tag = (q.get('tag') || '').toLowerCase();
    const mot = (q.get('q') || '').toLowerCase().trim();
    const tri = q.get('s') || 'top';
    let list = ouverts.filter(p => (!t || p.type === t) && (!tag || p.tags.includes(tag)));
    if (mot) {
      list = list.filter(p => [p.title, p.description, p.content, p.author, p.tags.join(' ')]
        .join(' ').toLowerCase().includes(mot));
    }
    list = list.slice().sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      if (tri === 'top') return points(b) - points(a) || b.stars - a.stars || (b.approvedAt || 0) - (a.approvedAt || 0);
      if (tri === 'etoiles') return b.stars - a.stars || b.starsCount - a.starsCount || (b.approvedAt || 0) - (a.approvedAt || 0);
      return (b.approvedAt || 0) - (a.approvedAt || 0);
    });
    const n = Math.min(100, Math.max(1, Number(q.get('limit')) || 30));
    const depuis = Math.max(0, Number(q.get('offset')) || 0);
    const page = list.slice(depuis, depuis + n);
    return {
      posts: page.map(p => { const o = { ...p }; delete o.content; return o; }),
      total: list.length, offset: depuis,
      suite: depuis + page.length < list.length ? depuis + page.length : null,
    };
  }
  throw Object.assign(new Error('Indisponible dans cette copie du site.'), { status: 404 });
}

async function api(path, { method = 'GET', body } = {}) {
  const isForm = body instanceof FormData;
  charge(true);
  try {
    if (STATIQUE) return await apiStatique(path, method);
    const res = await fetch('/api' + path, {
      method,
      credentials: 'same-origin',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || 'Une erreur est survenue.'), { status: res.status });
    // Toute écriture périme les compteurs affichés ailleurs (gemmes, étoiles, votes).
    if (method !== 'GET') videCache();
    return data;
  } finally {
    charge(false);
  }
}

function ago(ts) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return 'à l’instant';
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 14) return `il y a ${Math.floor(s / 86400)} j`;
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
const size = n => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} Ko` : `${(n / 1048576).toFixed(1).replace('.', ',')} Mo`;
const domain = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

const view = $('#view');
// La politique de sécurité du site refuse les attributs `style` écrits dans le HTML.
// La largeur des barres de sondage passe donc par `data-pct`, puis par le CSSOM, qu'elle autorise.
const applyBars = root => $$('[data-pct]', root).forEach(b => { b.style.width = b.dataset.pct + '%'; });
const render = (tpl) => { view.innerHTML = tpl.s; applyBars(view); window.scrollTo(0, 0); };
const go = h => { location.hash = h; };

// --- Composants ---------------------------------------------------------------
function header() {
  const q = new URLSearchParams((location.hash.split('?')[1] || '')).get('q') || '';
  $('#header').innerHTML = html`
    <div class="bar">
      <a class="logo" href="#/" aria-label="makers.si, accueil">makers<i>.</i>si</a>
      <form class="search" data-form="search" role="search">
        <input type="text" name="q" value="${q}" placeholder="Chercher un skill, un PDF, un tag…" aria-label="Rechercher" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="suggest">
        <kbd>/</kbd>
        <ul class="suggest hidden" id="suggest" role="listbox"></ul>
      </form>
      <div class="bar-end">
        <a class="btn ghost" href="#/top">${ICON.cup}Top 5</a>
        <a class="btn ghost hide-sm" href="#/aide">Aide</a>
        ${S.admin ? html`<a class="btn small" href="#/admin">À valider${S.pending ? html`<span class="badge">${S.pending}</span>` : ''}</a>` : ''}
        ${S.me
          ? html`<span class="purse" title="Gemmes qu’il te reste à donner cette semaine">${ICON.gem}${S.me.gemsLeft}</span>
            <a class="who" href="#/mes-partages">@${S.me.pseudo}</a><a class="btn primary" href="#/partager">${ICON.plus}Partager</a>`
          : STATIQUE
            ? html`<span class="lecture-seule" title="Copie consultable : on lit tout, on n’écrit rien">${ICON.lock}lecture seule</span>`
            : html`<a class="btn ghost" href="#/connexion">Connexion</a><a class="btn primary" href="#/rejoindre">Rejoindre</a>`}
      </div>
    </div>`.s;
}

// Chaque type a son signe, posé sur un aplat de sa couleur : c'est ce qui remplace
// l'image quand il n'y en a pas, et ce qui rend le fil lisible au survol plutôt qu'à la lecture.
const GLYPHE = {
  skill: 'dossier', prompt: 'copy', idee: 'ampoule', sondage: 'sondage',
  pdf: 'file', montage: 'play', lien: 'out', info: 'megaphone',
};

const kind = t => html`<span class="kind k-${t}">${TYPES[t]?.short || t}</span>`;
const tagLink = t => html`<a class="tag" href="#/?tag=${encodeURIComponent(t)}">#${t}</a>`;

// Une gemme = le signal fort. Chaque membre n'en a que quelques-unes par semaine,
// c'est ce qui fait que le classement « Top » veut dire quelque chose.
// En liste, le bouton tient dans une colonne étroite : icône et chiffre, comme à l'origine.
// Ailleurs, le mot « gemme » est écrit à côté, parce qu'un losange et un nombre tout seuls
// ne disent pas qu'on peut cliquer ni ce que ça fait.
function gemButton(p, { compact = false } = {}) {
  const title = p.gemmed ? 'Reprendre ma gemme' : 'Donner une gemme';
  return html`<button class="vote ${compact ? 'compacte' : ''} ${p.gemmed ? 'on' : ''}" data-action="gem" data-id="${p.id}"
    aria-pressed="${String(p.gemmed)}" aria-label="${title}" title="${title}">${ICON.gem}<b>${p.gems}</b>${compact ? '' : html`<span class="vote-mot">gemme${p.gems > 1 ? 's' : ''}</span>`}</button>`;
}

// Note : dans la liste, une étoile et le chiffre ; sur la page d'un partage, cinq étoiles cliquables.
function starsView(p, { interactive = false } = {}) {
  const shown = interactive && p.myStars ? p.myStars : Math.round(p.stars);
  const label = p.starsCount
    ? `${String(p.stars).replace('.', ',')} sur 5, ${p.starsCount} note${p.starsCount > 1 ? 's' : ''}`
    : 'Pas encore noté';
  if (!interactive) {
    if (!p.starsCount) return '';
    // La moyenne suffit sur une carte. Le nombre de notes reste dans l'infobulle,
    // et en toutes lettres sur la page du partage : « (8) » ne disait rien à personne.
    return html`<span class="stars" title="${label}" aria-label="${label}"
      ><i class="on">${ICON.star}</i><b>${String(p.stars).replace('.', ',')}</b></span>`;
  }
  return html`<span class="stars big ${p.myStars ? 'mine' : ''}" role="group" aria-label="Noter ce partage">
    ${[1, 2, 3, 4, 5].map(n => html`<button type="button" data-action="star" data-id="${p.id}" data-n="${n}"
      class="${n <= shown ? 'on' : ''}" aria-label="${n} étoile${n > 1 ? 's' : ''}" title="${n} sur 5">${ICON.star}</button>`)}
  </span>`;
}

// Un sondage. Tant qu'on n'a pas voté, les barres restent neutres ; une fois le vote donné,
// on voit les résultats et sa propre réponse est marquée. Revoter la même réponse la retire.
function pollView(p) {
  const poll = p.poll;
  if (!poll) return '';
  const vote = poll.myVote !== null;
  return html`
    <div class="poll ${vote ? 'voted' : ''}">
      ${poll.options.map((o, i) => html`
        <button type="button" class="poll-opt ${poll.myVote === i ? 'mine' : ''}" data-action="vote" data-id="${p.id}" data-n="${i}"
          aria-pressed="${String(poll.myVote === i)}" title="${poll.myVote === i ? 'Retirer mon vote' : 'Voter pour cette réponse'}">
          <span class="poll-bar" data-pct="${vote ? o.percent : 0}"></span>
          <span class="poll-text">${o.text}</span>
          ${vote ? html`<span class="poll-num">${o.percent} %<small>${o.votes}</small></span>` : ''}
        </button>`)}
      <p class="poll-foot">
        ${poll.total ? html`${poll.total} vote${poll.total > 1 ? 's' : ''}` : 'Aucun vote pour l’instant'}
        ${vote ? ' · clique ta réponse pour la retirer' : S.me ? ' · choisis une réponse pour voir les résultats' : ' · connecte-toi pour voter'}
      </p>
    </div>`;
}

// --- Le dossier d'un skill, parcouru comme sur GitHub -------------------------------
// Un skill est un dossier : on le montre comme tel. Arborescence à gauche, fichier
// sélectionné à droite. Tout est déjà chargé, donc changer de fichier est instantané.
const ICONE_FICHIER = {
  md: 'doc', txt: 'doc', json: 'code', js: 'code', sh: 'code',
  yml: 'code', yaml: 'code', py: 'code', ts: 'code',
};
const extDe = chemin => (chemin.split('.').pop() || '').toLowerCase();

// Range les chemins plats en dossiers : [{dossier, fichiers:[…]}, …], racine en premier.
function enDossiers(tree) {
  const groupes = new Map([['', []]]);
  for (const f of tree) {
    const i = f.path.lastIndexOf('/');
    const dossier = i < 0 ? '' : f.path.slice(0, i);
    if (!groupes.has(dossier)) groupes.set(dossier, []);
    groupes.get(dossier).push({ ...f, nom: i < 0 ? f.path : f.path.slice(i + 1) });
  }
  return [...groupes].filter(([, fs]) => fs.length).map(([dossier, fichiers]) => ({ dossier, fichiers }));
}

// Les contenus restent ici : le HTML n'affiche qu'un fichier à la fois, mais tout est
// déjà chargé, donc passer d'un fichier à l'autre ne demande aucun aller-retour réseau.
const depots = new Map();

function treeView(p) {
  const tree = p.tree;
  if (!tree?.length) return '';
  depots.set(p.id, tree);
  // SKILL.md d'abord : c'est le fichier que Claude lit, et celui qu'on veut voir en arrivant.
  const premier = tree.find(f => f.path.toLowerCase() === 'skill.md') || tree[0];
  const racine = (p.title || 'skill').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'mon-skill';

  const total = tree.reduce((a, f) => a + f.content.length, 0);
  return html`
    <div class="depot" data-depot="${p.id}">
      <div class="depot-head">
        ${ICON.dossier}<b>${racine}/</b>
        <span class="muted">${tree.length} fichier${tree.length > 1 ? 's' : ''} · ${Math.max(1, Math.round(total / 1024))} Ko</span>
        <button class="btn small" data-action="tout-copier" data-id="${p.id}">${ICON.copy}Tout copier</button>
      </div>
      <div class="depot-corps">
        <nav class="depot-arbre" aria-label="Fichiers du skill">
          ${enDossiers(tree).map(({ dossier, fichiers }) => html`
            ${dossier ? html`<div class="depot-dossier">${ICON.dossier}${dossier}/</div>` : ''}
            ${fichiers.map(f => html`
              <button type="button" class="depot-fichier ${f.path === premier.path ? 'on' : ''} ${dossier ? 'dedans' : ''}"
                data-action="voir-fichier" data-id="${p.id}" data-path="${f.path}">
                ${ICON[ICONE_FICHIER[extDe(f.path)] === 'code' ? 'code' : 'doc']}<span>${f.nom}</span>
              </button>`)}`)}
        </nav>
        <div class="depot-vue">
          <div class="depot-barre">
            <code data-depot-chemin="${p.id}">${premier.path}</code>
            <button class="btn small ghost" data-action="copy-fichier" data-id="${p.id}">${ICON.copy}Copier</button>
          </div>
          <pre class="code" data-depot-contenu="${p.id}">${premier.content}</pre>
        </div>
      </div>
    </div>
    <details class="howto"><summary>Comment installer ce skill ?</summary>
      <p>Crée le dossier <code>.claude/skills/${racine}/</code> à la racine de ton projet (ou <code>~/.claude/skills/${racine}/</code> pour qu’il serve dans tous tes projets), puis recrée les fichiers ci-dessus avec le même nom et la même place. « Tout copier » te donne l’ensemble en une fois, chaque fichier précédé de son chemin.</p>
      <p>${HOWTO}</p>
    </details>`;
}

function attachments(p) {
  const bits = [];
  if (p.file) bits.push(html`<span>${p.file.ext.toUpperCase()} · ${size(p.file.size)}</span>`);
  if (p.url) bits.push(html`<span>${domain(p.url)}</span>`);
  return bits;
}

// Ce qu'on annonce d'un partage en un coup d'œil : son contenu, pas sa fiche technique.
// Le type et l'auteur suffisent ; la date, le poids du fichier et le domaine encombraient
// la carte sans aider personne à choisir quoi ouvrir.
function apercu(p) {
  if (p.treeCount) return `${p.treeCount} fichier${p.treeCount > 1 ? 's' : ''}`;
  if (p.poll) return `${p.poll.total} vote${p.poll.total > 1 ? 's' : ''}`;
  if (p.file) return p.file.ext.toUpperCase();
  if (p.url) return domain(p.url);
  if (p.images?.length) return `${p.images.length} photo${p.images.length > 1 ? 's' : ''}`;
  return '';
}

// Deux façons de voir le fil, au choix du visiteur. La liste est le réglage d'origine :
// dense, on en voit beaucoup d'un coup. Les cartes montrent moins de partages mais
// se parcourent à l'œil. Le choix est gardé d'une visite à l'autre.
const VUES = { liste: 'Liste', cartes: 'Cartes' };
let vueFil = 'liste';
try { if (VUES[localStorage.getItem('mk-vue')]) vueFil = localStorage.getItem('mk-vue'); }
catch { /* navigation privée ou stockage bloqué : on garde la liste */ }

const item = (p, rang = null) => (vueFil === 'cartes' ? carte(p, rang) : ligne(p, rang));

// L'affichage d'origine : une ligne par partage, toutes les informations visibles.
function ligne(p, rang = null) {
  const thumb = p.images?.[0]?.thumb;
  const podium = rang && rang <= 3 ? rang : 0;
  return html`
    <article class="item ${p.pinned ? 'pinned' : ''} ${thumb ? 'has-thumb' : ''} ${podium ? 'podium rang-' + podium : ''}">
      <div class="vote-col">
        ${podium ? html`<span class="rang" title="${rang}ᵉ au classement, ${p.points} points">Top ${rang}</span>` : rang ? html`<span class="rang-n">${rang}</span>` : ''}
        ${gemButton(p, { compact: true })}
      </div>
      <div>
        <div class="item-top">
          ${kind(p.type)}
          <a class="item-title" href="#/p/${p.id}">${fr(p.title)}</a>
          ${p.locked ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
          ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        </div>
        <p class="item-desc">${fr(p.description)}</p>
        <div class="meta">
          ${starsView(p)}
          ${p.tags.map(tagLink)}
          <span>@${p.author}</span>
          <span>${ago(p.approvedAt || p.createdAt)}</span>
          ${attachments(p)}
          ${p.treeCount ? html`<span>${p.treeCount} fichier${p.treeCount > 1 ? 's' : ''}</span>` : ''}
          ${p.poll ? html`<span>${p.poll.total} vote${p.poll.total > 1 ? 's' : ''}</span>` : ''}
          ${p.images?.length > 1 ? html`<span>${p.images.length} photos</span>` : ''}
        </div>
      </div>
      ${thumb ? html`<a class="thumb" href="#/p/${p.id}" tabindex="-1" aria-hidden="true"><img src="${thumb}" alt="" loading="lazy"></a>` : ''}
    </article>`;
}

// `rang` n'est donné que dans le classement : les trois premiers portent une médaille.
function carte(p, rang = null) {
  const thumb = p.images?.[0]?.thumb;
  const podium = rang && rang <= 3 ? rang : 0;
  const detail = apercu(p);
  return html`
    <article class="carte k-${p.type} ${p.pinned ? 'pinned' : ''} ${podium ? 'podium rang-' + podium : ''}">
      <a class="carte-visuel" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">
        ${thumb ? html`<img src="${thumb}" alt="" loading="lazy">` : html`<span class="carte-glyphe">${ICON[GLYPHE[p.type]] || ICON.doc}</span>`}
        ${podium ? html`<span class="medaille">${rang}</span>` : ''}
      </a>
      <div class="carte-corps">
        <div class="carte-haut">
          ${kind(p.type)}
          ${p.locked ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
          ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        </div>
        <a class="carte-titre" href="#/p/${p.id}">${fr(p.title)}</a>
        <p class="carte-desc">${fr(p.description)}</p>
        <div class="carte-bas">
          ${gemButton(p)}
          ${starsView(p)}
          <span class="carte-auteur">@${p.author}</span>
          ${detail ? html`<span class="carte-detail">${detail}</span>` : ''}
        </div>
      </div>
    </article>`;
}

const BLOCK_LABEL = { skill: 'à copier', prompt: 'à copier', idee: 'l’idée', montage: 'étapes' };

const HOWTO = 'Relis toujours un skill avant de l’utiliser : il peut faire exécuter des actions sur ton ordinateur, et personne ne garantit qu’il fait ce qu’il annonce. Copie ensuite le contenu avec le bouton ci-dessus. Pour un skill Claude Code : crée un dossier .claude/skills/nom-du-skill/ dans ton projet (ou ~/.claude/skills/nom-du-skill/ pour tous tes projets) et colle le texte dans un fichier SKILL.md à l’intérieur. Pour un simple prompt, colle-le directement dans la conversation.';

function lockedBox(p) {
  const bits = [];
  if (p.has?.tree) bits.push(`un dossier de ${p.has.tree} fichier${p.has.tree > 1 ? 's' : ''}`);
  if (p.has?.content) bits.push('un contenu à copier');
  if (p.has?.poll) bits.push('un sondage');
  if (p.has?.file) bits.push('un fichier');
  if (p.has?.url) bits.push('un lien');
  if (p.has?.images) bits.push(`${p.has.images} photo${p.has.images > 1 ? 's' : ''}`);
  return html`
    <div class="locked">
      <div class="locked-head">${ICON.lock}<b>Contenu réservé à l’espace privé</b></div>
      <p>Ce partage contient ${bits.length ? bits.join(', ') : 'du contenu'}, visible seulement avec l’accès à l’espace privé.</p>
      ${S.me
        ? html`<p class="muted">Ton compte n’a pas encore cet accès. Écris-nous pour le demander.</p>`
        : html`<a class="btn primary" href="#/rejoindre">Créer mon compte</a>`}
    </div>`;
}

function postBody(p, { howto = false } = {}) {
  return html`
    <p class="lead">${fr(p.description)}</p>
    ${p.locked ? lockedBox(p) : ''}
    ${pollView(p)}
    ${treeView(p)}
    ${p.images?.length ? html`<div class="gallery">${p.images.map(i => html`<a href="${i.src}" target="_blank" rel="noopener"><img src="${i.src}" width="${i.w}" height="${i.h}" alt="Photo du partage : ${p.title}" loading="lazy"></a>`)}</div>` : ''}
    ${p.imagesProcessing ? html`<div class="notice">${p.imagesProcessing} photo${p.imagesProcessing > 1 ? 's' : ''} en cours de compression. Recharge la page dans quelques secondes.</div>` : ''}
    ${p.content ? html`
      <div class="block">
        <div class="block-head"><span>${BLOCK_LABEL[p.type] || 'contenu'}</span><button class="btn small" data-action="copy" data-id="${p.id}">${ICON.copy}Copier</button></div>
        <pre class="code" data-copy="${p.id}">${p.content}</pre>
      </div>
      ${howto && (p.type === 'skill' || p.type === 'prompt') ? html`<details class="howto"><summary>Comment l’utiliser ?</summary><p>${HOWTO}</p></details>` : ''}` : ''}
    ${p.file ? html`
      <div class="block"><a class="attach" href="${p.file.href}" target="_blank" rel="noopener">
        ${ICON.file}<div><b>${p.file.name}</b><small>${p.file.ext.toUpperCase()} · ${size(p.file.size)}</small></div>
        <span class="go">${p.file.ext === 'pdf' || p.file.ext === 'png' || p.file.ext === 'jpg' ? 'Ouvrir' : 'Télécharger'}</span>
      </a></div>` : ''}
    ${p.url ? html`
      <div class="block"><a class="attach" href="${p.url}" target="_blank" rel="noopener noreferrer nofollow">
        ${ICON.out}<div><b>${domain(p.url)}</b><small>${p.url.length > 70 ? p.url.slice(0, 70) + '…' : p.url}</small></div>
        <span class="go">Ouvrir le lien</span>
      </a></div>` : ''}`;
}

// --- Vues ---------------------------------------------------------------------
async function feedView(q) {
  const SORTS = { top: 'Top', recent: 'Récents', etoiles: 'Mieux notés' };
  const t = q.get('t') || '', tag = q.get('tag') || '', query = q.get('q') || '';
  const sort = SORTS[q.get('s')] ? q.get('s') : 'top';
  const prem = q.get('p') === '1' ? '1' : '';
  const params = new URLSearchParams({ t, tag, q: query, s: sort, p: prem });
  const cle = 'fil:' + params;
  const vu = duCache(cle);
  const frais = Promise.all([api('/posts?' + params), api('/stats'), api('/top?periode=semaine')])
    .then(r => { enCache(cle, r); return r; });
  // Déjà vu : on réaffiche immédiatement et on rafraîchit derrière.
  const [liste, stats, top] = vu || await frais;
  const { posts, total: combien, suite } = liste;
  const link = (over) => {
    const n = new URLSearchParams();
    const merged = { t, tag, q: query, s: sort, p: prem, ...over };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === 's' && v === 'top')) n.set(k, v);
    const s = n.toString();
    return '#/' + (s ? '?' + s : '');
  };
  const title = query ? `Résultats pour « ${query} »` : tag ? `#${tag}`
    : prem ? 'Espace privé' : t ? TYPES[t].plural : 'Tous les partages';
  const total = Object.values(stats.byType).reduce((a, b) => a + b, 0);

  render(html`
    <div class="layout">
      <nav class="nav" aria-label="Catégories">
        <h3>Catégories</h3>
        <a href="#/" class="${!t && !tag && !query && !prem ? 'on' : ''}">Tout <span>${total}</span></a>
        ${Object.entries(TYPES).map(([k, v]) => html`<a href="${link({ t: k, tag: '', q: '', p: '' })}" class="${!prem && t === k ? 'on' : ''}">${v.plural} <span>${stats.byType[k]}</span></a>`)}
        ${stats.premium ? html`<a class="nav-premium ${prem ? 'on' : ''}" href="${link({ p: '1', t: '', tag: '', q: '' })}">${ICON.lock}Espace privé <span>${stats.premium}</span></a>` : ''}
      </nav>

      <main>
        ${S.me || t || tag || query ? '' : html`
          <section class="start" aria-label="Commencer">
            <div class="start-head">
              <div><b>Bienvenue. Tu peux tout lire sans compte.</b>
              <span>Par où commencer ?</span></div>
              ${STATIQUE ? '' : html`<a class="btn primary" href="#/rejoindre">Créer mon compte</a>`}
            </div>
            <div class="tiles">
              <a class="tile" href="#/?t=skill"><b>Installer un skill Claude</b><span>Avec sa doc, prêt à copier</span></a>
              <a class="tile" href="#/?t=prompt"><b>Prendre un prompt</b><span>Testés, prêts à coller</span></a>
              <a class="tile" href="#/?t=pdf"><b>Lire un PDF</b><span>Guides et papiers de recherche</span></a>
              <a class="tile" href="#/top"><b>Voir le Top 5</b><span>Ce que la communauté a élu</span></a>
            </div>
          </section>`}
        <div class="toolbar">
          <h1>${title}<small>${combien}</small></h1>
          <div class="tabs">
            ${Object.entries(SORTS).map(([k, label]) => html`<a href="${link({ s: k })}" class="${sort === k ? 'on' : ''}">${label}</a>`)}
          </div>
          <div class="tabs vues" role="group" aria-label="Affichage">
            ${Object.entries(VUES).map(([k, label]) => html`<button type="button" data-action="vue" data-vue="${k}"
              class="${vueFil === k ? 'on' : ''}" aria-pressed="${String(vueFil === k)}">${ICON[k === 'liste' ? 'lignes' : 'grille']}${label}</button>`)}
          </div>
        </div>
        ${prem ? html`<p class="about-type">${ICON.lock} Partages réservés. Tu vois le sujet de chacun ; le contenu demande l’accès à l’espace privé.</p>`
          : t && !query && !tag ? html`<p class="about-type">${TYPES[t].about}</p>` : ''}
        <div class="${vueFil === 'cartes' ? 'grille' : 'list'}">
          ${posts.length ? (() => {
            // Le classement ne numérote que le tri « Top », et saute les partages épinglés,
            // qui sont en tête pour une autre raison.
            const classe = sort === 'top' && !query && !tag;
            let rang = 0;
            return posts.map(p => item(p, classe && !p.pinned ? ++rang : null));
          })() : html`
            <div class="empty">
              ${query ? html`Aucun résultat pour « ${query} ».<br>Essaie un mot plus court, ou parcours les catégories.<br>` : html`Rien ici pour l’instant.<br>`}
              ${stats.tags.length && query ? html`<div class="tagcloud center">${stats.tags.slice(0, 8).map(x => tagLink(x.tag))}</div>` : ''}
              <a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'Partager quelque chose' : 'Rejoindre pour partager'}</a></div>`}
        </div>
        ${suite ? html`<div class="plus"><button class="btn" data-action="plus" data-suite="${suite}" data-params="${params}">Voir plus<span class="muted"> · ${combien - posts.length} restants</span></button></div>` : ''}
      </main>

      <aside class="aside">
        ${top.posts.length ? html`
          <section class="aside-top">
            <h3>${ICON.cup}Top 5 de la semaine</h3>
            <ol class="top-list mini">${top.posts.map((p, i) => html`
              <li class="top-line ${i < 3 ? 'podium rang-' + (i + 1) : ''}">
                <span class="top-rang">${i + 1}</span>
                <a class="top-titre" href="#/p/${p.id}">${fr(p.title)}</a>
                <span class="top-pts"><b>${p.points}</b></span>
              </li>`)}</ol>
            <p><a href="#/top">Voir le classement complet →</a></p>
          </section>` : ''}
        <section>
          <h3>À propos</h3>
          <p>${stats.members} membres · ${stats.posts} partages · ${stats.gems} gemmes données. Tout ce qui s’affiche ici a été relu.</p>
        </section>
        <section>
          <h3>Le classement</h3>
          <p>Une gemme vaut dix points, une étoile en vaut deux. Chaque membre reçoit quelques gemmes par semaine et en donne au maximum une par partage : c’est ce qui fait tenir le <a href="#/top">Top 5</a>.</p>
        </section>
        <section>
          <h3>Règles</h3>
          <ol>
            <li>Chaque partage est validé avant publication.</li>
            <li>Pas de vidéo importée : colle le lien.</li>
            <li>Cite ta source si ce n’est pas toi.</li>
            <li>Pas de pub ni de vente.</li>
          </ol>
          <p><a href="#/aide">Besoin d’aide ?</a></p>
        </section>
        ${stats.tags.length ? html`<section><h3>Tags</h3><div class="tagcloud">${stats.tags.map(x => tagLink(x.tag))}</div></section>` : ''}
      </aside>
    </div>`);

  // Affiché depuis le cache : si la version fraîche diffère, on remet la page à jour sans
  // la faire sauter (même position de défilement, l'utilisateur ne voit qu'un changement de chiffres).
  if (vu) {
    frais.then(async ([neuf]) => {
      // Entre-temps l'utilisateur a pu partir ailleurs : on ne réécrit pas sa page.
      const [chemin] = (location.hash.slice(1) || '/').split('?');
      if (chemin !== '/' || JSON.stringify(neuf) === JSON.stringify(liste)) return;
      const y = window.scrollY;
      await feedView(q);
      window.scrollTo(0, y);   // render() remonte en haut : on revient où on était
    }).catch(() => {});
  }
}

// --- Top 5 --------------------------------------------------------------------
const PERIODES = {
  semaine: { titre: 'Top 5 de la semaine', sous: 'Publiés ces 7 derniers jours.' },
  mois: { titre: 'Top 5 du mois', sous: 'Publiés ces 30 derniers jours.' },
  toujours: { titre: 'Top 5 depuis le début', sous: 'Tout ce qui est passé par la bibliothèque.' },
};

// Une ligne du podium : le rang, le titre, et le détail des points.
function topLine(p, rang) {
  return html`
    <li class="top-line ${rang <= 3 ? 'podium rang-' + rang : ''}">
      <span class="top-rang">${rang}</span>
      <div class="top-main">
        <a class="top-titre" href="#/p/${p.id}">${fr(p.title)}</a>
        <div class="meta">${kind(p.type)}<span>@${p.author}</span>${starsView(p)}</div>
      </div>
      <div class="top-pts" title="${p.gems} gemme${p.gems > 1 ? 's' : ''} et ${p.starsCount} note${p.starsCount > 1 ? 's' : ''}">
        <b>${p.points}</b><small>points</small>
      </div>
    </li>`;
}

function topBloc(cle, list, { compact = false } = {}) {
  const { titre, sous } = PERIODES[cle];
  return html`
    <section class="top-bloc">
      <h2>${ICON.cup}${titre}</h2>
      ${compact ? '' : html`<p class="muted">${sous}</p>`}
      ${list.length
        ? html`<ol class="top-list">${list.map((p, i) => topLine(p, i + 1))}</ol>`
        : html`<p class="muted">Rien encore sur cette période. Donne une gemme à ce qui t’a servi.</p>`}
    </section>`;
}

async function topView() {
  const data = await api('/top');
  document.title = 'Top 5 – makers.si';
  render(html`
    <div class="narrow top-page">
      <a class="back" href="#/">← Tous les partages</a>
      <h1 class="page-title">${ICON.cup}Le Top 5</h1>
      <p class="page-sub">Les points viennent des gemmes et des étoiles : une gemme vaut dix points, et chaque étoile donnée en vaut deux. Les gemmes sont rares (${S.me ? S.me.gemsLeft + ' restantes cette semaine pour toi' : 'quelques-unes par membre et par semaine'}), c’est ce qui rend le classement difficile à truquer.</p>
      ${Object.keys(PERIODES).map(k => topBloc(k, data[k]))}
      <div class="post-actions"><a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'Partager quelque chose' : 'Créer mon compte'}</a><a class="btn" href="#/">Voir la bibliothèque</a></div>
    </div>`);
}

async function postView(id) {
  let p;
  try { p = (await api('/posts/' + id)).post; } catch { return render(html`<div class="narrow"><a class="back" href="#/">← Retour</a><div class="empty">Ce partage n’existe pas ou n’est pas encore publié.</div></div>`); }
  document.title = p.title + ' – makers.si';
  render(html`
    <div class="narrow post">
      <a class="back" href="#/">← Tous les partages</a>
      ${p.status === 'pending' ? html`<div class="notice">En attente de validation. Toi seul(e) vois ce partage pour l’instant.</div>` : ''}
      ${p.status === 'rejected' ? html`<div class="notice bad">Refusé${p.rejectReason ? ' : ' + p.rejectReason : '.'}</div>` : ''}
      <div>${kind(p.type)}${p.premium ? html` <span class="pin lock">${ICON.lock}espace privé</span>` : ''}</div>
      <h1>${fr(p.title)}</h1>
      <div class="post-meta"><span>@${p.author}</span><span>${ago(p.approvedAt || p.createdAt)}</span>${p.tags.map(tagLink)}</div>
      ${postBody(p, { howto: true })}
      ${p.status === 'approved' || !p.status ? html`<div class="post-actions">
          ${gemButton(p)}
          <span class="muted">${p.gems} gemme${p.gems > 1 ? 's' : ''}</span>
          <span class="sep"></span>
          ${starsView(p, { interactive: true })}
          <span class="muted" data-stars-label="${p.id}">${p.starsCount
            ? `${String(p.stars).replace('.', ',')} sur 5 · ${p.starsCount} note${p.starsCount > 1 ? 's' : ''}`
            : 'Pas encore noté'}</span>
        </div>
        <details class="report"><summary>Signaler ce partage</summary>
          <form data-form="report" data-id="${p.id}">
            <input type="text" name="reason" maxlength="300" placeholder="Qu’est-ce qui ne va pas ? (contenu copié, dangereux, publicité…)" aria-label="Motif du signalement" required>
            <button class="btn small" type="submit">Envoyer</button>
          </form>
          <p>Pour une demande de retrait pour droit d’auteur, voir la <a href="#/charte">charte</a>.</p>
        </details>` : ''}
    </div>`);
}

async function legalView(name) {
  // Chemin relatif : la copie statique peut vivre dans un sous-dossier (github.io/depot/).
  const res = await fetch(`legal/${name}.html`);
  if (!res.ok) return go('#/');
  // Contenu statique écrit par nous (dossier public/legal), pas de contenu de membre ici.
  render(raw(`<div class="narrow legal">${await res.text()}</div>`));
}

function accountView() {
  if (!S.me) { go('#/connexion'); return; }
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mon compte</h1><a class="btn ghost" href="#/mes-partages">← Mes partages</a></div>
      <div class="block"><div class="attach"><div><b>@${S.me.pseudo}</b><small>${S.me.email}</small></div></div></div>

      <h2 class="faq-title">Mes données</h2>
      <p class="muted">Télécharge tout ce que le site garde sur toi (compte, partages, votes) dans un fichier lisible.</p>
      <a class="btn" href="/api/me/export" download>Télécharger mes données</a>
      <p class="switch">Détails dans la <a href="#/confidentialite">politique de confidentialité</a>.</p>

      <h2 class="faq-title">Supprimer mon compte</h2>
      <p class="muted">C’est définitif. Tes partages en attente ou refusés sont supprimés. Pour tes partages publiés, tu choisis.</p>
      <form data-form="delete-account" novalidate>
        <div class="field"><label for="d-pw">Mot de passe</label><input id="d-pw" type="password" name="password" autocomplete="current-password" required></div>
        <div class="field"><label class="check"><input type="checkbox" name="deletePosts"><span>Supprimer aussi mes partages publiés (sinon ils restent, sans mon pseudo).</span></label></div>
        <p class="form-error" role="alert"></p>
        <button class="btn bad" type="submit">Supprimer mon compte</button>
      </form>
    </div>`);
}

// --- Anti-robot ---------------------------------------------------------------
// Le serveur donne un défi ; le navigateur cherche un nombre dont l'empreinte SHA-256
// commence par assez de zéros. Invisible pour une personne, coûteux pour un robot
// qui voudrait créer des comptes en masse. Aucun service extérieur n'est appelé.
let challenge = null;

async function getChallenge() {
  challenge = await api('/challenge');
  return challenge;
}

async function solveChallenge(c) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Ton navigateur doit être sur une connexion sécurisée (https) pour créer un compte.');
  }
  const enc = new TextEncoder();
  for (let nonce = 0; nonce < 50e6; nonce++) {
    const buf = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(`${c.salt}:${nonce}`)));
    let zeros = 0;
    for (const byte of buf) {
      if (byte === 0) { zeros += 8; continue; }
      zeros += Math.clz32(byte) - 24;
      break;
    }
    if (zeros >= c.bits) return { challengeId: c.id, nonce };
  }
  throw new Error('Vérification impossible. Recharge la page.');
}

function authView(mode) {
  if (S.me) { go('#/'); return; }
  const join = mode === 'join';
  render(html`
    <div class="narrow">
      <h1 class="page-title">${join ? 'Rejoindre la communauté' : 'Connexion'}</h1>
      <p class="page-sub">${join ? 'Gratuit. Ton email reste privé, il sert seulement à te recontacter si besoin.' : 'Content de te revoir.'}</p>
      ${join ? html`
        <ul class="steps">
          <li><b>Lire</b> : skills Claude, prompts, idées, PDF, liens.</li>
          <li><b>Partager</b> : tes trouvailles, relues avant publication.</li>
          <li><b>Voter</b> : gemmes, étoiles et sondages, pour faire remonter le meilleur.</li>
        </ul>` : ''}
      <form data-form="${join ? 'join' : 'login'}" novalidate>
        <div class="field"><label for="f-pseudo">${join ? 'Pseudo' : 'Pseudo ou email'}</label>
          <input id="f-pseudo" type="text" name="pseudo" required autocomplete="username" ${join ? 'maxlength="24"' : ''}>
          ${join ? html`<small>3 à 24 caractères : lettres, chiffres, point, tiret.</small>` : ''}</div>
        ${join ? html`<div class="field"><label for="f-email">Email</label><input id="f-email" type="email" name="email" required autocomplete="email"></div>` : ''}
        <div class="field"><label for="f-pw">Mot de passe</label>
          <input id="f-pw" type="password" name="password" required autocomplete="${join ? 'new-password' : 'current-password'}">
          ${join ? html`<small>8 caractères minimum.</small>` : ''}</div>
        ${join ? html`<div class="field"><label class="check"><input type="checkbox" name="accept" required>
          <span>J’accepte les <a href="#/conditions" target="_blank">conditions d’utilisation</a>, la <a href="#/charte" target="_blank">charte de la communauté</a> et la <a href="#/confidentialite" target="_blank">politique de confidentialité</a>.</span></label></div>` : ''}
        ${join ? html`<div class="trap" aria-hidden="true"><label>Ne remplis pas ce champ<input type="text" name="site" tabindex="-1" autocomplete="off"></label></div>` : ''}
        <p class="form-error" role="alert"></p>
        <button class="btn primary" type="submit">${join ? 'Créer mon compte' : 'Me connecter'}</button>
        ${join ? html`<p class="switch">Une vérification anti-robot tourne toute seule à l’envoi. Il n’y a pas d’image à déchiffrer, et rien n’est envoyé à un service extérieur.</p>` : ''}
      </form>
      <p class="switch">${join ? html`Déjà membre ? <a href="#/connexion">Connexion</a>` : html`Pas encore de compte ? <a href="#/rejoindre">Rejoindre</a>`}</p>
    </div>`);
  // Le défi est demandé dès l'ouverture de la page : au moment de l'envoi, il est prêt,
  // et le temps écoulé prouve déjà que le formulaire n'a pas été rempli par un script.
  if (join) getChallenge().catch(() => {});
}

function shareView(q) {
  if (!S.me) { go('#/rejoindre'); return; }
  const first = TYPES[q.get('type')] ? q.get('type') : 'skill';
  render(html`
    <div class="narrow">
      <h1 class="page-title">Partager</h1>
      <p class="page-sub">Trois minutes. Ton partage sera relu avant d’apparaître dans la bibliothèque.</p>
      <form data-form="share" enctype="multipart/form-data" novalidate>
        <h2 class="step"><span>1</span>Qu’est-ce que tu partages ?</h2>
        <div class="typecards">
          ${Object.entries(TYPES).map(([k, v]) => html`<input type="radio" name="type" id="t-${k}" value="${k}" ${k === first ? 'checked' : ''}>
            <label for="t-${k}"><b>${v.label}</b><span>${v.hint}</span><em>${v.example}</em></label>`)}
        </div>

        <h2 class="step"><span>2</span>Les détails</h2>
        <div class="field"><label for="s-title">Titre</label><input id="s-title" type="text" name="title" maxlength="120" required>
          <small>Dis ce que c’est, pas « super astuce ».</small></div>
        <div class="field" data-field="url"><label for="s-url" id="l-url">Lien</label><input id="s-url" type="url" name="url" placeholder="https://">
          <small id="h-url">Pour une vidéo : héberge-la (YouTube, Drive, Vimeo) et colle le lien ici.</small></div>
        <div class="field"><label for="s-desc">Description</label><textarea id="s-desc" name="description" maxlength="1500" required></textarea>
          <small>Entre 10 et 1500 caractères. Ajoute pour qui c’est utile.</small></div>
        <div class="field" data-field="content"><label for="s-content" id="l-content">Contenu</label>
          <textarea id="s-content" class="code" name="content" maxlength="20000" spellcheck="false"></textarea>
          <small>Les lecteurs pourront le copier d’un clic.</small></div>
        <div class="field" data-field="tree"><label>Les fichiers du skill</label>
          <small>Un skill est un dossier. <b>SKILL.md est obligatoire</b> : c’est le fichier que Claude lit. Ajoute à côté ce qui aide à s’en servir : une documentation, un exemple, un script. Un chemin peut contenir un dossier, comme <span class="mono">references/guide.md</span>.</small>
          <div class="fichiers" id="fichiers"></div>
          <button type="button" class="btn small" data-action="ajouter-fichier">${ICON.plus}Ajouter un fichier</button></div>
        <div class="field" data-field="options"><label for="s-options">Les réponses possibles</label>
          <textarea id="s-options" name="options" rows="5" maxlength="600" placeholder="Opus&#10;Sonnet&#10;Haiku&#10;Ça dépend du jour"></textarea>
          <small>Une réponse par ligne, de 2 à 6. Chaque membre vote une fois et peut changer d’avis.</small></div>
        <div class="field" data-field="file"><label for="s-file" id="l-file">Ton PDF</label><input id="s-file" type="file" name="file" accept=".pdf,.md,.txt,.zip">
          <small>PDF : ${S.limits.pdfKb} Ko maximum, pour que le site reste rapide. MD, TXT ou ZIP : ${S.limits.fileMb} Mo. Pas de vidéo : colle plutôt le lien.</small>
          <div id="pdf-aide" class="hidden"></div></div>
        <div class="field" data-field="images"><label for="s-images">Photos <span class="muted">(facultatif, 3 maximum)</span></label>
          <input id="s-images" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple>
          <small>JPG, PNG ou WebP. Elles sont compressées automatiquement et la position GPS est effacée.</small>
          <div class="previews" id="previews"></div></div>
        <div class="field" data-field="tags"><label for="s-tags">Tags <span class="muted">(facultatif)</span></label><input id="s-tags" type="text" name="tags" placeholder="claude-code, sous-titres">
          <small>5 maximum, séparés par des virgules. Ils aident à retrouver ton partage.</small></div>
        <p class="form-error" role="alert"></p>
        <button class="btn primary" type="submit">Envoyer pour validation</button>
      </form>
    </div>`);
  applyType(first);
}

// Adapte le formulaire de partage au type choisi : champs utiles, libellés, exemples.
function applyType(type) {
  const t = TYPES[type];
  $$('[data-field]').forEach(row => {
    const on = t.fields.includes(row.dataset.field);
    row.classList.toggle('hidden', !on);
    $$('input, textarea', row).forEach(i => { i.disabled = !on; });
  });
  $('#l-url').innerHTML = type === 'lien' ? 'Le lien' : 'Lien <span class="muted">(facultatif)</span>';
  $('#s-url').required = type === 'lien';
  $('#s-title').placeholder = t.titleEx;
  $('#s-desc').placeholder = t.descEx;
  // Un sondage a sa question dans le titre : les réponses sont obligatoires.
  $('#s-options').required = type === 'sondage';
  if (t.contentLabel) {
    // `contentLabel` porte déjà son « (facultatif) » quand le champ l'est vraiment.
    $('#l-content').innerHTML = /<span/.test(t.contentLabel) ? t.contentLabel : `${esc(t.contentLabel)} <span class="muted">(facultatif)</span>`;
    $('#s-content').placeholder = t.contentEx;
  }
  $('#l-file').innerHTML = t.fileLabel || (type === 'pdf' ? 'Ton PDF' : 'Fichier <span class="muted">(facultatif)</span>');

  // Un skill commence toujours avec son SKILL.md : la ligne est posée d'office.
  const boite = $('#fichiers');
  if (boite && type === 'skill' && !boite.children.length) {
    boite.innerHTML = ligneFichier('SKILL.md', '', true);
  }
}

// Un PDF trop lourd : on le dit au moment où il est choisi, pas après l'envoi,
// et on explique quoi faire. Les méthodes hors ligne viennent en premier : envoyer un
// document sur un site de compression, c'est le confier à un inconnu.
function verifiePdf(input) {
  const boite = $('#pdf-aide');
  if (!boite) return;
  const f = input.files?.[0];
  const limite = S.limits.pdfKb;
  if (!f || !/\.pdf$/i.test(f.name) || f.size <= limite * 1024) {
    boite.innerHTML = '';
    boite.classList.add('hidden');
    return;
  }
  const ko = Math.round(f.size / 1024);
  const fois = (f.size / (limite * 1024)).toFixed(1).replace('.', ',');
  boite.classList.remove('hidden');
  boite.innerHTML = html`
    <div class="trop-lourd">
      <b>Ce PDF est trop lourd : ${ko} Ko, soit ${fois} fois la limite de ${limite} Ko.</b>
      <p>On garde les documents légers pour que le site reste rapide, y compris en 4G. Trois solutions :</p>

      <h4>1. Le compresser sur ton ordinateur <span class="muted">(le plus sûr)</span></h4>
      <ul>
        <li><b>Mac</b> : ouvre-le dans Aperçu, puis Fichier → Exporter → Filtre Quartz → « Reduce File Size ».</li>
        <li><b>Windows</b> : ouvre-le dans Word, puis Fichier → Enregistrer sous → PDF → « Taille minimale ».</li>
        <li><b>Depuis le fichier d’origine</b> : réexporte en baissant la résolution des images à 150 ppp. C’est presque toujours une image à l’intérieur qui pèse.</li>
      </ul>

      <h4>2. Un outil en ligne</h4>
      <p class="attention">Attention : ces sites reçoivent une copie de ton document. Ne les utilise pas s’il contient des informations personnelles, les tiennes ou celles de quelqu’un d’autre.</p>
      <ul>
        <li><a href="https://www.ilovepdf.com/fr/compresser_pdf" target="_blank" rel="noopener noreferrer nofollow">iLovePDF</a></li>
        <li><a href="https://smallpdf.com/fr/compresser-pdf" target="_blank" rel="noopener noreferrer nofollow">Smallpdf</a></li>
        <li><a href="https://tools.pdf24.org/fr/compresser-pdf" target="_blank" rel="noopener noreferrer nofollow">PDF24</a> — existe aussi en logiciel à installer, qui travaille sans rien envoyer.</li>
      </ul>

      <h4>3. Ne pas l’envoyer du tout</h4>
      <p>Mets-le sur Drive, Dropbox ou ton site, et colle son adresse dans le champ <b>Lien</b> ci-dessus. Un partage « PDF » accepte très bien un lien à la place du fichier.</p>
    </div>`.s;
}

// Une ligne de l'éditeur : un chemin, un contenu. La première est SKILL.md, et ne s'enlève pas.
function ligneFichier(chemin = '', contenu = '', fixe = false) {
  return html`
    <div class="fichier-ligne">
      <div class="fichier-tete">
        ${ICON.doc}
        <input type="text" class="chemin" value="${chemin}" placeholder="references/guide.md" maxlength="100"
          aria-label="Chemin du fichier" ${fixe ? 'readonly' : ''}>
        ${fixe ? '' : html`<button type="button" class="fichier-sup" data-action="retirer-fichier" aria-label="Retirer ce fichier" title="Retirer">×</button>`}
      </div>
      <textarea class="contenu" spellcheck="false" maxlength="20000"
        placeholder="${fixe ? '---\nname: mon-skill\ndescription: Ce qu’il fait, en une phrase.\n---\n\nLes instructions…' : 'Le contenu de ce fichier…'}"
        aria-label="Contenu du fichier">${contenu}</textarea>
    </div>`.s;
}

// Rassemble l'éditeur en JSON, pour l'envoyer au serveur.
function lisFichiers() {
  return $$('#fichiers .fichier-ligne')
    .map(l => ({ path: $('.chemin', l).value.trim(), content: $('.contenu', l).value }))
    .filter(f => f.path || f.content);
}

function renderPreviews(input) {
  const box = $('#previews');
  box.innerHTML = '';
  [...input.files].slice(0, 3).forEach(f => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    img.alt = '';
    img.onload = () => URL.revokeObjectURL(img.src);
    box.append(img);
  });
}

function sentView(p) {
  render(html`
    <div class="narrow">
      <h1 class="page-title">Bien reçu</h1>
      <p class="page-sub">« ${p.title} » est en attente de validation. Tu le retrouves dans « Mes partages » avec son statut.</p>
      <ul class="steps"><li><b>Maintenant</b> : ton partage est enregistré${p.imagesProcessing ? ' et tes photos sont compressées en arrière-plan' : ''}.</li>
        <li><b>Ensuite</b> : il est relu. Si tout est bon il apparaît dans la bibliothèque.</li>
        <li><b>Si refusé</b> : tu vois le motif dans « Mes partages ».</li></ul>
      <div class="post-actions"><a class="btn primary" href="#/mes-partages">Mes partages</a><a class="btn" href="#/partager">Partager autre chose</a></div>
    </div>`);
}

function welcomeView() {
  if (!S.me) { go('#/rejoindre'); return; }
  render(html`
    <div class="narrow">
      <h1 class="page-title">Bienvenue, @${S.me.pseudo}</h1>
      <p class="page-sub">Ton compte est prêt. Voilà par où commencer.</p>
      <div class="tiles wide">
        <a class="tile" href="#/?t=skill"><b>Installer un skill Claude</b><span>Ouvre-le, clique « Copier », colle-le dans ton projet.</span></a>
        <a class="tile" href="#/?t=prompt"><b>Prendre un prompt</b><span>Des prompts déjà testés, prêts à coller.</span></a>
        <a class="tile" href="#/partager"><b>Partager ma première trouvaille</b><span>Un skill, un prompt, une idée : ça prend trois minutes.</span></a>
        <a class="tile" href="#/top"><b>Voir le Top 5</b><span>Semaine, mois, depuis le début.</span></a>
      </div>
      <p class="muted">Tout partage est relu avant publication. Pas de vidéo importée : colle le lien.</p>
    </div>`);
}

function helpView() {
  render(html`
    <div class="narrow">
      <h1 class="page-title">Comment ça marche</h1>
      <p class="page-sub">Une minute pour tout comprendre.</p>
      <ol class="guide">
        <li><b>Cherche.</b> Tape un mot dans la barre en haut (« sous-titres », « git », « musique ») ou choisis une catégorie à gauche. Tu n’as pas besoin de compte pour lire.</li>
        <li><b>Utilise.</b> Sur un skill ou une technique, clique « Copier ». Sur un PDF, clique « Ouvrir ». Sur un lien, il s’ouvre dans un nouvel onglet.</li>
        <li><b>Récompense ce qui t’a servi.</b> La gemme à gauche de chaque partage le fait remonter dans le classement. Tu en reçois quelques-unes par semaine : donne-les à ce qui le mérite vraiment. Les étoiles, de 1 à 5, disent la qualité et ne coûtent rien.</li>
        <li><b>Partage.</b> Crée ton compte, clique « Partager », choisis ce que tu apportes et remplis le formulaire. Il est relu puis publié.</li>
      </ol>
      <div class="post-actions"><a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'Partager quelque chose' : 'Créer mon compte'}</a><a class="btn" href="#/">Voir la bibliothèque</a></div>

      <h2 class="faq-title">Questions fréquentes</h2>
      <details class="faq"><summary>Je dois créer un compte pour lire ?</summary><p>Non. Tout le contenu public est lisible sans compte. Le compte sert à partager, à donner des gemmes et des étoiles, et à demander l’accès à l’espace privé.</p></details>
      <details class="faq"><summary>C’est quoi les gemmes et les étoiles ?</summary><p>Les étoiles notent la qualité, de 1 à 5, et ne coûtent rien. Les gemmes sont rares : tu en reçois quelques-unes par semaine et tu en donnes au maximum une par partage. On ne peut ni gemmer ni noter son propre partage.</p></details>
      <details class="faq"><summary>Comment marche le Top 5 ?</summary><p>Chaque partage a des points : une gemme vaut 10 points, et chaque étoile reçue en vaut 2 (cinq étoiles d’une personne = 10 points). Le <a href="#/top">Top 5</a> existe en trois versions : la semaine et le mois comptent les partages publiés sur cette période, « depuis le début » compte tout.</p></details>
      <details class="faq"><summary>Comment marche un sondage ?</summary><p>Celui qui le crée écrit la question en titre et 2 à 6 réponses. Chaque membre vote une fois et peut changer d’avis ; cliquer de nouveau sa réponse retire le vote. Les résultats s’affichent une fois qu’on a voté.</p></details>
      <details class="faq"><summary>C’est quoi l’espace privé ?</summary><p>Une section à part, marquée d’un cadenas, qui contient des partages réservés. Tout le monde voit le sujet, mais le contenu demande un accès. Aujourd’hui il se donne à la main : écris-nous pour le demander.</p></details>
      <details class="faq"><summary>Pourquoi une vérification à l’inscription ?</summary><p>Pour bloquer les robots qui créent des comptes en masse. Elle se fait toute seule en une seconde, il n’y a pas d’image à déchiffrer, et aucun service extérieur n’est appelé.</p></details>
      <details class="faq"><summary>Comment partager une vidéo ?</summary><p>On n’héberge pas de vidéo : la bibliothèque garde les skills, les prompts, les idées et les PDF. Mets ta vidéo sur YouTube, Drive ou Vimeo, puis fais un partage de type « Lien » : le nom de la vidéo en titre, son adresse dans le lien.</p></details>
      <details class="faq"><summary>Comment utiliser un skill ?</summary><p>${HOWTO}</p></details>
      <details class="faq"><summary>Pourquoi mon partage n’apparaît pas ?</summary><p>Chaque partage est relu avant d’être publié. Tu vois son statut dans « Mes partages » : en attente, publié ou refusé (avec le motif).</p></details>
      <details class="faq"><summary>Pourquoi mon PDF est refusé ?</summary><p>Les PDF sont limités à ${S.limits.pdfKb} Ko, pour que le site reste rapide même en 4G. Si le tien dépasse, c’est presque toujours une image mal compressée à l’intérieur. Tu peux le réduire sur ton ordinateur (sur Mac : Aperçu → Exporter → Filtre Quartz → « Reduce File Size »), passer par un outil en ligne, ou simplement l’héberger ailleurs et coller le lien : un partage « PDF » accepte un lien à la place du fichier. Le formulaire te donne les trois solutions au moment où tu choisis le fichier.</p></details>
      <details class="faq"><summary>Quelles photos puis-je ajouter ?</summary><p>JPG, PNG ou WebP, trois par partage, 10 Mo chacune. Elles sont réduites automatiquement et la position GPS est effacée.</p></details>
      <details class="faq"><summary>Je peux supprimer un de mes partages ?</summary><p>Oui, depuis « Mes partages », bouton « Supprimer ».</p></details>
    </div>`);
}

async function mineView() {
  if (!S.me) { go('#/connexion'); return; }
  const { posts } = await api('/me/posts');
  const label = { pending: 'En attente', approved: 'Publié', rejected: 'Refusé' };
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mes partages</h1>
        <div><a class="btn primary" href="#/partager">${ICON.plus}Partager</a> <a class="btn ghost" href="#/compte">Mon compte</a> <button class="btn ghost" data-action="logout">Déconnexion</button></div></div>
      ${posts.length ? html`<table class="table"><thead><tr><th>Titre</th><th>Statut</th><th>Gemmes</th><th>Étoiles</th><th></th></tr></thead><tbody>
        ${posts.map(p => html`<tr><td><a href="#/p/${p.id}">${p.title}</a>${p.status === 'rejected' && p.rejectReason ? html`<br><small class="muted">${p.rejectReason}</small>` : ''}</td>
          <td><span class="status ${p.status}">${label[p.status]}</span></td><td class="mono">${p.gems}</td>
          <td class="mono">${p.starsCount ? String(p.stars).replace('.', ',') : '—'}</td>
          <td><button class="btn ghost small" data-action="mine-delete" data-id="${p.id}">Supprimer</button></td></tr>`)}
      </tbody></table>` : html`<div class="empty">Tu n’as encore rien partagé.</div>`}
    </div>`);
}

async function adminView(q) {
  if (!S.admin) {
    return render(html`
      <div class="narrow">
        <h1 class="page-title">Espace admin</h1>
        <p class="page-sub">Valide ou refuse les partages avant qu’ils soient publiés.</p>
        <form data-form="admin-login" novalidate>
          <div class="field"><label for="a-pw">Mot de passe admin</label><input id="a-pw" type="password" name="password" autocomplete="current-password" required>
            <small>Il est dans <span class="mono">data/config.json</span> au premier lancement.</small></div>
          <p class="form-error" role="alert"></p>
          <button class="btn primary" type="submit">Entrer</button>
        </form>
      </div>`);
  }
  const tab = q.get('s') || 'pending';
  const [counts, data] = await Promise.all([
    api('/admin/stats'),
    tab === 'members' ? api('/admin/members') : tab === 'reports' ? api('/admin/reports') : api('/admin/posts?status=' + tab),
  ]);
  S.pending = counts.pending; header();
  const tabs = [['pending', 'À valider', counts.pending], ['reports', 'Signalés', counts.reported], ['approved', 'Publiés', counts.approved], ['rejected', 'Refusés', counts.rejected], ['members', 'Membres', counts.members]];
  const privateNote = tab === 'members'
    ? html`<p class="about-type">L’accès à l’espace privé se donne à la main, un membre à la fois. Il n’y a pas encore de paiement : c’est toi qui décides qui entre.</p>`
    : '';

  const card = p => html`
    <div class="card" data-card="${p.id}">
      <div class="post-meta">${kind(p.type)}<span>@${p.author}</span><span class="muted">${p.authorEmail}</span><span>${ago(p.createdAt)}</span>
        ${p.premium ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
        ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        ${p.status === 'approved' ? html`<span class="muted">${ICON.gem}${p.gems}${p.starsCount ? ` · ★ ${String(p.stars).replace('.', ',')}` : ''}</span>` : ''}</div>
      <h3>${fr(p.title)}</h3>
      ${p.tags.length ? html`<div class="meta">${p.tags.map(t => html`<span class="tag">#${t}</span>`)}</div>` : ''}
      ${postBody({ ...p, id: 'a' + p.id })}
      ${p.status === 'rejected' && p.rejectReason ? html`<div class="notice bad">Motif : ${p.rejectReason}</div>` : ''}
      ${p.reports?.length ? html`<div class="notice bad"><b>${p.reports.length} signalement${p.reports.length > 1 ? 's' : ''}</b><ul class="reasons">${p.reports.map(x => html`<li>${x.reason} <span class="muted">(${ago(x.at)})</span></li>`)}</ul></div>` : ''}
      <div class="actions">
        ${p.reports?.length ? html`<button class="btn ok" data-action="dismiss" data-id="${p.id}">Garder (ignorer)</button>` : ''}
        ${p.status !== 'approved' ? html`<button class="btn ok" data-action="approve" data-id="${p.id}">Approuver</button>` : ''}
        ${p.status === 'approved' ? html`<button class="btn" data-action="pin" data-id="${p.id}">${p.pinned ? 'Désépingler' : 'Épingler'}</button>
          <button class="btn" data-action="post-premium" data-id="${p.id}">${p.premium ? 'Rendre public' : 'Mettre en privé'}</button>` : ''}
        ${p.status !== 'rejected' ? html`<button class="btn bad" data-action="reject-open" data-id="${p.id}">${p.status === 'approved' ? 'Retirer' : 'Refuser'}</button>` : ''}
        <button class="btn ghost" data-action="delete" data-id="${p.id}">Supprimer</button>
      </div>
      <form class="reject-form hidden" data-form="reject" data-id="${p.id}">
        <input type="text" name="reason" maxlength="200" placeholder="Motif (visible par l’auteur), facultatif" aria-label="Motif du refus">
        <button class="btn bad" type="submit">Confirmer</button>
      </form>
    </div>`;

  render(html`
    <div>
      <div class="admin-head"><h1 class="page-title">Modération</h1><button class="btn ghost" data-action="logout">Déconnexion</button></div>
      <div class="toolbar"><div class="tabs">${tabs.map(([k, l, n]) => html`<a href="#/admin?s=${k}" class="${tab === k ? 'on' : ''}">${l} (${n})</a>`)}</div></div>
      ${privateNote}
      ${tab === 'members'
        ? html`<table class="table"><thead><tr><th>Pseudo</th><th>Email</th><th>Inscrit</th><th>Publiés</th><th>Espace privé</th><th></th></tr></thead><tbody>
            ${data.members.map(m => html`<tr><td>@${m.pseudo}${m.locked ? html` <span class="status rejected">bloqué</span>` : ''}</td>
              <td class="muted">${m.email}</td><td>${ago(m.createdAt)}</td><td class="mono">${m.posts}</td>
              <td><button class="btn small ${m.premium ? 'ok' : ''}" data-action="member-premium" data-id="${m.id}">${m.premium ? 'Accès accordé' : 'Donner l’accès'}</button></td>
              <td>${m.locked ? html`<button class="btn small" data-action="member-unlock" data-id="${m.id}">Débloquer</button> ` : ''}<button class="btn ghost small" data-action="member-delete" data-id="${m.id}" data-pseudo="${m.pseudo}">Supprimer</button></td></tr>`)}</tbody></table>`
        : data.posts.length ? data.posts.map(card) : html`<div class="empty">${tab === 'pending' ? 'Rien à valider. Tout est à jour.' : 'Aucun partage ici.'}</div>`}
    </div>`);
}

// --- Routeur ------------------------------------------------------------------
const LEGAL = ['confidentialite', 'conditions', 'cookies', 'charte', 'mentions-legales'];

async function route() {
  document.title = 'makers.si – la bibliothèque de la communauté';
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const q = new URLSearchParams(qs || '');
  header();
  // Dans une copie en lecture seule, les pages qui écrivent n'ont nulle part où écrire.
  if (STATIQUE && ['/rejoindre', '/connexion', '/partager', '/compte', '/mes-partages', '/admin'].includes(path)) {
    toast('Cette copie du site est en lecture seule.');
    return go('#/');
  }
  try {
    if (path === '/') await feedView(q);
    else if (path.startsWith('/p/')) await postView(path.slice(3));
    else if (path === '/rejoindre') authView('join');
    else if (path === '/connexion') authView('login');
    else if (path === '/partager') shareView(q);
    else if (path === '/top') await topView();
    else if (path === '/aide') helpView();
    else if (path === '/compte') accountView();
    else if (LEGAL.includes(path.slice(1))) await legalView(path.slice(1));
    else if (path === '/bienvenue') welcomeView();
    else if (path === '/mes-partages') await mineView();
    else if (path === '/admin') await adminView(q);
    else go('#/');
  } catch (e) {
    render(html`<div class="narrow"><div class="empty">Impossible de charger la page. ${e.message}</div></div>`);
  }
}

async function refreshMe() {
  try {
    const r = await api('/me');
    Object.assign(S, { me: r.member, admin: r.admin, pending: r.pending });
    if (r.limits) S.limits = r.limits;
  } catch { /* hors ligne : on reste visiteur */ }
}

// --- Événements ----------------------------------------------------------------
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  try {
    if (action === 'gem') {
      if (!S.me) { toast('Rejoins la communauté pour donner une gemme.'); return go('#/rejoindre'); }
      const r = await api(`/posts/${id}/gem`, { method: 'POST' });
      $$(`.vote[data-id="${id}"]`).forEach(b => {
        b.classList.toggle('on', r.gemmed);
        b.setAttribute('aria-pressed', String(r.gemmed));
        $('b', b).textContent = r.gems;
      });
      S.me.gemsLeft = r.gemsLeft;
      header();
      toast(r.gemmed
        ? `Gemme donnée. Il t’en reste ${r.gemsLeft} cette semaine.`
        : `Gemme reprise. Il t’en reste ${r.gemsLeft}.`);
    } else if (action === 'star') {
      if (!S.me) { toast('Rejoins la communauté pour noter un partage.'); return go('#/rejoindre'); }
      const n = Number(el.dataset.n);
      const r = await api(`/posts/${id}/stars`, { method: 'POST', body: { stars: n } });
      $$(`.stars.big [data-id="${id}"]`).forEach(b => b.classList.toggle('on', Number(b.dataset.n) <= r.myStars));
      $(`.stars.big`)?.classList.add('mine');
      const label = $(`[data-stars-label="${id}"]`);
      if (label) label.textContent = `${String(r.stars).replace('.', ',')} sur 5 · ${r.starsCount} note${r.starsCount > 1 ? 's' : ''}`;
      toast(`Noté ${n} sur 5.`);
    } else if (action === 'vote') {
      if (!S.me) { toast('Rejoins la communauté pour voter.'); return go('#/rejoindre'); }
      const n = Number(el.dataset.n);
      const { poll } = await api(`/posts/${id}/vote`, { method: 'POST', body: { choice: n } });
      // On remplace le bloc du sondage sur place : pas de rechargement, la page ne saute pas.
      const box = el.closest('.poll');
      if (box) {
        const parent = box.parentElement;
        box.outerHTML = pollView({ id, poll }).s;
        // Le navigateur part de 0 % puis anime jusqu'au résultat (voir .poll-bar).
        requestAnimationFrame(() => applyBars(parent));
      }
      toast(poll.myVote === null ? 'Vote retiré.' : 'Vote enregistré.');
    } else if (action === 'plus') {
      // On ajoute la page suivante à la suite, sans recharger ni bouger la page.
      el.disabled = true;
      const libelle = el.innerHTML;
      el.textContent = 'Chargement…';
      try {
        const { posts, suite, total } = await api(`/posts?${el.dataset.params}&offset=${el.dataset.suite}`);
        const liste = $('.grille, .list');
        // La numérotation du classement reprend là où la page précédente s'est arrêtée.
        const classe = !!$('.rang, .rang-n, .medaille');
        let rang = $$('.item, .carte').length;
        liste.insertAdjacentHTML('beforeend', posts.map(p => item(p, classe && !p.pinned ? ++rang : null).s).join(''));
        applyBars(liste);
        if (suite) {
          el.dataset.suite = suite;
          el.innerHTML = libelle.replace(/· \d+ restants/, `· ${total - $$('.item, .carte').length} restants`);
          el.disabled = false;
        } else {
          el.closest('.plus').remove();
        }
      } catch (ex) {
        el.innerHTML = libelle;
        el.disabled = false;
        throw ex;
      }
    } else if (action === 'vue') {
      vueFil = el.dataset.vue;
      try { localStorage.setItem('mk-vue', vueFil); } catch { /* stockage bloqué : le choix vaut pour cette page */ }
      // On refait le fil sans recharger : les données sont déjà en cache.
      const y = window.scrollY;
      await route();
      window.scrollTo(0, y);
    } else if (action === 'ajouter-fichier') {
      const boite = $('#fichiers');
      boite.insertAdjacentHTML('beforeend', ligneFichier());
      $$('.fichier-ligne .chemin', boite).slice(-1)[0]?.focus();
    } else if (action === 'retirer-fichier') {
      el.closest('.fichier-ligne').remove();
    } else if (action === 'voir-fichier') {
      const f = depots.get(id)?.find(x => x.path === el.dataset.path);
      if (!f) return;
      const boite = el.closest('.depot');
      $$('.depot-fichier', boite).forEach(b => b.classList.toggle('on', b === el));
      $(`[data-depot-chemin="${id}"]`).textContent = f.path;
      $(`[data-depot-contenu="${id}"]`).textContent = f.content;
    } else if (action === 'copy-fichier') {
      const chemin = $(`[data-depot-chemin="${id}"]`).textContent;
      await navigator.clipboard.writeText($(`[data-depot-contenu="${id}"]`).textContent);
      toast(`${chemin} copié.`);
    } else if (action === 'tout-copier') {
      // Chaque fichier précédé de son chemin : on peut recréer le dossier à l'identique.
      const tree = depots.get(id) || [];
      const tout = tree.map(f => `===== ${f.path} =====\n${f.content}`).join('\n\n');
      await navigator.clipboard.writeText(tout);
      toast(`${tree.length} fichiers copiés.`);
    } else if (action === 'copy') {
      const text = $(`[data-copy="${id}"]`).textContent;
      await navigator.clipboard.writeText(text);
      toast('Copié.');
    } else if (action === 'logout') {
      await api('/logout', { method: 'POST' });
      Object.assign(S, { me: null, admin: false, pending: 0 });
      go('#/'); route();
    } else if (action === 'approve') {
      await api(`/admin/posts/${id}/approve`, { method: 'POST' });
      toast('Publié.'); route();
    } else if (action === 'mine-delete') {
      if (!confirm('Supprimer ce partage ?')) return;
      await api(`/posts/${id}/delete`, { method: 'POST' });
      toast('Supprimé.'); route();
    } else if (action === 'pin') {
      await api(`/admin/posts/${id}/pin`, { method: 'POST' });
      route();
    } else if (action === 'post-premium') {
      await api(`/admin/posts/${id}/premium`, { method: 'POST' });
      toast('Changé.'); route();
    } else if (action === 'member-premium') {
      await api(`/admin/members/${id}/premium`, { method: 'POST' });
      toast('Accès mis à jour.'); route();
    } else if (action === 'member-unlock') {
      await api(`/admin/members/${id}/unlock`, { method: 'POST' });
      toast('Compte débloqué.'); route();
    } else if (action === 'member-delete') {
      if (!confirm(`Supprimer le compte @${el.dataset.pseudo} et tous ses partages ?`)) return;
      await api(`/admin/members/${id}/delete`, { method: 'POST' });
      toast('Compte supprimé.'); route();
    } else if (action === 'dismiss') {
      await api(`/admin/posts/${id}/dismiss`, { method: 'POST' });
      toast('Signalements ignorés.'); route();
    } else if (action === 'reject-open') {
      $(`[data-card="${id}"] .reject-form`).classList.toggle('hidden');
      $(`[data-card="${id}"] .reject-form input`).focus();
    } else if (action === 'delete') {
      if (!confirm('Supprimer définitivement ce partage ?')) return;
      await api(`/admin/posts/${id}/delete`, { method: 'POST' });
      toast('Supprimé.'); route();
    }
  } catch (err) {
    toast(err.message);
  }
});

document.addEventListener('submit', async (e) => {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();
  const kindOf = form.dataset.form;
  const err = $('.form-error', form);
  const btn = $('button[type=submit]', form);
  const fail = m => { if (err) err.textContent = m; else toast(m); };
  if (err) err.textContent = '';
  const fd = new FormData(form);
  try {
    if (kindOf === 'search') {
      const q = String(fd.get('q')).trim();
      return go('#/' + (q ? '?q=' + encodeURIComponent(q) : ''));
    }
    btn && (btn.disabled = true);
    if (kindOf === 'join') {
      if (!fd.get('accept')) return fail('Coche la case pour accepter les conditions et la politique de confidentialité.');
      const label = btn.textContent;
      btn.textContent = 'Vérification…';
      const send = async () => {
        const proof = await solveChallenge(challenge || await getChallenge());
        return api('/join', { method: 'POST', body: { ...Object.fromEntries(fd), accept: true, ...proof } });
      };
      let r;
      try {
        r = await send();
      } catch (ex) {
        // Page restée ouverte longtemps : le défi a expiré. On en reprend un et on réessaie une fois.
        if (!/expirée/i.test(ex.message)) throw ex;
        challenge = null;
        await new Promise(res => setTimeout(res, 1700));
        r = await send();
      } finally {
        btn.textContent = label;
      }
      challenge = null;
      S.me = r.member; go('#/bienvenue');
    } else if (kindOf === 'login') {
      const r = await api('/login', { method: 'POST', body: Object.fromEntries(fd) });
      S.me = r.member; await refreshMe(); go('#/');
    } else if (kindOf === 'admin-login') {
      await api('/admin/login', { method: 'POST', body: Object.fromEntries(fd) });
      await refreshMe(); go('#/admin');
    } else if (kindOf === 'share') {
      const isVideo = f => VIDEO_EXT.includes(f.name.split('.').pop().toLowerCase()) || f.type.startsWith('video/');
      const VIDEO_MSG = 'Les vidéos ne sont pas acceptées. Héberge-la (YouTube, Drive…) et colle le lien.';
      const f = fd.get('file');
      if (f && f.size) {
        if (isVideo(f)) return fail(VIDEO_MSG);
        // Le PDF est arrêté ici : inutile d'envoyer plusieurs mégaoctets pour un refus.
        // Le détail de quoi faire est déjà affiché sous le champ (voir verifiePdf).
        if (/\.pdf$/i.test(f.name) && f.size > S.limits.pdfKb * 1024) {
          return fail(`Ce PDF fait ${Math.round(f.size / 1024)} Ko, la limite est de ${S.limits.pdfKb} Ko. Vois les solutions sous le champ « Ton PDF ».`);
        }
        if (f.size > S.limits.fileMb * 1024 * 1024) return fail(`Fichier trop lourd (${S.limits.fileMb} Mo maximum).`);
      } else fd.delete('file');
      const pics = fd.getAll('images').filter(x => x.size);
      fd.delete('images');
      if (pics.length > 3) return fail('3 photos maximum par partage.');
      for (const x of pics) {
        if (isVideo(x)) return fail(VIDEO_MSG);
        if (x.size > 10 * 1024 * 1024) return fail('Une photo dépasse 10 Mo.');
        fd.append('images', x);
      }
      // Les fichiers du skill voyagent en JSON : un formulaire ne sait pas porter une arborescence.
      if (fd.get('type') === 'skill') {
        const fichiers = lisFichiers();
        if (!fichiers.some(f => f.path.toLowerCase() === 'skill.md' && f.content.trim())) {
          return fail('Un skill a besoin d’un fichier SKILL.md rempli : c’est celui que Claude lit.');
        }
        fd.set('tree', JSON.stringify(fichiers));
      }
      const r = await api('/posts', { method: 'POST', body: fd });
      sentView(r.post);
    } else if (kindOf === 'report') {
      if (!S.me) { toast('Rejoins la communauté pour signaler.'); return go('#/rejoindre'); }
      await api(`/posts/${form.dataset.id}/report`, { method: 'POST', body: { reason: fd.get('reason') } });
      form.closest('details').open = false;
      form.reset();
      toast('Merci, le signalement est transmis.');
    } else if (kindOf === 'delete-account') {
      if (!confirm('Supprimer définitivement ton compte ?')) return;
      await api('/me/delete', { method: 'POST', body: { password: fd.get('password'), deletePosts: !!fd.get('deletePosts') } });
      Object.assign(S, { me: null, admin: false, pending: 0 });
      go('#/'); route(); toast('Compte supprimé.');
    } else if (kindOf === 'reject') {
      await api(`/admin/posts/${form.dataset.id}/reject`, { method: 'POST', body: { reason: fd.get('reason') } });
      toast('Refusé.'); route();
    }
  } catch (ex) {
    if (ex.status === 401 && kindOf === 'share') { S.me = null; header(); }
    fail(ex.message);
  } finally {
    btn && (btn.disabled = false);
  }
});

document.addEventListener('change', (e) => {
  if (e.target.name === 'type') applyType(e.target.value);
  if (e.target.name === 'images') renderPreviews(e.target);
  if (e.target.name === 'file') verifiePdf(e.target);
});

// Suggestions de recherche pendant la frappe.
let suggestTimer, suggestSeq = 0;
function closeSuggest() {
  const box = $('#suggest');
  if (!box) return;
  box.classList.add('hidden');
  box.innerHTML = '';
  $('.search input')?.setAttribute('aria-expanded', 'false');
}
document.addEventListener('input', (e) => {
  if (!e.target.matches('.search input')) return;
  clearTimeout(suggestTimer);
  const q = e.target.value.trim();
  if (q.length < 2) return closeSuggest();
  suggestTimer = setTimeout(async () => {
    const seq = ++suggestSeq;
    try {
      const { posts } = await api('/posts?' + new URLSearchParams({ q }));
      if (seq !== suggestSeq) return;
      const box = $('#suggest');
      if (!box) return;
      box.innerHTML = (posts.length
        ? posts.slice(0, 6).map(p => html`<li role="option"><a href="#/p/${p.id}">${kind(p.type)}<span>${p.title}</span></a></li>`)
        : [html`<li class="none">Aucun résultat pour « ${q} »</li>`]).map(x => x.s).join('') +
        html`<li class="all"><a href="#/?q=${encodeURIComponent(q)}">Voir tous les résultats</a></li>`.s;
      box.classList.remove('hidden');
      e.target.setAttribute('aria-expanded', 'true');
    } catch { closeSuggest(); }
  }, 160);
});
document.addEventListener('click', (e) => { if (!e.target.closest('.search')) closeSuggest(); });
document.addEventListener('keydown', (e) => {
  if (!e.target.matches?.('.search input')) return;
  const links = $$('#suggest a');
  if (e.key === 'Escape') { closeSuggest(); return; }
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' || !links.length) return;
  e.preventDefault();
  const i = links.indexOf(document.activeElement);
  const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i <= 0 ? links.length - 1 : i - 1);
  links[next].focus();
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    e.preventDefault();
    $('.search input')?.focus();
  }
});

window.addEventListener('hashchange', () => { closeSuggest(); route(); });
await refreshMe();
route();
