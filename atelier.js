// L'atelier — la couche d'interaction.
//
// Trois choses vivent ici, et aucune n'est indispensable au site : s'il ne se
// charge pas, la bibliothèque marche exactement comme avant.
//
//   1. La palette de commandes (⌘K, Ctrl+K ou /). Elle remplace le champ de
//      recherche de la barre du haut. Un champ ne sait que chercher ; une
//      palette cherche ET fait — aller au Top, composer une collection,
//      changer de thème. C'est ce que les gens qui passent leur journée dans
//      des outils attendent, et pratiquement aucune bibliothèque
//      communautaire ne l'offre.
//   2. Le clavier. j/k pour descendre l'index, Entrée pour ouvrir, g puis une
//      lettre pour sauter, c pour copier le contenu d'un partage, ? pour le
//      mémo. Un site qui parle de Claude Code se conduit au clavier.
//   3. Le tiroir du rail sur petit écran.
//
// Le déplacement dans l'index se fait en déplaçant le *focus* du navigateur,
// pas une sélection inventée : Entrée, la molette, les lecteurs d'écran et le
// surlignage continuent de marcher sans qu'on ait rien à réimplémenter.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const dans_un_champ = () => /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')
  || document.activeElement?.isContentEditable;

// app.js pose ce pont avant son premier appel réseau. S'il n'est pas là, la
// palette se contente des destinations : elle ne cherche pas.
const pont = () => window.makers || null;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ico = nom => pont()?.icones?.[nom] || '';
// Le mot court d'une catégorie (« Skill », « PDF »), pour l'étiquette des résultats.
const court = cle => (pont()?.types || []).find(t => t.cle === cle)?.court || cle;

// --- Le tiroir du rail ---------------------------------------------------------
const fermeRail = () => document.body.classList.remove('rail-ouvert');
function basculeRail() {
  const ouvert = document.body.classList.toggle('rail-ouvert');
  if (ouvert) $('.rail a, .rail button')?.focus();
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-action="menu"]')) { basculeRail(); return; }
  if (e.target.closest('.voile')) fermeRail();
  // Un lien du rail mène ailleurs : le tiroir n'a plus de raison de rester.
  if (e.target.closest('.rail a')) fermeRail();
});
window.addEventListener('hashchange', fermeRail);

// --- Les destinations et les gestes de la palette --------------------------------
// `faire` plutôt qu'une adresse quand ce n'est pas une navigation.
function commandes() {
  const p = pont();
  const moi = p?.etat?.me;
  const admin = p?.etat?.admin;
  const statique = p?.statique;
  const choix = window.makersTheme?.lu?.() || 'auto';
  const liste = [
    { groupe: 'Aller à', mot: 'La bibliothèque', hash: '#/', icone: 'lignes' },
    { groupe: 'Aller à', mot: 'Les collections', hash: '#/collections', icone: 'lignes' },
    { groupe: 'Aller à', mot: 'Le Top 5', hash: '#/top', icone: 'cup' },
    { groupe: 'Aller à', mot: 'Comment ça marche', hash: '#/aide', icone: 'ampoule' },
    { groupe: 'Aller à', mot: 'La charte de la communauté', hash: '#/charte', icone: 'doc' },
    { groupe: 'Aller à', mot: 'Mettre un partage en avant', hash: '#/mise-en-avant', icone: 'megaphone' },
  ];
  if (!statique) {
    if (moi) {
      liste.unshift(
        { groupe: 'Faire', mot: 'Partager quelque chose', hash: '#/partager', icone: 'plus' },
        { groupe: 'Faire', mot: 'Composer une collection', hash: '#/collection', icone: 'plus' },
      );
      liste.push(
        { groupe: 'Mon compte', mot: 'Ce qui s’est passé', hash: '#/notifications', icone: 'cloche' },
        { groupe: 'Mon compte', mot: 'Mes partages', hash: '#/mes-partages', icone: 'dossier' },
        { groupe: 'Mon compte', mot: 'Mes ventes', hash: '#/mes-ventes', icone: 'doc' },
        { groupe: 'Mon compte', mot: 'Mes achats', hash: '#/mes-achats', icone: 'doc' },
        { groupe: 'Mon compte', mot: `Mon profil public (@${moi.pseudo})`, hash: '#/membre/' + encodeURIComponent(moi.pseudo), icone: 'file' },
        { groupe: 'Mon compte', mot: 'Mes données et mon compte', hash: '#/compte', icone: 'file' },
      );
    } else {
      liste.unshift(
        { groupe: 'Faire', mot: 'Créer mon compte', hash: '#/rejoindre', icone: 'plus' },
        { groupe: 'Faire', mot: 'Me connecter', hash: '#/connexion', icone: 'lock' },
      );
    }
    if (admin) liste.push({ groupe: 'Mon compte', mot: 'Modération', hash: '#/admin', icone: 'vote' });
  }
  // Les catégories : le même chemin que le rail, mais atteignable en tapant.
  for (const t of p?.types || []) {
    liste.push({ groupe: 'Catégories', mot: t.label, hash: `#/?t=${t.cle}`, type: t.cle, icone: 'lignes' });
  }
  // Le thème : la seule commande qui ne navigue pas.
  const themes = [['auto', 'Thème : suivre l’appareil'], ['papier', 'Thème : papier (clair)'], ['nuit', 'Thème : nuit (sombre)']];
  for (const [cle, mot] of themes) {
    if (cle === choix) continue;
    liste.push({ groupe: 'Réglages', mot, icone: 'ampoule', faire: () => window.makersTheme?.choisis(cle) });
  }
  return liste;
}

// --- La palette ------------------------------------------------------------------
let fond = null;        // l'élément du voile, créé une seule fois
let lignes = [];        // les lignes affichées, dans l'ordre
let curseur = 0;
let chrono = null;      // la frappe, retardée avant l'appel réseau
let tour = 0;           // numéro d'appel : une réponse en retard est ignorée
let rendu = null;       // l'élément qui avait le focus avant l'ouverture

function construis() {
  fond = document.createElement('div');
  fond.className = 'palette-fond hidden';
  fond.innerHTML = `
    <div class="palette" role="dialog" aria-modal="true" aria-label="Palette de commandes">
      <div class="palette-haut">
        <svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.6 10.6 14 14"/></svg>
        <input type="text" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true"
          aria-controls="palette-res" aria-autocomplete="list"
          placeholder="Chercher un partage, ou taper une commande…" aria-label="Chercher ou commander">
      </div>
      <div class="palette-res" id="palette-res" role="listbox" aria-label="Résultats"></div>
      <div class="palette-pied">
        <span><kbd>↑</kbd><kbd>↓</kbd> parcourir</span>
        <span><kbd>↵</kbd> ouvrir</span>
        <span><kbd>esc</kbd> fermer</span>
        <span class="fin"><kbd>?</kbd> raccourcis</span>
      </div>
    </div>`;
  document.body.append(fond);

  const champ = $('input', fond);
  champ.addEventListener('input', () => cherche(champ.value));
  champ.addEventListener('keydown', auClavierPalette);
  fond.addEventListener('mousedown', (e) => { if (e.target === fond) ferme(); });
  $('.palette-res', fond).addEventListener('click', (e) => {
    const l = e.target.closest('.palette-ligne');
    if (!l) return;
    e.preventDefault();
    active(Number(l.dataset.i));
  });
  // Le survol déplace le curseur : la souris et le clavier désignent la même ligne.
  $('.palette-res', fond).addEventListener('mousemove', (e) => {
    const l = e.target.closest('.palette-ligne');
    if (l && Number(l.dataset.i) !== curseur) { curseur = Number(l.dataset.i); marque(); }
  });
}

const ouverte = () => fond && !fond.classList.contains('hidden');

function ouvre(prefixe = '') {
  if (!fond) construis();
  rendu = document.activeElement;
  fond.classList.remove('hidden');
  requestAnimationFrame(() => fond.classList.add('on'));
  const champ = $('input', fond);
  champ.value = prefixe;
  champ.focus();
  champ.select();
  cherche(prefixe);
}

function ferme() {
  if (!ouverte()) return;
  fond.classList.remove('on');
  fond.classList.add('hidden');
  clearTimeout(chrono);
  if (rendu && document.contains(rendu)) rendu.focus();
}

// Les commandes, filtrées sur ce qui est tapé. Un filtre tolérant : les accents
// et la casse ne doivent pas empêcher de trouver « idée » en tapant « idee ».
const plat = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function cherche(q) {
  const mot = q.trim();
  const filtre = plat(mot);
  const cmds = commandes().filter(c => !filtre || plat(c.mot).includes(filtre));
  dessine(mot, cmds, null);
  clearTimeout(chrono);
  const p = pont();
  if (!p || filtre.length < 2) return;
  chrono = setTimeout(async () => {
    const mien = ++tour;
    try {
      const { posts } = await p.api('/posts?' + new URLSearchParams({ q: mot, limit: '7' }));
      if (mien !== tour || !ouverte()) return;
      dessine(mot, cmds, posts);
    } catch { /* hors ligne : les destinations suffisent */ }
  }, 170);
}

function dessine(mot, cmds, posts) {
  lignes = [];
  const bouts = [];

  if (posts?.length) {
    bouts.push('<div class="palette-groupe cote">Partages</div>');
    for (const p of posts) {
      lignes.push({ hash: '#/p/' + p.id });
      bouts.push(`<a class="palette-ligne" role="option" aria-selected="false" data-i="${lignes.length - 1}" href="#/p/${esc(p.id)}">
        <span class="kind k-${esc(p.type)}">${esc(court(p.type))}</span><span>${esc(p.title)}</span></a>`);
    }
  }

  // Groupées, dans l'ordre d'apparition : « Faire » d'abord, « Catégories » plus bas.
  let groupe = null;
  for (const c of cmds) {
    if (c.groupe !== groupe) {
      groupe = c.groupe;
      bouts.push(`<div class="palette-groupe cote">${esc(groupe)}</div>`);
    }
    lignes.push(c);
    const i = lignes.length - 1;
    const marque_type = c.type ? ` k-${esc(c.type)}` : '';
    bouts.push(`<${c.hash ? 'a' : 'button type="button"'} class="palette-ligne" role="option" aria-selected="false" data-i="${i}"${c.hash ? ` href="${esc(c.hash)}"` : ''}>
      <span class="ico-boite${marque_type}">${ico(c.icone)}</span><span>${esc(c.mot)}</span></${c.hash ? 'a' : 'button'}>`);
  }

  if (mot) {
    lignes.push({ hash: '#/?q=' + encodeURIComponent(mot) });
    bouts.push(`<div class="palette-groupe cote">Recherche</div>
      <a class="palette-ligne" role="option" aria-selected="false" data-i="${lignes.length - 1}" href="#/?q=${encodeURIComponent(mot)}">
        <span class="ico-boite">${ico('lignes')}</span><span>Tout ce qui parle de « ${esc(mot)} »</span></a>`);
  }

  const boite = $('.palette-res', fond);
  boite.innerHTML = lignes.length ? bouts.join('') : `<p class="palette-vide">Rien ne correspond à « ${esc(mot)} ».</p>`;
  curseur = 0;
  marque();
}

function marque() {
  const els = $$('.palette-ligne', fond);
  els.forEach((el, i) => {
    const on = i === curseur;
    el.classList.toggle('on', on);
    el.setAttribute('aria-selected', String(on));
    if (on) el.scrollIntoView({ block: 'nearest' });
  });
}

function active(i) {
  const l = lignes[i];
  if (!l) return;
  ferme();
  if (l.faire) return l.faire();
  if (l.hash) location.hash = l.hash;
}

function auClavierPalette(e) {
  if (e.key === 'Escape') { e.preventDefault(); ferme(); return; }
  if (e.key === 'Enter') { e.preventDefault(); active(curseur); return; }
  const bas = e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n');
  const haut = e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p');
  if (!bas && !haut) return;
  e.preventDefault();
  if (!lignes.length) return;
  curseur = bas
    ? (curseur + 1) % lignes.length
    : (curseur <= 0 ? lignes.length - 1 : curseur - 1);
  marque();
}

// --- Le mémo des raccourcis (?) ---------------------------------------------------
const RACCOURCIS = [
  ['Partout', [
    ['⌘K  ou  Ctrl K', 'Ouvrir la palette'],
    ['/', 'Chercher'],
    ['?', 'Ce mémo'],
    ['Échap', 'Fermer, ou revenir à la bibliothèque'],
  ]],
  ['Dans l’index', [
    ['j  ou  ↓', 'Partage suivant'],
    ['k  ou  ↑', 'Partage précédent'],
    ['Entrée', 'Ouvrir le partage'],
  ]],
  ['Sur un partage', [
    ['c', 'Copier le contenu'],
  ]],
  ['Sauter', [
    ['g puis b', 'La bibliothèque'],
    ['g puis c', 'Les collections'],
    ['g puis t', 'Le Top 5'],
    ['g puis p', 'Partager'],
    ['g puis a', 'Comment ça marche'],
  ]],
];

// On interroge le document plutôt que de retenir l'élément dans une variable :
// une variable qui garde un élément déjà retiré du document laisse le mémo
// « ouvert » pour le code et invisible pour la personne, et il faut alors
// appuyer deux fois sur ? pour qu'il reparaisse.
const memoOuvert = () => document.querySelector('.memo-fond');
function basculeMemo() {
  const deja = memoOuvert();
  if (deja) { deja.remove(); return; }
  const memo = document.createElement('div');
  memo.className = 'palette-fond memo-fond on';
  memo.innerHTML = `
    <div class="palette memo" role="dialog" aria-modal="true" aria-label="Raccourcis clavier">
      <div class="palette-haut"><b class="memo-titre">Raccourcis clavier</b></div>
      <div class="palette-res memo-liste">
        ${RACCOURCIS.map(([titre, rangs]) => `<div class="cote">${esc(titre)}</div>
          ${rangs.map(([touche, quoi]) => `<div><span>${esc(quoi)}</span><kbd>${esc(touche)}</kbd></div>`).join('')}`).join('')}
      </div>
      <div class="palette-pied"><span><kbd>esc</kbd> fermer</span></div>
    </div>`;
  memo.addEventListener('mousedown', (e) => { if (e.target === memo) basculeMemo(); });
  document.body.append(memo);
}

// --- Le clavier -------------------------------------------------------------------
// Les lignes de l'index sont parcourues par le focus du navigateur : on déplace
// le focus d'un titre à l'autre, et Entrée suit le lien toute seule.
const titres = () => $$('.list .item-title, .grille .carte-titre, .etagere-item, .top-titre, .coll-titre');

function bouge(pas) {
  const liste = titres();
  if (!liste.length) return;
  const i = liste.indexOf(document.activeElement);
  const j = i < 0 ? (pas > 0 ? 0 : liste.length - 1) : Math.min(liste.length - 1, Math.max(0, i + pas));
  liste[j].focus({ preventScroll: true });
  liste[j].scrollIntoView({ block: 'nearest' });
}

let gEnAttente = 0;
const SAUTS = { b: '#/', c: '#/collections', t: '#/top', p: '#/partager', a: '#/aide', m: '#/mes-partages' };

document.addEventListener('keydown', (e) => {
  // Les combinaisons du système (copier, coller, recharger) ne nous appartiennent pas.
  if (e.altKey) return;

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    ouverte() ? ferme() : ouvre();
    return;
  }
  if (e.metaKey || e.ctrlKey) return;
  if (ouverte()) return;              // la palette gère son propre clavier

  if (e.key === 'Escape') {
    if (memoOuvert()) { basculeMemo(); return; }
    if (document.body.classList.contains('rail-ouvert')) { fermeRail(); return; }
    if (dans_un_champ()) { document.activeElement.blur(); return; }
    return;
  }
  if (dans_un_champ()) return;
  // Le mémo est une notice : n'importe quelle touche la referme.
  if (memoOuvert() && e.key !== '?') { basculeMemo(); return; }

  // g suivi d'une lettre : on garde la touche g en mémoire une seconde.
  if (gEnAttente && Date.now() - gEnAttente < 1200) {
    gEnAttente = 0;
    const ou = SAUTS[e.key.toLowerCase()];
    if (ou) { e.preventDefault(); location.hash = ou; return; }
  }

  switch (e.key) {
    case '/':
      e.preventDefault(); ouvre(); break;
    case '?':
      e.preventDefault(); basculeMemo(); break;
    case 'g':
      gEnAttente = Date.now(); break;
    case 'j': case 'ArrowDown':
      e.preventDefault(); bouge(1); break;
    case 'k': case 'ArrowUp':
      e.preventDefault(); bouge(-1); break;
    case 'c': {
      // Sur la page d'un partage, c copie ce qu'on est venu chercher.
      const b = $('[data-action="copy"], [data-action="tout-copier"], [data-action="copy-fichier"]');
      if (b) { e.preventDefault(); b.click(); }
      break;
    }
    default: break;
  }
});

// La palette s'ouvre aussi au clic sur son déclencheur de la barre du haut.
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-action="palette"]')) { e.preventDefault(); ouvre(); }
});
