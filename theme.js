// Le thème, posé avant le premier affichage.
//
// Ce fichier est chargé dans <head> et ne fait qu'une chose : écrire un
// `data-theme` sur <html>. Il est séparé d'app.js exprès, parce qu'il doit
// s'exécuter avant que la page s'affiche — sinon on verrait un éclair de nuit
// avant de passer au papier. La politique de sécurité du site interdit les
// scripts écrits dans le HTML, d'où un fichier plutôt qu'une balise en ligne.
//
// Trois choix possibles : `auto` (suit le réglage de l'appareil), `papier`,
// `nuit`. Le choix est gardé sur l'appareil, jamais envoyé au serveur.
// La feuille de style ne connaît que deux palettes — nuit par défaut, papier
// sous `[data-theme="papier"]` — et c'est ce fichier qui résout `auto` en
// l'une des deux. Sans JavaScript, le site reste en nuit, comme avant.

const CLE = 'mk-theme';
const CLAIR = '(prefers-color-scheme: light)';

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
  const resolu = choix === 'auto' ? duSysteme() : choix;
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

// app.js et atelier.js s'en servent pour dessiner le sélecteur et le changer.
window.makersTheme = { lu, choisis, pose };
