// L'écran d'accueil, comme l'écran verrouillé d'un iPhone.
//
// Quand on arrive sur makers.si, on ne tombe pas directement dans la bibliothèque :
// on voit d'abord la date et l'heure de son propre appareil, en grand, un mot qui
// dépend du moment de la journée, et les derniers drops posés comme des
// notifications. On fait glisser vers le haut, et le site apparaît dessous.
//
// - Une fois par visite (sessionStorage) : recharger la page ne le remontre pas.
// - Seulement en arrivant sur l'accueil. Quelqu'un qui ouvre le lien d'un drop
//   veut ce drop, pas un écran à faire glisser avant.
// - Script classique, chargé dans <head> : il pose une classe sur <html> avant le
//   premier affichage, pour qu'on ne voie jamais le site clignoter avant l'écran.
// - Tout est construit avec textContent : aucune donnée n'est écrite comme du HTML.
(() => {
  const CLE = 'mk-accueil';
  const surAccueil = ['', '#', '#/'].includes(location.hash);
  let deja = false;
  try { deja = sessionStorage.getItem(CLE) === 'vu'; } catch { /* stockage bloqué : on montre */ }
  if (!surAccueil || deja) return;

  const racine = document.documentElement;
  racine.classList.add('accueil-avant');
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- L'heure et la date, celles de l'appareil ------------------------------------
  const fmtHeure = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const salut = h => (h >= 5 && h < 12 ? 'Bonjour' : h >= 12 && h < 18 ? 'Bon après-midi' : h >= 18 && h < 23 ? 'Bonsoir' : 'Bonne nuit');
  const ilya = (() => {
    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
    return t => {
      const s = Math.round((t - Date.now()) / 1000);
      if (s > -60) return 'maintenant';
      if (s > -3600) return rtf.format(Math.round(s / 60), 'minute');
      if (s > -86400) return rtf.format(Math.round(s / 3600), 'hour');
      if (s > -86400 * 30) return rtf.format(Math.round(s / 86400), 'day');
      return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(t);
    };
  })();
  const TYPES = { skill: 'Skill', prompt: 'Prompt', pdf: 'PDF', lien: 'Lien', idee: 'Idée', info: 'Actu', agent: 'Agent', mcp: 'MCP', sondage: 'Sondage', montage: 'Montage' };

  const el = (tag, classe, texte) => {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    return e;
  };

  function construit() {
    const ecran = el('div', 'accueil');
    ecran.setAttribute('role', 'dialog');
    ecran.setAttribute('aria-modal', 'true');
    ecran.setAttribute('aria-label', 'Bienvenue sur makers.si');

    const fond = el('div', 'accueil-fond');
    fond.setAttribute('aria-hidden', 'true');
    for (let i = 1; i <= 4; i++) fond.append(el('span', 'tache t' + i));

    const contenu = el('div', 'accueil-contenu');
    const marque = el('p', 'accueil-marque');
    marque.append('makers', el('i', '', '.'), 'si');
    const date = el('p', 'accueil-date');
    const heure = el('p', 'accueil-heure');
    heure.setAttribute('aria-live', 'off');
    const mot = el('p', 'accueil-salut');
    contenu.append(marque, date, heure, mot);

    const pile = el('div', 'accueil-notifs');
    pile.setAttribute('aria-label', 'Les derniers drops');

    const bas = el('div', 'accueil-bas');
    const entrer = el('button', 'accueil-entrer');
    entrer.type = 'button';
    entrer.append(el('span', 'fleche'), el('span', 'accueil-consigne',
      matchMedia('(pointer: coarse)').matches ? 'Glisse vers le haut pour entrer' : 'Fais défiler ou clique pour entrer'));
    const barre = el('span', 'accueil-barre');
    barre.setAttribute('aria-hidden', 'true');
    bas.append(entrer, barre);

    ecran.append(fond, contenu, pile, bas);

    // L'heure bouge pendant qu'on regarde : on la relit chaque seconde, mais on
    // n'écrit dans la page que quand la minute change.
    let affichee = '';
    const tic = () => {
      const now = new Date();
      const h = fmtHeure.format(now);
      if (h === affichee) return;
      affichee = h;
      heure.textContent = h;
      const d = fmtDate.format(now);
      date.textContent = d.charAt(0).toUpperCase() + d.slice(1);
      mot.textContent = salut(now.getHours());
    };
    tic();
    const minuterie = setInterval(tic, 1000);

    return { ecran, pile, entrer, minuterie };
  }

  // --- Les derniers drops, en notifications ----------------------------------------
  async function notifications(pile, ouvrir) {
    let posts = [];
    try {
      if (window.MAKERS_STATIQUE) {
        const d = await (await fetch('donnees/site.json')).json();
        posts = (d.posts || []).slice().sort((a, b) => (b.approvedAt || 0) - (a.approvedAt || 0));
      } else {
        posts = (await (await fetch('/api/posts?s=recent', { credentials: 'same-origin' })).json()).posts || [];
      }
    } catch { return; } // hors ligne : l'écran reste beau sans notifications
    posts.filter(p => !p.pinned).slice(0, 3).forEach((p, i) => {
      const n = el('a', 'accueil-notif k-' + p.type);
      n.href = '#/p/' + p.id;
      n.style.setProperty('--i', i);
      const icone = el('span', 'accueil-notif-icone');
      icone.setAttribute('aria-hidden', 'true');
      icone.textContent = (TYPES[p.type] || '·').slice(0, 1);
      const corps = el('span', 'accueil-notif-corps');
      const haut = el('span', 'accueil-notif-haut');
      haut.append(el('b', '', 'makers.si'), el('span', '', ilya(p.approvedAt || p.createdAt)));
      const titre = el('span', 'accueil-notif-titre', `New drop · ${TYPES[p.type] || p.type}${p.prix ? ` · ${p.prix} ${p.devise || 'DA'}` : ''}`);
      const texte = el('span', 'accueil-notif-texte', p.title);
      corps.append(haut, titre, texte);
      n.append(icone, corps);
      n.addEventListener('click', e => { e.preventDefault(); ouvrir('#/p/' + p.id); });
      pile.append(n);
    });
  }

  // --- Faire glisser vers le haut ------------------------------------------------
  function montre() {
    const { ecran, pile, entrer, minuterie } = construit();
    const autour = [...document.body.children];
    autour.forEach(e => { e.inert = true; });
    document.body.append(ecran);
    racine.classList.add('accueil-ouvert');
    racine.classList.remove('accueil-avant');
    // La barre d'adresse du téléphone prend la couleur de l'écran, puis la rend.
    const meta = document.querySelector('meta[name="theme-color"]');
    const couleur = meta?.getAttribute('content');
    meta?.setAttribute('content', '#0a0e22');
    // L'heure descend en place à l'image suivante (et au plus tard un instant après,
    // si le navigateur retarde ses images, comme dans un onglet en arrière-plan).
    requestAnimationFrame(() => ecran.classList.add('pret'));
    setTimeout(() => ecran.classList.add('pret'), 80);
    entrer.focus({ preventScroll: true });

    let parti = false;
    const ouvrir = (vers) => {
      if (parti) return;
      parti = true;
      try { sessionStorage.setItem(CLE, 'vu'); } catch { /* vaut pour cette page */ }
      if (vers) location.hash = vers;
      autour.forEach(e => { e.inert = false; });
      ecran.classList.add('part');
      ecran.style.transform = '';
      const fin = () => {
        clearInterval(minuterie);
        ecran.remove();
        racine.classList.remove('accueil-ouvert');
        if (couleur) meta?.setAttribute('content', couleur);
      };
      if (calme) fin(); else { ecran.addEventListener('transitionend', fin, { once: true }); setTimeout(fin, 900); }
    };

    entrer.addEventListener('click', () => ouvrir());
    notifications(pile, ouvrir);

    // Le doigt (ou la souris) tire l'écran vers le haut ; on le suit exactement. Au
    // lâcher, s'il est monté d'un quart de l'écran ou s'il a été lancé vite, il
    // part ; sinon il retombe à sa place, comme sur un iPhone.
    let depart = null, dernier = 0, vitesse = 0, t0 = 0, glisse = false;
    ecran.addEventListener('pointerdown', e => {
      if (parti || e.button > 0) return;
      depart = e.clientY; dernier = e.clientY; t0 = performance.now(); vitesse = 0; glisse = false;
      ecran.classList.add('tire');
    });
    ecran.addEventListener('pointermove', e => {
      if (depart === null) return;
      const dy = Math.min(0, e.clientY - depart);
      if (Math.abs(e.clientY - depart) > 6 && !glisse) {
        glisse = true;
        try { ecran.setPointerCapture(e.pointerId); } catch { /* rien */ }
      }
      const t = performance.now();
      vitesse = (e.clientY - dernier) / Math.max(1, t - t0);
      dernier = e.clientY; t0 = t;
      ecran.style.transform = `translateY(${dy}px)`;
      ecran.style.setProperty('--tire', String(Math.min(1, -dy / innerHeight)));
    });
    const lache = e => {
      if (depart === null) return;
      const dy = Math.min(0, (e.clientY ?? dernier) - depart);
      depart = null;
      ecran.classList.remove('tire');
      if (-dy > innerHeight * 0.22 || vitesse < -0.5) return ouvrir();
      ecran.style.transform = '';
      ecran.style.setProperty('--tire', '0');
    };
    ecran.addEventListener('pointerup', lache);
    ecran.addEventListener('pointercancel', lache);
    // Un simple clic, sans glisser, entre aussi : sur ordinateur, personne ne pense
    // à tirer une page vers le haut. Les notifications gèrent leur propre clic.
    ecran.addEventListener('click', e => { if (!glisse && !e.target.closest('.accueil-notif')) ouvrir(); });
    // La molette et le pavé tactile : faire défiler vers le bas, c'est monter l'écran.
    ecran.addEventListener('wheel', e => { if (e.deltaY > 12) ouvrir(); }, { passive: true });
    ecran.addEventListener('keydown', e => {
      if (['Escape', 'ArrowUp', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ouvrir(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montre, { once: true });
  else montre();
})();
