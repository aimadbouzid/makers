// Makers – interface. Pas de framework : un routeur par hash, du HTML échappé, des événements délégués.

// `fields` : ce que le formulaire de partage demande pour chaque type (le titre et la description sont toujours là).
const TYPES = {
  // Les grandes familles de produits digitaux. Leur contenu se livre en fichier (un
  // ZIP le plus souvent) ou par un lien de téléchargement ; des images montrent le
  // produit avant l'achat.
  template: {
    label: 'Template', short: 'Template', plural: 'Templates et modèles',
    about: 'Des modèles prêts à l’emploi : Notion, Canva, Figma, Excel, CV, sites. Tu le copies, tu le remplis, il est à toi.',
    hint: 'Notion, Canva, Figma, Excel, un CV, un site.', example: 'Ex. : « Planner Notion pour freelances »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'Le fichier du produit <span class="muted">(ZIP, PDF, TXT)</span>',
    titleEx: 'Un planner Notion pour gérer ses clients en freelance', descEx: 'Ce que contient le modèle, l’outil qu’il faut pour l’ouvrir, et pour qui il est fait.',
  },
  design: {
    label: 'Design', short: 'Design', plural: 'Design et graphisme',
    about: 'Des ressources graphiques : icônes, polices, mockups, illustrations, presets photo et LUT vidéo.',
    hint: 'Icônes, polices, mockups, presets, LUT.', example: 'Ex. : « 40 presets Lightroom ciné »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'Le fichier du produit <span class="muted">(ZIP, PDF, TXT)</span>',
    titleEx: '40 presets Lightroom au rendu ciné', descEx: 'Ce qu’il y a dans le pack, les formats, et le logiciel qu’il faut.',
  },
  code: {
    label: 'Code et outil', short: 'Code', plural: 'Code et outils',
    about: 'Des scripts, des plugins, des thèmes et de petites applis, prêts à installer.',
    hint: 'Un script, un plugin, un thème, une appli.', example: 'Ex. : « Thème WordPress pour restaurant »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'Le fichier du produit <span class="muted">(ZIP, PDF, TXT)</span>',
    titleEx: 'Un thème WordPress pour restaurant, réservation comprise', descEx: 'Ce qu’il fait, comment l’installer, et ce qu’il demande (langage, version).',
  },
  formation: {
    label: 'Formation / ebook', short: 'Formation', plural: 'Formations et ebooks',
    about: 'Des cours, des guides et des ebooks pour apprendre un métier ou un outil.',
    hint: 'Un cours, un guide, un ebook.', example: 'Ex. : « Lancer sa boutique en 30 jours »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'L’ebook ou le support <span class="muted">(PDF, ZIP)</span>',
    titleEx: 'Lancer sa boutique en ligne en 30 jours', descEx: 'Ce qu’on sait faire à la fin, le niveau de départ, et la durée.',
  },
  audio: {
    label: 'Audio / musique', short: 'Audio', plural: 'Audio et musique',
    about: 'Des musiques, des sons, des boucles et des voix, pour tes vidéos et tes projets.',
    hint: 'Une musique, des sons, des boucles.', example: 'Ex. : « 50 transitions sonores pour Reels »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'Le pack <span class="muted">(ZIP)</span>',
    titleEx: '50 transitions sonores pour Reels et TikTok', descEx: 'Ce qu’il y a dans le pack, les formats, et ce que tu as le droit d’en faire.',
  },
  media: {
    label: 'Photo / vidéo', short: 'Photo', plural: 'Photos et vidéos',
    about: 'Des photos, des plans vidéo et du B-roll, prêts à utiliser dans tes projets.',
    hint: 'Des photos, des plans vidéo, du B-roll.', example: 'Ex. : « 30 photos d’Alger en 4K »',
    fields: ['file', 'url', 'images', 'tags'], fileLabel: 'Le pack <span class="muted">(ZIP, ou un lien pour les gros fichiers)</span>',
    titleEx: '30 photos d’Alger en 4K, libres d’utilisation', descEx: 'Le nombre de fichiers, la définition, et la licence.',
  },
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
  check: svg('<path d="M3 8.5l3.2 3.2L13 4.8"/>'),
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
  globe: svg('<circle cx="8" cy="8" r="6.2"/><path d="M1.8 8h12.4M8 1.8c1.8 2 2.6 4 2.6 6.2S9.8 12.2 8 14.2C6.2 12.2 5.4 10.2 5.4 8S6.2 3.8 8 1.8z"/>'),
  bouclier: svg('<path d="M8 1.8 13.2 3.8v4.1c0 3-2.2 5.3-5.2 6.3-3-1-5.2-3.3-5.2-6.3V3.8z"/><path d="M5.7 8.1 7.3 9.7 10.4 6.5"/>'),
  chevron: svg('<path d="M4 6l4 4 4-4"/>'),
  suivant: svg('<path d="M6 3.5 10.5 8 6 12.5"/>'),
  infoRond: svg('<circle cx="8" cy="8" r="6.2"/><path d="M8 7.2v4M8 4.9v.1"/>'),
  coeur: svg('<path d="M8 13.6S2 10 2 5.9A3.1 3.1 0 0 1 8 4.6a3.1 3.1 0 0 1 6 1.3C14 10 8 13.6 8 13.6z"/>'),
  pleinCadeau: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 11h7v10H5a1 1 0 0 1-1-1zm9 0h7v9a1 1 0 0 1-1 1h-6zM3 7h18v3H3zm9-1.2C11.1 3.6 9.4 2.5 8 3c-1.6.6-1.4 3 .4 3.6.9.3 2.4.4 3.6.4zm0 0c.9-2.2 2.6-3.3 4-2.8 1.6.6 1.4 3-.4 3.6-.9.3-2.4.4-3.6.4z"/></svg>`),
  pleinBoite: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 3 6.5l9 4.5 9-4.5zM2.5 8v9.2L11 21.5V12.7zm19 0L13 12.7v8.8l8.5-4.3z"/></svg>`),
  pleinPerso: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7.5" r="4.5"/><path d="M3.5 21c0-4.4 3.8-7.5 8.5-7.5s8.5 3.1 8.5 7.5z"/></svg>`),
  pleinMaison: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 2.5 11h2.5v9.5h5.5v-6h3v6H19V11h2.5z"/></svg>`),
  pleinGrille: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>`),
  pleinPlus: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"/></svg>`),
  pleinCoeur: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-8.5-5.2-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.8 12 21 12 21z"/></svg>`),
  bulleAide: raw(`<svg class="ico ico-plein" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm4 7.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm4 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm4 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/></svg>`),
  palette: svg('<path d="M8 2a6 6 0 0 0 0 12c.9 0 1.3-.5 1.3-1.1 0-.7-.6-1-.6-1.7 0-.6.5-1 1.1-1H11a3 3 0 0 0 3-3C14 4.3 11.3 2 8 2z"/><circle cx="5.3" cy="7" r=".8"/><circle cx="7.6" cy="4.8" r=".8"/><circle cx="10.4" cy="5.6" r=".8"/>'),
  terminal: svg('<rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M4.8 6.3 6.8 8l-2 1.7M8.5 10h3"/>'),
  chapeau: svg('<path d="M1.5 6.2 8 3l6.5 3.2L8 9.4z"/><path d="M4.2 7.6v3c1 .9 2.3 1.4 3.8 1.4s2.8-.5 3.8-1.4v-3M14.5 6.2v3.6"/>'),
  note: svg('<path d="M6 12.2V3.8l7-1.5v8.4"/><circle cx="4.3" cy="12.2" r="1.7"/><circle cx="11.3" cy="10.7" r="1.7"/>'),
  photo: svg('<rect x="2" y="3" width="12" height="10" rx="1.5"/><circle cx="6" cy="6.6" r="1.2"/><path d="m2.5 11.5 3.3-3 2.4 2.2 2.3-1.8 3 2.6"/>'),
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
  etiquette: svg('<path d="M8.6 1.8H14.2v5.6L7.6 14 2 8.4z"/><circle cx="11.3" cy="4.7" r="1"/>'),
  cadeau: svg('<rect x="2.4" y="6.2" width="11.2" height="7.6" rx="1"/><path d="M1.8 6.2h12.4M8 6.2v7.6M8 6.2C7 3.4 4.2 3.2 4.2 4.8S8 6.2 8 6.2zm0 0c1-2.8 3.8-3 3.8-1.4S8 6.2 8 6.2z"/>'),
  cloche: svg('<path d="M4 6.6a4 4 0 0 1 8 0c0 3 1 4.2 1 4.2H3s1-1.2 1-4.2z"/><path d="M6.6 13a1.6 1.6 0 0 0 2.8 0"/>'),
};

// --- Utilitaires ------------------------------------------------------------
// `limits` est renseigné par /api/me : le formulaire prévient avant l'envoi plutôt que
// de laisser partir 5 Mo pour un refus. Valeurs de repli si l'appel échoue.
// `stats` sert au rail, qui est dessiné sur toutes les pages : on le garde ici
// pour ne pas redemander les mêmes compteurs à chaque changement de page.
// `modeles` vient du serveur (jamais recopié ici) : le formulaire ne peut donc
// pas proposer une famille que le serveur refuserait.
const S = { me: null, admin: false, pending: 0, nonLues: 0, promo: null, marche: null, stats: null, modeles: {}, site: { nuit: false }, limits: { pdfKb: 15360, fileMb: 15, imageMb: 10, images: 3 } };

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
// La page d'accueil est aussi gardée sur l'appareil, d'une visite à l'autre : à
// l'ouverture, elle s'affiche tout de suite avec ce qu'on avait vu la dernière fois,
// et se met à jour dès que le serveur répond. Sur une ligne où les données mettent
// parfois trois secondes à arriver, c'est la différence entre une page blanche et une
// page qui est déjà là. Rien de privé n'y est gardé (ce sont les drops publics, vus
// par ce visiteur), et la copie est effacée à la moindre action et à la déconnexion.
const FIL_ACCUEIL = 'fil2:t=&tag=&q=&s=top&p=&m=&prix=';
const CLE_FIL = 'mk-fil';
const GARDE_MS = 7 * 86400000;
// L'amorce : les données de l'accueil que le serveur a écrites dans la page.
let amorce;
function lisAmorce() {
  if (amorce === undefined) {
    try { amorce = JSON.parse(document.getElementById('amorce')?.textContent || 'null'); } catch { amorce = null; }
  }
  return amorce;
}
function duCache(cle) {
  const e = memo.get(cle);
  if (e && Date.now() - e.at < CACHE_MS) return e.valeur;
  if (cle === FIL_ACCUEIL) {
    // La plus récente des deux copies : celle de l'appareil, ou celle écrite dans la page.
    let d = null;
    try {
      d = JSON.parse(localStorage.getItem(CLE_FIL) || 'null');
      if (!d || d.cle !== cle) d = null;
    } catch { /* stockage illisible ou bloqué */ }
    const a = lisAmorce();
    if (a && (!d || a.at > d.at)) d = a;
    if (d && Date.now() - d.at < GARDE_MS) return d.valeur;
  }
  return null;
}
function enCache(cle, valeur) {
  memo.set(cle, { valeur, at: Date.now() });
  // Après une gemme, une étoile ou un vote, les compteurs affichés sont périmés.
  if (memo.size > 40) memo.delete(memo.keys().next().value);
  if (cle === FIL_ACCUEIL) {
    try { localStorage.setItem(CLE_FIL, JSON.stringify({ cle, at: Date.now(), valeur })); } catch { /* plein ou bloqué */ }
  }
}
const videCache = () => {
  memo.clear();
  try { localStorage.removeItem(CLE_FIL); } catch { /* rien à effacer */ }
};

// --- Mode lecture seule -------------------------------------------------------------
// Une copie du site peut être publiée sur un hébergement de fichiers (GitHub Pages),
// sans serveur : tout est alors chargé une fois depuis donnees/, et les tris, filtres
// et recherches se font dans le navigateur. On lit tout, on n'écrit rien.
const STATIQUE = typeof window !== 'undefined' && window.MAKERS_STATIQUE === true;
let fondStatique = null;

// La copie publiée répond aux mêmes adresses que le serveur, et doit renvoyer la
// même forme : une liste ne porte jamais le contenu d'un partage, seulement sa
// fiche. (Voir `pourListe` dans src/posts.js, dont ceci est le jumeau.)
const pourListe = p => {
  const o = { ...p };
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
  const { posts, stats, limits, promo, modeles = {}, collections = [], site = { nuit: false } } = await chargeStatique();
  const [base, qs] = chemin.split('?');
  const q = new URLSearchParams(qs || '');

  // `promo` décrit l'offre (places, durée, tarif), pas son état : une copie de fichiers
  // n'a pas d'horloge, donc elle ne sait pas combien de places sont libres à cet instant.
  if (base === '/me') return { member: null, admin: false, pending: 0, limits, promo, modeles, site };
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
    if (!post) throw Object.assign(new Error('Drop introuvable.'), { status: 404 });
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
    if (!p) throw Object.assign(new Error('Drop introuvable.'), { status: 404 });
    return { post: p };
  }

  if (base === '/posts') {
    const t = q.get('t') || '', tag = (q.get('tag') || '').toLowerCase();
    const mot = (q.get('q') || '').toLowerCase().trim();
    const fam = (q.get('m') || '').toLowerCase();
    const tri = q.get('s') || 'top';
    // Le même filtre de vitrine que le serveur, pour que les deux copies répondent pareil.
    const prix = q.get('prix') || '';
    const rayon = q.get('rayon') || '';
    let list = ouverts.filter(p => (!t || p.type === t)
      && (!fam || p.modele?.famille === fam)
      && (!tag || p.tags.includes(tag))
      && (prix !== 'payant' || p.prix > 0)
      && (prix !== 'gratuit' || !(p.prix > 0))
      && (rayon !== 'produits' || FAMILLES_PRODUIT.has(p.type))
      && (rayon !== 'ia' || !FAMILLES_PRODUIT.has(p.type)));
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

// Une même lecture n'est demandée qu'une fois. Sur une ligne lente — depuis l'Algérie,
// un aller-retour vers le serveur coûte souvent 300 ms, parfois plus d'une seconde —
// chaque requête en double se paie. Deux parties de la page qui veulent la même chose
// au même moment (le rail et le fil veulent tous deux les compteurs) partagent donc la
// réponse, et elle reste partagée quelques secondes. Toute écriture vide cette mémoire :
// après une gemme ou une publication, on relit toujours le vrai état.
const enVol = new Map();
// Les drops déjà reçus dans une liste, par id : on ouvre leur fiche tout de suite avec ce
// qu'on sait, et on la complète quand le serveur répond.
const vus = new Map();
const retiens = liste => { for (const p of liste || []) vus.set(p.id, p); };
const PARTAGE_MS = 4000;
function api(path, opts = {}) {
  if ((opts.method && opts.method !== 'GET') || opts.body) { enVol.clear(); return appel(path, opts); }
  const deja = enVol.get(path);
  if (deja) return deja;
  const p = appel(path, opts);
  enVol.set(path, p);
  p.then(() => setTimeout(() => { if (enVol.get(path) === p) enVol.delete(path); }, PARTAGE_MS),
    () => { if (enVol.get(path) === p) enVol.delete(path); });
  return p;
}
// Lance des lectures sans les attendre : la réponse sera prête quand la page la demandera.
// (Le service worker sert ce fichier depuis l'appareil et le revérifie derrière : une
// mise en ligne arrive chez chacun à la visite qui suit, sans rien vider à la main.)
const prechauffer = chemins => chemins.forEach(c => api(c).catch(() => {}));

async function appel(path, { method = 'GET', body } = {}) {
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
    <!-- La bande du haut, la barre et ses trois raccourcis à droite : la mise en page des
         grandes boutiques de produits digitaux, que les acheteurs connaissent déjà. -->
    <div class="gg-bande">
      <span>${ICON.globe}Dinar algérien (DA) · Français</span>
      ${STATIQUE ? '' : html`<a href="${S.me ? '#/partager' : '#/rejoindre'}">Vendre sur makers.si</a>`}
    </div>
    <div class="bar">
      <button class="menu-btn" type="button" data-action="menu" aria-label="Ouvrir le catalogue" aria-expanded="false">${ICON.menu}</button>
      <a class="logo" href="#/" aria-label="makers.si, accueil">makers<i>.</i>si</a>
      <button class="gg-catalogue" type="button" data-action="menu" aria-label="Ouvrir le catalogue">${ICON.menu}<span>Catalogue</span></button>
      <button class="cmd" type="button" data-action="palette" aria-label="Trouver un produit">
        ${ICON.loupe}<span>Trouver un produit</span><kbd>⌘K</kbd>
      </button>
      <div class="bar-end">
        ${S.site?.nuit ? html`<div class="theme" role="group" aria-label="Apparence">
          ${theme('auto', 'auto', 'Suivre le réglage de l’appareil')}
          ${theme('papier', 'papier', 'Fond clair')}
          ${theme('nuit', 'nuit', 'Fond sombre')}
        </div>` : ''}
        <!-- Sur téléphone, la modération quitte la barre du haut : elle ne sert qu'à
             une personne, et la place revient à la cloche, qui sert tous les jours.
             Elle reste atteignable par le rail et par la palette. -->
        ${S.admin ? html`<a class="btn small hide-sm" href="#/admin" title="Drops à relire et commandes à confirmer">À valider${S.pending + (S.aConfirmer || 0) ? html`<span class="badge">${S.pending + (S.aConfirmer || 0)}</span>` : ''}</a>` : ''}
        ${S.me && !STATIQUE ? html`
          <a class="cloche ${S.nonLues ? 'neuve' : ''}" href="#/notifications"
            aria-label="${S.nonLues ? `${S.nonLues} nouveauté${S.nonLues > 1 ? 's' : ''} depuis ta dernière visite` : 'Ce qui s’est passé'}"
            title="${S.nonLues ? `${S.nonLues} nouveauté${S.nonLues > 1 ? 's' : ''}` : 'Ce qui s’est passé'}">
            ${ICON.cloche}${S.nonLues ? html`<span class="pastille">${S.nonLues > 9 ? '9+' : S.nonLues}</span>` : ''}
          </a>` : ''}
        <a class="gg-ico hide-sm" href="#/?prix=gratuit">${ICON.pleinCadeau}<span>Offerts</span></a>
        ${STATIQUE ? '' : html`<a class="gg-ico hide-sm" href="${S.me ? '#/mes-achats' : '#/connexion'}">${ICON.pleinBoite}<span>Achats</span></a>`}
        ${S.me
          ? html`<a class="gg-ico" href="#/mes-partages">${ICON.pleinPerso}<span>@${S.me.pseudo}</span></a>`
          : STATIQUE
            ? html`<span class="gg-ico hide-sm" title="Copie consultable : on lit tout, on n’écrit rien">${ICON.lock}<span>Lecture seule</span></span>`
            // Sur téléphone, la barre du bas porte déjà « Connexion ».
            : html`<a class="gg-ico hide-sm" href="#/connexion">${ICON.pleinPerso}<span>Connexion</span></a>`}
      </div>
    </div>`.s;
}

// --- Le rail et la barre du bas ---------------------------------------------------
// Le rail est la table des matières de la bibliothèque, et il ne bouge jamais :
// on change de catégorie depuis n'importe quelle page. C'est ce qui fait la
// différence entre une suite de pages et un outil.
const TYPE_ICONE = {
  template: 'grille', design: 'palette', code: 'terminal', formation: 'chapeau', audio: 'note', media: 'photo',
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
  const prix = surFil ? (q.get('prix') || '') : '';
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
  // Même règle que pour les gemmes : on n'écrit jamais un zéro. Quatre « 0 » alignés
  // dans la colonne de gauche, sur chaque page, annoncent un site mort.
  const compte = n => (!n ? '' : html`<span>${n}</span>`);
  const total = stats ? Object.values(stats.byType).reduce((a, b) => a + b, 0) : null;
  const rien = !t && !tag && !mot && !prem && !mod && !prix && surFil;

  // La boutique passe en tête : vendre des produits digitaux est ce que fait ce site.
  // Les deux rayons restent visibles même vides — « À vendre » est la raison d'être du
  // site, le cacher tant qu'il est vide cacherait le site lui-même.
  return html`
    <section>
      <h3 class="cote">La boutique</h3>
      <a href="${vers('prix', 'payant')}" class="k-vente ${prix === 'payant' ? 'on' : ''}">${ICON.etiquette}À vendre ${compte(stats?.aVendre)}</a>
      <a href="${vers('prix', 'gratuit')}" class="k-gratuit ${prix === 'gratuit' ? 'on' : ''}">${ICON.cadeau}Offert ${compte(stats?.gratuits)}</a>
    </section>
    <section>
      <h3 class="cote">La bibliothèque</h3>
      <a href="${vers('t', '')}" class="${rien ? 'on' : ''}">Tout ${compte(total)}</a>
      ${Object.entries(TYPES)
        // Une rubrique vide n'apparaît plus : quatre lignes grisées dans la colonne de
        // gauche, sur chaque page, faisaient un site à moitié vide. Elle revient d'elle-
        // même au premier drop publié. Celle qu'on regarde reste, même vide.
        .filter(([cle]) => !stats || stats.byType?.[cle] || t === cle)
        .map(([cle, v]) => html`
        <a href="${vers('t', cle)}" class="k-${cle} ${t === cle && !prem ? 'on' : ''}">
          ${ICON[TYPE_ICONE[cle]]}${v.plural} ${compte(stats?.byType?.[cle])}</a>`)}
    </section>

    <!-- « Montre-moi ce qui tourne sur Claude. » La rubrique n'apparaît que
         lorsqu'au moins un drop dit sur quoi il a été essayé : une liste de
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
      <!-- Le Top ne s'affiche que s'il a quelque chose à classer. Tant que personne
           n'a donné de gemme, il mène à une page vide depuis chaque page du site,
           et annonce le vide plus sûrement que n'importe quel compteur. La première
           gemme le fait réapparaître toute seule. -->
      ${stats?.gems ? html`<a href="#/top" class="${path === '/top' ? 'on' : ''}">${ICON.cup}Top 5</a>` : ''}
      ${stats?.premium ? html`
        <a href="#/?p=1" class="${prem ? 'on' : ''}">${ICON.lock}Espace privé ${compte(stats.premium)}</a>` : ''}
    </section>

    ${STATIQUE ? '' : html`
      <section>
        <h3 class="cote">${S.me ? 'Chez moi' : 'Participer'}</h3>
        ${S.me
          ? html`
            <a class="btn primary" href="#/partager">${ICON.plus}New drop</a>
            <a href="#/notifications" class="${path === '/notifications' ? 'on' : ''}">
              ${ICON.cloche}Ce qui s’est passé ${S.nonLues ? html`<span>${S.nonLues}</span>` : ''}</a>
            <a href="#/mes-partages" class="${path === '/mes-partages' ? 'on' : ''}">${ICON.dossier}Mes drops</a>
            <!-- C'est sur « Mes achats » qu'est écrit où payer. Elle n'était accessible
                 qu'en passant par « Mes ventes », où un acheteur n'a aucune raison
                 d'aller. Le chiffre rappelle qu'une commande attend son versement. -->
            <a href="#/mes-achats" class="${path === '/mes-achats' ? 'on' : ''}">${ICON.etiquette}Mes achats ${S.commandes ? html`<span>${S.commandes}</span>` : ''}</a>
            <a href="#/mes-ventes" class="${path === '/mes-ventes' ? 'on' : ''}">${ICON.file}Mes ventes</a>
            <a href="#/membre/${encodeURIComponent(S.me.pseudo)}">${ICON.perso}Mon profil</a>`
          : html`
            <a href="#/rejoindre">${ICON.plus}Créer mon compte</a>
            <a href="#/connexion">${ICON.lock}Me connecter</a>`}
        <!-- Hors du choix ci-dessus : une session d'administration est indépendante
             d'un compte membre. On peut modérer sans être connecté comme membre. -->
        ${S.admin ? html`<a href="#/admin" class="${path === '/admin' ? 'on' : ''}">
          ${ICON.vote}Modération ${S.pending ? html`<span>${S.pending}</span>` : ''}</a>
          <a href="#/admin?s=marche">${ICON.etiquette}Commandes à confirmer ${S.aConfirmer ? html`<span class="a-faire">${S.aConfirmer}</span>` : ''}</a>` : ''}
      </section>`}

    <div class="rail-bas">
      <p>Chaque drop est relu avant publication.
        <a href="#/aide">Comment ça marche</a> · <a href="#/charte">la charte</a>.</p>
      <p class="hide-sm">Tape <kbd>?</kbd> pour les raccourcis.</p>
    </div>`;
}

// Les cinq cases de la barre du bas, sur téléphone. « Partager » au centre,
// à la couleur de la maison : c'est le geste qu'on vient faire.
function barreBasHTML(path) {
  // La boutique a sa case : sur un téléphone, c'est cette barre qu'on utilise, et ce
  // que le site vend ne doit pas se trouver seulement au fond d'un menu.
  const enBoutique = path === '/' && new URLSearchParams(location.hash.split('?')[1] || '').get('prix') === 'payant';
  // Un onglet : une pastille autour de l'icône (elle se colore sur la page en cours),
  // et son nom dessous. `aria-current` dit aux lecteurs d'écran où l'on est.
  // Un compte (les notifications non lues) se pose en badge rouge sur l'icône.
  const onglet = (href, icone, nom, actif, classe = '', compte = 0) => html`<a href="${href}" class="${classe}${actif ? ' on' : ''}"${actif ? html` aria-current="page"` : ''}${compte ? html` aria-label="${nom}, ${compte} nouveauté${compte > 1 ? 's' : ''}"` : ''}><span class="p">${icone}${compte ? html`<span class="pastille-compte" aria-hidden="true">${compte > 9 ? '9+' : compte}</span>` : ''}</span><span class="l">${nom}</span></a>`;
  // Comme sur les grandes boutiques : Accueil, Catalogue (le tiroir des rubriques),
  // puis New drop, Achats, Profil. Des icônes pleines, le nom dessous.
  return html`
    ${onglet('#/', ICON.pleinMaison, 'Accueil', path === '/' && !enBoutique)}
    <button type="button" data-action="menu" class="onglet-bouton" aria-label="Ouvrir le catalogue"><span class="p">${ICON.pleinGrille}</span><span class="l">Catalogue</span></button>
    ${STATIQUE ? onglet('#/?prix=payant', ICON.pleinBoite, 'À vendre', enBoutique) : ''}
    ${STATIQUE
      ? onglet('#/aide', ICON.ampoule, 'Aide', path === '/aide')
      // « New drop » n'est pas un endroit mais un geste : un bouton plein, qui ne se
      // confond jamais avec l'onglet de la page où l'on se trouve.
      : onglet(S.me ? '#/partager' : '#/rejoindre', ICON.pleinPlus, 'New drop', path === '/partager')}
    ${STATIQUE ? '' : onglet(S.me ? '#/mes-achats' : '#/connexion', ICON.pleinBoite, 'Achats', path === '/mes-achats')}
    ${STATIQUE ? onglet('#/?prix=gratuit', ICON.pleinCadeau, 'Offerts', path === '/' && !enBoutique && false)
      : onglet(S.me ? '#/mes-partages' : '#/connexion', ICON.pleinPerso, S.me ? 'Profil' : 'Connexion', path === '/mes-partages' || path === '/connexion', '', S.me ? S.nonLues : 0)}`;
}

// Une seule pastille pour toute la barre, qui glisse d'un onglet à l'autre quand on
// change de page — au lieu de disparaître ici et d'apparaître là. Elle part de sa
// dernière position connue (la barre est redessinée à chaque page) et rejoint la
// nouvelle. Quand la barre se réduit ou change de taille, elle suit sans glisser.
let indicateurAvant = null;
function placeIndicateur(b, { glisse = true } = {}) {
  if (!b) return;
  let ind = b.querySelector('.indicateur');
  if (!ind) {
    ind = document.createElement('span');
    ind.className = 'indicateur';
    ind.setAttribute('aria-hidden', 'true');
    b.prepend(ind);
  }
  const cible = b.querySelector('a.on:not(.appoint) .p');
  const rb = b.getBoundingClientRect();
  if (!cible || !rb.width) { ind.classList.remove('visible'); return; }
  const r = cible.getBoundingClientRect();
  const pos = { x: r.left - rb.left, y: r.top - rb.top, w: r.width, h: r.height };
  const pose = p => {
    ind.style.transform = `translate(${p.x}px, ${p.y}px)`;
    ind.style.width = p.w + 'px';
    ind.style.height = p.h + 'px';
  };
  ind.classList.remove('anime');
  if (glisse && indicateurAvant && ind.classList.contains('visible') === false) {
    pose(indicateurAvant);
    ind.classList.add('visible');
    ind.getBoundingClientRect(); // le point de départ est posé avant le mouvement
  }
  if (glisse && indicateurAvant) ind.classList.add('anime');
  pose(pos);
  ind.classList.add('visible');
  indicateurAvant = pos;
}
{
  const b = document.getElementById('barre-bas');
  if (b && 'ResizeObserver' in window) new ResizeObserver(() => placeIndicateur(b, { glisse: false })).observe(b);
  // Un toucher se sent, là où le téléphone le permet (Android) : une vibration de
  // quelques millisecondes, comme les onglets d'une application.
  b?.addEventListener('click', e => { if (e.target.closest('a')) navigator.vibrate?.(8); });
}

// Comme sur iOS 26, la barre du téléphone se réduit à ses icônes quand on descend dans
// une page, pour laisser la place au contenu, et revient dès qu'on remonte. Un seul
// calcul par image affichée, et un écouteur passif : le défilement n'attend jamais.
{
  let dernier = 0, prevu = false;
  addEventListener('scroll', () => {
    if (prevu) return;
    prevu = true;
    requestAnimationFrame(() => {
      prevu = false;
      const b = document.getElementById('barre-bas'), y = scrollY;
      if (!b) return;
      if (y < 80 || y < dernier - 6) b.classList.remove('compacte');
      else if (y > dernier + 6) b.classList.add('compacte');
      dernier = y;
    });
  }, { passive: true });
}

// Le rail se dessine tout de suite avec les chiffres qu'on a déjà, puis se
// corrige quand ils arrivent : il ne doit jamais retarder l'affichage de la page.
async function rail() {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const q = new URLSearchParams(qs || '');
  const dessine = () => {
    const r = $('#rail'), b = $('#barre-bas');
    if (r) r.innerHTML = railHTML(S.stats, path, q).s;
    if (b) {
      b.innerHTML = barreBasHTML(path).s;
      b.classList.remove('compacte');
      placeIndicateur(b);
    }
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
// « 2500 » se lit mal, « 2 500 » se lit d'un coup : l'espace fine des milliers.
const prixLisible = n => Number(n).toLocaleString('fr-FR');
const prixBadge = p => (p.prix
  ? html`<span class="pin vente" title="Le contenu de ce drop s’achète">${prixLisible(p.prix)} ${p.devise || ''}</span>`
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
function gemButton(p, { compact = false, court = false, coeur = false } = {}) {
  // Sur la copie publiée, personne ne peut voter : un bouton qui ne sait pas répondre
  // n'a rien à faire là. On garde le compte quand il y a quelque chose à compter, et
  // rien du tout sinon — trente boutons morts, c'est trente promesses non tenues.
  if (STATIQUE) {
    return p.gems ? html`<span class="vote fige" title="${p.gems} gemme${p.gems > 1 ? 's' : ''}"
      >${coeur ? ICON.coeur : ICON.gem}<b>${p.gems}</b></span>` : '';
  }
  const title = p.gemmed ? 'Reprendre ma gemme' : 'Donner une gemme';
  const mot = !compact && !court;
  return html`<button class="vote ${compact ? 'compacte' : ''} ${court ? 'court' : ''} ${p.gemmed ? 'on' : ''}" data-action="gem" data-id="${p.id}"
    aria-pressed="${String(p.gemmed)}" aria-label="${title}" title="${title}">${coeur ? ICON.coeur : ICON.gem}<b>${p.gems || ''}</b>${mot ? html`<span class="vote-mot">${coeur ? (p.gemmed ? 'Dans mes favoris' : 'Ajouter aux favoris') : p.gems ? `gemme${p.gems > 1 ? 's' : ''}` : 'Donner une gemme'}</span>` : ''}</button>`;
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
  return html`<span class="stars big ${p.myStars ? 'mine' : ''}" role="group" aria-label="Noter ce drop">
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
  if (p.has?.fichier) return p.has.fichier.ext.toUpperCase();
  if (p.url) return domain(p.url);
  // La couverture d'un produit en vente n'est pas une « photo » qu'on reçoit : la
  // compter faisait écrire « 1 photo » sous un pack de LUT.
  const photos = (p.images || []).filter(i => !i.couverture).length;
  if (photos) return `${photos} photo${photos > 1 ? 's' : ''}`;
  return '';
}

// --- Les boîtes ---------------------------------------------------------------
// Une bibliothèque de skills, de prompts et de liens n'a presque jamais d'image.
// Chaque partage se présente donc comme l'emballage de ce qu'on achète : une boîte
// en 3D (CSS seul, voir « La boîte » dans style.css) à la couleur de sa catégorie,
// son titre sur la face, sa catégorie sur la tranche, posée directement sur la carte,
// sans décor derrière. Une vraie photo, s'il y en a, devient la face.

// Empreinte stable (FNV-1a) : la couleur de l'initiale d'un membre est la même à
// chaque visite, sur chaque appareil. Tirée au hasard, elle changerait d'un
// affichage à l'autre, et on ne reconnaîtrait plus quelqu'un à sa couleur.
function empreinte(id = '') {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}


// La boîte. Chaque produit se présente comme l'emballage de ce qu'on achète : une
// boîte en trois dimensions, posée sur la carte sans décor derrière, avec son
// nom sur la face, sa catégorie sur la tranche, et la marque en bas. C'est ce qu'on
// voit dans un magasin de logiciels — on reconnaît un produit à sa boîte avant d'en
// avoir lu le nom.
//
// Tout est en CSS (transformations 3D, aucune image, aucune bibliothèque) : la boîte
// ne coûte rien à télécharger, se redessine dans les deux thèmes, et s'adapte à la
// taille de la carte grâce aux unités de conteneur. Une vraie photo, quand il y en a
// une, devient la face de la boîte.
//
// La boîte est décorative au sens strict : elle répète un lien et un titre déjà écrits
// juste à côté. Elle est donc retirée du clavier et des lecteurs d'écran — sinon chaque
// partage compterait deux fois dans l'index.
// Le pack lui-même : la scène, la boîte et son ombre. Partagé par les cartes, la
// liste et la page d'un produit, pour que ce soit partout le même objet.
function boite(p) {
  const thumb = p.images?.[0]?.thumb;
  const court = TYPES[p.type]?.short || p.type;
  return html`
    <span class="boite-scene">
      <span class="boite">
        <span class="boite-face${thumb ? ' photo' : ''}">
          ${thumb ? html`<img src="${thumb}" alt="" loading="lazy">` : html`
            <span class="boite-kind">${court}</span>
            <span class="boite-titre">${fr(p.title)}</span>
            <span class="boite-glyphe">${ICON[TYPE_ICONE[p.type]] || ''}</span>
            <span class="boite-marque">makers<i>.</i>si</span>`}
        </span>
        <span class="boite-tranche"><span>${court}</span></span>
        <span class="boite-dessus"></span>
      </span>
      <span class="boite-sol"></span>
    </span>`;
}

// Un lien n'est pas un produit qu'on emporte : le mettre en boîte trompait sur ce
// qu'on obtient. Il a sa propre couverture, plate : une plaque qui dit où il mène —
// le site en petit, et ce qu'on y trouve en grand. Pour un dépôt GitHub, son
// propriétaire et son nom (« anthropics / skills ») : c'est ce qu'un développeur
// reconnaît, bien plus qu'un titre.
function cibleLien(url) {
  try {
    const u = new URL(url);
    const site = u.hostname.replace(/^www\./, '');
    const [a, b] = u.pathname.split('/').filter(Boolean);
    if (site === 'github.com' && a && b) return { site, haut: a, nom: b };
    return { site, haut: '', nom: a || site };
  } catch { return { site: 'lien externe', haut: '', nom: '' }; }
}
function couvLien(p, mini) {
  if (mini) {
    return html`<a class="couv couv-adresse couv-mini k-${p.type}" href="#/p/${p.id}" tabindex="-1" aria-hidden="true"><span class="adresse">${ICON.out}</span></a>`;
  }
  const c = cibleLien(p.url || '');
  return html`
    <a class="couv couv-depot k-${p.type}" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">
      <span class="depot-plaque">
        <span class="depot-site">${ICON.out}${c.site}</span>
        <span class="depot-nom">${c.haut ? html`<span class="depot-proprio">${c.haut} /</span>` : ''}<b>${c.nom || fr(p.title)}</b></span>
      </span>
    </a>`;
}

function couverture(p, { mini = false } = {}) {
  if (p.type === 'lien') return couvLien(p, mini);
  return html`
    <a class="couv${mini ? ' couv-mini' : ''} k-${p.type}" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">${boite(p)}</a>`;
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
// La rangée des catégories, sous la barre : une pastille colorée et un nom, comme sur
// les grandes boutiques de produits digitaux.
const CATEGORIES = [
  ['#/?prix=payant', 'etiquette', 'À vendre', 'k-vente', p => p === 'payant'],
  ['#/?prix=gratuit', 'cadeau', 'Offerts', 'k-offert', p => p === 'gratuit'],
  ['#/?t=template', 'grille', 'Templates', 'k-template', (p, t) => t === 'template'],
  ['#/?t=design', 'palette', 'Design', 'k-design', (p, t) => t === 'design'],
  ['#/?t=code', 'terminal', 'Code', 'k-code', (p, t) => t === 'code'],
  ['#/?t=formation', 'chapeau', 'Formations', 'k-formation', (p, t) => t === 'formation'],
  ['#/?t=audio', 'note', 'Audio', 'k-audio', (p, t) => t === 'audio'],
  ['#/?t=media', 'photo', 'Photos et vidéos', 'k-media', (p, t) => t === 'media'],
  ['#/?t=skill', 'dossier', 'Skills Claude', 'k-skill', (p, t) => t === 'skill'],
  ['#/?t=prompt', 'code', 'Prompts', 'k-prompt', (p, t) => t === 'prompt'],
];
function rangeeCategories(t = '', prix = '') {
  return html`<nav class="gg-cats" aria-label="Catégories">${CATEGORIES.map(([href, ico, nom, k, actif]) =>
    html`<a href="${href}" class="${k}${actif(prix, t) ? ' on' : ''}"><span class="gg-pic">${ICON[ico]}</span>${nom}</a>`)}</nav>`;
}
// Les grandes tuiles de l'accueil (images dans public/img/tuiles, fabriquées par
// scripts/affiches-fabriquer.js). Le nom est du vrai texte posé par-dessus.
const TUILES = [
  ['capcut', 'CapCut', '#/?q=capcut'], ['templates', 'Templates', '#/?t=template'], ['notion', 'Notion', '#/?q=notion'],
  ['excel', 'Excel', '#/?q=excel'], ['design', 'Design', '#/?t=design'], ['lightroom', 'Lightroom', '#/?q=lightroom'],
  ['cv', 'CV et lettres', '#/?q=cv'], ['code', 'Code et outils', '#/?t=code'], ['formations', 'Formations', '#/?t=formation'],
  ['audio', 'Sons et musique', '#/?t=audio'], ['photos', 'Photos et vidéos', '#/?t=media'],
];
function tuilesAccueil() {
  return html`
    <div class="gg-tuiles-cadre">
      <div class="gg-tuiles" id="tuiles">${TUILES.map(([img, nom, href]) => html`
        <a class="gg-tuile" href="${href}"><img src="img/tuiles/${img}.webp" alt="" width="180" height="225" loading="lazy"><span>${nom}</span></a>`)}
      </div>
      <button class="gg-tuiles-suite" type="button" data-action="tuiles" aria-label="Voir les catégories suivantes">${ICON.suivant}</button>
    </div>`;
}

// Les familles « produit » (templates, design, code, formations, audio, photos et
// vidéos, PDF) se présentent comme dans une boutique : une grande photo, le prix en
// gros juste dessous, puis le titre. Les drops pour l'IA (skills, prompts, agents, MCP)
// et le reste gardent leur boîte : ils n'ont pas de photo à montrer.
const FAMILLES_PRODUIT = new Set(['template', 'design', 'code', 'formation', 'audio', 'media', 'pdf']);
const enBoutique = p => FAMILLES_PRODUIT.has(p.type);
// Une photo très haute (cadre vertical) ou très large (bande audio) est montrée entière
// plutôt que rognée : on ne coupe pas la moitié de ce qu'on vend.
const photoEntiere = i => { const r = (i.w || 16) / (i.h || 10); return r < 1.2 || r > 2.1; };
function carteProduit(p, rang = null) {
  const podium = rang && rang <= 3 ? rang : 0;
  const a = p.affiche, i = p.images?.[0];
  const f = p.file || (p.has?.fichier ? { ext: p.has.fichier.ext, size: p.has.fichier.size } : null);
  // La carte d'une grande boutique : l'affiche carrée, la catégorie en petit, le prix en
  // gros, le nom sur deux lignes, une ligne grise, et le bouton vert en bas.
  return html`
    <article class="carte gg-carte k-${p.type} ${podium ? 'podium rang-' + podium : ''}">
      <a class="gg-carte-lien" href="#/p/${p.id}">
        <span class="gg-image">${a ? html`<img src="${a.thumb}" alt="" loading="lazy" width="480" height="480">`
          : i ? html`<img src="${i.thumb}" alt="" loading="lazy" class="contenue">` : boite(p)}</span>
        <span class="gg-cat">${TYPES[p.type]?.label || p.type}</span>
        <span class="gg-prix">${p.prix ? html`${prixLisible(p.prix)} ${p.devise || 'DA'}` : 'Offert'}</span>
        <span class="gg-nom">${fr(p.title)}</span>
        <span class="gg-info">${f ? `${f.ext.toUpperCase()} · ${size(f.size)}` : p.url ? domain(p.url) : 'À lire en ligne'}</span>
      </a>
      ${podium ? html`<span class="medaille" title="${rang}ᵉ au classement, ${p.points} points">n° ${rang}</span>` : ''}
      <span class="gg-fav">${gemButton(p, { compact: true, coeur: true })}</span>
      <a class="gg-bouton" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">${p.prix && !p.achete ? 'Acheter' : 'Télécharger'}</a>
    </article>`;
}

function carte(p, rang = null) {
  if (enBoutique(p)) return carteProduit(p, rang);
  const podium = rang && rang <= 3 ? rang : 0;
  // « PDF » écrit sous une pastille qui dit déjà « PDF » n'apprend rien à personne,
  // et c'est ce mot en trop qui faisait passer le pied de la carte à la ligne.
  const vu = apercu(p);
  const detail = vu.toLowerCase() === (TYPES[p.type]?.short || '').toLowerCase() ? '' : vu;
  return html`
    <article class="carte k-${p.type} ${p.pinned ? 'pinned' : ''} ${podium ? 'podium rang-' + podium : ''}">
      <!-- La couverture et ce qui est posé dessus : la médaille en haut à gauche, le prix
           en bas à droite. Le prix n'est plus une petite pastille perdue entre la
           catégorie et le titre — dans une boutique, c'est la première chose qu'on
           cherche du regard. Il reste hors du lien de la couverture (masqué aux
           lecteurs d'écran) : c'est une information, pas une décoration. -->
      <div class="couv-cadre">
        ${couverture(p)}
        ${podium ? html`<span class="medaille" title="${rang}ᵉ au classement, ${p.points} points">n° ${rang}</span>` : ''}
        ${p.prix ? html`<span class="prix-couv" title="Le contenu de ce produit s’achète">${prixLisible(p.prix)} ${p.devise || ''}</span>` : ''}
      </div>
      <div class="carte-corps">
        <div class="carte-haut">
          ${kind(p.type)}
          ${detail ? html`<span class="carte-detail">${detail}</span>` : ''}
          ${p.locked && !p.prix ? html`<span class="pin lock">${ICON.lock}privé</span>` : ''}
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
        : html`<p class="reponse-invite">Tu as un retour sur ce drop ? <a href="#/rejoindre">Crée un compte</a> pour répondre.</p>`}
    </section>`;
}

// Ce qu'un acheteur reçoit, dit avec ses mots à lui : « le mode d'emploi », pas « un
// contenu à copier » ; et la couverture, déjà visible, n'est pas comptée comme une photo.
const RECU_TEXTE = { prompt: 'le prompt complet', skill: 'le skill', agent: 'la consigne de l’agent', mcp: 'la configuration', idee: 'l’idée en détail', montage: 'les étapes' };
function lockedBox(p) {
  const bits = [];
  if (p.has?.tree) bits.push(`un dossier de ${p.has.tree} fichier${p.has.tree > 1 ? 's' : ''}`);
  if (p.has?.file) bits.push(p.has.fichier ? `le fichier ${p.has.fichier.ext.toUpperCase()}` : 'un fichier');
  if (p.has?.content) bits.push(RECU_TEXTE[p.type] || 'le mode d’emploi');
  if (p.has?.poll) bits.push('un sondage');
  if (p.has?.url) bits.push('un lien');
  const photos = (p.has?.images || 0) - (p.images?.[0]?.couverture ? 1 : 0);
  if (photos > 0) bits.push(`${photos} photo${photos > 1 ? 's' : ''} en grand`);
  const dedans = !bits.length ? 'du contenu' : bits.length === 1 ? bits[0] : bits.slice(0, -1).join(', ') + ' et ' + bits.at(-1);
  // Deux verrous différents, deux explications différentes : un abonnement d'un côté,
  // un achat de l'autre. Les confondre ferait croire qu'on paie deux fois.
  if (p.prix) {
    // L'endroit où l'on décide de payer : une vraie carte, avec le prix en grand — et
    // le seul prix de la page. Avant, c'était une note encadrée, comme une citation.
    return html`
      <div class="locked achat">
        <div class="achat-haut">
          <span class="achat-prix">${prixLisible(p.prix)}<small>${p.devise || 'DA'}</small></span>
          <span class="achat-etat">${ICON.lock}Contenu fermé</span>
        </div>
        <p>Après l’achat, tu reçois ${dedans}. ${p.images?.[0]?.couverture ? 'L’aperçu, la description et le prix restent visibles par tous.' : 'La description et le prix restent visibles par tous.'}</p>
        ${p.has?.chemins?.length ? html`<div class="recu"><b>Ce que tu reçois</b>
          <ul class="recu-liste">${p.has.chemins.map(c => html`<li>${ICON.doc}<span class="mono">${c}</span></li>`)}</ul></div>`
          : p.has?.fichier ? html`<div class="recu"><b>Ce que tu reçois</b>
          <ul class="recu-liste"><li>${ICON.doc}<span>Un fichier ${p.has.fichier.ext.toUpperCase()} · ${p.has.fichier.size < 1048576 ? Math.max(1, Math.round(p.has.fichier.size / 1024)) + ' Ko' : (p.has.fichier.size / 1048576).toFixed(1).replace('.', ',') + ' Mo'}</span></li></ul></div>` : ''}
        ${STATIQUE
          // Le site complet n'est pas encore en ligne : renvoyer vers lui serait renvoyer
          // vers rien. On dit ce qui est vrai, sans date qu'on ne peut pas tenir.
          ? html`<p class="achat-ferme">Ce produit ne s’achète pas encore en ligne : la vente n’est pas ouverte.</p>`
          // Pas de coordonnées de paiement réglées : on ne propose pas d'acheter. Un
          // bouton qui mène à une commande impayable, c'est pire qu'un bouton absent.
          : !S.marche?.ouvert
            ? html`<p class="achat-ferme">La vente n’est pas encore ouverte. Ce produit pourra s’acheter bientôt.</p>`
          : S.me
            ? html`<button class="btn primary achat-bouton" data-action="acheter" data-id="${p.id}" data-prix="${p.prix} ${p.devise || ''}">Acheter pour ${prixLisible(p.prix)} ${p.devise || ''}</button>
              <p class="muted">Tu commandes, tu reçois une référence et l’adresse où envoyer le paiement. Le contenu s’ouvre dès que le versement est vérifié.</p>`
            : html`<a class="btn primary achat-bouton" href="#/rejoindre">Créer mon compte pour acheter</a>`}
      </div>`;
  }
  return html`
    <div class="locked">
      <div class="locked-head">${ICON.lock}<b>Contenu réservé à l’espace privé</b></div>
      <p>Ce drop contient ${dedans}, visible seulement avec l’accès à l’espace privé.</p>
      ${S.me
        ? html`<p class="muted">Ton compte n’a pas encore cet accès. Écris-nous pour le demander.</p>`
        : html`<a class="btn primary" href="#/rejoindre">Créer mon compte</a>`}
    </div>`;
}

function postBody(p, { howto = false, fiche = false } = {}) {
  const photos = (p.images || []).filter(i => !i.couverture).slice(fiche ? 1 : 0);
  return html`
    ${fiche ? '' : html`<p class="lead">${fr(p.description)}</p>`}
    ${p.locked && !fiche ? lockedBox(p) : ''}
    ${pollView(p)}
    ${treeView(p)}
    ${photos.length ? html`<div class="gallery">${photos.map(i => html`<a href="${i.src}" target="_blank" rel="noopener"><img src="${i.src}" width="${i.w}" height="${i.h}" alt="Photo du drop : ${p.title}" loading="lazy"></a>`)}</div>` : ''}
    ${p.imagesProcessing ? html`<div class="notice">${p.imagesProcessing} photo${p.imagesProcessing > 1 ? 's' : ''} en cours de compression. Recharge la page dans quelques secondes.</div>` : ''}
    ${p.content ? html`
      ${howto && p.type === 'skill' ? etapesSkill(slugDe(p.title), false) : ''}
      ${howto && p.type === 'prompt' ? etapesPrompt() : ''}
      <div class="block">
        <div class="block-head"><span>${BLOCK_LABEL[p.type] || 'contenu'}</span><button class="btn small" data-action="copy" data-id="${p.id}">${ICON.copy}Copier</button></div>
        <pre class="code" data-copy="${p.id}">${p.content}</pre>
      </div>` : ''}
    ${p.file && !fiche ? html`
      <div class="block"><a class="attach" href="${p.file.href}" target="_blank" rel="noopener">
        ${ICON.file}<div><b>${p.file.name}</b><small>${p.file.ext.toUpperCase()} · ${size(p.file.size)}</small></div>
        <span class="go">${p.file.ext === 'pdf' || p.file.ext === 'png' || p.file.ext === 'jpg' ? 'Ouvrir' : 'Télécharger'}</span>
      </a></div>` : ''}
    ${p.url && !fiche ? html`
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
  const prix = ['payant', 'gratuit'].includes(q.get('prix')) ? q.get('prix') : '';
  const params = new URLSearchParams({ t, tag, q: query, s: sort, p: prem, m: mod, prix });
  const cle = 'fil2:' + params;
  const vu = duCache(cle);
  // Deux rayons, comme dans une boutique : les produits (grande affiche, prix, bouton) et,
  // à part, ce qui sert à travailler avec l'IA (skills, prompts…), qui garde ses cartes.
  // Une catégorie précise n'a qu'un rayon.
  const unRayon = t ? (FAMILLES_PRODUIT.has(t) ? 'produits' : 'ia') : '';
  const frais = Promise.all([
    api('/posts?' + params + '&rayon=' + (unRayon || 'produits')),
    api('/stats'), api('/top?periode=semaine'), api('/collections?limit=3'),
    unRayon ? Promise.resolve(null) : api('/posts?' + params + '&rayon=ia&limit=8'),
  ])
    .then(r => { enCache(cle, r); return r; });
  // Déjà vu : on réaffiche immédiatement et on rafraîchit derrière.
  const [liste, stats, top, colls, listeIA] = vu || await frais;
  retiens(liste?.posts); retiens(listeIA?.posts);
  const { posts, total: combien, suite } = liste;
  const link = (over) => {
    const n = new URLSearchParams();
    const merged = { t, tag, q: query, s: sort, p: prem, m: mod, prix, ...over };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === 's' && v === 'top')) n.set(k, v);
    const s = n.toString();
    return '#/' + (s ? '?' + s : '');
  };
  const nomModele = mod ? (S.modeles[mod] || mod) : '';
  const title = query ? `Résultats pour « ${query} »` : tag ? `#${tag}`
    : prem ? 'Espace privé'
      : prix === 'payant' ? (t ? `${TYPES[t].plural} à vendre` : 'À vendre')
        : prix === 'gratuit' ? (t ? `${TYPES[t].plural} offerts` : 'Offert')
          : t && mod ? `${TYPES[t].plural} essayés sur ${nomModele}`
            : mod ? `Essayé sur ${nomModele}`
              : t ? TYPES[t].plural : 'Tous les drops';
  // Le rail affiche les mêmes compteurs sur toutes les pages : il les prend ici
  // plutôt que de redemander la même chose au serveur.
  S.stats = stats;
  rail();
  const nu = !t && !tag && !query && !prem && !mod && !prix;

  render(html`
    <div>
      ${rangeeCategories(t, prix)}
      ${nu ? tuilesAccueil() : ''}

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

      <!-- Le rayon principal : sur l'accueil, « Meilleures ventes » ; ailleurs, le nom de
           la rubrique. Le menu à droite choisit ce qu'on regarde, comme « Tous les
           produits » sur les grandes boutiques. -->
      ${posts.length || !listeIA?.posts?.length ? html`
      <section class="gg-section">
        <div class="gg-tete">
          <h1 class="gg-titre">${nu ? 'Meilleures ventes' : title}${combien ? html`<small>${combien}</small>` : ''}</h1>
          <details class="gg-choix">
            <summary>${prix === 'payant' ? 'À vendre' : prix === 'gratuit' ? 'Offerts' : 'Tous les produits'}${ICON.chevron}</summary>
            <div class="gg-choix-menu">
              <a href="${link({ prix: '' })}" class="${!prix ? 'on' : ''}">Tous les produits</a>
              <a href="${link({ prix: 'payant' })}" class="${prix === 'payant' ? 'on' : ''}">À vendre</a>
              <a href="${link({ prix: 'gratuit' })}" class="${prix === 'gratuit' ? 'on' : ''}">Offerts</a>
              ${stats?.gems || stats?.notes ? Object.entries(SORTS).map(([k, label]) => html`<a href="${link({ s: k })}" class="${sort === k ? 'on' : ''}">Trier : ${label}</a>`) : ''}
            </div>
          </details>
        </div>
      ${prix === 'payant' && !query && !tag ? html`<p class="about-type">${ICON.etiquette} Des fichiers prêts à servir : templates, design, code, formations, audio, photos et vidéos, outils pour l’IA. L’aperçu, la description et le prix se voient librement ; le fichier s’ouvre une fois l’achat confirmé. Chaque produit est relu avant d’être mis en vente.</p>`
        : prix === 'gratuit' && !query && !tag ? html`<p class="about-type">${ICON.cadeau} Tout ce qui est offert : à lire, à copier, à installer, sans rien payer et sans créer de compte.</p>`
        : prem ? html`<p class="about-type">${ICON.lock} Drops réservés. Tu vois le sujet de chacun ; le contenu demande l’accès à l’espace privé.</p>`
        : mod ? html`<p class="about-type">${ICON.etincelle} Ce que des membres ont essayé sur ${nomModele}, et qui a marché chez eux. On range les familles, pas les versions : la version exacte est écrite à côté de chaque drop.</p>`
          : t && !query && !tag ? html`<p class="about-type">${TYPES[t].about}</p>` : ''}
        <div class="${unRayon === 'ia' ? (vueFil === 'cartes' ? 'grille' : 'list') : 'gg-grille'}" id="liste-principale">
          ${posts.length ? (() => {
            const classe = sort === 'top' && !query && !tag;
            let rang = 0;
            return posts.map(p => (unRayon === 'ia' ? item : carte)(p, classe && !p.pinned && !p.promo && p.points > 0 ? ++rang : null));
          })() : html`
          <div class="empty">
            <!-- Une rubrique vide disait « Rien ici pour l'instant » : un constat,
                 et une impression de site mort. Elle dit maintenant à qui arrive
                 que la place est libre, ce qui est à la fois vrai et accueillant. -->
            ${query ? html`Aucun résultat pour « ${query} ».<br>Essaie un mot plus court, ou parcours les rubriques.<br>`
              // Le rayon « À vendre » vide : pas de faux « bientôt », mais une invitation
              // à ceux qui fabriquent, avec la règle du jeu écrite en clair.
              : prix === 'payant' ? html`<b>Rien n’est encore en vente.</b><br>Si tu fabriques des skills, des prompts ou des guides, tu peux vendre les tiens ici : tu fixes le prix, et tu reçois ce qui est vendu, moins ${S.marche?.commission ?? 5} % pour la plateforme.<br>`
              : t ? html`${TYPES[t].plural} : personne n’a encore rien posé ici.<br>Tu peux être la première personne à le faire.<br>`
                : html`Rien ici pour l’instant.<br>`}
            ${stats.tags.length && query ? html`<div class="tagcloud center">${stats.tags.slice(0, 8).map(x => tagLink(x.tag))}</div>` : ''}
            <!-- Sur la copie publiée, personne ne peut s'inscrire : pas de bouton qui y mène. -->
            ${STATIQUE ? '' : prix === 'payant'
              ? html`<a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${ICON.etiquette}${S.me ? 'Mettre un produit en vente' : 'Rejoindre pour vendre'}</a>`
              : html`<a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'New drop' : 'Rejoindre pour faire un drop'}</a>`}</div>`}
        </div>
        ${suite ? html`<div class="plus"><button class="btn" data-action="plus" data-cible="liste-principale" data-suite="${suite}" data-params="${params}&rayon=${unRayon || 'produits'}">Voir plus<span class="muted"> · ${combien - posts.length} restants</span></button></div>` : ''}
      </section>` : ''}

      <!-- Le rayon de l'IA : les skills, prompts, agents et le reste gardent leurs cartes. -->
      ${listeIA?.posts?.length ? html`
      <section class="gg-section">
        <div class="gg-tete">
          <h2 class="gg-titre">${nu ? 'Pour travailler avec Claude et l’IA' : 'Skills, prompts et outils IA'}<small>${listeIA.total}</small></h2>
        </div>
        <div class="grille" id="liste-ia">${listeIA.posts.map(p => carte(p))}</div>
        ${listeIA.suite ? html`<div class="plus"><button class="btn" data-action="plus" data-cible="liste-ia" data-suite="${listeIA.suite}" data-params="${params}&rayon=ia">Voir plus<span class="muted"> · ${listeIA.total - listeIA.posts.length} restants</span></button></div>` : ''}
      </section>` : ''}

      <!-- Le colophon. Ce qui remplissait la colonne de droite se lit mieux à la
           fin du catalogue, en petit : c'est la fin de l'objet, pas un encart
           qu'on double à chaque défilement. -->
      <div class="colophon">
        <section>
          <h3>Ce site</h3>
          <p>Ce qui est ici est trié et relu par une personne avant d’être publié, à vendre ou offert : rien n’y entre parce qu’un robot l’a trouvé populaire. Le catalogue de départ est signé <b>@makers.si</b>. Les membres y ajoutent leurs propres produits — vendus à leur prix, ou offerts — relus de la même façon et signés de leur nom.</p>
          <p class="muted">${stats.members} membre${stats.members > 1 ? 's' : ''} · ${stats.posts} drops · ${stats.gems} gemmes données.</p>
          ${colls?.collections?.length ? html`<p><a href="#/collections">${stats.collections} parcours composés par des membres →</a></p>` : ''}
        </section>
        <section>
          <h3>Le classement</h3>
          <p>Tu reçois quelques gemmes par semaine. Donne-les à ce qui t’a vraiment servi : une gemme pèse lourd, une étoile un peu. C’est ce qui fait monter un drop dans le <a href="#/top">Top 5</a>.</p>
        </section>
        <section>
          <h3>Les règles</h3>
          <ol>
            <li>Chaque drop est validé avant publication.</li>
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

  // Un repère de temps, lisible dans les outils du navigateur (Performance) : quand le
  // fil s'est dessiné, et d'où venaient ses données. C'est ce qui permet de vérifier,
  // sur une vraie ligne, que la réouverture n'attend plus le réseau.
  if (!performance.getEntriesByName('fil-affiche').length) performance.mark('fil-affiche', { detail: vu ? 'appareil' : 'serveur' });

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
      <a class="back" href="#/">← Tous les drops</a>
      <h1 class="page-title">${ICON.cup}Le Top 5</h1>
      <p class="page-sub">Les points viennent des gemmes et des étoiles : une gemme vaut dix points, et chaque étoile donnée en vaut deux. Les gemmes sont rares (${S.me ? S.me.gemsLeft + ' restantes cette semaine pour toi' : 'quelques-unes par membre et par semaine'}), c’est ce qui rend le classement difficile à truquer.</p>
      ${Object.keys(PERIODES).map(k => topBloc(k, data[k]))}
      <div class="post-actions"><a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'New drop' : 'Créer mon compte'}</a><a class="btn" href="#/">Voir la bibliothèque</a></div>
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
      <div class="narrow"><a class="back" href="#/">← Tous les drops</a>
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
      <a class="back" href="#/">← Tous les drops</a>
      <header class="profil-tete">
        <span class="profil-rond rond" data-teinte="${empreinte(profil.pseudo) % 10}" aria-hidden="true">${profil.pseudo.slice(0, 1).toUpperCase()}</span>
        <div class="profil-nom">
          <h1>@${profil.pseudo}</h1>
          <p class="muted">${mois ? `Membre depuis ${mois}` : 'Membre de la communauté'}${
            profil.premium ? html` · ${ICON.lock}${pluriel(profil.premium, 'drop')} dans l’espace privé` : ''}</p>
        </div>
        ${moi && !STATIQUE ? html`<a class="btn ghost" href="#/mes-partages">Gérer mes drops</a>` : ''}
      </header>
      ${moi ? html`<div class="notice">C’est ce que les autres membres voient de toi. Ton email n’y est jamais.</div>` : ''}

      <div class="profil-chiffres">
        <div><b>${profil.posts}</b><span>${profil.posts > 1 ? 'drops' : 'drop'}</span></div>
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
        <h2 class="profil-titre">${profil.posts > 1 ? 'Ses drops' : 'Son drop'}<small>le mieux élu d’abord</small></h2>
        <div class="${vueFil === 'cartes' ? 'grille' : 'list'}">${posts.map(p => item(p))}</div>`
        : html`<div class="empty">${moi
            ? html`Tu n’as encore rien de publié.<br><a class="btn primary" href="#/partager">New drop</a>`
            : 'Rien de publié pour l’instant.'}</div>`}
    </div>`);
}

// La fiche d'un produit, comme sur les grandes boutiques de produits digitaux : à
// gauche l'affiche, au centre le titre, ce qu'on reçoit, l'encadré « À savoir » et la
// description ; à droite la carte d'achat, qui reste à l'écran pendant qu'on lit.
function boutonAchat(p) {
  const f = p.file;
  const telecharger = f ? html`<a class="gg-acheter" href="${f.href}" target="_blank" rel="noopener">${f.ext === 'pdf' ? 'Ouvrir le PDF' : 'Télécharger'}</a>`
    : p.url ? html`<a class="gg-acheter" href="${p.url}" target="_blank" rel="noopener noreferrer nofollow">Ouvrir le lien</a>`
      : html`<a class="gg-acheter" href="#contenu" data-action="vers-contenu">Voir le contenu</a>`;
  if (!p.locked) {
    return html`${telecharger}<p class="gg-achat-note">${p.prix ? 'Il est à toi : tu peux le retélécharger quand tu veux.' : 'Gratuit, sans compte et sans inscription.'}</p>`;
  }
  if (STATIQUE || !S.marche?.ouvert) {
    return html`<button class="gg-acheter" type="button" disabled>Bientôt en vente</button>
      <p class="gg-achat-note">La vente n’est pas encore ouverte : ce produit pourra s’acheter très bientôt.</p>`;
  }
  return S.me
    ? html`<button class="gg-acheter" type="button" data-action="acheter" data-id="${p.id}" data-prix="${p.prix} ${p.devise || ''}">Acheter</button>
      <p class="gg-achat-note">Tu reçois une référence et l’adresse où payer. Le fichier s’ouvre dès que le paiement est vérifié.</p>`
    : html`<a class="gg-acheter" href="#/rejoindre">Acheter</a>
      <p class="gg-achat-note">Il faut un compte pour acheter : il se crée en une minute.</p>`;
}
function ficheProduit(p) {
  const a = p.affiche, i = p.images?.[0];
  const f = p.file || (p.has?.fichier ? { ext: p.has.fichier.ext, size: p.has.fichier.size } : null);
  const recu = [
    f ? `Fichier ${f.ext.toUpperCase()} · ${size(f.size)}` : p.url ? `Lien · ${domain(p.url)}` : 'Contenu à lire en ligne',
    (p.content || p.has?.content) ? 'Mode d’emploi inclus' : '',
    ...(p.has?.chemins || (p.tree || []).map(x => x.path)).slice(0, 6),
  ].filter(Boolean);
  // L'aperçu lisible du produit (la vraie page d'une facture, d'un CV…) : sur la fiche
  // d'un produit fermé, c'est la couverture ; sur un produit ouvert, sa première image.
  const apercu = i && (i.couverture || !p.locked) ? i : null;
  return html`
    <nav class="gg-fil" aria-label="Fil d’Ariane"><a href="#/">Accueil</a>${ICON.suivant}<a href="#/?t=${p.type}">${TYPES[p.type]?.plural || p.type}</a>${ICON.suivant}<span>${fr(p.title)}</span></nav>
    ${p.status === 'pending' ? html`<div class="notice">En attente de validation. Toi seul(e) vois ce drop pour l’instant.</div>` : ''}
    ${p.status === 'rejected' ? html`<div class="notice bad">Refusé${p.rejectReason ? ' : ' + p.rejectReason : '.'}</div>` : ''}
    <div class="gg-fiche">
      <div class="gg-fiche-image">
        ${a ? html`<a href="${a.src}" target="_blank" rel="noopener"><img src="${a.src}" width="1000" height="1000" alt="${p.title}"></a>`
          : i ? html`<a href="${i.src}" target="_blank" rel="noopener"><img src="${i.src}" alt="${p.title}" class="contenue"></a>`
            : html`<div class="pack-hero k-${p.type}" aria-hidden="true">${boite(p)}</div>`}
      </div>
      <div class="gg-fiche-centre">
        <h1>${fr(p.title)}</h1>
        <div class="gg-note">
          ${p.starsCount ? html`<span>★ ${String(p.stars).replace('.', ',')}</span><span>·</span><span>${p.starsCount} note${p.starsCount > 1 ? 's' : ''}</span><span>·</span>` : ''}
          <span>${p.commentsCount ? `${p.commentsCount} avis` : 'Nouveau'}</span>
          <span class="gg-note-fav">${gemButton(p, { coeur: true })}</span>
        </div>
        <div class="gg-fiche-achat-mobile">
          <div class="gg-achat-prix">${p.prix ? html`${prixLisible(p.prix)} ${p.devise || 'DA'}` : 'Offert'}</div>
        </div>
        <div class="gg-options">
          <div class="gg-options-titre">Ce que tu reçois<span>*</span></div>
          <div class="gg-puces">${recu.map((x, k) => html`<span class="gg-puce${k === 0 ? ' on' : ''}">${x}</span>`)}</div>
        </div>
        <div class="gg-asavoir">
          <p class="gg-asavoir-titre">${ICON.infoRond}À savoir</p>
          <p>${p.locked
            ? 'Le paiement se fait par versement. Dès qu’il est vérifié, le fichier s’ouvre ici et dans « Mes achats », et tu peux le retélécharger quand tu veux.'
            : 'Ce produit est offert : le téléchargement démarre tout de suite, sans compte. Chaque produit est relu par makers.si avant d’être publié.'}</p>
        </div>
        <section class="gg-apropos" id="contenu">
          <h2>À propos du produit</h2>
          <div class="gg-apropos-corps">
            <p class="lead">${fr(p.description)}</p>
            ${apercu ? html`<figure class="gg-apercu"><a href="${apercu.src}" target="_blank" rel="noopener"><img src="${apercu.src}" alt="Aperçu : ${p.title}" loading="lazy"></a><figcaption>Aperçu du produit</figcaption></figure>` : ''}
            ${postBody(p, { fiche: true })}
            ${p.tags.length ? html`<div class="fiche-tags">${p.tags.map(tagLink)}</div>` : ''}
          </div>
        </section>
        ${p.locked ? html`<section class="gg-avis"><h2>Avis <span>0</span></h2><p class="muted">Pas encore d’avis sur ce produit.</p></section>` : ''}
      </div>
      <aside class="gg-achat">
        <div class="gg-achat-carte">
          <div class="gg-achat-prix">${p.prix ? html`${prixLisible(p.prix)} ${p.devise || 'DA'}` : 'Offert'}</div>
          <div class="gg-vendeur">${auteurLien(p)}<span>· ${TYPES[p.type]?.label || p.type}</span></div>
          ${boutonAchat(p)}
          <details class="gg-securite"><summary>${ICON.bouclier}Chaque produit est relu avant d’être publié${ICON.chevron}</summary>
            <p>makers.si vérifie chaque produit avant de le mettre en ligne : le fichier s’ouvre, il correspond à la description, il ne contient rien de dangereux. Un souci ? <a href="#/aide">L’aide répond</a>.</p>
          </details>
        </div>
      </aside>
    </div>`;
}

async function postView(id) {
  // Déjà vu dans une liste : la fiche s'affiche tout de suite, sans attendre le serveur.
  const deja = vus.get(id);
  if (deja) dessinePost(deja, []);
  let p;
  try { p = (await api('/posts/' + id)).post; } catch { if (deja) return; return render(html`<div class="narrow"><a class="back" href="#/">← Retour</a><div class="empty">Ce drop n’existe pas ou n’est pas encore publié.</div></div>`); }
  let reponses = [];
  if (!p.locked) {
    try { reponses = (await api(`/posts/${id}/comments`)).comments || []; } catch { reponses = []; }
  }
  // Entre-temps, on a pu ouvrir une autre page : on ne réécrit pas celle-là.
  if ((location.hash.slice(1) || '/').split('?')[0] !== '/p/' + id) return;
  const y = window.scrollY;
  dessinePost(p, reponses);
  if (deja) window.scrollTo(0, y);
}

function dessinePost(p, reponses) {
  document.title = p.title + ' – makers.si';
  render(html`
    <div class="narrow post k-${p.type}${enBoutique(p) ? ' fiche' : ''}">
      <a class="back" href="#/">← Tous les drops</a>
      ${enBoutique(p) ? ficheProduit(p) : html`
      ${p.images?.[0]?.couverture
        // Un produit en vente montre son aperçu à plat et en grand, avant tout le reste :
        // c'est ce que l'acheteur veut voir. Collé sur la face d'une boîte, il devenait
        // illisible, et la photo lisible était rangée sous la carte d'achat.
        ? html`<figure class="vitrine-vente${p.images[0].vitrine ? '' : ' petite'}">
            <a href="${p.images[0].src}" target="_blank" rel="noopener"><img src="${p.images[0].src}" width="${p.images[0].w}" height="${p.images[0].h}" alt="Aperçu : ${p.title}"></a>
            <figcaption>Aperçu${p.images[0].vitrine ? ' · touche pour l’agrandir' : ''}</figcaption>
          </figure>`
        : p.type !== 'lien' ? html`<div class="pack-hero k-${p.type}" aria-hidden="true">${boite(p)}</div>` : ''}
      ${p.status === 'pending' ? html`<div class="notice">En attente de validation. Toi seul(e) vois ce drop pour l’instant.</div>` : ''}
      ${p.status === 'rejected' ? html`<div class="notice bad">Refusé${p.rejectReason ? ' : ' + p.rejectReason : '.'}</div>` : ''}
      <div>${kind(p.type)}${p.premium ? html` <span class="pin lock">${ICON.lock}espace privé</span>` : ''}${p.promo ? html` ${sponsoBadge(p)}` : ''}</div>
      <h1>${fr(p.title)}</h1>
      <div class="post-meta">${auteurLien(p)}<span>${ago(p.approvedAt || p.createdAt)}</span>${
        p.modele ? html`<span class="modele-ligne">essayé sur ${modeleBadge(p)}</span>` : ''}${p.tags.map(tagLink)}</div>
      ${postBody(p, { howto: true })}`}
      <!-- Sur la copie publiée, la barre d'actions ne contient que ce qui a quelque
           chose à dire : pas d'étoiles cliquables qui ne noteront rien, pas de
           « Pas encore noté » répété sous chaque drop. -->
      ${p.status === 'approved' || !p.status ? html`${STATIQUE && !p.gems && !p.starsCount ? '' : html`<div class="post-actions">
          ${gemButton(p)}
          ${STATIQUE || !p.gems ? '' : html`<span class="muted">${p.gems} gemme${p.gems > 1 ? 's' : ''}</span>`}
          ${STATIQUE && !p.starsCount ? '' : html`
            <span class="sep"></span>
            ${starsView(p, { interactive: !STATIQUE })}
            <span class="muted" data-stars-label="${p.id}">${p.starsCount
              ? `${String(p.stars).replace('.', ',')} sur 5 · ${p.starsCount} note${p.starsCount > 1 ? 's' : ''}`
              // Une note vide ne dit rien de bon : on laisse les étoiles inviter seules.
              : ''}</span>`}
        </div>`}
        ${reponsesView(p, reponses)}
        <details class="report"><summary>Signaler ce drop</summary>
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
      <div class="admin-head"><h1 class="page-title">Mon compte</h1><a class="btn ghost" href="#/mes-partages">← Mes drops</a></div>
      <div class="block"><div class="attach"><div><b>@${S.me.pseudo}</b><small>${S.me.email}</small></div></div></div>

      <h2 class="faq-title">Mes données</h2>
      <p class="muted">Télécharge tout ce que le site garde sur toi (compte, drops, votes) dans un fichier lisible.</p>
      <a class="btn" href="/api/me/export" download>Télécharger mes données</a>
      <p class="switch">Détails dans la <a href="#/confidentialite">politique de confidentialité</a>.</p>

      <h2 class="faq-title">Supprimer mon compte</h2>
      <p class="muted">C’est définitif. Tes drops en attente ou refusés sont supprimés. Pour tes drops publiés, tu choisis.</p>
      <form data-form="delete-account" novalidate>
        <div class="field"><label for="d-pw">Mot de passe</label><input id="d-pw" type="password" name="password" autocomplete="current-password" required></div>
        <div class="field"><label class="check"><input type="checkbox" name="deletePosts"><span>Supprimer aussi mes drops publiés (sinon ils restent, sans mon pseudo).</span></label></div>
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
  // Une carte centrée, comme les pages de connexion d'aujourd'hui : on vient faire une
  // seule chose ici, rien d'autre ne doit attirer l'œil.
  render(html`
    <div class="narrow auth">
      <div class="auth-carte">
      <h1 class="page-title">${join ? 'Rejoindre la communauté' : 'Connexion'}</h1>
      <p class="page-sub">${join ? 'Gratuit. Ton email reste privé, il sert seulement à te recontacter si besoin.' : 'Content de te revoir.'}</p>
      ${join ? html`
        <ul class="atouts">
          <li>${ICON.doc}<span><b>Lire</b> les skills, prompts et guides</span></li>
          <li>${ICON.plus}<span><b>Faire un drop</b>, relu avant publication</span></li>
          <li>${ICON.gem}<span><b>Voter</b> pour faire remonter le meilleur</span></li>
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
        <button class="btn primary auth-envoi" type="submit">${join ? 'Créer mon compte' : 'Me connecter'}</button>
        ${join ? html`<p class="switch">Une vérification anti-robot tourne toute seule à l’envoi. Il n’y a pas d’image à déchiffrer, et rien n’est envoyé à un service extérieur.</p>` : ''}
      </form>
      </div>
      <p class="switch">${join ? html`Déjà membre ? <a href="#/connexion">Connexion</a>` : html`Pas encore de compte ? <a href="#/rejoindre">Rejoindre</a>`}</p>
    </div>`);
  // Le défi est demandé dès l'ouverture de la page : au moment de l'envoi, il est prêt,
  // et le temps écoulé prouve déjà que le formulaire n'a pas été rempli par un script.
  if (join) getChallenge().catch(() => {});
}

function shareView(q) {
  if (!S.me) { go('#/rejoindre'); return; }
  // Sans type demandé, la première famille de la liste : makers.si vend de tout, pas
  // d'abord des skills.
  const first = TYPES[q.get('type')] ? q.get('type') : Object.keys(TYPES)[0];
  render(html`
    <div class="narrow">
      <h1 class="page-title">New drop</h1>
      <p class="page-sub">Trois minutes. Ton drop sera relu avant d’apparaître dans la bibliothèque.</p>
      <form data-form="share" enctype="multipart/form-data" novalidate>
        <h2 class="step"><span>1</span>Qu’est-ce que tu partages ?</h2>
        <div class="typecards">
          ${Object.entries(TYPES).map(([k, v]) => html`<input type="radio" name="type" id="t-${k}" value="${k}" ${k === first ? 'checked' : ''}>
            <label for="t-${k}" class="k-${k}"><i class="tc-ico">${ICON[TYPE_ICONE[k]] || ''}</i><b>${v.label}</b><span>${v.hint}</span><em>${v.example}</em></label>`)}
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
          <small>PDF jusqu’à ${Math.round(S.limits.pdfKb / 1024)} Mo ; ZIP, MD ou TXT jusqu’à ${S.limits.fileMb} Mo. Une vidéo se met dans le ZIP, ou se partage par un lien.</small>
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
          <small>5 maximum, séparés par des virgules. Ils aident à retrouver ton drop.</small></div>
        <div class="field" data-field="prix"><label for="s-prix">Prix <span class="muted">(facultatif — laisse vide pour offrir)</span></label>
          <input id="s-prix" type="number" name="prix" min="0" step="1" placeholder="0" inputmode="numeric">
          <small>Si tu mets un prix, le <b>contenu</b> ne s’ouvre qu’après l’achat ; le titre, la description et les tags restent publics, sinon personne ne saurait ce qu’il achète.
            De ${S.marche?.prixMin ?? 100} à ${S.marche?.prixMax ?? 100000} ${S.marche?.devise || 'DA'}.
            La plateforme retient <b>${S.marche?.commission ?? 5} %</b> sur chaque vente ; le reste te revient.
            Le prix passe la relecture comme le reste : l’équipe peut refuser une vente.
            Pense à dire <a href="#/mes-ventes">où te payer</a> : sans ça, ce qui t’est dû ne peut pas t’être versé.</small></div>
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
      <b>Ce PDF est trop lourd : ${(ko / 1024).toFixed(1).replace('.', ',')} Mo, soit ${fois} fois la limite de ${Math.round(limite / 1024)} Mo.</b>
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
      <p>Mets-le sur Drive, Dropbox ou ton site, et colle son adresse dans le champ <b>Lien</b> ci-dessus. Un drop « PDF » accepte très bien un lien à la place du fichier.</p>
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
      <p class="page-sub">« ${p.title} » est en attente de validation. Tu le retrouves dans « Mes drops » avec son statut.</p>
      <ul class="steps"><li><b>Maintenant</b> : ton drop est enregistré${p.imagesProcessing ? ' et tes photos sont compressées en arrière-plan' : ''}.</li>
        <li><b>Ensuite</b> : il est relu. Si tout est bon il apparaît dans la bibliothèque.</li>
        <li><b>Si refusé</b> : tu vois le motif dans « Mes drops ».</li></ul>
      <div class="post-actions"><a class="btn primary" href="#/mes-partages">Mes drops</a><a class="btn" href="#/partager">Un autre drop</a></div>
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
        <a class="tile" href="#/partager"><b>Mon premier drop</b><span>Un skill, un prompt, une idée : ça prend trois minutes.</span></a>
        <a class="tile" href="#/top"><b>Voir le Top 5</b><span>Semaine, mois, depuis le début.</span></a>
      </div>
      <p class="muted">Tout drop est relu avant publication. Pas de vidéo importée : colle le lien.</p>
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
      <a class="back" href="#/">← Tous les drops</a>
      <h1 class="page-title">${ICON.megaphone}Mettre un drop en avant</h1>
      <p class="page-sub">Une place en haut du fil, pour quelques jours. ${prix}.</p>

      <div class="notice">
        <b>Ce qui s’achète est la place, jamais la publication.</b> Un drop sponsorisé passe
        exactement la même relecture que les autres, et il est refusé s’il ne respecte pas
        la <a href="#/charte">charte</a>. Payer n’achète ni gemme, ni étoile, ni point :
        le <a href="#/top">Top 5</a> reste décidé par la communauté seule.
      </div>

      <ol class="steps">
        <li><b>Publie ton drop normalement.</b> Il est relu comme les autres. Un drop
          refusé ne peut pas être mis en avant, et l’argent n’y change rien.</li>
        <li><b>Écris-nous</b> avec l’adresse du drop et le nombre de jours voulus.</li>
        <li><b>Tu paies</b> (virement ou lien de paiement), puis la place est posée à la main.</li>
        <li><b>Elle s’arrête toute seule</b> à la date prévue. Rien à résilier.</li>
      </ol>

      <h2 class="faq-title">Les règles, en clair</h2>
      <ul class="guide">
        <li>Le drop porte la mention <span class="pin sponso">${ICON.megaphone}sponsorisé</span> tant que la place dure. Elle n’est jamais cachée.</li>
        <li>Il y a <b>${o?.places ?? 2} places</b> au maximum en même temps${o && typeof o.libres === 'number' ? html` (${o.libres} libre${o.libres > 1 ? 's' : ''} en ce moment)` : ''}, pour que le haut du fil reste lisible.</li>
        <li>Les épingles de l’équipe passent devant : ce que le site tient à montrer ne se fait pas doubler.</li>
        <li>Un drop de l’espace privé ne peut pas être mis en avant : il n’est pas dans le fil.</li>
        <li>Si un drop est retiré après un signalement, sa place s’arrête. On en reparle au cas par cas.</li>
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
        <li><b>Récompense ce qui t’a servi.</b> La gemme à gauche de chaque drop le fait remonter dans le classement. Tu en reçois quelques-unes par semaine : donne-les à ce qui le mérite vraiment. Les étoiles, de 1 à 5, disent la qualité et ne coûtent rien.</li>
        <li><b>Drop.</b> Crée ton compte, clique « New drop », choisis ce que tu apportes et remplis le formulaire. Il est relu puis publié.</li>
      </ol>
      <div class="post-actions"><a class="btn primary" href="${S.me ? '#/partager' : '#/rejoindre'}">${S.me ? 'New drop' : 'Créer mon compte'}</a><a class="btn" href="#/">Voir la bibliothèque</a></div>

      <h2 class="faq-title">Questions fréquentes</h2>
      <details class="faq"><summary>Je dois créer un compte pour lire ?</summary><p>Non. Tout le contenu public est lisible sans compte. Le compte sert à partager, à donner des gemmes et des étoiles, et à demander l’accès à l’espace privé.</p></details>
      <details class="faq"><summary>Qui peut répondre sous un drop ?</summary><p>N’importe quel membre connecté. Contrairement aux drops, une réponse n’est pas relue avant d’apparaître : elle s’affiche tout de suite, signée de ton pseudo. Tu peux supprimer les tiennes à tout moment, et l’admin peut supprimer n’importe laquelle. Si une réponse pose problème, signale le drop : le fil est relu avec lui.</p></details>
      <details class="faq"><summary>C’est quoi les gemmes et les étoiles ?</summary><p>Les étoiles notent la qualité, de 1 à 5, et ne coûtent rien. Les gemmes sont rares : tu en reçois quelques-unes par semaine et tu en donnes au maximum une par drop. On ne peut ni gemmer ni noter son propre drop.</p></details>
      <details class="faq"><summary>Comment marche le Top 5 ?</summary><p>Chaque drop a des points : une gemme vaut 10 points, et chaque étoile reçue en vaut 2 (cinq étoiles d’une personne = 10 points). Le <a href="#/top">Top 5</a> existe en trois versions : la semaine et le mois comptent les drops publiés sur cette période, « depuis le début » compte tout.</p></details>
      <details class="faq"><summary>Comment marche un sondage ?</summary><p>Celui qui le crée écrit la question en titre et 2 à 6 réponses. Chaque membre vote une fois et peut changer d’avis ; cliquer de nouveau sa réponse retire le vote. Les résultats s’affichent une fois qu’on a voté.</p></details>
      <details class="faq"><summary>C’est quoi l’espace privé ?</summary><p>Une section à part, marquée d’un cadenas, qui contient des drops réservés. Tout le monde voit le sujet, mais le contenu demande un accès. Aujourd’hui il se donne à la main : écris-nous pour le demander.</p></details>
      <details class="faq"><summary>On peut payer pour être en haut ?</summary><p>Oui, et c’est écrit dessus : un drop dont la place a été payée porte la mention « sponsorisé » tant qu’elle dure. Ce qui s’achète est la place, jamais la publication — le drop passe la même relecture que les autres, et payer ne donne ni gemme, ni étoile, ni point. <a href="#/mise-en-avant">Voir comment ça marche</a>.</p></details>
      <details class="faq"><summary>C’est quoi une collection ?</summary><p>Un parcours : des drops déjà publiés, remis dans l’ordre où on devrait les lire, avec un mot sur chacun. « Démarrer avec Claude Code en une soirée », par exemple. Tu n’écris rien de neuf — tu ranges, et ranger demande du jugement. Clique « Composer » depuis <a href="#/collections">les collections</a>, choisis au moins deux drops, et envoie : elle est relue comme un drop. La modifier la renvoie en relecture, sauf si tu ne touches qu’aux notes.</p></details>
      <details class="faq"><summary>Comment je sais que mon drop est passé ?</summary><p>La cloche en haut à droite s’allume. Tu es prévenu quand un de tes drops ou une de tes collections est publié ou refusé (avec le motif), quand quelqu’un répond sous un de tes drops, quand on commande ce que tu vends, et quand un achat que tu as fait est confirmé. <b>Rien n’est envoyé par email ni poussé sur ton téléphone</b> : la liste t’attend sur <a href="#/notifications">Ce qui s’est passé</a>, et elle ne garde que les trois derniers mois. Ouvrir la page marque tout comme lu, mais n’efface rien.</p></details>
      <details class="faq"><summary>C’est quoi « essayé sur » ?</summary><p>Devant un prompt ou un agent, la première question est « ça marche sur quoi ? » — le même prompt peut être excellent sur un modèle et inutile sur un autre. Quand tu partages un skill, un agent, un serveur MCP ou un prompt, tu peux donc dire sur quel modèle tu l’as essayé. On range les <b>familles</b> (Claude, GPT, Gemini…) et tu écris la version à côté (« Opus 5 »), parce qu’une famille dure des années quand une version est périmée en deux mois. Le rail de gauche te laisse alors tout filtrer : « montre-moi ce qui tourne sur Claude ». C’est facultatif, et mieux vaut le laisser vide que de deviner : annoncer un modèle qu’on n’a pas essayé, c’est refusé par la <a href="#/charte">charte</a>.</p></details>
      <details class="faq"><summary>Un agent, un serveur MCP : quelle différence avec un skill ?</summary><p>Un <b>skill</b> est un mode d’emploi que Claude lit tout seul quand ta demande correspond : tu le poses dans un dossier et tu l’oublies. Un <b>agent</b> fait un travail du début à la fin sans toi — il boucle, il se sert d’outils, et il s’arrête quand c’est fini ou quand il a besoin de toi. Un <b>serveur MCP</b> ne fait rien tout seul : il <i>donne</i> des outils à un modèle (une base de données, des fichiers, une API), et c’est le modèle qui s’en sert. En résumé : le skill explique, l’agent exécute, le MCP branche.</p></details>
      <details class="faq"><summary>Je peux vendre un skill que j’ai écrit ?</summary><p>Oui. Mets un prix dans le formulaire de drop : le <b>contenu</b> ne s’ouvre alors qu’après l’achat, mais le titre, la description et les tags restent publics — sinon personne ne saurait ce qu’il achète. Ton drop passe la même relecture que les autres, et l’équipe peut refuser une vente comme elle refuse un contenu. La plateforme retient ${S.marche?.commission ?? 5} % sur chaque vente, le reste te revient. Tu suis tout dans <a href="#/mes-ventes">Mes ventes</a>, et c'est là aussi que tu indiques <b>où être payé</b> (CCP ou BaridiMob) : sans ça, ce qui t'est dû ne peut pas t'être reversé. Ces coordonnées ne sont visibles que de toi et de l'équipe.</p></details>
      <details class="faq"><summary>Comment se passe un achat ?</summary><p>Tu cliques « Acheter » : ça enregistre une commande, ça ne prend pas d’argent. Tu arrives alors sur <a href="#/mes-achats">Mes achats</a>, qui te donne trois étapes : <b>1.</b> envoie le montant au CCP ou au compte BaridiMob indiqué ; <b>2.</b> écris ta <b>référence de commande</b> (elle commence par MK-) dans le motif du versement ; <b>3.</b> envoie la capture du versement, avec ta référence, au contact indiqué. Dès que le versement est vérifié, le contenu s’ouvre et la cloche, en haut, te prévient. Tu retrouves tout ça à tout moment dans Mes achats.</p></details>
      <details class="faq"><summary>Pourquoi une vérification à l’inscription ?</summary><p>Pour bloquer les robots qui créent des comptes en masse. Elle se fait toute seule en une seconde, il n’y a pas d’image à déchiffrer, et aucun service extérieur n’est appelé.</p></details>
      <details class="faq"><summary>Comment partager une vidéo ?</summary><p>On n’héberge pas de vidéo : la bibliothèque garde les skills, les prompts, les idées et les PDF. Mets ta vidéo sur YouTube, Drive ou Vimeo, puis fais un drop de type « Lien » : le nom de la vidéo en titre, son adresse dans le lien.</p></details>
      <details class="faq"><summary>Comment utiliser un skill ?</summary><p>${HOWTO}</p></details>
      <details class="faq"><summary>Pourquoi mon drop n’apparaît pas ?</summary><p>Chaque drop est relu avant d’être publié. Tu vois son statut dans « Mes drops » : en attente, publié ou refusé (avec le motif).</p></details>
      <details class="faq"><summary>Pourquoi mon PDF est refusé ?</summary><p>Les PDF sont limités à ${Math.round(S.limits.pdfKb / 1024)} Mo. Si le tien dépasse, c’est presque toujours une image mal compressée à l’intérieur. Tu peux le réduire sur ton ordinateur (sur Mac : Aperçu → Exporter → Filtre Quartz → « Reduce File Size »), passer par un outil en ligne, ou simplement l’héberger ailleurs et coller le lien : un drop « PDF » accepte un lien à la place du fichier. Le formulaire te donne les trois solutions au moment où tu choisis le fichier.</p></details>
      <details class="faq"><summary>Quelles photos puis-je ajouter ?</summary><p>JPG, PNG ou WebP, trois par drop, 10 Mo chacune. Elles sont réduites automatiquement et la position GPS est effacée.</p></details>
      <details class="faq"><summary>Je peux supprimer un de mes drops ?</summary><p>Oui, depuis « Mes drops », bouton « Supprimer ».</p></details>

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
      <span class="coll-compte">${ICON.lignes}${c.count} drop${c.count > 1 ? 's' : ''}</span>
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
      <a class="back" href="#/">← Tous les drops</a>
      <div class="admin-head">
        <div><h1 class="page-title">${ICON.lignes}Les collections</h1>
          <p class="page-sub">Des parcours composés par des membres à partir de ce qui existe déjà. Par où commencer, dans quel ordre, et pourquoi.</p></div>
        ${STATIQUE ? '' : html`<a class="btn primary" href="#/collection">${ICON.plus}Composer</a>`}
      </div>
      ${collections.length
        ? html`<div class="coll-liste">${collections.map(collCarte)}</div>`
        : html`<div class="empty">Aucune collection pour l’instant.<br>La première est à composer : choisis cinq drops qui vont ensemble et dis pourquoi.<br>
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
      <div class="post-meta">${auteurLien(c)}<span>${ago(c.approvedAt || c.createdAt)}</span><span>${c.count} drop${c.count > 1 ? 's' : ''}</span></div>
      <p class="lead">${fr(c.description)}</p>
      ${c.manquants ? html`<p class="muted">${c.manquants} drop${c.manquants > 1 ? 's ont' : ' a'} été retiré${c.manquants > 1 ? 's' : ''} de la bibliothèque depuis.</p>` : ''}

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
    : html`<p class="muted">Rien de choisi pour l’instant. Cherche un drop ci-dessus et ajoute-le.</p>`).s;
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
        <p class="page-sub">Choisis des drops déjà publiés, range-les dans l’ordre où on devrait les lire, et dis en un mot pourquoi chacun est là. ${neuve ? 'Elle est relue avant publication.' : 'Changer les drops ou le texte la renvoie en relecture.'}</p>
        <form data-form="collection" data-id="${id || ''}" novalidate>
          <div class="field"><label for="c-titre">Titre</label>
            <input id="c-titre" type="text" name="title" maxlength="80" required placeholder="Démarrer avec Claude Code en une soirée" value="${compo.title}">
            <small>Ce qu’on obtient en suivant le parcours, pas son thème.</small></div>
          <div class="field"><label for="c-desc">À qui ça sert</label>
            <textarea id="c-desc" name="description" rows="3" maxlength="500" required placeholder="Pour qui débute et ne sait pas par quel bout prendre les skills. À lire dans l’ordre.">${compo.description}</textarea></div>

          <div class="field"><label for="compo-q">Ajouter des drops</label>
            <input id="compo-q" type="text" autocomplete="off" placeholder="Cherche un titre, un tag…">
            <small>De 2 à 30 drops. Seuls les drops publiés peuvent être ajoutés.</small>
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
        <div><a class="btn ghost" href="#/mes-partages">Mes drops</a> <a class="btn ghost" href="#/mes-achats">Mes achats</a></div></div>
      <p class="page-sub">La plateforme retient ${d.taux} % sur chaque vente. Le reste t’est reversé à la main : ce tableau dit ce qui t’est dû.</p>
      <div class="profil-chiffres">
        <div><b>${d.ventes.filter(v => v.status === 'paye').length}</b><span>vendus</span></div>
        <div><b>${d.total} ${d.devise}</b><span>encaissés en tout</span></div>
        <div><b>${d.commission} ${d.devise}</b><span>retenus par la plateforme</span></div>
        <div><b>${d.du} ${d.devise}</b><span>à te reverser</span></div>
      </div>
      ${blocVersement(d)}
      ${d.ventes.length
        ? html`<table class="table"><thead><tr><th>Drop</th><th>Acheteur</th><th>Prix</th><th>Pour toi</th><th>État</th></tr></thead><tbody>
            ${d.ventes.map(v => html`<tr>
              <td><a href="#/p/${v.postId}">${v.titre}</a></td>
              <td class="muted">@${v.acheteur}</td>
              <td class="mono">${v.prix} ${v.devise}</td>
              <td class="mono">${v.net} ${v.devise}<br><small class="muted">− ${v.commission} (${v.taux} %)</small></td>
              <td><span class="status ${v.status === 'paye' ? 'approved' : 'pending'}">${ETAT_VENTE[v.status] || v.status}</span>
                ${v.regleAt ? html`<br><small class="muted">reversé le ${new Date(v.regleAt).toLocaleDateString('fr-FR')}</small>` : ''}</td></tr>`)}
          </tbody></table>`
        : html`<div class="empty">Tu n’as encore rien vendu.<br>Mets un prix sur un drop pour commencer.<br><a class="btn primary" href="#/partager">${ICON.plus}New drop</a></div>`}
    </div>`);
}

// Où le vendeur veut être payé. Placé sur sa page de ventes, là où il regarde ce qui
// lui est dû. S'il a de l'argent à recevoir et rien de renseigné, on le lui dit
// franchement : sans ces coordonnées, il ne peut pas être payé.
function blocVersement(d) {
  const v = d.versement || {};
  const manque = !d.versement;
  return html`
    <section class="versement ${manque && d.du ? 'urgent' : ''}" aria-label="Où te payer">
      <h2>Où te payer</h2>
      ${manque && d.du
        ? html`<p class="notice bad">${d.du} ${d.devise} t’attendent, mais on ne sait pas où te les verser. Indique ton compte ci-dessous.</p>`
        : manque
          ? html`<p class="muted">Indique où recevoir l’argent de tes ventes. Tu peux le faire avant ta première vente : rien ne part tant qu’il n’y a rien à te verser.</p>`
          : html`<p class="muted">Seuls toi et l’administrateur voyez ces coordonnées, au moment de te régler. Elles n’apparaissent nulle part ailleurs.</p>`}
      <form data-form="versement" class="versement-form">
        <div class="field"><label for="v-titulaire">Titulaire du compte</label>
          <input id="v-titulaire" name="titulaire" type="text" maxlength="80" autocomplete="name" value="${v.titulaire || ''}" placeholder="Le nom tel qu’il figure à la poste">
        </div>
        <div class="duo">
          <div class="field"><label for="v-ccp">CCP</label>
            <input id="v-ccp" name="ccp" type="text" maxlength="40" inputmode="numeric" value="${v.ccp || ''}" placeholder="0012345678 clé 99">
          </div>
          <div class="field"><label for="v-baridimob">RIP BaridiMob</label>
            <input id="v-baridimob" name="baridimob" type="text" maxlength="40" inputmode="numeric" value="${v.baridimob || ''}" placeholder="20 chiffres">
          </div>
        </div>
        <small class="muted">Un des deux suffit. Pour retirer tes coordonnées, vide les trois champs.</small>
        <p class="form-error" role="alert"></p>
        <button class="btn primary" type="submit">${d.versement ? 'Mettre à jour' : 'Enregistrer'}</button>
      </form>
    </section>`;
}

// Comment payer une commande. Écrit pour être suivi sur un téléphone, une étape à la
// fois, avec un bouton pour copier ce qu'on recopierait mal : la référence et le compte.
// Si les coordonnées manquent (vente fermée depuis la commande), on le dit au lieu de
// laisser un bloc vide.
function blocPaiement(paiement, commandes) {
  const copier = (texte, libelle) => html`<button class="btn small" data-action="copier-texte" data-texte="${texte}">${ICON.copy}${libelle}</button>`;
  if (!paiement) {
    return html`<div class="notice">Ta commande est enregistrée, mais les coordonnées de paiement ne sont pas disponibles pour l’instant. Reviens sur cette page un peu plus tard.</div>`;
  }
  const total = commandes.reduce((n, a) => n + a.prix, 0);
  const devise = commandes[0]?.devise || '';
  return html`
    <section class="paiement" aria-label="Comment payer">
      <h2>Pour recevoir ${commandes.length > 1 ? 'tes produits' : 'ton produit'}</h2>
      <ol class="paiement-etapes">
        <li>
          <b>Envoie ${total} ${devise}</b>${commandes.length > 1 ? html` <span class="muted">(${commandes.length} commandes)</span>` : ''}
          ${paiement.ccp ? html`<div class="paiement-ligne"><span>CCP</span><code>${paiement.ccp}</code>${copier(paiement.ccp, 'Copier')}</div>` : ''}
          ${paiement.baridimob ? html`<div class="paiement-ligne"><span>BaridiMob</span><code>${paiement.baridimob}</code>${copier(paiement.baridimob, 'Copier')}</div>` : ''}
          ${paiement.titulaire ? html`<div class="paiement-ligne"><span>Au nom de</span><b>${paiement.titulaire}</b></div>` : ''}
        </li>
        <li>
          <b>Écris ${commandes.length > 1 ? 'tes références' : 'ta référence'} dans le motif du versement</b>
          ${commandes.map(a => html`<div class="paiement-ligne"><span>${a.titre}</span><code class="ref">${a.ref}</code>${copier(a.ref, 'Copier')}</div>`)}
          <small class="muted">${commandes.length > 1 ? 'Ce sont elles qui permettent' : 'C’est elle qui permet'} de savoir que l’argent vient de toi.</small>
        </li>
        <li>
          <b>Envoie la capture du versement, avec ${commandes.length > 1 ? 'tes références' : 'ta référence'}, à</b>
          <div class="paiement-ligne"><code>${paiement.contact}</code>${copier(paiement.contact, 'Copier')}</div>
        </li>
      </ol>
      <p class="muted">Le contenu s’ouvre dès que le versement est vérifié. La cloche, en haut, s’allume pour te prévenir.</p>
    </section>`;
}

async function achatsView() {
  if (!S.me) { go('#/connexion'); return; }
  const { achats, paiement } = await api('/me/achats');
  document.title = 'Mes achats – makers.si';
  const attente = achats.filter(a => a.status === 'en-attente');
  render(html`
    <div class="narrow">
      <div class="admin-head"><h1 class="page-title">Mes achats</h1>
        <div><a class="btn ghost" href="#/mes-ventes">Mes ventes</a> <a class="btn ghost" href="#/mes-partages">Mes drops</a></div></div>
      ${attente.length ? blocPaiement(paiement, attente) : ''}
      ${achats.length
        ? html`<table class="table"><thead><tr><th>Référence</th><th>Produit</th><th class="col-large">Vendeur</th><th>Prix</th><th>État</th></tr></thead><tbody>
            ${achats.map(a => html`<tr>
              <td class="mono nowrap">${a.ref}</td>
              <td><a href="#/p/${a.postId}">${a.titre}</a></td>
              <td class="muted col-large">@${a.vendeur}</td>
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
      <a class="back" href="#/">← Tous les drops</a>
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
            Tu seras prévenu ici quand un de tes drops sera relu, quand quelqu’un te répondra,
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
      <div class="admin-head"><h1 class="page-title">Mes drops</h1>
        <div><a class="btn primary" href="#/partager">${ICON.plus}New drop</a> <a class="btn ghost" href="#/collection">Composer</a> <a class="btn ghost" href="#/mes-ventes">Mes ventes</a> <a class="btn ghost" href="#/membre/${encodeURIComponent(S.me.pseudo)}">Mon profil public</a> <a class="btn ghost" href="#/compte">Mon compte</a> <button class="btn ghost" data-action="logout">Déconnexion</button></div></div>
      ${mesColls.collections.length ? html`
        <h2 class="profil-titre">Mes collections</h2>
        <div class="coll-liste">${mesColls.collections.map(collCarte)}</div>
        <h2 class="profil-titre">Mes drops</h2>` : ''}
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
        <p class="page-sub">Valide ou refuse les drops avant qu’ils soient publiés.</p>
        <form data-form="admin-login" novalidate>
          <div class="field"><label for="a-pw">Mot de passe admin</label><input id="a-pw" type="password" name="password" autocomplete="current-password" required>
            <small>Il est dans <span class="mono">.env</span>, à la ligne <span class="mono">ADMIN_PASSWORD</span>. Sans <span class="mono">.env</span>, le serveur en génère un dans <span class="mono">data/config.json</span>.</small></div>
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
        : tab === 'reglages' ? Promise.resolve({})
          : tab === 'reports' ? api('/admin/reports') : api('/admin/posts?status=' + tab),
  ]);
  // Les deux compteurs de l'admin suivent ce qu'il vient de faire : confirmer une
  // commande doit faire baisser son badge tout de suite, pas au prochain rechargement.
  S.pending = counts.pending; S.aConfirmer = counts.marche; header(); rail();
  const tabs = [['pending', 'À valider', counts.pending], ['reports', 'Signalés', counts.reported], ['approved', 'Publiés', counts.approved], ['rejected', 'Refusés', counts.rejected], ['promos', 'Mises en avant', counts.promos], ['collections', 'Collections', counts.collections], ['marche', 'Marché', counts.marche], ['members', 'Membres', counts.members], ['reglages', 'Réglages', null]];
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
      <div class="toolbar"><div class="tabs">${tabs.map(([k, l, n]) => html`<a href="#/admin?s=${k}" class="${tab === k ? 'on' : ''}">${l}${n === null ? '' : ` (${n})`}</a>`)}</div></div>
      ${privateNote}
      ${tab === 'reglages'
        ? html`<div class="card reglage">
            <h3>Mode nuit</h3>
            <p>${S.site?.nuit
              ? 'Autorisé. Chaque visiteur choisit entre clair, sombre, ou le réglage de son appareil.'
              : 'Bloqué. Tout le monde voit le mode clair, même avec un téléphone réglé en sombre, et le sélecteur de thème n’apparaît pas.'}</p>
            <button class="btn ${S.site?.nuit ? '' : 'primary'}" data-action="reglage-nuit" data-valeur="${S.site?.nuit ? 'non' : 'oui'}">${S.site?.nuit ? 'Bloquer le mode nuit' : 'Autoriser le mode nuit'}</button>
          </div>`
      : tab === 'members'
        ? html`<table class="table"><thead><tr><th>Pseudo</th><th>Email</th><th>Inscrit</th><th>Publiés</th><th>Espace privé</th><th></th></tr></thead><tbody>
            ${data.members.map(m => html`<tr><td>@${m.pseudo}${m.locked ? html` <span class="status rejected">bloqué</span>` : ''}</td>
              <td class="muted">${m.email}</td><td>${ago(m.createdAt)}</td><td class="mono">${m.posts}</td>
              <td><button class="btn small ${m.premium ? 'ok' : ''}" data-action="member-premium" data-id="${m.id}">${m.premium ? 'Accès accordé' : 'Donner l’accès'}</button></td>
              <td>${m.locked ? html`<button class="btn small" data-action="member-unlock" data-id="${m.id}">Débloquer</button> ` : ''}<button class="btn ghost small" data-action="member-delete" data-id="${m.id}" data-pseudo="${m.pseudo}">Supprimer</button></td></tr>`)}</tbody></table>`
        : tab === 'collections'
          ? html`
            <p class="about-type">Une collection est une recommandation signée : elle range des drops déjà publiés et dit pourquoi. On relit l’ordre et les mots, pas le contenu — il a déjà été validé.</p>
            ${data.collections.length
              ? data.collections.map(c => html`
                <div class="card">
                  <div class="post-meta">${auteurLien(c)}<span>${ago(c.createdAt)}</span><span>${c.count} drop${c.count > 1 ? 's' : ''}</span></div>
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
              ? html`<table class="table"><thead><tr><th>Référence</th><th>Date</th><th>Drop</th><th>Acheteur</th><th>Prix</th><th></th></tr></thead><tbody>
                  ${data.attente.map(a => html`<tr>
                    <td class="mono nowrap"><b>${a.ref}</b></td>
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
              ? html`<table class="table"><thead><tr><th>Vendeur</th><th>Où le payer</th><th>Ventes</th><th>Encaissé</th><th>À reverser</th><th></th></tr></thead><tbody>
                  ${data.vendeurs.map(v => html`<tr>
                    <td>@${v.pseudo}</td>
                    <td>${v.versement
                      ? html`<b>${v.versement.titulaire}</b>
                          ${v.versement.ccp ? html`<br><small class="muted">CCP</small> <code>${v.versement.ccp}</code>` : ''}
                          ${v.versement.baridimob ? html`<br><small class="muted">BaridiMob</small> <code>${v.versement.baridimob}</code>` : ''}`
                      : v.du
                        ? html`<span class="status rejected">rien d’indiqué</span><br><small class="muted">à lui demander</small>`
                        : html`<span class="muted">—</span>`}</td>
                    <td class="mono">${v.ventes}</td>
                    <td class="mono">${v.brut} ${data.devise}</td>
                    <td class="mono">${v.du} ${data.devise}${v.regle ? html`<br><small class="muted">${v.regle} déjà reversés</small>` : ''}</td>
                    <td>${v.du && v.id ? html`<button class="btn small" data-action="vendeur-regler" data-id="${v.id}" data-pseudo="${v.pseudo}" data-du="${v.du} ${data.devise}">Marquer reversé</button>` : ''}</td></tr>`)}
                </tbody></table>`
              : html`<div class="empty">Aucune vente encaissée pour l’instant.</div>`}

            <h3 class="admin-sous-titre">Ventes encaissées<small>${data.payes.length} au total</small></h3>
            ${data.payes.length
              ? html`<table class="table"><thead><tr><th>Date</th><th>Drop</th><th>Vendeur</th><th>Prix</th><th>Ta part</th></tr></thead><tbody>
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
              ? html`<table class="table"><thead><tr><th>Date</th><th>Drop</th><th>Jours</th><th>Montant</th><th>Note</th></tr></thead><tbody>
                  ${data.registre.map(v => html`<tr>
                    <td>${new Date(v.at).toLocaleDateString('fr-FR')}</td>
                    <td><a href="#/p/${v.postId}">${v.titre}</a><br><small class="muted">@${v.auteur} · jusqu’au ${new Date(v.jusqua).toLocaleDateString('fr-FR')}</small></td>
                    <td class="mono">${v.jours}</td>
                    <td class="mono">${v.montant ? `${v.montant} ${v.devise}` : '—'}</td>
                    <td class="muted">${v.note}</td></tr>`)}
                </tbody></table>`
              : html`<div class="empty">Rien de vendu pour l’instant.</div>`}`
          : data.posts.length ? data.posts.map(card) : html`<div class="empty">${tab === 'pending' ? 'Rien à valider. Tout est à jour.' : 'Aucun drop ici.'}</div>`}
    </div>`);
}

// --- Routeur ------------------------------------------------------------------
const LEGAL = ['confidentialite', 'conditions', 'cookies', 'charte', 'mentions-legales'];

async function route() {
  document.title = 'makers.si — la boutique des produits digitaux';
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
            L’application est bien là, elle s’ouvre sans connexion — mais les drops, les
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
    Object.assign(S, { me: r.member, admin: r.admin, pending: r.pending, nonLues: r.nonLues || 0,
      commandes: r.commandes || 0, aConfirmer: r.aConfirmer || 0 });
    if (r.limits) S.limits = r.limits;
    if (r.promo) S.promo = r.promo;
    if (r.marche) S.marche = r.marche;
    if (r.modeles) S.modeles = r.modeles;
    // Le mode nuit n'existe que si l'admin l'a autorisé.
    S.site = { nuit: r.site?.nuit === true };
    window.makersTheme?.permettre?.(S.site.nuit);
  } catch { /* hors ligne : on reste visiteur */ }
}

// --- Événements ----------------------------------------------------------------
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  if (action === 'tuiles') { const r = document.getElementById('tuiles'); r?.scrollBy({ left: r.clientWidth * 0.8, behavior: 'smooth' }); return; }
  // « Voir le contenu » d'une fiche : une ancre classique changerait la route du site.
  if (action === 'vers-contenu') { e.preventDefault(); document.getElementById('contenu')?.scrollIntoView({ behavior: 'smooth' }); return; }
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
      if (!S.me) { toast('Rejoins la communauté pour noter un drop.'); return go('#/rejoindre'); }
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
        retiens(posts);
        const liste = (el.dataset.cible && document.getElementById(el.dataset.cible)) || $('.grille, .list');
        // La numérotation du classement reprend là où la page précédente s'est arrêtée.
        const classe = !!$('.rang, .rang-n, .medaille');
        // On repart du nombre de rangs déjà affichés, pas du nombre de partages : les épingles
        // et les places payées n'en portent pas, et décaleraient toute la numérotation.
        let rang = $$('.rang, .rang-n, .medaille').length;
        liste.insertAdjacentHTML('beforeend', posts.map(p => item(p, classe && !p.pinned && !p.promo && p.points > 0 ? ++rang : null).s).join(''));
        applyBars(liste);
        if (suite) {
          el.dataset.suite = suite;
          el.innerHTML = libelle.replace(/· \d+ restants/, `· ${total - liste.querySelectorAll('.item, .carte').length} restants`);
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
    } else if (action === 'copier-texte') {
      // Une référence ou un numéro de compte : sur un téléphone, les recopier à la main
      // dans l'application de la banque, c'est la faute de frappe assurée.
      await navigator.clipboard.writeText(el.dataset.texte);
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
    } else if (action === 'reglage-nuit') {
      const r = await api('/admin/reglages', { method: 'POST', body: { nuit: el.dataset.valeur === 'oui' } });
      S.site = { nuit: r.site.nuit === true };
      window.makersTheme?.permettre?.(S.site.nuit);
      toast(S.site.nuit ? 'Mode nuit autorisé.' : 'Mode nuit bloqué : tout le monde voit le mode clair.');
      header(); route();
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
      if (!confirm('Supprimer ce drop ?')) return;
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
      if (!confirm(`Supprimer le compte @${el.dataset.pseudo} et tous ses drops ?`)) return;
      await api(`/admin/members/${id}/delete`, { method: 'POST' });
      toast('Compte supprimé.'); route();
    } else if (action === 'dismiss') {
      await api(`/admin/posts/${id}/dismiss`, { method: 'POST' });
      toast('Signalements ignorés.'); route();
    } else if (action === 'compo-add') {
      if (compo.items.some(x => x.postId === id)) return toast('Ce drop est déjà dans ta collection.');
      if (compo.items.length >= 30) return toast('Trente drops au maximum.');
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
      if (!confirm('Supprimer cette collection ? Les drops qu’elle cite ne sont pas touchés.')) return;
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
      if (!confirm(`Retirer le prix de ${el.dataset.prix} et rendre ce drop gratuit ?\n\nLes ventes déjà faites restent au registre, et ceux qui ont payé gardent leur accès.`)) return;
      await api(`/admin/posts/${id}/gratuit`, { method: 'POST' });
      toast('Drop rendu gratuit.'); route();
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
      if (!confirm(`Commander ce produit pour ${el.dataset.prix} ?\n\nTu vas recevoir une référence et l’adresse où envoyer le paiement. Le contenu s’ouvre dès que le versement est vérifié.`)) return;
      await api(`/posts/${id}/acheter`, { method: 'POST' });
      // « On te recontacte » : le site n'envoie aucun email, personne ne recontactait.
      // On emmène l'acheteur là où sont écrites la référence et l'adresse de paiement.
      toast('Commande enregistrée. Voici comment payer.');
      go('#/mes-achats');
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
      if (!confirm('Supprimer définitivement ce drop ?')) return;
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
      if (pics.length > 3) return fail('3 photos maximum par drop.');
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
    } else if (kindOf === 'versement') {
      const r = await api('/me/versement', { method: 'POST', body: {
        titulaire: fd.get('titulaire'), ccp: fd.get('ccp'), baridimob: fd.get('baridimob'),
      } });
      toast(r.versement ? 'Coordonnées enregistrées.' : 'Coordonnées retirées.');
      route();
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
        : [html`<p class="muted">Aucun drop publié ne correspond à « ${q} ».</p>`]).map(x => x.s).join('');
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

// Au démarrage, ne pas attendre de savoir qui est connecté pour demander le reste :
// sur la page d'accueil, ses données partent en même temps que /api/me. C'est un
// aller-retour entier de gagné avant le premier affichage.
if ((location.hash || '#/') === '#/') {
  prechauffer(['/posts?t=&tag=&q=&s=top&p=&m=&prix=&rayon=produits', '/stats', '/top?periode=semaine', '/collections?limit=3', '/posts?t=&tag=&q=&s=top&p=&m=&prix=&rayon=ia&limit=8']);
}
// Les pages publiques s'affichent sans attendre de savoir qui est connecté : /api/me
// part en même temps, et la page n'est redessinée que si sa réponse change quelque
// chose (un membre connecté, l'admin, la vente ouverte). Les autres pages attendent.
{
  const [chemin] = (location.hash.slice(1) || '/').split('?');
  const publique = chemin === '/' || chemin.startsWith('/p/') || chemin.startsWith('/membre/') || chemin === '/top'
    || chemin === '/collections' || ['/aide', '/charte', '/conditions', '/confidentialite', '/cookies', '/mentions-legales'].includes(chemin);
  if (publique) {
    const etat = () => JSON.stringify([S.me?.id, S.admin, S.marche?.ouvert, S.pending]);
    const avant = etat();
    route();
    await refreshMe();
    if (etat() !== avant) route(); else { header(); rail(); }
  } else {
    await refreshMe();
    route();
  }
}

// --- Installation et hors ligne ----------------------------------------------------
// Uniquement sur le site complet : la copie publiée n'embarque pas de service worker
// (l'export l'écarte volontairement, voir scripts/export-statique.js), et tenter de
// l'enregistrer là-bas ne produirait qu'une erreur dans la console.
//
// Après le premier affichage, jamais avant : installer ne doit pas retarder la page.
// Et si la page est déjà chargée — ce qui arrive, ce module attend le réseau plus
// haut — on n'attend pas un événement `load` qui est déjà passé.
// Une fois la page affichée et ses données arrivées, la coquille gardée sur l'appareil
// est revérifiée (voir rafraichir dans sw.js) : la prochaine ouverture aura la dernière
// version. Quatre secondes d'attente pour ne jamais disputer la ligne aux données.
if (!STATIQUE && 'serviceWorker' in navigator) {
  setTimeout(() => navigator.serviceWorker.controller?.postMessage('rafraichir'), 4000);
}

if (!STATIQUE && 'serviceWorker' in navigator) {
  const installe = () => navigator.serviceWorker.register('/sw.js')
    .catch(() => { /* pas de hors ligne sur cet appareil : le site marche quand même */ });
  if (document.readyState === 'complete') installe();
  else window.addEventListener('load', installe, { once: true });
}
