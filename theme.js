// Le thème, posé avant le premier affichage.
//
// Ce fichier est chargé dans <head> et ne fait qu'une chose : écrire un
// `data-theme` sur <html>. Il est séparé d'app.js exprès, parce qu'il doit
// s'exécuter avant que la page s'affiche — sinon on verrait un éclair de nuit
// avant de passer au papier. La politique de sécurité du site interdit les
// scripts écrits dans le HTML, d'où un fichier plutôt qu'une balise en ligne.
//
// Trois choix possibles, quand l'admin autorise le mode nuit : `auto` (suit le
// réglage de l'appareil), `papier`, `nuit`. Le choix est gardé sur l'appareil, jamais envoyé au serveur.
// La feuille de style ne connaît que deux palettes — nuit par défaut, papier
// sous `[data-theme="papier"]` — et c'est ce fichier qui résout `auto` en
// l'une des deux. Sans JavaScript, la page porte déjà `data-theme="papier"` : elle reste claire.

const CLE = 'mk-theme';
const CLAIR = '(prefers-color-scheme: light)';

// Le mode nuit peut être bloqué depuis l'administration. Tant qu'il l'est, tout le
// monde voit le mode clair, quel que soit le réglage de l'appareil ou un ancien choix.
// La réponse du serveur arrive après le premier affichage : on garde donc la dernière
// connue sur l'appareil, pour ne jamais montrer un éclair sombre à quelqu'un qui ne
// doit voir que du clair. Sans réponse connue, c'est bloqué.
const CLE_PERMIS = 'mk-nuit';
let permis = (() => {
  try { return localStorage.getItem(CLE_PERMIS) === '1'; } catch { return false; }
})();
const nuitPermise = () => permis;

const lu = () => {
  try {
    const v = localStorage.getItem(CLE);
    return v === 'papier' || v === 'nuit' ? v : 'auto';
  } catch {
    // Navigation privée ou stockage bloqué : on suit l'appareil.
    return 'auto';
  }
};

const duSysteme = () => (matchMedia(CLAIR).matches ? 'papier' : 'nuit');

function pose(choix) {
  const resolu = !permis ? 'papier' : choix === 'auto' ? duSysteme() : choix;
  const racine = document.documentElement;
  racine.dataset.theme = resolu;
  racine.dataset.choix = choix;
  // La barre d'adresse du téléphone prend la couleur de la page : sans ça, elle
  // reste noire au-dessus d'un site devenu blanc.
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolu === 'papier' ? '#fbfbfd' : '#161618');
}

function choisis(choix) {
  try { localStorage.setItem(CLE, choix); } catch { /* le choix vaut pour cette visite */ }
  pose(choix);
}

pose(lu());

// L'appareil peut changer d'avis en cours de route (coucher du soleil, réglage
// automatique). On ne suit que si la personne n'a rien imposé.
matchMedia(CLAIR).addEventListener('change', () => { if (lu() === 'auto') pose('auto'); });

// app.js l'appelle avec la réponse du serveur : l'admin a-t-il autorisé le mode nuit ?
function permettre(oui) {
  permis = !!oui;
  try { oui ? localStorage.setItem(CLE_PERMIS, '1') : localStorage.removeItem(CLE_PERMIS); } catch { /* vaut pour cette visite */ }
  pose(lu());
}

// app.js et atelier.js s'en servent pour dessiner le sélecteur et le changer.
window.makersTheme = { lu, choisis, pose, permettre, nuitPermise };
