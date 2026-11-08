// Makers – interface. Pas de framework : un routeur par hash, du HTML échappé, des événements délégués.

// `fields` : ce que le formulaire de partage demande pour chaque type (le titre et la description sont toujours là).
const TYPES = {
  skill: {
    label: 'Skill Claude', short: 'Skill', plural: 'Skills Claude',
    about: 'Un skill, c’est un mode d’emploi que Claude lit tout seul quand ta demande correspond. Ceux-ci sont prêts à installer, en trois étapes.',
    hint: 'Le mode d’emploi que Claude lit, et ses fichiers.', example: 'Ex. : « Relecture avant commit »',
    fields: ['tree', 'url', 'images', 'modele', 'tags'],
    titleEx: 'Relecture automatique avant chaque commit', descEx: 'À quoi il sert, ce qu’il fait, dans quel cas tu l’utilises.',
  },
  agent: {
    label: 'Agent', short: 'Agent', plural: 'Agents',
    about: 'Des agents qui font un travail tout seuls : une consigne, des outils, et un endroit où s’arrêter.',
    hint: 'Un agent qui travaille seul, et ce qu’il lui faut.', example: 'Ex. : « Un agent qui relit mes PR »',
    fields: ['content', 'url', 'images', 'modele', 'tags'],
    titleEx: 'Un agent qui trie mes mails et répond aux plus simples',
    descEx: 'Ce qu’il fait sans toi, ce qu’il te demande, et où il s’arrête tout seul.',
    contentLabel: 'Sa consigne et ses outils', contentEx: 'Rôle : …\n\nOutils dont il dispose :\n- …\n\nQuand il s’arrête et demande :\n- …',
  },
  mcp: {
    label: 'Serveur MCP', short: 'MCP', plural: 'Serveurs MCP',
    about: 'Des serveurs MCP : ce qui donne à un modèle des outils, des fichiers ou une base à consulter.',
    hint: 'Un serveur qui donne des outils à un modèle.', example: 'Ex. : « Un MCP pour ma base Postgres »',
    fields: ['content', 'url', 'images', 'modele', 'tags'],
    titleEx: 'Un serveur MCP pour interroger ma base Postgres',
    descEx: 'Les outils qu’il expose, ce qu’il faut pour l’installer, et ce qu’il ne sait pas faire.',
    contentLabel: 'La configuration', contentEx: '{\n  "mcpServers": {\n    "postgres": {\n      "command": "npx",\n      "args": ["-y", "…"]\n    }\n  }\n}',
  },
  prompt: {
    label: 'Prompt', short: 'Prompt', plural: 'Prompts',
    about: 'Des prompts qui marchent, prêts à coller dans ta conversation.',
    hint: 'Un prompt à coller tel quel.', example: 'Ex. : « Explique-moi ce code »',
    fields: ['content', 'url', 'images', 'modele', 'tags'],
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
  alerte: svg('<path d="M8 2.3 14.6 13.7H1.4z"/><path d="M8 6.4v3.3"/><path d="M8 11.7h.01"/>'),
  bulle: svg('<path d="M13.5 9.5a1.5 1.5 0 0 1-1.5 1.5H6l-3.5 2.5V4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4z"/>'),
  poubelle: svg('<path d="M2.8 4.3h10.4M6.3 4.3V2.8h3.4v1.5M4.3 4.3l.6 8.4a1 1 0 0 0 1 .9h4.2a1 1 0 0 0 1-.9l.6-8.4"/>'),
  loupe: svg('<circle cx="7" cy="7" r="4.6"/><path d="M10.6 10.6 14 14"/>'),
  menu: svg('<path d="M2.5 4h11M2.5 8h11M2.5 12h11"/>'),
  maison: svg('<path d="M2.5 7 8 2.5 13.5 7v6.5H2.5z"/><path d="M6.3 13.5V9.2h3.4v4.3"/>'),
  perso: svg('<circle cx="8" cy="5.4" r="2.6"/><path d="M2.9 13.6a5.1 5.1 0 0 1 10.2 0"/>'),
  // Un agent : une tête qui travaille toute seule.
  agent: svg('<rect x="2.8" y="5.6" width="10.4" height="7.6" rx="1.8"/><path d="M8 5.6V2.8M5.9 9.2h.01M10.1 9.2h.01"/>'),
  // Un serveur MCP : une prise. C'est exactement ce qu'il fait — il branche des
  // outils sur un modèle.
  mcp: svg('<path d="M5.8 2.2v3.4M10.2 2.2v3.4"/><rect x="3.6" y="5.6" width="8.8" height="4" rx="1.2"/><path d="M8 9.6v4.2"/>'),
  // Le modèle sur lequel c'est essayé.
  etincelle: svg('<path d="M8 2.2v11.6M2.2 8h11.6M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6"/>'),
  // Ce qui s'est passé pendant ton absence.
  cloche: svg('<path d="M4 6.6a4 4 0 0 1 8 0c0 3 1 4.2 1 4.2H3s1-1.2 1-4.2z"/><path d="M6.6 13a1.6 1.6 0 0 0 2.8 0"/>'),
};

// --- Utilitaires ------------------------------------------------------------
// `limits` est renseigné par /api/me : le formulaire prévient avant l'envoi plutôt que
// de laisser partir 5 Mo pour un refus. Valeurs de repli si l'appel échoue.
// `stats` sert au rail, qui est dessiné sur toutes les pages : on le garde ici
// pour ne pas redemander les mêmes compteurs à chaque changement de page.
// `modeles` vient du serveur (jamais recopié ici) : le formulaire ne peut donc
// pas proposer une famille que le serveur refuserait.
const S = { me: null, admin: false, pending: 0, nonLues: 0, promo: null, marche: null, stats: null, modeles: {}, limits: { pdfKb: 200, fileMb: 15, imageMb: 10, images: 3 } };

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

// La copie publiée répond aux mêmes adresses que le serveur, et doit renvoyer la
// même forme : une liste porte un aperçu du contenu, jamais le contenu entier.
// C'est cet aperçu que la couverture d'un partage affiche ; sans lui, la copie
// publiée montrerait des couvertures vides là où le site complet montre le début
// du prompt. (Voir `pourListe` dans src/posts.js, dont ceci est le jumeau.)
const pourListe = p => {
  const o = { ...p };
  o.apercu = (o.content || '').slice(0, 260);
  delete o.content;
  return o;
};

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
  const { posts, stats, limits, promo, modeles = {}, collections = [] } = await chargeStatique();
  const [base, qs] = chemin.split('?');
  const q = new URLSearchParams(qs || '');

  // `promo` décrit l'offre (places, durée, tarif), pas son état : une copie de fichiers
  // n'a pas d'horloge, donc elle ne sait pas combien de places sont libres à cet instant.
  if (base === '/me') return { member: null, admin: false, pending: 0, limits, promo, modeles };
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

  // Les réponses voyagent avec leur partage dans le fichier de données : la copie
  // consultable les affiche, sans pouvoir en ajouter ni en retirer.
  const sesReponses = base.match(/^\/posts\/([a-f0-9]+)\/comments$/);
  if (sesReponses) {
    const post = posts.find(p => p.id === sesReponses[1]);
    if (!post) throw Object.assign(new Error('Partage introuvable.'), { status: 404 });
    return { comments: post.comments || [] };
  }

  // Les collections de la copie consultable : elles portent déjà leurs partages, il
  // suffit de les habiller comme le ferait le serveur.
  const habille = c => ({
    ...c, count: c.items.length, manquants: 0,
    items: c.items.map(it => ({ note: it.note, post: posts.find(p => p.id === it.postId) })).filter(x => x.post),
  });
  if (base === '/collections') {
    const n = Math.min(100, Math.max(1, Number(q.get('limit')) || 100));
    return { collections: collections.slice(0, n).map(habille), total: collections.length };
  }
  const uneColl = base.match(/^\/collections\/([a-f0-9]+)$/);
  if (uneColl) {
    const c = collections.find(x => x.id === uneColl[1]);
    if (!c) throw Object.assign(new Error('Collection introuvable.'), { status: 404 });
    return { collection: habille(c) };
  }

  // Le profil est recalculé à partir des partages : la copie consultable ne contient
  // aucune fiche de membre (ni email, ni date d'inscription), seulement des pseudos
  // déjà publics parce qu'ils sont signés au bas de chaque partage.
  const unMembre = base.match(/^\/membres\/(.+)$/);
  if (unMembre) {
    const cherche = decodeURIComponent(unMembre[1]).toLowerCase();
    const siens = ouverts.filter(p => (p.authorLink || '').toLowerCase() === cherche);
    if (!siens.length) throw Object.assign(new Error('Ce membre n’existe pas.'), { status: 404 });
    const starsCount = siens.reduce((a, p) => a + p.starsCount, 0);
    const tagCount = {};
    for (const p of siens) for (const t of p.tags) tagCount[t] = (tagCount[t] || 0) + 1;
    return {
      profil: {
        pseudo: siens[0].authorLink,
        depuis: null,
        posts: siens.length,
        premium: 0,
        gems: siens.reduce((a, p) => a + p.gems, 0),
        stars: starsCount
          ? Math.round((siens.reduce((a, p) => a + p.stars * p.starsCount, 0) / starsCount) * 10) / 10
          : 0,
        starsCount,
        points: siens.reduce((a, p) => a + points(p), 0),
        byType: {},
        tags: Object.entries(tagCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .slice(0, 10).map(([tag, count]) => ({ tag, count })),
      },
      posts: siens.slice()
        .sort((a, b) => points(b) - points(a) || (b.approvedAt || 0) - (a.approvedAt || 0))
        .map(pourListe),
      collections: collections.filter(c => (c.authorLink || '').toLowerCase() === cherche).map(habille),
    };
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
    const fam = (q.get('m') || '').toLowerCase();
    const tri = q.get('s') || 'top';
    let list = ouverts.filter(p => (!t || p.type === t)
      && (!fam || p.modele?.famille === fam)
      && (!tag || p.tags.includes(tag)));
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
      posts: page.map(pourListe),
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
    let res;
    try {
      res = await fetch('/api' + path, {
        method,
        credentials: 'same-origin',
        headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      });
    } catch {
      // Le réseau n'a pas répondu du tout : appareil hors ligne, ou serveur
      // injoignable. `fetch` ne dit que « Failed to fetch » — de l'anglais
      // technique qui n'apprend rien à personne. On marque l'erreur, et c'est
      // le routeur qui en fait une page lisible.
      throw Object.assign(new Error('Le serveur ne répond pas.'), { reseau: true });
    }
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

// Une copie se confirme sur le bouton qui l'a faite. Le message au coin de
// l'écran arrivait trop loin du geste pour qu'on le relie au clic : on cliquait
// « Copier », quelque chose apparaissait en bas à gauche, et on recliquait.
function confirme(el, mot = 'Copié') {
  const avant = el.innerHTML;
  el.innerHTML = html`${ICON.vote}${mot}`.s;
  el.classList.add('copie');
  clearTimeout(el.chronoCopie);
  el.chronoCopie = setTimeout(() => { el.innerHTML = avant; el.classList.remove('copie'); }, 1600);
}

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
// Le remplacement du contenu reste synchrone, et c'est volontaire : plusieurs
// vues interrogent le DOM à la ligne suivante (le formulaire de partage règle
// ses champs, le composeur dessine sa liste). Une transition différée d'une
// image — `startViewTransition` — les ferait travailler sur une page encore
// vide. Le fondu d'entrée est donc fait en CSS, sur l'élément neuf : même
// effet à l'œil, aucun décalage.
const render = (tpl) => { view.innerHTML = tpl.s; applyBars(view); window.scrollTo(0, 0); };
const go = h => { location.hash = h; };

// --- Composants ---------------------------------------------------------------
// La barre du haut. Le champ de recherche a laissé sa place au déclencheur de la
// palette : un champ ne sait que chercher, une palette cherche et fait. Elle
// trouve les partages, les catégories, les pages, et exécute les gestes
// courants — tout au clavier, ce que le champ ne permettait pas.
function header() {
  const choix = window.makersTheme?.lu?.() || 'auto';
  // Le nom lu doit contenir le mot visible, sinon « clique sur papier » dicté à
  // voix haute ne trouve pas le bouton (le `title` seul prenait le dessus).
  const theme = (cle, mot, titre) => html`<button type="button" data-action="theme" data-theme="${cle}"
    aria-pressed="${String(choix === cle)}" aria-label="Thème ${mot} — ${titre}" title="${titre}">${mot}</button>`;
  $('#header').innerHTML = html`
    <div class="bar">
      <button class="menu-btn" type="button" data-action="menu" aria-label="Ouvrir les sections" aria-expanded="false">${ICON.menu}</button>
      <a class="logo" href="#/" aria-label="makers.si, accueil">makers<i>.</i>si</a>
      <button class="cmd" type="button" data-action="palette" aria-label="Chercher un partage ou taper une commande">
        ${ICON.loupe}<span>Chercher, ou taper une commande…</span><kbd>⌘K</kbd>
      </button>
      <div class="bar-end">
        <div class="theme" role="group" aria-label="Apparence">
          ${theme('auto', 'auto', 'Suivre le réglage de l’appareil')}
          ${theme('papier', 'papier', 'Fond clair')}
          ${theme('nuit', 'nuit', 'Fond sombre')}
        </div>
        <!-- Sur téléphone, la modération quitte la barre du haut : elle ne sert qu'à
             une personne, et la place revient à la cloche, qui sert tous les jours.
             Elle reste atteignable par le rail et par la palette. -->
        ${S.admin ? html`<a class="btn small hide-sm" href="#/admin">À valider${S.pending ? html`<span class="badge">${S.pending}</span>` : ''}</a>` : ''}
        ${S.me && !STATIQUE ? html`
          <a class="cloche ${S.nonLues ? 'neuve' : ''}" href="#/notifications"
            aria-label="${S.nonLues ? `${S.nonLues} nouveauté${S.nonLues > 1 ? 's' : ''} depuis ta dernière visite` : 'Ce qui s’est passé'}"
            title="${S.nonLues ? `${S.nonLues} nouveauté${S.nonLues > 1 ? 's' : ''}` : 'Ce qui s’est passé'}">
            ${ICON.cloche}${S.nonLues ? html`<span class="pastille">${S.nonLues > 9 ? '9+' : S.nonLues}</span>` : ''}
          </a>` : ''}
        ${S.me
          ? html`<span class="purse hide-sm" title="Gemmes qu’il te reste à donner cette semaine">${ICON.gem}${S.me.gemsLeft}</span>
            <a class="who" href="#/mes-partages">@${S.me.pseudo}</a>`
          : STATIQUE
            ? html`<span class="lecture-seule hide-sm" title="Copie consultable : on lit tout, on n’écrit rien">${ICON.lock}lecture seule</span>`
            : html`<a class="btn ghost hide-sm" href="#/connexion">Connexion</a>
              <!-- Sur téléphone, la barre du bas porte déjà « Entrer » : garder
                   ce bouton ici faisait déborder la barre du haut. -->
              <a class="btn primary hide-sm" href="#/rejoindre">Rejoindre</a>`}
      </div>
    </div>`.s;
}

// --- Le rail et la barre du bas ---------------------------------------------------
// Le rail est la table des matières de la bibliothèque, et il ne bouge jamais :
// on change de catégorie depuis n'importe quelle page. C'est ce qui fait la
// différence entre une suite de pages et un outil.
const TYPE_ICONE = {
  skill: 'dossier', agent: 'agent', mcp: 'mcp', prompt: 'code', idee: 'ampoule',
  sondage: 'sondage', montage: 'play', pdf: 'doc', lien: 'out', info: 'megaphone',
};

function railHTML(stats, path, q) {
  const surFil = path === '/';
  const t = surFil ? (q.get('t') || '') : '';
  const tag = surFil ? (q.get('tag') || '') : '';
  const mot = surFil ? (q.get('q') || '') : '';
  const prem = surFil && q.get('p') === '1';
  const mod = surFil ? (q.get('m') || '') : '';
  const tri = q.get('s');
  // Changer de catégorie remet à zéro la recherche et le tag, mais garde le tri :
  // quelqu'un qui lit « les mieux notés » veut continuer à les lire ailleurs.
  // Une entrée du rail remet à zéro la recherche et les autres filtres, mais
  // garde le tri : qui lit « les mieux notés » veut continuer à les lire ailleurs.
  const vers = (clef, valeur) => {
    const n = new URLSearchParams();
    if (valeur) n.set(clef, valeur);
    if (tri && tri !== 'top') n.set('s', tri);
    const s = n.toString();
    return '#/' + (s ? '?' + s : '');
  };
  // Même règle que pour les gemmes : une rubrique vide reste visible — elle dit ce
  // que la bibliothèque accueille — mais elle n'écrit pas son zéro. Quatre « 0 »
  // alignés dans la colonne de gauche, sur chaque page, annoncent un site mort.
  const compte = n => (!n ? '' : html`<span>${n}</span>`);
  const total = stats ? Object.values(stats.byType).reduce((a, b) => a + b, 0) : null;
  const rien = !t && !tag && !mot && !prem && !mod && surFil;

  return html`
    <section>
      <h3 class="cote">La bibliothèque</h3>
      <a href="${vers('t', '')}" class="${rien ? 'on' : ''}">Tout ${compte(total)}</a>
      ${Object.entries(TYPES).map(([cle, v]) => html`
        <a href="${vers('t', cle)}" class="k-${cle} ${stats && !stats.byType?.[cle] ? 'vide' : ''} ${t === cle && !prem ? 'on' : ''}">
          ${ICON[TYPE_ICONE[cle]]}${v.plural} ${compte(stats?.byType?.[cle])}</a>`)}
    </section>

    <!-- « Montre-moi ce qui tourne sur Claude. » La rubrique n'apparaît que
         lorsqu'au moins un partage dit sur quoi il a été essayé : une liste de
         modèles sans rien derrière ne ferait que promettre du vide. -->
    ${Object.keys(stats?.byModele || {}).length ? html`
      <section>
        <h3 class="cote">Essayé sur</h3>
        ${Object.entries(stats.byModele).map(([cle, n]) => html`
          <a href="${vers('m', cle)}" class="${mod === cle ? 'on' : ''}">
            ${ICON.etincelle}${S.modeles[cle] || cle} ${compte(n)}</a>`)}
      </section>` : ''}

    <section>
      <h3 class="cote">Parcours</h3>
      <a href="#/collections" class="${path === '/collections' || path.startsWith('/c/') ? 'on' : ''}">
        ${ICON.lignes}Collections ${compte(stats?.collections)}</a>
      <a href="#/top" class="${path === '/top' ? 'on' : ''}">${ICON.cup}Top 5 ${compte(null)}</a>
      ${stats?.premium ? html`
        <a href="#/?p=1" class="${prem ? 'on' : ''}">${ICON.lock}Espace privé ${compte(stats.premium)}</a>` : ''}
    </section>

    ${STATIQUE ? '' : html`
      <section>
        <h3 class="cote">${S.me ? 'Chez moi' : 'Participer'}</h3>
        ${S.me
          ? html`
            <a class="btn primary" href="#/partager">${ICON.plus}Partager</a>
            <a href="#/notifications" class="${path === '/notifications' ? 'on' : ''}">
              ${ICON.cloche}Ce qui s’est passé ${S.nonLues ? html`<span>${S.nonLues}</span>` : ''}</a>
            <a href="#/mes-partages" class="${path === '/mes-partages' ? 'on' : ''}">${ICON.dossier}Mes partages</a>
            <a href="#/mes-ventes" class="${path === '/mes-ventes' ? 'on' : ''}">${ICON.file}Mes ventes</a>
            <a href="#/membre/${encodeURIComponent(S.me.pseudo)}">${ICON.perso}Mon profil</a>`
          : html`
            <a class="btn primary" href="#/rejoindre">${ICON.plus}Créer mon compte</a>
            <a href="#/connexion">${ICON.lock}Me connecter</a>`}
        <!-- Hors du choix ci-dessus : une session d'administration est indépendante
             d'un compte membre. On peut modérer sans être connecté comme membre. -->
        ${S.admin ? html`<a href="#/admin" class="${path === '/admin' ? 'on' : ''}">
          ${ICON.vote}Modération ${S.pending ? html`<span>${S.pending}</span>` : ''}</a>` : ''}
      </section>`}

    <div class="rail-bas">
      <p>Chaque partage est relu avant publication.
        <a href="#/aide">Comment ça marche</a> · <a href="#/charte">la charte</a>.</p>
      <p class="hide-sm">Tape <kbd>?</kbd> pour les raccourcis.</p>
    </div>`;
}

// Les cinq cases de la barre du bas, sur téléphone. « Partager » au centre,
// à la couleur de la maison : c'est le geste qu'on vient faire.
function barreBasHTML(path) {
  const on = p => (path === p ? 'on' : '');
  return html`
    <a href="#/" class="${on('/')}">${ICON.maison}Biblio</a>
    <a href="#/collections" class="${on('/collections')}">${ICON.lignes}Parcours</a>
    ${STATIQUE
      ? html`<a href="#/aide" class="${on('/aide')}">${ICON.ampoule}Aide</a>`
      : html`<a href="${S.me ? '#/partager' : '#/rejoindre'}" class="appoint ${on('/partager')}">${ICON.plus}Partager</a>`}
    <a href="#/top" class="${on('/top')}">${ICON.cup}Top</a>
    <a href="${S.me ? '#/mes-partages' : '#/connexion'}" class="${on('/mes-partages')}">${ICON.perso}${S.me ? 'Moi' : 'Entrer'}</a>`;
}

// Le rail se dessine tout de suite avec les chiffres qu'on a déjà, puis se
// corrige quand ils arrivent : il ne doit jamais retarder l'affichage de la page.
async function rail() {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const q = new URLSearchParams(qs || '');
  const dessine = () => {
    const r = $('#rail'), b = $('#barre-bas');
    if (r) r.innerHTML = railHTML(S.stats, path, q).s;
    if (b) b.innerHTML = barreBasHTML(path).s;
  };
  dessine();
  if (S.stats) return;
  try { S.stats = await api('/stats'); dessine(); }
  catch { /* hors ligne : le rail reste sans compteurs, les liens marchent */ }
}

const kind = t => html`<span class="kind k-${t}">${TYPES[t]?.short || t}</span>`;
const tagLink = t => html`<a class="tag" href="#/?tag=${encodeURIComponent(t)}">#${t}</a>`;
// Le pseudo mène au profil. Quand le compte a été supprimé le partage reste, mais son
// auteur n'existe plus (« ancien·ne membre ») : il n'y a rien à ouvrir, donc pas de lien.
// Un visage, même réduit à une initiale, dit « quelqu'un a partagé ça » bien plus vite
// qu'un pseudo en gris clair. Même pastille que sur la page de profil, en plus petit.
// La teinte vient du pseudo, donc elle ne change jamais : la même personne porte
// la même couleur sur toutes les pages, à toutes les visites, sur tous les
// appareils. C'est ce qui fait qu'on finit par reconnaître quelqu'un avant
// d'avoir lu son nom. (`empreinte` est déclarée plus bas — une fonction, donc
// disponible ici.)
const rond = nom => html`<span class="rond" data-teinte="${empreinte(nom || '?') % 10}" aria-hidden="true">${(nom || '?').slice(0, 1).toUpperCase()}</span>`;

// Une place payée se signale, partout où le partage apparaît. Sans cette mention,
// ce serait de la publicité déguisée — et le fil ne vaudrait plus rien.
const sponsoBadge = p => (p.promo
  ? html`<span class="pin sponso" title="Place payée par son auteur. Le contenu a passé la même relecture que les autres.">${ICON.megaphone}sponsorisé</span>`
  : '');
// Un partage en vente le dit partout où il apparaît : le prix fait partie de ce qu'on
// regarde pour décider d'ouvrir, au même titre que le titre.
const prixBadge = p => (p.prix
  ? html`<span class="pin vente" title="Le contenu de ce partage s’achète">${p.prix} ${p.devise || ''}</span>`
  : '');
// Le modèle sur lequel ça a été essayé. Cliquable : c'est aussi un filtre, parce
// que « montre-moi tout ce qui tourne sur Claude » est une vraie question.
const nomFamille = m => S.modeles?.[m.famille] || m.famille;
const modeleBadge = p => (p.modele
  ? html`<a class="modele" href="#/?m=${encodeURIComponent(p.modele.famille)}"
      title="Essayé sur ${p.modele.label} — voir tout ce qui tourne sur ${nomFamille(p.modele)}">${p.modele.label}</a>`
  : '');

const auteurLien = p => p.authorLink
  ? html`<a class="auteur" href="#/membre/${encodeURIComponent(p.authorLink)}">${rond(p.author)}@${p.author}</a>`
  : html`<span class="auteur">${rond(p.author)}@${p.author}</span>`;

// Une gemme = le signal fort. Chaque membre n'en a que quelques-unes par semaine,
// c'est ce qui fait que le classement « Top » veut dire quelque chose.
// En liste, le bouton tient dans une colonne étroite : icône et chiffre, comme à l'origine.
// Ailleurs, le mot « gemme » est écrit à côté, parce qu'un losange et un nombre tout seuls
// ne disent pas qu'on peut cliquer ni ce que ça fait.
// Trois tailles : la colonne étroite de la liste (compacte), la pastille courte du pied
// d'une carte (court), et la version en toutes lettres partout où il y a la place.
// Le mot disparaît de l'affichage, jamais de l'étiquette lue à voix haute.
// Le chiffre n'est écrit que s'il y a quelque chose à compter. Un « 0 » répété
// trente fois sur la première page dit « personne n'est jamais passé ici », et
// c'est la première chose qu'un visiteur lit. Le <b> reste dans la page, vide :
// le gestionnaire du clic y écrit le nouveau total, et le CSS le cache tant
// qu'il est vide. Sans lui, la première gemme donnée ferait planter l'affichage.
function gemButton(p, { compact = false, court = false } = {}) {
  const title = p.gemmed ? 'Reprendre ma gemme' : 'Donner une gemme';
  const mot = !compact && !court;
  return html`<button class="vote ${compact ? 'compacte' : ''} ${court ? 'court' : ''} ${p.gemmed ? 'on' : ''}" data-action="gem" data-id="${p.id}"
    aria-pressed="${String(p.gemmed)}" aria-label="${title}" title="${title}">${ICON.gem}<b>${p.gems || ''}</b>${mot ? html`<span class="vote-mot">${p.gems ? `gemme${p.gems > 1 ? 's' : ''}` : 'Donner une gemme'}</span>` : ''}</button>`;
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

// Un nom de dossier valable, tiré du titre : « Expliquer un bout de code » devient
// « expliquer-un-bout-de-code ».
const slugDe = (titre) => (titre || 'skill').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'mon-skill';

// La première question en arrivant sur un skill n'est pas « quels fichiers ? » mais
// « qu'est-ce que j'en fais ? ». Trois étapes numérotées, visibles sans rien déplier :
// c'est ce qui remplace l'arborescence de dépôt comme premier contact.
function etapesSkill(racine, multi) {
  return html`
    <section class="mode-emploi">
      <h2>Comment s’en servir</h2>
      <ol class="etapes">
        <li><div><b>Copie ${multi ? 'les fichiers' : 'le contenu'}</b>
          <span>Le bouton de copie ci-dessous te donne tout en une fois.</span></div></li>
        <li><div><b>Crée le dossier sur ton ordinateur</b>
          <span>Un dossier nommé <code>${racine}</code>, à mettre dans <code>.claude/skills/</code> de ton projet — ou dans <code>~/.claude/skills/</code> pour l’avoir partout. Colle ${multi ? 'chaque fichier avec le nom indiqué' : 'le texte dans un fichier nommé SKILL.md'}.</span></div></li>
        <li><div><b>Redémarre Claude et demande-lui</b>
          <span>Il s’en sert tout seul quand ta demande correspond. Il n’y a aucun réglage à faire.</span></div></li>
      </ol>
      <p class="prudence">${ICON.alerte}<span>Lis ce que fait un skill avant de l’installer : il peut lancer des actions sur ton ordinateur, et personne ne garantit à ta place qu’il est sans danger.</span></p>
    </section>`;
}

// Un prompt, c'est deux gestes : copier, coller. Dire le reste serait du bruit.
function etapesPrompt() {
  return html`
    <section class="mode-emploi">
      <h2>Comment s’en servir</h2>
      <ol class="etapes">
        <li><div><b>Copie le texte</b>
          <span>Le bouton « Copier » en haut du bloc.</span></div></li>
        <li><div><b>Colle-le dans ta conversation</b>
          <span>Dans Claude, ChatGPT ou l’outil que tu utilises, puis remplace ce qui est entre crochets par ta situation.</span></div></li>
      </ol>
    </section>`;
}

function treeView(p) {
  const tree = p.tree;
  if (!tree?.length) return '';
  depots.set(p.id, tree);
  // SKILL.md d'abord : c'est le fichier que Claude lit, et celui qu'on veut voir en arrivant.
  const premier = tree.find(f => f.path.toLowerCase() === 'skill.md') || tree[0];
  const racine = slugDe(p.title);
  const multi = tree.length > 1;
  return html`
    ${etapesSkill(racine, multi)}
    <div class="depot" data-depot="${p.id}">
      <div class="depot-head">
        ${ICON.dossier}<b>Ce qu’il y a dedans</b>
        <span class="muted">${tree.length} fichier${multi ? 's' : ''}</span>
        <button class="btn small" data-action="tout-copier" data-id="${p.id}">${ICON.copy}Copier tout le skill</button>
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
    </div>`;
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

// --- Les couvertures ----------------------------------------------------------
// Une bibliothèque de skills, de prompts et de liens n'a presque jamais d'image :
// sur les trente-huit partages du catalogue, aucun n'en a. L'index était donc du
// texte gris sur fond sombre, de haut en bas — une liste de courses, pas une
// bibliothèque. Chaque partage reçoit maintenant une couverture fabriquée à partir
// de ce qu'il est vraiment : la couleur de sa catégorie, un motif tiré de son
// identifiant, et son propre contenu posé dessus en petit. De loin on voit une
// matière et on distingue les catégories à la couleur ; de près on lit le début du
// prompt. Rien n'est décoratif : tout ce qui s'affiche sort du partage lui-même.

// Empreinte stable (FNV-1a) : la couverture d'un partage est la même à chaque
// visite, sur chaque appareil. Un motif tiré au hasard changerait d'un affichage à
// l'autre, et on ne reconnaîtrait plus un partage à son allure.
function empreinte(id = '') {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const MOTIFS = 8;

// Ce qu'on pose sur la couverture, par ordre de préférence : le contenu lui-même,
// puis ce qui en tient lieu. Un partage fermé ne montre rien — son `content` est
// déjà vide pour qui n'y a pas accès, et on ne fabrique pas un faux aperçu à partir
// du titre pour remplir le cadre.
// Quinze liens sur trente-huit partages, et presque tous sur le même site : une
// couverture qui ne dirait que « github.com » quinze fois ne distinguerait rien.
// C'est le chemin qui porte le nom du dépôt, donc c'est lui qu'on écrit en grand.
function adresseCoupee(brut) {
  try {
    const u = new URL(brut);
    return { hote: u.hostname.replace(/^www\./, ''), chemin: decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g, '') };
  } catch { return { hote: domain(brut), chemin: '' }; }
}

function couvertureFond(p) {
  if (p.locked) return '';
  // `apercu` : les premiers caractères du contenu, envoyés par le serveur avec la
  // liste. Le contenu entier n'arrive que sur la page du partage — d'où le repli.
  const texte = (p.apercu || p.content || '').trim();
  if (texte) return html`<span class="couv-extrait">${texte}</span>`;
  if (p.url) {
    const { hote, chemin } = adresseCoupee(p.url);
    return html`<span class="couv-lien"><small>${hote}</small><b>${chemin || hote}</b></span>`;
  }
  if (p.file) return html`<span class="couv-mot">${p.file.ext.toUpperCase()}</span>`;
  if (p.poll) return html`<span class="couv-mot">${p.poll.total} vote${p.poll.total > 1 ? 's' : ''}</span>`;
  if (p.treeCount) return html`<span class="couv-mot">${p.treeCount} fichier${p.treeCount > 1 ? 's' : ''}</span>`;
  // Un partage qui n'a ni contenu, ni lien, ni fichier — une annonce, par exemple.
  // Plutôt qu'un cadre vide : sa catégorie, en grand. C'est le dernier mot vrai
  // qui reste à dire sur lui.
  return html`<span class="couv-mot couv-cote">${TYPES[p.type]?.short || p.type}</span>`;
}

// Une vraie photo passe toujours devant la couverture fabriquée : quand il y a
// quelque chose à montrer, on le montre.
//
// La couverture est décorative au sens strict : elle répète un lien et un texte
// qui sont déjà écrits juste à côté. Elle est donc retirée du clavier et des
// lecteurs d'écran — sinon chaque partage compterait deux fois dans l'index.
function couverture(p, { mini = false } = {}) {
  const thumb = p.images?.[0]?.thumb;
  const classes = `couv${mini ? ' couv-mini' : ''} k-${p.type}`;
  if (thumb) {
    return html`<a class="${classes} couv-photo" href="#/p/${p.id}" tabindex="-1" aria-hidden="true"
      ><img src="${thumb}" alt="" loading="lazy"></a>`;
  }
  return html`
    <a class="${classes}" href="#/p/${p.id}" data-motif="${empreinte(p.id) % MOTIFS}" tabindex="-1" aria-hidden="true"
      >${couvertureFond(p)}</a>`;
}

// Deux façons de voir le fil, au choix du visiteur. Les cartes sont le réglage par
// défaut depuis que chaque partage a une couverture : c'est là qu'elle se voit, et
// une bibliothèque se parcourt d'abord à l'œil. La liste reste pour qui veut de la
// densité — elle porte les mêmes couvertures, en vignette. Le choix est gardé d'une
// visite à l'autre, et celui qui avait déjà choisi la liste la garde.
const VUES = { cartes: 'Cartes', liste: 'Liste' };
let vueFil = 'cartes';
try { if (VUES[localStorage.getItem('mk-vue')]) vueFil = localStorage.getItem('mk-vue'); }
catch { /* navigation privée ou stockage bloqué : on garde les cartes */ }

const item = (p, rang = null) => (vueFil === 'cartes' ? carte(p, rang) : ligne(p, rang));

// Une ligne de l'index. La grille se lit de gauche à droite comme une fiche de
// catalogue : la cote (le type) dans la marge, le titre et ce que c'est au
// centre, les chiffres à droite en chasse fixe, la gemme au bout.
//
// Ce qui a disparu par rapport à l'ancienne liste : les tags de chaque ligne.
// Trente-huit lignes à trois tags faisaient cent quatorze liens bleus en
// concurrence avec les titres, pour une navigation qu'on fait trois fois par
// mois. Ils restent sur la page d'un partage et dans le colophon du bas.
function ligne(p, rang = null) {
  const podium = rang && rang <= 3 ? rang : 0;
  const vu = apercu(p);
  return html`
    <article class="item k-${p.type} ${p.pinned ? 'pinned' : ''} ${podium ? 'podium rang-' + podium : ''}">
      ${kind(p.type)}
      <div class="item-corps">
        <div class="item-top">
          <a class="item-title" href="#/p/${p.id}">${fr(p.title)}</a>
          ${p.locked && !p.prix ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
          ${prixBadge(p)}
          ${sponsoBadge(p)}
          ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        </div>
        <p class="item-desc">${fr(p.description)}</p>
      </div>
      ${couverture(p, { mini: true })}
      <div class="faits">
        ${modeleBadge(p)}
        ${vu ? html`<span>${vu}</span>` : ''}
        ${starsView(p)}
        ${p.commentsCount ? html`<span class="repl" title="${p.commentsCount} réponse${p.commentsCount > 1 ? 's' : ''}">${ICON.bulle}${p.commentsCount}</span>` : ''}
        ${auteurLien(p)}
        <span>${ago(p.approvedAt || p.createdAt)}</span>
      </div>
      <div class="vote-col">
        ${podium ? html`<span class="rang" title="${rang}ᵉ au classement, ${p.points} points">n° ${rang}</span>`
          : rang ? html`<span class="rang-n">${rang}</span>` : ''}
        ${gemButton(p, { compact: true })}
      </div>
    </article>`;
}

// `rang` n'est donné que dans le classement : les trois premiers portent une médaille.
//
// La carte a retrouvé une couverture, et cette fois elle dit quelque chose : ce
// n'est plus l'aplat de couleur vide avec une icône au milieu qui occupait un quart
// de la carte pour rien, mais le début du prompt, le domaine du lien, l'extension
// du fichier. La description est revenue dessous, en deux lignes : un titre seul
// n'a jamais suffi à décider si on ouvre.
function carte(p, rang = null) {
  const podium = rang && rang <= 3 ? rang : 0;
  // « PDF » écrit sous une pastille qui dit déjà « PDF » n'apprend rien à personne,
  // et c'est ce mot en trop qui faisait passer le pied de la carte à la ligne.
  const vu = apercu(p);
  const detail = vu.toLowerCase() === (TYPES[p.type]?.short || '').toLowerCase() ? '' : vu;
  return html`
    <article class="carte k-${p.type} ${p.pinned ? 'pinned' : ''} ${podium ? 'podium rang-' + podium : ''}">
      ${couverture(p)}
      ${podium ? html`<span class="medaille" title="${rang}ᵉ au classement, ${p.points} points">n° ${rang}</span>` : ''}
      <div class="carte-corps">
        <div class="carte-haut">
          ${kind(p.type)}
          ${detail ? html`<span class="carte-detail">${detail}</span>` : ''}
          ${p.locked && !p.prix ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
          ${prixBadge(p)}
          ${sponsoBadge(p)}
          ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        </div>
        <a class="carte-titre" href="#/p/${p.id}">${fr(p.title)}</a>
        <p class="carte-desc">${fr(p.description)}</p>
        <div class="carte-bas">
          ${gemButton(p, { court: true })}
          ${modeleBadge(p)}
          ${starsView(p)}
          ${p.commentsCount ? html`<span class="repl" title="${p.commentsCount} réponse${p.commentsCount > 1 ? 's' : ''}">${ICON.bulle}${p.commentsCount}</span>` : ''}
          <span class="carte-auteur">${auteurLien(p)}</span>
        </div>
      </div>
    </article>`;
}

const BLOCK_LABEL = {
  skill: 'Le contenu du skill', agent: 'Sa consigne et ses outils', mcp: 'La configuration',
  prompt: 'Le prompt', idee: 'L’idée en détail', montage: 'Les étapes',
};

const HOWTO = 'Un skill, c’est un mode d’emploi écrit pour Claude : tu le poses une fois dans un dossier, et il s’en sert tout seul quand ta demande correspond. Sur la page d’un skill, les trois étapes sont écrites en haut : copier, créer le dossier .claude/skills/nom-du-skill/ dans ton projet (ou ~/.claude/skills/nom-du-skill/ pour l’avoir partout), redémarrer Claude. Lis toujours ce que fait un skill avant de l’installer : il peut lancer des actions sur ton ordinateur, et personne ne garantit à ta place qu’il est sans danger. Un prompt, lui, se colle directement dans la conversation.';

// --- Les réponses sous un partage ---------------------------------------------
// C'est ici que le site cesse d'être une étagère. Une réponse paraît tout de suite,
// signée du pseudo de qui l'écrit, et son auteur (comme l'admin) peut la retirer.
function reponseLi(c) {
  const nom = c.authorLink
    ? html`<a class="auteur" href="#/membre/${encodeURIComponent(c.authorLink)}">${rond(c.author)}@${c.author}</a>`
    : html`<span class="auteur">${rond(c.author)}@${c.author}</span>`;
  return html`
    <li class="reponse" data-comment="${c.id}">
      <div class="reponse-tete">
        ${nom}
        <span class="muted">${ago(c.createdAt)}</span>
        ${c.canDelete ? html`<button class="reponse-sup" data-action="comment-delete" data-id="${c.id}"
          title="Supprimer ce commentaire" aria-label="Supprimer ce commentaire">${ICON.poubelle}</button>` : ''}
      </div>
      <p class="reponse-texte">${c.body}</p>
    </li>`;
}

const titreFil = n => (n ? `${n} réponse${n > 1 ? 's' : ''}` : 'Aucune réponse pour l’instant');

function reponsesView(p, liste) {
  // Un partage réservé ne montre pas ses réponses : elles parlent de son contenu.
  if (p.locked) return '';
  return html`
    <section class="reponses">
      <h2>${ICON.bulle}${titreFil(liste.length)}</h2>
      ${liste.length ? html`<ol class="fil">${liste.map(reponseLi)}</ol>` : ''}
      ${STATIQUE ? html`<p class="reponse-invite">Cette copie du site se lit seulement : pour répondre, passe par le site complet.</p>`
        : S.me ? html`
        <form class="reponse-form" data-form="comment" data-id="${p.id}">
          <textarea name="body" rows="3" maxlength="1200" required
            placeholder="Ce qui a marché, ce que tu as changé, ce qui coince…" aria-label="Ta réponse"></textarea>
          <div class="reponse-pied">
            <span class="muted">Publiée tout de suite, signée @${S.me.pseudo}. Tu peux la supprimer ensuite.</span>
            <button class="btn primary" type="submit">Répondre</button>
          </div>
          <p class="form-error" role="alert"></p>
        </form>`
        : html`<p class="reponse-invite">Tu as un retour sur ce partage ? <a href="#/rejoindre">Crée un compte</a> pour répondre.</p>`}
    </section>`;
}

function lockedBox(p) {
  const bits = [];
  if (p.has?.tree) bits.push(`un dossier de ${p.has.tree} fichier${p.has.tree > 1 ? 's' : ''}`);
  if (p.has?.content) bits.push('un contenu à copier');
  if (p.has?.poll) bits.push('un sondage');
  if (p.has?.file) bits.push('un fichier');
  if (p.has?.url) bits.push('un lien');
  if (p.has?.images) bits.push(`${p.has.images} photo${p.has.images > 1 ? 's' : ''}`);
  const dedans = bits.length ? bits.join(', ') : 'du contenu';
  // Deux verrous différents, deux explications différentes : un abonnement d'un côté,
  // un achat de l'autre. Les confondre ferait croire qu'on paie deux fois.
  if (p.prix) {
    return html`
      <div class="locked">
        <div class="locked-head">${ICON.lock}<b>En vente · ${p.prix} ${p.devise || ''}</b></div>
        <p>Ce partage contient ${dedans}. Le contenu s’ouvre une fois l’achat confirmé ; le titre, la description et les tags restent publics.</p>
        ${STATIQUE
          ? html`<p class="muted">Cette copie du site se lit seulement : l’achat se fait sur le site complet.</p>`
          : S.me
            ? html`<button class="btn primary" data-action="acheter" data-id="${p.id}" data-prix="${p.prix} ${p.devise || ''}">Acheter pour ${p.prix} ${p.devise || ''}</button>
              <p class="muted">Le paiement se règle avec nous, hors du site. Ta commande nous prévient, et l’accès s’ouvre dès qu’elle est confirmée.</p>`
            : html`<a class="btn primary" href="#/rejoindre">Créer mon compte pour acheter</a>`}
      </div>`;
  }
  return html`
    <div class="locked">
      <div class="locked-head">${ICON.lock}<b>Contenu réservé à l’espace privé</b></div>
      <p>Ce partage contient ${dedans}, visible seulement avec l’accès à l’espace privé.</p>
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
      ${howto && p.type === 'skill' ? etapesSkill(slugDe(p.title), false) : ''}
      ${howto && p.type === 'prompt' ? etapesPrompt() : ''}
      <div class="block">
        <div class="block-head"><span>${BLOCK_LABEL[p.type] || 'contenu'}</span><button class="btn small" data-action="copy" data-id="${p.id}">${ICON.copy}Copier</button></div>
        <pre class="code" data-copy="${p.id}">${p.content}</pre>
      </div>` : ''}
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
  const mod = q.get('m') || '';
  const params = new URLSearchParams({ t, tag, q: query, s: sort, p: prem, m: mod });
  const cle = 'fil:' + params;
  const vu = duCache(cle);
  const frais = Promise.all([api('/posts?' + params), api('/stats'), api('/top?periode=semaine'), api('/collections?limit=3')])
    .then(r => { enCache(cle, r); return r; });
  // Déjà vu : on réaffiche immédiatement et on rafraîchit derrière.
  const [liste, stats, top, colls] = vu || await frais;
  const { posts, total: combien, suite } = liste;
  const link = (over) => {
    const n = new URLSearchParams();
    const merged = { t, tag, q: query, s: sort, p: prem, m: mod, ...over };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === 's' && v === 'top')) n.set(k, v);
    const s = n.toString();
    return '#/' + (s ? '?' + s : '');
  };
  const nomModele = mod ? (S.modeles[mod] || mod) : '';
  const title = query ? `Résultats pour « ${query} »` : tag ? `#${tag}`
    : prem ? 'Espace privé'
      : t && mod ? `${TYPES[t].plural} essayés sur ${nomModele}`
        : mod ? `Essayé sur ${nomModele}`
          : t ? TYPES[t].plural : 'Tous les partages';
  // Le rail affiche les mêmes compteurs sur toutes les pages : il les prend ici
  // plutôt que de redemander la même chose au serveur.
  S.stats = stats;
  rail();
  const nu = !t && !tag && !query && !prem && !mod;

  render(html`
    <div>
      ${S.me || !nu ? '' : html`
        <!-- Le premier bloc que quelqu'un lit en arrivant. Il disait « Tu peux
             tout lire sans compte / Un compte sert à partager, noter et voter » :
             deux règles d'usage, exactes et froides, qui décrivaient un système
             et pas un endroit. Ce qu'on a envie de savoir en poussant une porte,
             c'est qui est là et pourquoi. -->
        <section class="start" aria-label="Bienvenue">
          <div><b>Bienvenue. Ici, on range ce qui marche vraiment avec l’IA.</b>
          <span>Des skills, des prompts, des agents, des techniques — essayés pour de vrai, et relus un par un avant d’être publiés. Le catalogue de départ a été réuni par la maison, pour que les étagères ne soient pas vides le jour de l’ouverture ; à partir de maintenant, ça s’écrit à plusieurs.</span></div>
          ${STATIQUE ? '' : html`<a class="btn primary" href="#/rejoindre">Nous rejoindre</a>`}
        </section>`}

      <!-- L'étagère : la sélection de la semaine, posée à l'entrée. Dans une
           bibliothèque, la table des nouveautés est devant la porte — pas dans
           une colonne de droite que personne ne regarde. -->
      ${nu && top.posts.length ? html`
        <section class="etagere" aria-label="Le top de la semaine">
          <div class="etagere-tete">
            <h2 class="cote">Cette semaine</h2>
            <a href="#/top">Le classement complet →</a>
          </div>
          <div class="etagere-liste">
            ${top.posts.slice(0, 3).map((p, i) => html`
              <a class="etagere-item k-${p.type} ${i < 3 ? 'podium rang-' + (i + 1) : ''}" href="#/p/${p.id}">
                <span class="etagere-rang">n° ${i + 1} · ${TYPES[p.type]?.short || p.type}</span>
                <span class="etagere-titre">${fr(p.title)}</span>
                <span class="etagere-pts">${p.points} points</span>
              </a>`)}
          </div>
        </section>` : ''}

      <div class="toolbar">
        <h1>${title}<small>${combien} ${combien > 1 ? 'partages' : 'partage'}</small></h1>
        <div class="tabs">
          ${Object.entries(SORTS).map(([k, label]) => html`<a href="${link({ s: k })}" class="${sort === k ? 'on' : ''}">${label}</a>`)}
        </div>
        <div class="tabs vues" role="group" aria-label="Affichage">
          ${Object.entries(VUES).map(([k, label]) => html`<button type="button" data-action="vue" data-vue="${k}"
            class="${vueFil === k ? 'on' : ''}" aria-pressed="${String(vueFil === k)}">${ICON[k === 'liste' ? 'lignes' : 'grille']}${label}</button>`)}
        </div>
      </div>
      ${prem ? html`<p class="about-type">${ICON.lock} Partages réservés. Tu vois le sujet de chacun ; le contenu demande l’accès à l’espace privé.</p>`
        : mod ? html`<p class="about-type">${ICON.etincelle} Ce que des membres ont essayé sur ${nomModele}, et qui a marché chez eux. On range les familles, pas les versions : la version exacte est écrite à côté de chaque partage.</p>`
          : t && !query && !tag ? html`<p class="about-type">${TYPES[t].about}</p>` : ''}
      <div class="${vueFil === 'cartes' ? 'grille' : 'list'}">
        ${posts.length ? (() => {
          // Le classement ne numérote que le tri « Top », et saute les partages épinglés
          // comme les places payées : ils sont en tête pour une autre raison que leurs points.
          // Sans ça une place achetée porterait la médaille du premier, et payer ressemblerait
          // à gagner — exactement ce que la charte promet qui n'arrive pas.
          const classe = sort === 'top' && !query && !tag;
          let rang = 0;
          return posts.map(p => item(p, classe && !p.pinned && !p.promo ? ++rang : null));
        })() : html`
          <div class="empty">
            <!-- Une rubrique vide disait « Rien ici pour l'instant » : un constat,
                 et une impression de site mort. Elle dit maintenant à qui arrive
                 que la place est libre, ce qui est à la fois vrai et accueillant. -->
            ${query ? html`Aucun résultat pour « ${query} ».<br>Essaie un mot plus court, ou parcours les rubriques.<br>`
              : t ? html`${TYPES[t].plural} : personne n’a encore rien posé ici.<br>Tu peux être la première personne à le faire.<br>`
                : html`Rien ici pour l’instant.<br>`}
            ${stats.tags.length && query ? html`<div class="tagcloud center">${stats.tags.slice(0, 8).map(x => tagLink(x.tag))}</div>` : ''}
            <a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'Partager quelque chose' : 'Rejoindre pour partager'}</a></div>`}
      </div>
      ${suite ? html`<div class="plus"><button class="btn" data-action="plus" data-suite="${suite}" data-params="${params}">Voir plus<span class="muted"> · ${combien - posts.length} restants</span></button></div>` : ''}

      <!-- Le colophon. Ce qui remplissait la colonne de droite se lit mieux à la
           fin du catalogue, en petit : c'est la fin de l'objet, pas un encart
           qu'on double à chaque défilement. -->
      <div class="colophon">
        <section>
          <h3>Cette bibliothèque</h3>
          <p>Le catalogue de départ a été réuni par la maison — le compte <b>@makers.si</b> — pour que la bibliothèque ne soit pas vide à l’ouverture. Tout ce qui s’ajoute ensuite vient des membres, relu un par un avant d’être publié, et chaque réponse est signée.</p>
          <p class="muted">${stats.members} membre${stats.members > 1 ? 's' : ''} · ${stats.posts} partages · ${stats.gems} gemmes données.</p>
          ${colls?.collections?.length ? html`<p><a href="#/collections">${stats.collections} parcours composés par des membres →</a></p>` : ''}
        </section>
        <section>
          <h3>Le classement</h3>
          <p>Tu reçois quelques gemmes par semaine. Donne-les à ce qui t’a vraiment servi : une gemme pèse lourd, une étoile un peu. C’est ce qui fait monter un partage dans le <a href="#/top">Top 5</a>.</p>
        </section>
        <section>
          <h3>Les règles</h3>
          <ol>
            <li>Chaque partage est validé avant publication.</li>
            <li>Les réponses paraissent tout de suite, signées.</li>
            <li>Pas de vidéo importée : colle le lien.</li>
            <li>Cite ta source si ce n’est pas toi.</li>
            <li>Pas de pub déguisée : une <a href="#/mise-en-avant">place payée</a> est toujours signalée.</li>
          </ol>
        </section>
        ${stats.tags.length ? html`
          <section>
            <h3>Les sujets</h3>
            <div class="tagcloud">${stats.tags.map(x => tagLink(x.tag))}</div>
          </section>` : ''}
      </div>
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
        <div class="meta">${kind(p.type)}${auteurLien(p)}${starsView(p)}</div>
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

// --- Profil public d'un membre -------------------------------------------------
// Ce que la communauté peut savoir de quelqu'un : ce qu'il a publié, et ce que les autres
// en ont pensé. Rien d'autre. C'est la page qui donne une réputation à un pseudo, donc
// une raison de partager, et c'est elle qu'on pourra brancher plus tard sur une vitrine.
async function profilView(pseudo) {
  let data;
  try { data = await api('/membres/' + encodeURIComponent(pseudo)); }
  catch {
    return render(html`
      <div class="narrow"><a class="back" href="#/">← Tous les partages</a>
        <div class="empty">Ce membre n’existe pas.<br><a class="btn" href="#/">Voir la bibliothèque</a></div></div>`);
  }
  const { profil, posts } = data;
  const moi = !!S.me && S.me.pseudo.toLowerCase() === profil.pseudo.toLowerCase();
  document.title = `@${profil.pseudo} – makers.si`;
  // La copie consultable n'embarque aucune fiche de membre : elle n'a donc pas de date
  // d'arrivée à donner, et la ligne s'adapte au lieu d'afficher un trou.
  const mois = profil.depuis
    ? new Date(profil.depuis).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    : '';
  const pluriel = (n, un, suffixe = 's') => `${n} ${un}${n > 1 ? suffixe : ''}`;
  render(html`
    <div class="narrow profil">
      <a class="back" href="#/">← Tous les partages</a>
      <header class="profil-tete">
        <span class="profil-rond rond" data-teinte="${empreinte(profil.pseudo) % 10}" aria-hidden="true">${profil.pseudo.slice(0, 1).toUpperCase()}</span>
        <div class="profil-nom">
          <h1>@${profil.pseudo}</h1>
          <p class="muted">${mois ? `Membre depuis ${mois}` : 'Membre de la communauté'}${
            profil.premium ? html` · ${ICON.lock}${pluriel(profil.premium, 'partage')} dans l’espace privé` : ''}</p>
        </div>
        ${moi && !STATIQUE ? html`<a class="btn ghost" href="#/mes-partages">Gérer mes partages</a>` : ''}
      </header>
      ${moi ? html`<div class="notice">C’est ce que les autres membres voient de toi. Ton email n’y est jamais.</div>` : ''}

      <div class="profil-chiffres">
        <div><b>${profil.posts}</b><span>${profil.posts > 1 ? 'partages' : 'partage'}</span></div>
        <div><b>${profil.gems}</b><span>${profil.gems > 1 ? 'gemmes reçues' : 'gemme reçue'}</span></div>
        <div><b>${profil.starsCount ? String(profil.stars).replace('.', ',') : '—'}</b>
          <span>${profil.starsCount ? `sur 5 · ${pluriel(profil.starsCount, 'note')}` : 'pas encore noté'}</span></div>
        <div><b>${profil.points}</b><span>points</span></div>
      </div>

      ${profil.tags.length ? html`<div class="profil-tags">${profil.tags.map(x => tagLink(x.tag))}</div>` : ''}

      ${data.collections?.length ? html`
        <h2 class="profil-titre">${profil.collectionsCount > 1 ? 'Ses collections' : 'Sa collection'}<small>des parcours qu’${moi ? 'tu as' : 'il ou elle a'} composés</small></h2>
        <div class="coll-liste">${data.collections.map(collCarte)}</div>` : ''}

      ${posts.length ? html`
        <h2 class="profil-titre">${profil.posts > 1 ? 'Ses partages' : 'Son partage'}<small>le mieux élu d’abord</small></h2>
        <div class="${vueFil === 'cartes' ? 'grille' : 'list'}">${posts.map(p => item(p))}</div>`
        : html`<div class="empty">${moi
            ? html`Tu n’as encore rien de publié.<br><a class="btn primary" href="#/partager">Partager quelque chose</a>`
            : 'Rien de publié pour l’instant.'}</div>`}
    </div>`);
}

async function postView(id) {
  let p;
  try { p = (await api('/posts/' + id)).post; } catch { return render(html`<div class="narrow"><a class="back" href="#/">← Retour</a><div class="empty">Ce partage n’existe pas ou n’est pas encore publié.</div></div>`); }
  document.title = p.title + ' – makers.si';
  // Les réponses ne doivent pas empêcher le partage de s'afficher : si elles ne
  // viennent pas (copie consultable, partage réservé), la page se contente du reste.
  let reponses = [];
  try { reponses = (await api(`/posts/${id}/comments`)).comments || []; } catch { reponses = []; }
  // La classe du type porte la couleur de la catégorie à toute la page : les
  // numéros des étapes, l'icône d'une pièce jointe, le filet du dossier. Une
  // page de skill est verte, une page de prompt est cyan — chaque type a son
  // identité au lieu d'un violet unique partout.
  render(html`
    <div class="narrow post k-${p.type}">
      <a class="back" href="#/">← Tous les partages</a>
      ${p.status === 'pending' ? html`<div class="notice">En attente de validation. Toi seul(e) vois ce partage pour l’instant.</div>` : ''}
      ${p.status === 'rejected' ? html`<div class="notice bad">Refusé${p.rejectReason ? ' : ' + p.rejectReason : '.'}</div>` : ''}
      <div>${kind(p.type)}${p.premium ? html` <span class="pin lock">${ICON.lock}espace privé</span>` : ''}${p.prix ? html` ${prixBadge(p)}` : ''}${p.promo ? html` ${sponsoBadge(p)}` : ''}</div>
      <h1>${fr(p.title)}</h1>
      <div class="post-meta">${auteurLien(p)}<span>${ago(p.approvedAt || p.createdAt)}</span>${
        p.modele ? html`<span class="modele-ligne">essayé sur ${modeleBadge(p)}</span>` : ''}${p.tags.map(tagLink)}</div>
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
        ${reponsesView(p, reponses)}
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
        <div class="field" data-field="modele"><label for="s-modele">Essayé sur quel modèle ? <span class="muted">(facultatif)</span></label>
          <div class="duo">
            <select id="s-modele" name="modele">
              <option value="">Je ne précise pas</option>
              ${Object.entries(S.modeles).map(([cle, nom]) => html`<option value="${cle}">${nom}</option>`)}
            </select>
            <input type="text" name="modeleVersion" maxlength="40" placeholder="Opus 5" aria-label="Version du modèle">
          </div>
          <small>La famille d’abord, la version à côté si tu la connais. C’est la première chose qu’on se demande devant un prompt : <b>« ça marche sur quoi ? »</b> On range les familles, jamais les versions : une version est périmée en deux mois, une famille dure des années.</small></div>
        <div class="field" data-field="tags"><label for="s-tags">Tags <span class="muted">(facultatif)</span></label><input id="s-tags" type="text" name="tags" placeholder="claude-code, sous-titres">
          <small>5 maximum, séparés par des virgules. Ils aident à retrouver ton partage.</small></div>
        <div class="field" data-field="prix"><label for="s-prix">Prix <span class="muted">(facultatif — laisse vide pour offrir)</span></label>
          <input id="s-prix" type="number" name="prix" min="0" step="1" placeholder="0" inputmode="numeric">
          <small>Si tu mets un prix, le <b>contenu</b> ne s’ouvre qu’après l’achat ; le titre, la description et les tags restent publics, sinon personne ne saurait ce qu’il achète.
            De ${S.marche?.prixMin ?? 100} à ${S.marche?.prixMax ?? 100000} ${S.marche?.devise || 'DA'}.
            La plateforme retient <b>${S.marche?.commission ?? 5} %</b> sur chaque vente ; le reste te revient.
            Le prix passe la relecture comme le reste : l’équipe peut refuser une vente.</small></div>
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
    // Tout type peut être vendu, sauf un sondage : il n'a rien à livrer, seulement des
    // voix à compter. Le champ prix n'est donc pas listé type par type.
    const on = row.dataset.field === 'prix' ? type !== 'sondage' : t.fields.includes(row.dataset.field);
    row.classList.toggle('hidden', !on);
    // `select` était oublié ici : un champ caché continuait d'être envoyé.
    $$('input, textarea, select', row).forEach(i => { i.disabled = !on; });
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

// --- Mise en avant payée ---------------------------------------------------------
// La page qui rend l'offre trouvable. Elle dit le prix quand il est fixé (PROMO_PRIX),
// et sinon invite simplement à écrire : mieux vaut pas de chiffre qu'un faux chiffre.
function promoView() {
  const o = S.promo;
  const prix = o?.prix
    ? html`<b>${o.prix} ${o.devise}</b> pour ${o.jours} jours`
    : html`<b>Écris-nous pour le tarif</b>`;
  document.title = 'Mise en avant – makers.si';
  render(html`
    <div class="narrow">
      <a class="back" href="#/">← Tous les partages</a>
      <h1 class="page-title">${ICON.megaphone}Mettre un partage en avant</h1>
      <p class="page-sub">Une place en haut du fil, pour quelques jours. ${prix}.</p>

      <div class="notice">
        <b>Ce qui s’achète est la place, jamais la publication.</b> Un partage sponsorisé passe
        exactement la même relecture que les autres, et il est refusé s’il ne respecte pas
        la <a href="#/charte">charte</a>. Payer n’achète ni gemme, ni étoile, ni point :
        le <a href="#/top">Top 5</a> reste décidé par la communauté seule.
      </div>

      <ol class="steps">
        <li><b>Publie ton partage normalement.</b> Il est relu comme les autres. Un partage
          refusé ne peut pas être mis en avant, et l’argent n’y change rien.</li>
        <li><b>Écris-nous</b> avec l’adresse du partage et le nombre de jours voulus.</li>
        <li><b>Tu paies</b> (virement ou lien de paiement), puis la place est posée à la main.</li>
        <li><b>Elle s’arrête toute seule</b> à la date prévue. Rien à résilier.</li>
      </ol>

      <h2 class="faq-title">Les règles, en clair</h2>
      <ul class="guide">
        <li>Le partage porte la mention <span class="pin sponso">${ICON.megaphone}sponsorisé</span> tant que la place dure. Elle n’est jamais cachée.</li>
        <li>Il y a <b>${o?.places ?? 2} places</b> au maximum en même temps${o && typeof o.libres === 'number' ? html` (${o.libres} libre${o.libres > 1 ? 's' : ''} en ce moment)` : ''}, pour que le haut du fil reste lisible.</li>
        <li>Les épingles de l’équipe passent devant : ce que le site tient à montrer ne se fait pas doubler.</li>
        <li>Un partage de l’espace privé ne peut pas être mis en avant : il n’est pas dans le fil.</li>
        <li>Si un partage est retiré après un signalement, sa place s’arrête. On en reparle au cas par cas.</li>
      </ul>

      <div class="post-actions">
        <a class="btn primary" href="#/aide">Comment ça marche</a>
        <a class="btn" href="#/conditions">Les conditions</a>
      </div>
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
      <details class="faq"><summary>Qui peut répondre sous un partage ?</summary><p>N’importe quel membre connecté. Contrairement aux partages, une réponse n’est pas relue avant d’apparaître : elle s’affiche tout de suite, signée de ton pseudo. Tu peux supprimer les tiennes à tout moment, et l’admin peut supprimer n’importe laquelle. Si une réponse pose problème, signale le partage : le fil est relu avec lui.</p></details>
      <details class="faq"><summary>C’est quoi les gemmes et les étoiles ?</summary><p>Les étoiles notent la qualité, de 1 à 5, et ne coûtent rien. Les gemmes sont rares : tu en reçois quelques-unes par semaine et tu en donnes au maximum une par partage. On ne peut ni gemmer ni noter son propre partage.</p></details>
      <details class="faq"><summary>Comment marche le Top 5 ?</summary><p>Chaque partage a des points : une gemme vaut 10 points, et chaque étoile reçue en vaut 2 (cinq étoiles d’une personne = 10 points). Le <a href="#/top">Top 5</a> existe en trois versions : la semaine et le mois comptent les partages publiés sur cette période, « depuis le début » compte tout.</p></details>
      <details class="faq"><summary>Comment marche un sondage ?</summary><p>Celui qui le crée écrit la question en titre et 2 à 6 réponses. Chaque membre vote une fois et peut changer d’avis ; cliquer de nouveau sa réponse retire le vote. Les résultats s’affichent une fois qu’on a voté.</p></details>
      <details class="faq"><summary>C’est quoi l’espace privé ?</summary><p>Une section à part, marquée d’un cadenas, qui contient des partages réservés. Tout le monde voit le sujet, mais le contenu demande un accès. Aujourd’hui il se donne à la main : écris-nous pour le demander.</p></details>
      <details class="faq"><summary>On peut payer pour être en haut ?</summary><p>Oui, et c’est écrit dessus : un partage dont la place a été payée porte la mention « sponsorisé » tant qu’elle dure. Ce qui s’achète est la place, jamais la publication — le partage passe la même relecture que les autres, et payer ne donne ni gemme, ni étoile, ni point. <a href="#/mise-en-avant">Voir comment ça marche</a>.</p></details>
      <details class="faq"><summary>C’est quoi une collection ?</summary><p>Un parcours : des partages déjà publiés, remis dans l’ordre où on devrait les lire, avec un mot sur chacun. « Démarrer avec Claude Code en une soirée », par exemple. Tu n’écris rien de neuf — tu ranges, et ranger demande du jugement. Clique « Composer » depuis <a href="#/collections">les collections</a>, choisis au moins deux partages, et envoie : elle est relue comme un partage. La modifier la renvoie en relecture, sauf si tu ne touches qu’aux notes.</p></details>
      <details class="faq"><summary>Comment je sais que mon partage est passé ?</summary><p>La cloche en haut à droite s’allume. Tu es prévenu quand un de tes partages ou une de tes collections est publié ou refusé (avec le motif), quand quelqu’un répond sous un de tes partages, quand on commande ce que tu vends, et quand un achat que tu as fait est confirmé. <b>Rien n’est envoyé par email ni poussé sur ton téléphone</b> : la liste t’attend sur <a href="#/notifications">Ce qui s’est passé</a>, et elle ne garde que les trois derniers mois. Ouvrir la page marque tout comme lu, mais n’efface rien.</p></details>
      <details class="faq"><summary>C’est quoi « essayé sur » ?</summary><p>Devant un prompt ou un agent, la première question est « ça marche sur quoi ? » — le même prompt peut être excellent sur un modèle et inutile sur un autre. Quand tu partages un skill, un agent, un serveur MCP ou un prompt, tu peux donc dire sur quel modèle tu l’as essayé. On range les <b>familles</b> (Claude, GPT, Gemini…) et tu écris la version à côté (« Opus 5 »), parce qu’une famille dure des années quand une version est périmée en deux mois. Le rail de gauche te laisse alors tout filtrer : « montre-moi ce qui tourne sur Claude ». C’est facultatif, et mieux vaut le laisser vide que de deviner : annoncer un modèle qu’on n’a pas essayé, c’est refusé par la <a href="#/charte">charte</a>.</p></details>
      <details class="faq"><summary>Un agent, un serveur MCP : quelle différence avec un skill ?</summary><p>Un <b>skill</b> est un mode d’emploi que Claude lit tout seul quand ta demande correspond : tu le poses dans un dossier et tu l’oublies. Un <b>agent</b> fait un travail du début à la fin sans toi — il boucle, il se sert d’outils, et il s’arrête quand c’est fini ou quand il a besoin de toi. Un <b>serveur MCP</b> ne fait rien tout seul : il <i>donne</i> des outils à un modèle (une base de données, des fichiers, une API), et c’est le modèle qui s’en sert. En résumé : le skill explique, l’agent exécute, le MCP branche.</p></details>
      <details class="faq"><summary>Je peux vendre un skill que j’ai écrit ?</summary><p>Oui. Mets un prix dans le formulaire de partage : le <b>contenu</b> ne s’ouvre alors qu’après l’achat, mais le titre, la description et les tags restent publics — sinon personne ne saurait ce qu’il achète. Ton partage passe la même relecture que les autres, et l’équipe peut refuser une vente comme elle refuse un contenu. La plateforme retient ${S.marche?.commission ?? 5} % sur chaque vente, le reste te revient. Tu suis tout dans <a href="#/mes-ventes">Mes ventes</a>.</p></details>
      <details class="faq"><summary>Comment se passe un achat ?</summary><p>Tu cliques « Acheter » : ça enregistre une commande, ça ne prend pas d’argent. Le paiement se règle avec nous hors du site (il n’y a pas encore de paiement en ligne), et le contenu s’ouvre dès que la commande est confirmée. Tu retrouves tes commandes dans <a href="#/mes-achats">Mes achats</a>.</p></details>
      <details class="faq"><summary>Pourquoi une vérification à l’inscription ?</summary><p>Pour bloquer les robots qui créent des comptes en masse. Elle se fait toute seule en une seconde, il n’y a pas d’image à déchiffrer, et aucun service extérieur n’est appelé.</p></details>
      <details class="faq"><summary>Comment partager une vidéo ?</summary><p>On n’héberge pas de vidéo : la bibliothèque garde les skills, les prompts, les idées et les PDF. Mets ta vidéo sur YouTube, Drive ou Vimeo, puis fais un partage de type « Lien » : le nom de la vidéo en titre, son adresse dans le lien.</p></details>
      <details class="faq"><summary>Comment utiliser un skill ?</summary><p>${HOWTO}</p></details>
      <details class="faq"><summary>Pourquoi mon partage n’apparaît pas ?</summary><p>Chaque partage est relu avant d’être publié. Tu vois son statut dans « Mes partages » : en attente, publié ou refusé (avec le motif).</p></details>
      <details class="faq"><summary>Pourquoi mon PDF est refusé ?</summary><p>Les PDF sont limités à ${S.limits.pdfKb} Ko, pour que le site reste rapide même en 4G. Si le tien dépasse, c’est presque toujours une image mal compressée à l’intérieur. Tu peux le réduire sur ton ordinateur (sur Mac : Aperçu → Exporter → Filtre Quartz → « Reduce File Size »), passer par un outil en ligne, ou simplement l’héberger ailleurs et coller le lien : un partage « PDF » accepte un lien à la place du fichier. Le formulaire te donne les trois solutions au moment où tu choisis le fichier.</p></details>
      <details class="faq"><summary>Quelles photos puis-je ajouter ?</summary><p>JPG, PNG ou WebP, trois par partage, 10 Mo chacune. Elles sont réduites automatiquement et la position GPS est effacée.</p></details>
      <details class="faq"><summary>Je peux supprimer un de mes partages ?</summary><p>Oui, depuis « Mes partages », bouton « Supprimer ».</p></details>

      ${STATIQUE ? '' : html`
        <h2 class="faq-title">Installer la bibliothèque</h2>
        <p class="muted">Tu peux poser makers.si sur ton téléphone ou ton ordinateur comme une application : le menu de ton navigateur propose « Installer » ou « Ajouter à l’écran d’accueil ». Une fois installée, elle s’ouvre même sans connexion, et tu retrouves ce que tu avais déjà consulté. Rien de plus n’est gardé sur ton appareil : ni les pages privées, ni les fichiers des membres.</p>
        <p class="muted">Si l’application semble figée sur une vieille version, ce bouton efface ce qu’elle garde en mémoire et repart du serveur. Tu ne perds rien : tout est en ligne.</p>
        <div class="post-actions"><button class="btn" data-action="vider-cache">Vider la mémoire de l’application</button></div>`}
    </div>`);
}

// --- Collections -----------------------------------------------------------------
// Un parcours composé à partir de partages déjà publiés : « Démarrer avec Claude Code »,
// « Monter un Reel de A à Z ». Rien de neuf n'est écrit — c'est du rangement, et le
// rangement est précisément ce qu'un membre expérimenté peut offrir en dix minutes.
// Une collection ne copie rien : elle pointe. Un partage retiré en sort tout seul.

const collCarte = c => html`
  <article class="coll-carte">
    <a class="coll-titre" href="#/c/${c.id}">${fr(c.title)}</a>
    <p class="coll-desc">${fr(c.description)}</p>
    <div class="meta">
      <span class="coll-compte">${ICON.lignes}${c.count} partage${c.count > 1 ? 's' : ''}</span>
      ${auteurLien(c)}
      ${c.pinned ? html`<span class="pin">${ICON.pin}épinglée</span>` : ''}
      ${c.status && c.status !== 'approved' ? html`<span class="status ${c.status}">${c.status === 'pending' ? 'En attente' : 'Refusée'}</span>` : ''}
    </div>
  </article>`;

async function collectionsView() {
  const { collections } = await api('/collections');
  document.title = 'Collections – makers.si';
  render(html`
    <div class="narrow">
      <a class="back" href="#/">← Tous les partages</a>
      <div class="admin-head">
        <div><h1 class="page-title">${ICON.lignes}Les collections</h1>
          <p class="page-sub">Des parcours composés par des membres à partir de ce qui existe déjà. Par où commencer, dans quel ordre, et pourquoi.</p></div>
        ${STATIQUE ? '' : html`<a class="btn primary" href="#/collection">${ICON.plus}Composer</a>`}
      </div>
      ${collections.length
        ? html`<div class="coll-liste">${collections.map(collCarte)}</div>`
        : html`<div class="empty">Aucune collection pour l’instant.<br>La première est à composer : choisis cinq partages qui vont ensemble et dis pourquoi.<br>
            ${STATIQUE ? '' : html`<a class="btn primary" href="${S.me ? '#/collection' : '#/rejoindre'}">${S.me ? 'Composer la première' : 'Créer mon compte'}</a>`}</div>`}
    </div>`);
}

async function collectionView(id) {
  let c;
  try { c = (await api('/collections/' + id)).collection; }
  catch {
    return render(html`<div class="narrow"><a class="back" href="#/collections">← Les collections</a>
      <div class="empty">Cette collection n’existe pas ou n’est pas encore publiée.</div></div>`);
  }
  document.title = c.title + ' – makers.si';
  const sienne = !!S.me && S.me.pseudo === c.author;
  render(html`
    <div class="narrow post">
      <a class="back" href="#/collections">← Les collections</a>
      ${c.status === 'pending' ? html`<div class="notice">En attente de validation. Toi seul(e) vois cette collection pour l’instant.</div>` : ''}
      ${c.status === 'rejected' ? html`<div class="notice bad">Refusée${c.rejectReason ? ' : ' + c.rejectReason : '.'}</div>` : ''}
      <div><span class="kind k-idee">${ICON.lignes}Collection</span></div>
      <h1>${fr(c.title)}</h1>
      <div class="post-meta">${auteurLien(c)}<span>${ago(c.approvedAt || c.createdAt)}</span><span>${c.count} partage${c.count > 1 ? 's' : ''}</span></div>
      <p class="lead">${fr(c.description)}</p>
      ${c.manquants ? html`<p class="muted">${c.manquants} partage${c.manquants > 1 ? 's ont' : ' a'} été retiré${c.manquants > 1 ? 's' : ''} de la bibliothèque depuis.</p>` : ''}

      <ol class="coll-etapes">
        ${c.items.map(({ post, note }, i) => html`
          <li>
            <span class="coll-num">${i + 1}</span>
            <div class="coll-item">
              <div class="item-top">${kind(post.type)}<a class="item-title" href="#/p/${post.id}">${fr(post.title)}</a>
                ${post.prix ? prixBadge(post) : ''}${post.locked && !post.prix ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}</div>
              ${note ? html`<p class="coll-note">${fr(note)}</p>` : html`<p class="item-desc">${fr(post.description)}</p>`}
            </div>
          </li>`)}
      </ol>

      <div class="post-actions">
        ${sienne && !STATIQUE ? html`<a class="btn" href="#/collection/${c.id}">Modifier</a>
          <button class="btn ghost" data-action="coll-delete" data-id="${c.id}">Supprimer</button>` : ''}
        <a class="btn" href="#/collections">Les autres collections</a>
      </div>
    </div>`);
}

// --- Composer une collection -------------------------------------------------------
// L'état vit ici le temps de la page : on cherche des partages, on les range, on écrit
// un mot sur chacun. Rien n'est envoyé avant le bouton final.
let compo = null;

function compoListe() {
  const boite = $('#compo-liste');
  if (!boite) return;
  boite.innerHTML = (compo.items.length
    ? html`<ol class="compo-items">${compo.items.map((it, i) => html`
        <li>
          <span class="coll-num">${i + 1}</span>
          <div class="compo-item">
            <b>${it.title}</b>
            <input type="text" maxlength="200" placeholder="Pourquoi celui-là, en une phrase (facultatif)"
              aria-label="Note sur ${it.title}" data-compo-note="${i}" value="${it.note}">
          </div>
          <div class="compo-boutons">
            <button type="button" class="btn ghost small" data-action="compo-up" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Monter">↑</button>
            <button type="button" class="btn ghost small" data-action="compo-down" data-i="${i}" ${i === compo.items.length - 1 ? 'disabled' : ''} aria-label="Descendre">↓</button>
            <button type="button" class="btn ghost small" data-action="compo-del" data-i="${i}" aria-label="Retirer">✕</button>
          </div>
        </li>`)}</ol>`
    : html`<p class="muted">Rien de choisi pour l’instant. Cherche un partage ci-dessus et ajoute-le.</p>`).s;
  const n = $('#compo-compte');
  if (n) n.textContent = `${compo.items.length} choisi${compo.items.length > 1 ? 's' : ''}`;
}

function composerView(id) {
  if (!S.me) { go('#/connexion'); return; }
  const neuve = !id;
  document.title = (neuve ? 'Composer une collection' : 'Modifier ma collection') + ' – makers.si';
  const dessine = () => {
    render(html`
      <div class="narrow">
        <a class="back" href="#/collections">← Les collections</a>
        <h1 class="page-title">${neuve ? 'Composer une collection' : 'Modifier ma collection'}</h1>
        <p class="page-sub">Choisis des partages déjà publiés, range-les dans l’ordre où on devrait les lire, et dis en un mot pourquoi chacun est là. ${neuve ? 'Elle est relue avant publication.' : 'Changer les partages ou le texte la renvoie en relecture.'}</p>
        <form data-form="collection" data-id="${id || ''}" novalidate>
          <div class="field"><label for="c-titre">Titre</label>
            <input id="c-titre" type="text" name="title" maxlength="80" required placeholder="Démarrer avec Claude Code en une soirée" value="${compo.title}">
            <small>Ce qu’on obtient en suivant le parcours, pas son thème.</small></div>
          <div class="field"><label for="c-desc">À qui ça sert</label>
            <textarea id="c-desc" name="description" rows="3" maxlength="500" required placeholder="Pour qui débute et ne sait pas par quel bout prendre les skills. À lire dans l’ordre.">${compo.description}</textarea></div>

          <div class="field"><label for="compo-q">Ajouter des partages</label>
            <input id="compo-q" type="text" autocomplete="off" placeholder="Cherche un titre, un tag…">
            <small>De 2 à 30 partages. Seuls les partages publiés peuvent être ajoutés.</small>
            <div class="compo-res" id="compo-res"></div></div>

          <div class="field"><div class="lbl">Ta collection <span class="muted" id="compo-compte"></span></div>
            <div id="compo-liste"></div></div>

          <p class="form-error" role="alert"></p>
          <button class="btn primary" type="submit">${neuve ? 'Envoyer pour validation' : 'Enregistrer'}</button>
        </form>
      </div>`);
    compoListe();
  };

  if (neuve) {
    compo = { title: '', description: '', items: [] };
    dessine();
    return;
  }
  api('/collections/' + id).then(({ collection }) => {
    compo = {
      title: collection.title,
      description: collection.description,
      items: collection.items.map(({ post, note }) => ({ postId: post.id, title: post.title, note })),
    };
    dessine();
  }).catch(() => render(html`<div class="narrow"><div class="empty">Cette collection n’existe pas.</div></div>`));
}

// --- Mes ventes, mes achats ------------------------------------------------------
// Deux pages qui disent la même chose des deux côtés d'une vente : ce qui est commandé,
// ce qui est encaissé, ce qui reste dû. Rien n'est calculé ici — les chiffres viennent
// du serveur, pour qu'un vendeur et l'administrateur lisent toujours le même nombre.
const ETAT_VENTE = { 'en-attente': 'En attente de paiement', paye: 'Payé' };

async function ventesView() {
  if (!S.me) { go('#/connexion'); return; }
  const d = await api('/me/ventes');
  document.title = 'Mes ventes – makers.si';
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mes ventes</h1>
        <div><a class="btn ghost" href="#/mes-partages">Mes partages</a> <a class="btn ghost" href="#/mes-achats">Mes achats</a></div></div>
      <p class="page-sub">La plateforme retient ${d.taux} % sur chaque vente. Le reste t’est reversé à la main : ce tableau dit ce qui t’est dû.</p>
      <div class="profil-chiffres">
        <div><b>${d.ventes.filter(v => v.status === 'paye').length}</b><span>vendus</span></div>
        <div><b>${d.total} ${d.devise}</b><span>encaissés en tout</span></div>
        <div><b>${d.commission} ${d.devise}</b><span>retenus par la plateforme</span></div>
        <div><b>${d.du} ${d.devise}</b><span>à te reverser</span></div>
      </div>
      ${d.ventes.length
        ? html`<table class="table"><thead><tr><th>Partage</th><th>Acheteur</th><th>Prix</th><th>Pour toi</th><th>État</th></tr></thead><tbody>
            ${d.ventes.map(v => html`<tr>
              <td><a href="#/p/${v.postId}">${v.titre}</a></td>
              <td class="muted">@${v.acheteur}</td>
              <td class="mono">${v.prix} ${v.devise}</td>
              <td class="mono">${v.net} ${v.devise}<br><small class="muted">− ${v.commission} (${v.taux} %)</small></td>
              <td><span class="status ${v.status === 'paye' ? 'approved' : 'pending'}">${ETAT_VENTE[v.status] || v.status}</span>
                ${v.regleAt ? html`<br><small class="muted">reversé le ${new Date(v.regleAt).toLocaleDateString('fr-FR')}</small>` : ''}</td></tr>`)}
          </tbody></table>`
        : html`<div class="empty">Tu n’as encore rien vendu.<br>Mets un prix sur un partage pour commencer.<br><a class="btn primary" href="#/partager">${ICON.plus}Partager</a></div>`}
    </div>`);
}

async function achatsView() {
  if (!S.me) { go('#/connexion'); return; }
  const { achats } = await api('/me/achats');
  document.title = 'Mes achats – makers.si';
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mes achats</h1>
        <div><a class="btn ghost" href="#/mes-ventes">Mes ventes</a> <a class="btn ghost" href="#/mes-partages">Mes partages</a></div></div>
      ${achats.some(a => a.status === 'en-attente')
        ? html`<div class="notice">Une commande attend son paiement. Il se règle avec nous, hors du site : le contenu s’ouvre dès qu’elle est confirmée.</div>`
        : ''}
      ${achats.length
        ? html`<table class="table"><thead><tr><th>Partage</th><th>Vendeur</th><th>Prix</th><th>État</th></tr></thead><tbody>
            ${achats.map(a => html`<tr>
              <td><a href="#/p/${a.postId}">${a.titre}</a></td>
              <td class="muted">@${a.vendeur}</td>
              <td class="mono">${a.prix} ${a.devise}</td>
              <td><span class="status ${a.status === 'paye' ? 'approved' : 'pending'}">${ETAT_VENTE[a.status] || a.status}</span></td></tr>`)}
          </tbody></table>`
        : html`<div class="empty">Tu n’as encore rien acheté.<br><a class="btn" href="#/">Voir la bibliothèque</a></div>`}
    </div>`);
}

// --- Ce qui s'est passé -------------------------------------------------------------
// La liste de ce qui est arrivé pendant l'absence. Ouvrir la page vaut lecture : on ne
// marque pas lu une pastille qu'on n'a fait qu'apercevoir dans l'en-tête.
const NOTIF_ICONE = {
  'partage-publie': 'vote', 'partage-refuse': 'alerte', 'partage-retire': 'alerte',
  reponse: 'bulle', 'collection-publiee': 'vote', 'collection-refusee': 'alerte',
  vente: 'gem', 'achat-confirme': 'vote', 'mise-en-avant': 'megaphone', 'acces-prive': 'lock',
};

async function notificationsView() {
  if (!S.me) { go('#/connexion'); return; }
  const { notifications: liste } = await api('/me/notifications');
  document.title = 'Ce qui s’est passé – makers.si';
  render(html`
    <div class="narrow">
      <a class="back" href="#/">← Tous les partages</a>
      <h1 class="page-title">${ICON.cloche}Ce qui s’est passé</h1>
      <p class="page-sub">Pendant que tu n’étais pas là. Rien n’est envoyé par email ni poussé sur ton téléphone : cette liste t’attend ici, et elle ne garde que les trois derniers mois.</p>
      ${liste.length ? html`
        <div class="notifs">
          ${liste.map(n => html`
            <a class="notif ${n.lu ? '' : 'neuve'}" href="${n.lien || '#/'}">
              <span class="notif-ico">${ICON[NOTIF_ICONE[n.type] || 'bulle']}</span>
              <span class="notif-corps">
                <b>${n.texte}</b>
                ${n.motif ? html`<span class="notif-motif">${n.motif}</span>` : ''}
              </span>
              <span class="notif-date">${ago(n.at)}</span>
            </a>`)}
        </div>`
        : html`<div class="empty">Rien pour l’instant.<br>
            Tu seras prévenu ici quand un de tes partages sera relu, quand quelqu’un te répondra,
            ou quand on commandera ce que tu vends.</div>`}
    </div>`);
  // Ouvrir la page vaut lecture : la pastille s'éteint, et l'en-tête se met à jour
  // sans recharger. Si l'appel échoue, ce n'est pas grave — elle se rallumera.
  if (S.nonLues) {
    try {
      await api('/me/notifications/read', { method: 'POST' });
      S.nonLues = 0;
      header();
      rail();
    } catch { /* on réessaiera à la prochaine ouverture */ }
  }
}

async function mineView() {
  if (!S.me) { go('#/connexion'); return; }
  const [{ posts }, mesColls] = await Promise.all([api('/me/posts'), api('/me/collections')]);
  const label = { pending: 'En attente', approved: 'Publié', rejected: 'Refusé' };
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mes partages</h1>
        <div><a class="btn primary" href="#/partager">${ICON.plus}Partager</a> <a class="btn ghost" href="#/collection">Composer</a> <a class="btn ghost" href="#/mes-ventes">Mes ventes</a> <a class="btn ghost" href="#/membre/${encodeURIComponent(S.me.pseudo)}">Mon profil public</a> <a class="btn ghost" href="#/compte">Mon compte</a> <button class="btn ghost" data-action="logout">Déconnexion</button></div></div>
      ${mesColls.collections.length ? html`
        <h2 class="profil-titre">Mes collections</h2>
        <div class="coll-liste">${mesColls.collections.map(collCarte)}</div>
        <h2 class="profil-titre">Mes partages</h2>` : ''}
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
    tab === 'members' ? api('/admin/members')
      : tab === 'promos' ? api('/admin/promos')
        : tab === 'collections' ? api('/admin/collections?status=pending')
        : tab === 'marche' ? api('/admin/marche')
          : tab === 'reports' ? api('/admin/reports') : api('/admin/posts?status=' + tab),
  ]);
  S.pending = counts.pending; header();
  const tabs = [['pending', 'À valider', counts.pending], ['reports', 'Signalés', counts.reported], ['approved', 'Publiés', counts.approved], ['rejected', 'Refusés', counts.rejected], ['promos', 'Mises en avant', counts.promos], ['collections', 'Collections', counts.collections], ['marche', 'Marché', counts.marche], ['members', 'Membres', counts.members]];
  const privateNote = tab === 'members'
    ? html`<p class="about-type">L’accès à l’espace privé se donne à la main, un membre à la fois. Il n’y a pas encore de paiement : c’est toi qui décides qui entre.</p>`
    : tab === 'promos'
      ? html`<p class="about-type">Le paiement se fait hors du site. Ici tu enregistres la vente et tu poses la durée : la place s’arrête toute seule à la date prévue, il n’y a rien à retirer à la main. ${data.libres} place${data.libres > 1 ? 's' : ''} libre${data.libres > 1 ? 's' : ''} sur ${data.places}.</p>`
      : '';

  const card = p => html`
    <div class="card" data-card="${p.id}">
      <div class="post-meta">${kind(p.type)}<span>@${p.author}</span><span class="muted">${p.authorEmail}</span><span>${ago(p.createdAt)}</span>
        ${p.premium ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
        ${p.pinned ? html`<span class="pin">${ICON.pin}épinglé</span>` : ''}
        ${p.promo ? html`<span class="pin sponso">${ICON.megaphone}en avant jusqu’au ${new Date(p.promoUntil).toLocaleDateString('fr-FR')}</span>` : ''}
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
        ${p.prix ? html`<button class="btn" data-action="post-gratuit" data-id="${p.id}" data-prix="${p.prix} ${p.devise || ''}">Rendre gratuit</button>` : ''}
        ${p.status === 'approved' && !p.premium ? html`<button class="btn" data-action="promo-open" data-id="${p.id}">${p.promo ? 'Prolonger la place' : 'Mettre en avant'}</button>
          ${p.promo ? html`<button class="btn ghost" data-action="promo-stop" data-id="${p.id}">Arrêter la place</button>` : ''}` : ''}
        ${p.status !== 'rejected' ? html`<button class="btn bad" data-action="reject-open" data-id="${p.id}">${p.status === 'approved' ? 'Retirer' : 'Refuser'}</button>` : ''}
        <button class="btn ghost" data-action="delete" data-id="${p.id}">Supprimer</button>
      </div>
      <form class="reject-form hidden" data-form="reject" data-id="${p.id}">
        <input type="text" name="reason" maxlength="200" placeholder="Motif (visible par l’auteur), facultatif" aria-label="Motif du refus">
        <button class="btn bad" type="submit">Confirmer</button>
      </form>
      <form class="reject-form promo-form hidden" data-form="promo" data-id="${p.id}">
        <input type="number" name="jours" min="1" max="${S.promo?.joursMax || 30}" value="${S.promo?.jours || 7}" required aria-label="Nombre de jours">
        <input type="number" name="montant" min="0" step="1" placeholder="Montant encaissé (${S.promo?.devise || 'DA'})" aria-label="Montant encaissé">
        <input type="text" name="note" maxlength="140" placeholder="Note : qui a payé, comment" aria-label="Note">
        <button class="btn primary" type="submit">Enregistrer</button>
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
        : tab === 'collections'
          ? html`
            <p class="about-type">Une collection est une recommandation signée : elle range des partages déjà publiés et dit pourquoi. On relit l’ordre et les mots, pas le contenu — il a déjà été validé.</p>
            ${data.collections.length
              ? data.collections.map(c => html`
                <div class="card">
                  <div class="post-meta">${auteurLien(c)}<span>${ago(c.createdAt)}</span><span>${c.count} partage${c.count > 1 ? 's' : ''}</span></div>
                  <h3><a href="#/c/${c.id}">${fr(c.title)}</a></h3>
                  <p>${fr(c.description)}</p>
                  <ol class="reasons">${c.items.map(({ post, note }) => html`<li>${post.title}${note ? html` — <span class="muted">${note}</span>` : ''}</li>`)}</ol>
                  <div class="actions">
                    <button class="btn ok" data-action="coll-approve" data-id="${c.id}">Publier</button>
                    <button class="btn" data-action="coll-pin" data-id="${c.id}">${c.pinned ? 'Désépingler' : 'Épingler'}</button>
                    <button class="btn bad" data-action="coll-reject" data-id="${c.id}">Refuser</button>
                    <button class="btn ghost" data-action="coll-admin-delete" data-id="${c.id}">Supprimer</button>
                  </div>
                </div>`)
              : html`<div class="empty">Aucune collection à relire.</div>`}`
        : tab === 'marche'
          ? html`
            <p class="about-type">Le paiement se règle hors du site. Ici tu confirmes avoir reçu l’argent — le contenu s’ouvre alors pour l’acheteur — puis tu reverses leur part aux vendeurs. La plateforme retient ${data.taux} %.</p>
            <div class="profil-chiffres">
              <div><b>${data.totalVentes} ${data.devise}</b><span>encaissés en tout</span></div>
              <div><b>${data.totalCommission} ${data.devise}</b><span>ta part (${data.taux} %)</span></div>
              <div><b>${data.totalDu} ${data.devise}</b><span>à reverser aux vendeurs</span></div>
              <div><b>${data.attente.length}</b><span>commande${data.attente.length > 1 ? 's' : ''} en attente</span></div>
            </div>

            <h3 class="admin-sous-titre">Commandes à confirmer</h3>
            ${data.attente.length
              ? html`<table class="table"><thead><tr><th>Date</th><th>Partage</th><th>Acheteur</th><th>Prix</th><th></th></tr></thead><tbody>
                  ${data.attente.map(a => html`<tr>
                    <td>${new Date(a.at).toLocaleDateString('fr-FR')}</td>
                    <td><a href="#/p/${a.postId}">${a.titre}</a><br><small class="muted">vendu par @${a.sellerPseudo}</small></td>
                    <td class="muted">@${a.buyerPseudo}</td>
                    <td class="mono">${a.prix} ${a.devise}</td>
                    <td><button class="btn small ok" data-action="achat-confirmer" data-id="${a.id}">Paiement reçu</button>
                      <button class="btn ghost small" data-action="achat-annuler" data-id="${a.id}">Annuler</button></td></tr>`)}
                </tbody></table>`
              : html`<div class="empty">Aucune commande en attente.</div>`}

            <h3 class="admin-sous-titre">Ce que tu dois aux vendeurs</h3>
            ${data.vendeurs.length
              ? html`<table class="table"><thead><tr><th>Vendeur</th><th>Ventes</th><th>Encaissé</th><th>À reverser</th><th></th></tr></thead><tbody>
                  ${data.vendeurs.map(v => html`<tr>
                    <td>@${v.pseudo}</td><td class="mono">${v.ventes}</td>
                    <td class="mono">${v.brut} ${data.devise}</td>
                    <td class="mono">${v.du} ${data.devise}${v.regle ? html`<br><small class="muted">${v.regle} déjà reversés</small>` : ''}</td>
                    <td>${v.du && v.id ? html`<button class="btn small" data-action="vendeur-regler" data-id="${v.id}" data-pseudo="${v.pseudo}" data-du="${v.du} ${data.devise}">Marquer reversé</button>` : ''}</td></tr>`)}
                </tbody></table>`
              : html`<div class="empty">Aucune vente encaissée pour l’instant.</div>`}

            <h3 class="admin-sous-titre">Ventes encaissées<small>${data.payes.length} au total</small></h3>
            ${data.payes.length
              ? html`<table class="table"><thead><tr><th>Date</th><th>Partage</th><th>Vendeur</th><th>Prix</th><th>Ta part</th></tr></thead><tbody>
                  ${data.payes.map(a => html`<tr>
                    <td>${new Date(a.payeAt).toLocaleDateString('fr-FR')}</td>
                    <td><a href="#/p/${a.postId}">${a.titre}</a><br><small class="muted">acheté par @${a.buyerPseudo}</small></td>
                    <td class="muted">@${a.sellerPseudo}</td>
                    <td class="mono">${a.prix} ${a.devise}</td>
                    <td class="mono">${a.commission} ${a.devise}</td></tr>`)}
                </tbody></table>`
              : ''}`
        : tab === 'promos'
          ? html`
            ${data.actives.length
              ? html`<h3 class="admin-sous-titre">En cours</h3>${data.actives.map(card)}`
              : html`<div class="empty">Aucune place occupée en ce moment. Les places se posent depuis l’onglet « Publiés ».</div>`}
            <h3 class="admin-sous-titre">Registre des ventes<small>${data.total} ${data.devise} encaissés au total</small></h3>
            ${data.registre.length
              ? html`<table class="table"><thead><tr><th>Date</th><th>Partage</th><th>Jours</th><th>Montant</th><th>Note</th></tr></thead><tbody>
                  ${data.registre.map(v => html`<tr>
                    <td>${new Date(v.at).toLocaleDateString('fr-FR')}</td>
                    <td><a href="#/p/${v.postId}">${v.titre}</a><br><small class="muted">@${v.auteur} · jusqu’au ${new Date(v.jusqua).toLocaleDateString('fr-FR')}</small></td>
                    <td class="mono">${v.jours}</td>
                    <td class="mono">${v.montant ? `${v.montant} ${v.devise}` : '—'}</td>
                    <td class="muted">${v.note}</td></tr>`)}
                </tbody></table>`
              : html`<div class="empty">Rien de vendu pour l’instant.</div>`}`
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
  // Le rail et la barre du bas sont redessinés à chaque page : c'est là qu'on
  // voit quelle section est ouverte. Ils ne bloquent pas l'affichage de la vue.
  rail();
  // Dans une copie en lecture seule, les pages qui écrivent n'ont nulle part où écrire.
  if (STATIQUE && (['/rejoindre', '/connexion', '/partager', '/compte', '/mes-partages', '/mes-ventes', '/mes-achats', '/notifications', '/admin'].includes(path)
    || path === '/collection' || path.startsWith('/collection/'))) {
    toast('Cette copie du site est en lecture seule.');
    return go('#/');
  }
  try {
    if (path === '/') await feedView(q);
    else if (path.startsWith('/p/')) await postView(path.slice(3));
    // Un pseudo ne contient que des lettres, des chiffres et . _ - : rien à décoder ici.
    else if (path.startsWith('/membre/')) await profilView(path.slice(8));
    else if (path === '/rejoindre') authView('join');
    else if (path === '/connexion') authView('login');
    else if (path === '/partager') shareView(q);
    else if (path === '/top') await topView();
    else if (path === '/aide') helpView();
    else if (path === '/mise-en-avant') promoView();
    else if (path === '/compte') accountView();
    else if (LEGAL.includes(path.slice(1))) await legalView(path.slice(1));
    else if (path === '/bienvenue') welcomeView();
    else if (path === '/collections') await collectionsView();
    else if (path.startsWith('/c/')) await collectionView(path.slice(3));
    else if (path === '/collection') composerView(null);
    else if (path.startsWith('/collection/')) composerView(path.slice(12));
    else if (path === '/notifications') await notificationsView();
    else if (path === '/mes-partages') await mineView();
    else if (path === '/mes-ventes') await ventesView();
    else if (path === '/mes-achats') await achatsView();
    else if (path === '/admin') await adminView(q);
    else go('#/');
  } catch (e) {
    // Hors ligne, l'application s'ouvre quand même : sa coquille est sur l'appareil.
    // La bibliothèque, elle, vit sur le serveur — on ne met jamais l'API en cache,
    // parce qu'un contenu privé ou une réponse personnelle n'ont rien à faire sur
    // un appareil partagé. Mieux vaut le dire clairement qu'afficher une erreur brute.
    if (!navigator.onLine || e.reseau) {
      return render(html`
        <div class="narrow">
          <div class="empty">
            <b>${navigator.onLine ? 'Le serveur ne répond pas.' : 'Tu es hors ligne.'}</b><br>
            L’application est bien là, elle s’ouvre sans connexion — mais les partages, les
            réponses et les classements vivent sur le serveur, et ils ont besoin du réseau.<br>
            Dès qu’il revient, la page se remet toute seule.
            <button class="btn" data-action="reessayer">Réessayer maintenant</button>
          </div>
        </div>`);
    }
    render(html`<div class="narrow"><div class="empty">Impossible de charger la page. ${e.message}</div></div>`);
  }
}

async function refreshMe() {
  try {
    const r = await api('/me');
    Object.assign(S, { me: r.member, admin: r.admin, pending: r.pending, nonLues: r.nonLues || 0 });
    if (r.limits) S.limits = r.limits;
    if (r.promo) S.promo = r.promo;
    if (r.marche) S.marche = r.marche;
    if (r.modeles) S.modeles = r.modeles;
  } catch { /* hors ligne : on reste visiteur */ }
}

// --- Événements ----------------------------------------------------------------
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  try {
    if (action === 'comment-delete') {
      if (!confirm('Supprimer ce commentaire ? C’est définitif.')) return;
      await api(`/comments/${id}/delete`, { method: 'POST' });
      const li = el.closest('[data-comment]');
      const ol = li.parentElement, section = li.closest('.reponses');
      li.remove();
      const reste = ol.children.length;
      if (!reste) ol.remove();
      $('h2', section).lastChild.textContent = titreFil(reste);
      toast('Commentaire supprimé.');
    } else if (action === 'gem') {
      // La copie publiée ne sait rien écrire : le dire tout de suite vaut mieux que
      // d'envoyer quelqu'un vers une page d'inscription qui lui répondra la même chose.
      if (STATIQUE) { toast('Cette copie du site est en lecture seule.'); return; }
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
        // On repart du nombre de rangs déjà affichés, pas du nombre de partages : les épingles
        // et les places payées n'en portent pas, et décaleraient toute la numérotation.
        let rang = $$('.rang, .rang-n, .medaille').length;
        liste.insertAdjacentHTML('beforeend', posts.map(p => item(p, classe && !p.pinned && !p.promo ? ++rang : null).s).join(''));
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
      await navigator.clipboard.writeText($(`[data-depot-contenu="${id}"]`).textContent);
      confirme(el);
    } else if (action === 'tout-copier') {
      // Chaque fichier précédé de son chemin : on peut recréer le dossier à l'identique.
      const tree = depots.get(id) || [];
      const tout = tree.map(f => `===== ${f.path} =====\n${f.content}`).join('\n\n');
      await navigator.clipboard.writeText(tout);
      confirme(el, `${tree.length} fichier${tree.length > 1 ? 's' : ''} copié${tree.length > 1 ? 's' : ''}`);
    } else if (action === 'copy') {
      const text = $(`[data-copy="${id}"]`).textContent;
      await navigator.clipboard.writeText(text);
      confirme(el);
    } else if (action === 'reessayer') {
      videCache();
      route();
    } else if (action === 'vider-cache') {
      // La sortie de secours. Un service worker est la seule pièce d'un site qu'on ne
      // peut pas reprendre à distance : il faut donc toujours laisser à la personne
      // devant l'écran un moyen de tout remettre à zéro elle-même.
      confirme(el, 'Nettoyage…');
      try {
        if ('serviceWorker' in navigator) {
          for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
        }
        if ('caches' in window) for (const n of await caches.keys()) await caches.delete(n);
      } catch { /* rien à vider : on recharge quand même */ }
      location.reload();
    } else if (action === 'theme') {
      // Le choix est gardé sur l'appareil par theme.js, jamais envoyé au serveur.
      window.makersTheme?.choisis(el.dataset.theme);
      header();
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
    } else if (action === 'compo-add') {
      if (compo.items.some(x => x.postId === id)) return toast('Ce partage est déjà dans ta collection.');
      if (compo.items.length >= 30) return toast('Trente partages au maximum.');
      compo.items.push({ postId: id, title: el.dataset.titre, note: '' });
      compoListe();
      toast('Ajouté.');
    } else if (action === 'compo-del') {
      compo.items.splice(Number(el.dataset.i), 1);
      compoListe();
    } else if (action === 'compo-up' || action === 'compo-down') {
      const i = Number(el.dataset.i);
      const j = action === 'compo-up' ? i - 1 : i + 1;
      if (j < 0 || j >= compo.items.length) return;
      [compo.items[i], compo.items[j]] = [compo.items[j], compo.items[i]];
      compoListe();
    } else if (action === 'coll-delete') {
      if (!confirm('Supprimer cette collection ? Les partages qu’elle cite ne sont pas touchés.')) return;
      await api(`/collections/${id}/delete`, { method: 'POST' });
      toast('Collection supprimée.');
      go('#/collections');
    } else if (action === 'coll-approve') {
      await api(`/admin/collections/${id}/approve`, { method: 'POST' });
      toast('Collection publiée.'); route();
    } else if (action === 'coll-reject') {
      const reason = prompt('Motif du refus (visible par l’auteur), facultatif :') ?? null;
      if (reason === null) return;
      await api(`/admin/collections/${id}/reject`, { method: 'POST', body: { reason } });
      toast('Collection refusée.'); route();
    } else if (action === 'coll-pin') {
      await api(`/admin/collections/${id}/pin`, { method: 'POST' });
      route();
    } else if (action === 'coll-admin-delete') {
      if (!confirm('Supprimer définitivement cette collection ?')) return;
      await api(`/admin/collections/${id}/delete`, { method: 'POST' });
      toast('Supprimée.'); route();
    } else if (action === 'post-gratuit') {
      if (!confirm(`Retirer le prix de ${el.dataset.prix} et rendre ce partage gratuit ?\n\nLes ventes déjà faites restent au registre, et ceux qui ont payé gardent leur accès.`)) return;
      await api(`/admin/posts/${id}/gratuit`, { method: 'POST' });
      toast('Partage rendu gratuit.'); route();
    } else if (action === 'achat-confirmer') {
      await api(`/admin/achats/${id}/confirmer`, { method: 'POST' });
      toast('Vente confirmée. L’acheteur a maintenant accès au contenu.'); route();
    } else if (action === 'achat-annuler') {
      if (!confirm('Annuler cette commande ? Elle disparaît du registre.')) return;
      await api(`/admin/achats/${id}/annuler`, { method: 'POST' });
      toast('Commande annulée.'); route();
    } else if (action === 'vendeur-regler') {
      // Le virement se fait ailleurs : ici on ne fait que noter qu'il a été fait.
      if (!confirm(`Marquer ${el.dataset.du} comme reversés à @${el.dataset.pseudo} ?\n\nÀ faire une fois le virement parti : le site ne fait que tenir le compte.`)) return;
      const bilan = await api(`/admin/vendeurs/${id}/regler`, { method: 'POST' });
      toast(`${bilan.total} notés comme reversés (${bilan.nombre} vente${bilan.nombre > 1 ? 's' : ''}).`); route();
    } else if (action === 'acheter') {
      // On ne prend pas d'argent ici : on enregistre une commande. Le dire clairement
      // avant de cliquer évite que quelqu'un attende un formulaire de carte bancaire.
      if (!confirm(`Commander ce partage pour ${el.dataset.prix} ?\n\nLe paiement se règle avec nous, hors du site. Ta commande nous prévient, et l’accès s’ouvre dès qu’elle est confirmée.`)) return;
      await api(`/posts/${id}/acheter`, { method: 'POST' });
      toast('Commande enregistrée. On te recontacte pour le paiement.');
      route();
    } else if (action === 'promo-open') {
      $(`[data-card="${id}"] .promo-form`).classList.toggle('hidden');
      $(`[data-card="${id}"] .promo-form input`).focus();
    } else if (action === 'promo-stop') {
      if (!confirm('Arrêter la mise en avant maintenant ? La vente reste au registre.')) return;
      await api(`/admin/posts/${id}/promo-stop`, { method: 'POST' });
      toast('Place arrêtée.'); route();
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
    } else if (kindOf === 'comment') {
      if (!S.me) { toast('Rejoins la communauté pour répondre.'); return go('#/rejoindre'); }
      const r = await api(`/posts/${form.dataset.id}/comments`, { method: 'POST', body: { body: fd.get('body') } });
      // On insère la réponse à la suite plutôt que de recharger la page : on reste
      // où on était, et on voit son propre message apparaître.
      const section = form.closest('.reponses');
      let ol = $('.fil', section);
      if (!ol) { ol = document.createElement('ol'); ol.className = 'fil'; section.insertBefore(ol, form); }
      ol.insertAdjacentHTML('beforeend', reponseLi(r.comment).s);
      $('h2', section).lastChild.textContent = titreFil(ol.children.length);
      form.reset();
      toast('Réponse publiée.');
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
    } else if (kindOf === 'collection') {
      const corps = { title: fd.get('title'), description: fd.get('description'), items: compo.items.map(({ postId, note }) => ({ postId, note })) };
      const id = form.dataset.id;
      const r = await api(id ? `/collections/${id}/update` : '/collections', { method: 'POST', body: corps });
      toast(id ? 'Collection enregistrée. Elle repasse en relecture si tu l’as changée.' : 'Collection envoyée. Elle paraîtra une fois relue.');
      go('#/c/' + (id || r.collection.id));
    } else if (kindOf === 'promo') {
      await api(`/admin/posts/${form.dataset.id}/promo`, {
        method: 'POST',
        body: { jours: Number(fd.get('jours')), montant: Number(fd.get('montant')) || 0, note: fd.get('note') },
      });
      toast('Mise en avant enregistrée.'); route();
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

// Les notes du composeur : on les garde en mémoire au fil de la frappe, sinon elles
// disparaîtraient au premier réordonnancement.
document.addEventListener('input', (e) => {
  const i = e.target.dataset?.compoNote;
  if (i !== undefined && compo?.items[Number(i)]) compo.items[Number(i)].note = e.target.value;
});

// La recherche du composeur : mêmes résultats que la recherche du site, mais chaque
// ligne porte un bouton qui l'ajoute au parcours.
let compoTimer, compoSeq = 0;
document.addEventListener('input', (e) => {
  if (e.target.id !== 'compo-q') return;
  clearTimeout(compoTimer);
  const q = e.target.value.trim();
  const boite = $('#compo-res');
  if (!boite) return;
  if (q.length < 2) { boite.innerHTML = ''; return; }
  compoTimer = setTimeout(async () => {
    const seq = ++compoSeq;
    try {
      const { posts } = await api('/posts?' + new URLSearchParams({ q, limit: '8' }));
      if (seq !== compoSeq) return;
      boite.innerHTML = (posts.length
        ? posts.map(p => html`
            <div class="compo-res-ligne">
              ${kind(p.type)}<span class="compo-res-titre">${p.title}</span>
              <button type="button" class="btn small" data-action="compo-add" data-id="${p.id}" data-titre="${p.title}">${ICON.plus}Ajouter</button>
            </div>`)
        : [html`<p class="muted">Aucun partage publié ne correspond à « ${q} ».</p>`]).map(x => x.s).join('');
    } catch { boite.innerHTML = ''; }
  }, 200);
});

window.addEventListener('hashchange', route);
// Le réseau revient : on refait la page tout seul, sans rien demander à personne.
window.addEventListener('online', () => { videCache(); route(); });

// --- Le pont vers l'atelier -------------------------------------------------------
// atelier.js — la palette de commandes et le clavier — est un module séparé,
// chargé juste après celui-ci. Il n'importe rien : il lit ce pont. Il est posé
// avant le premier appel réseau, donc il est prêt quand l'autre module
// s'exécute. Si atelier.js ne se charge pas, rien ici ne casse : le site se
// conduit à la souris, comme n'importe quel site.
window.makers = {
  api,
  etat: S,
  statique: STATIQUE,
  icones: Object.fromEntries(Object.entries(ICON).map(([k, v]) => [k, v.s])),
  types: Object.entries(TYPES).map(([cle, v]) => ({ cle, label: v.plural, court: v.short })),
};

await refreshMe();
route();

// --- Installation et hors ligne ----------------------------------------------------
// Uniquement sur le site complet : la copie publiée n'embarque pas de service worker
// (l'export l'écarte volontairement, voir scripts/export-statique.js), et tenter de
// l'enregistrer là-bas ne produirait qu'une erreur dans la console.
//
// Après le premier affichage, jamais avant : installer ne doit pas retarder la page.
// Et si la page est déjà chargée — ce qui arrive, ce module attend le réseau plus
// haut — on n'attend pas un événement `load` qui est déjà passé.
if (!STATIQUE && 'serviceWorker' in navigator) {
  const installe = () => navigator.serviceWorker.register('/sw.js')
    .catch(() => { /* pas de hors ligne sur cet appareil : le site marche quand même */ });
  if (document.readyState === 'complete') installe();
  else window.addEventListener('load', installe, { once: true });
}
