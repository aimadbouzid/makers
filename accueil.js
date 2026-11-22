// La page d'accueil : ce qu'on voit en arrivant sur makers.si, avant d'entrer.
//
// Une page du site, dans son style clair : l'heure et la date de l'appareil du
// visiteur, mises à jour en direct, une salutation qui suit le moment de la
// journée, ce que fait le site en une phrase, et les derniers drops posés dans
// leurs boîtes. On entre en faisant défiler vers le haut — la page se lève et
// découvre la bibliothèque dessous — ou par les boutons.
//
// - À la première visite seulement (localStorage) : un habitué arrive directement
//   dans la bibliothèque, sans porte à franchir à chaque fois.
// - Seulement en arrivant sur l'accueil. Quelqu'un qui ouvre le lien d'un drop
//   veut ce drop, pas une page de plus avant.
// - Script classique, chargé dans <head> : il pose une classe sur <html> avant le
//   premier affichage, pour que le site ne clignote jamais avant cette page.
// - Tout est construit avec textContent : aucune donnée n'est écrite comme du HTML.
(() => {
  const CLE = 'mk-accueil';
  const surAccueil = ['', '#', '#/'].includes(location.hash);
  let deja = false;
  try { deja = localStorage.getItem(CLE) === 'vu' || sessionStorage.getItem(CLE) === 'vu'; } catch { /* stockage bloqué : on montre */ }
  if (!surAccueil || deja) return;

  const racine = document.documentElement;
  racine.classList.add('accueil-avant');
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- L'heure et la date, celles de l'appareil ------------------------------------
  const fmtHeure = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const salut = h => (h >= 5 && h < 12 ? 'Bonjour.' : h >= 12 && h < 18 ? 'Bon après-midi.' : h >= 18 && h < 23 ? 'Bonsoir.' : 'Bonne nuit.');
  const TYPES = { template: 'Template', design: 'Design', code: 'Code', formation: 'Formation', audio: 'Audio', media: 'Photo', skill: 'Skill', prompt: 'Prompt', pdf: 'PDF', lien: 'Lien', idee: 'Idée', info: 'Actu', agent: 'Agent', mcp: 'MCP', sondage: 'Sondage', montage: 'Montage' };

  const el = (tag, classe, texte) => {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    return e;
  };
  const lien = (href, classe, texte) => { const a = el('a', classe, texte); a.href = href; return a; };

  function construit() {
    const page = el('section', 'accueil');
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-modal', 'true');
    page.setAttribute('aria-label', 'Bienvenue sur makers.si');

    const fond = el('div', 'accueil-fond');
    fond.setAttribute('aria-hidden', 'true');

    // En haut : la marque, et une porte pour qui veut entrer tout de suite.
    const haut = el('header', 'accueil-haut');
    const marque = el('span', 'accueil-marque');
    marque.append('makers', el('i', '', '.'), 'si');
    const passer = el('button', 'accueil-passer', 'Entrer');
    passer.type = 'button';
    haut.append(marque, passer);

    // Le cœur : l'heure en direct, la salutation, ce qu'est le site.
    const coeur = el('div', 'accueil-coeur');
    const moment = el('p', 'accueil-moment');
    const point = el('span', 'accueil-direct');
    point.setAttribute('aria-hidden', 'true');
    const quand = el('time', 'accueil-quand');
    moment.append(point, quand);
    const titre = el('h1', 'accueil-titre');
    const bonjour = el('span', 'accueil-salut');
    // « Les derniers drops » seulement s'ils sont récents : annoncer des nouveautés
    // vieilles d'un mois, c'est montrer un site qui ne bouge plus. Le titre est corrigé
    // dès que la vitrine sait de quand datent les drops.
    const suite = el('span', 'accueil-suite', 'Voici les drops à la une.');
    titre.append(bonjour, suite);
    const phrase = el('p', 'accueil-phrase',
      'Templates, design, code, formations, audio, photos, skills et prompts pour l’IA : des produits digitaux faits par des créateurs. Certains s’achètent, d’autres sont offerts, et tous sont relus avant d’être publiés.');
    const actions = el('div', 'accueil-actions');
    const entrer = el('button', 'btn primary accueil-entrer', 'Entrer dans la bibliothèque');
    entrer.type = 'button';
    actions.append(entrer, lien('#/?prix=payant', 'btn accueil-boutique', 'Voir la boutique'));
    coeur.append(moment, titre, phrase, actions);

    // Les derniers drops, dans leurs boîtes.
    const vitrine = el('div', 'accueil-vitrine');
    vitrine.setAttribute('aria-label', 'Les derniers drops');

    // En bas : l'invitation à faire défiler.
    const bas = el('button', 'accueil-defile');
    bas.type = 'button';
    bas.append(el('span', 'accueil-fleche'), el('span', '', 'Faire défiler pour entrer'));

    page.append(fond, haut, coeur, vitrine, bas);

    // L'heure bouge pendant qu'on lit : relue chaque seconde, écrite seulement quand
    // la minute change.
    let affichee = '';
    const tic = () => {
      const now = new Date();
      const h = fmtHeure.format(now);
      if (h === affichee) return;
      affichee = h;
      const d = fmtDate.format(now);
      quand.textContent = `${d.charAt(0).toUpperCase() + d.slice(1)} · ${h}`;
      quand.dateTime = now.toISOString();
      bonjour.textContent = salut(now.getHours());
    };
    tic();
    const minuterie = setInterval(tic, 1000);

    return { page, vitrine, suite, portes: [passer, entrer, bas], minuterie };
  }

  // --- La vitrine : les trois derniers drops, chacun dans sa boîte -----------------
  // Le même dessin que les cartes de la bibliothèque (voir « La boîte » dans
  // style.css), pour que le visiteur reconnaisse ce qu'il va trouver en entrant.
  function boite(p) {
    const court = TYPES[p.type] || p.type;
    const scene = el('span', 'boite-scene');
    const b = el('span', 'boite');
    const face = el('span', 'boite-face');
    face.append(el('span', 'boite-kind', court), el('span', 'boite-titre', p.title));
    const m = el('span', 'boite-marque');
    m.append('makers', el('i', '', '.'), 'si');
    face.append(m);
    const tranche = el('span', 'boite-tranche');
    tranche.append(el('span', '', court));
    b.append(face, tranche, el('span', 'boite-dessus'));
    scene.append(b, el('span', 'boite-sol'));
    return scene;
  }

  async function vitrine(conteneur, ouvrir, suite) {
    let posts = [];
    try {
      if (window.MAKERS_STATIQUE) {
        const d = await (await fetch('donnees/site.json')).json();
        posts = (d.posts || []).slice().sort((a, b) => (b.approvedAt || 0) - (a.approvedAt || 0));
      } else {
        posts = (await (await fetch('/api/posts?s=recent', { credentials: 'same-origin' })).json()).posts || [];
      }
    } catch { return; } // hors ligne : la page reste complète sans vitrine
    // La vitrine montre des produits : ceux qui sont à vendre d'abord, puis les autres
    // drops faits ici. Les liens vers d'autres sites n'y vont pas — ce ne sont pas des
    // packs, et une vitrine de liens ressemble à un annuaire.
    // Trois produits de trois familles différentes, ceux qui ont une affiche d'abord : la
    // vitrine de l'accueil donne tout de suite une idée de la variété du site.
    const candidats = posts.filter(p => !p.pinned && p.type !== 'lien' && p.type !== 'info')
      .sort((a, b) => !!b.affiche - !!a.affiche || (b.prix > 0) - (a.prix > 0) || (b.approvedAt || 0) - (a.approvedAt || 0));
    const famille = p => (/capcut/i.test(p.title) ? 'capcut' : p.type);
    const vues = new Set(), choix = [];
    for (const p of candidats) { if (choix.length < 3 && !vues.has(famille(p))) { vues.add(famille(p)); choix.push(p); } }
    for (const p of candidats) { if (choix.length < 3 && !choix.includes(p)) choix.push(p); }
    const recent = posts.some(p => !p.pinned && Date.now() - (p.approvedAt || 0) < 7 * 86400000);
    if (recent) suite.textContent = 'Voici les derniers drops.';
    choix.forEach((p, i) => {
      const a = lien('#/p/' + p.id, 'accueil-drop k-' + p.type);
      a.style.setProperty('--i', i);
      const pied = el('span', 'accueil-drop-pied');
      pied.append(el('span', 'accueil-drop-titre', p.title),
        el('span', 'accueil-drop-prix' + (p.prix ? '' : ' offert'), p.prix ? `${p.prix} ${p.devise || 'DA'}` : 'Offert'));
      // L'affiche carrée du produit, comme dans la boutique ; la boîte reste pour un drop
      // qui n'a pas d'image.
      const image = p.affiche?.thumb || p.images?.[0]?.thumb;
      const cadre = el('span', 'accueil-drop-boite' + (image ? ' affiche' : ''));
      if (image) {
        const img = document.createElement('img');
        img.src = image; img.alt = ''; img.width = 400; img.height = 400; img.decoding = 'async';
        cadre.append(img);
      } else cadre.append(boite(p));
      a.append(cadre, pied);
      a.addEventListener('click', e => { e.preventDefault(); ouvrir('#/p/' + p.id); });
      conteneur.append(a);
    });
  }

  // --- Entrer : la page se lève et découvre le site --------------------------------
  function montre() {
    const { page, vitrine: cadre, suite, portes, minuterie } = construit();
    const autour = [...document.body.children];
    autour.forEach(e => { e.inert = true; });
    document.body.append(page);
    racine.classList.add('accueil-ouvert');
    racine.classList.remove('accueil-avant');
    requestAnimationFrame(() => page.classList.add('pret'));
    setTimeout(() => page.classList.add('pret'), 80);
    portes[1].focus({ preventScroll: true });

    let parti = false;
    const ouvrir = (vers) => {
      if (parti) return;
      parti = true;
      try { localStorage.setItem(CLE, 'vu'); } catch { /* vaut pour cette page */ }
      if (vers) location.hash = vers;
      autour.forEach(e => { e.inert = false; });
      page.classList.add('part');
      page.style.transform = '';
      const fin = () => {
        clearInterval(minuterie);
        page.remove();
        racine.classList.remove('accueil-ouvert');
      };
      if (calme) fin(); else { page.addEventListener('transitionend', fin, { once: true }); setTimeout(fin, 900); }
    };

    portes.forEach(b => b.addEventListener('click', () => ouvrir()));
    page.querySelector('.accueil-boutique').addEventListener('click', e => { e.preventDefault(); ouvrir('#/?prix=payant'); });
    vitrine(cadre, ouvrir, suite);

    // Tirer vers le haut, au doigt ou à la souris : la page suit, puis part si on l'a
    // montée d'un quart d'écran ou lancée vite ; sinon elle reprend sa place.
    // Le geste part de n'importe où, cartes et boutons compris : sur un téléphone, on
    // pose le doigt là où il tombe. Un vrai glissement n'ouvre pas ce qu'il y a dessous.
    let depart = null, dernier = 0, vitesse = 0, t0 = 0, glisse = false;
    page.addEventListener('pointerdown', e => {
      if (parti || e.button > 0) return;
      depart = e.clientY; dernier = e.clientY; t0 = performance.now(); vitesse = 0; glisse = false;
      page.classList.add('tire');
    });
    page.addEventListener('pointermove', e => {
      if (depart === null) return;
      const dy = Math.min(0, e.clientY - depart);
      if (!glisse && Math.abs(e.clientY - depart) > 6) {
        glisse = true;
        try { page.setPointerCapture(e.pointerId); } catch { /* rien */ }
      }
      const t = performance.now();
      vitesse = (e.clientY - dernier) / Math.max(1, t - t0);
      dernier = e.clientY; t0 = t;
      page.style.transform = `translateY(${dy}px)`;
      page.style.setProperty('--tire', String(Math.min(1, -dy / innerHeight)));
    });
    const lache = e => {
      if (depart === null) return;
      const dy = Math.min(0, (e.clientY ?? dernier) - depart);
      depart = null;
      page.classList.remove('tire');
      if (-dy > innerHeight * 0.22 || vitesse < -0.5) return ouvrir();
      page.style.transform = '';
      page.style.setProperty('--tire', '0');
    };
    page.addEventListener('pointerup', lache);
    // Le clic qui suit un glissement n'est pas un choix : on l'arrête avant les liens.
    page.addEventListener('click', e => {
      if (glisse) { e.preventDefault(); e.stopPropagation(); glisse = false; }
    }, true);
    page.addEventListener('pointercancel', lache);
    // La molette et le pavé tactile : faire défiler vers le bas, c'est entrer.
    page.addEventListener('wheel', e => { if (e.deltaY > 12) ouvrir(); }, { passive: true });
    page.addEventListener('keydown', e => {
      if (['Escape', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); ouvrir(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montre, { once: true });
  else montre();
})();
