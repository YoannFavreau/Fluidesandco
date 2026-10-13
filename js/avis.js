/* ==========================================================================
   AVIS CLIENTS – seul fichier à modifier pour ajouter un avis.
   Un avis par bloc { ... }, les plus récents en premier. Ne pas oublier la virgule.
   n = note sur 5 · t = texte · w = prénom (ou nom) · v = ville
   d = prestation · m = date (mois année) · g:1 = avis « générique » utilisé sur les pages Chauffage, Climatisation et Professionnels
   Après modification : relancer la génération (cd build && npm run build) pour mettre à jour les fichiers HTML.
   ========================================================================== */
const RV=[
{n:5,w:'Romain',v:'Orvault',d:'Petits travaux de plomberie',m:'juillet 2026',
 t:'Les travaux se sont très bien passés à tout point de vue. Maxime a été rapide à visiter le chantier et nous a fait profiter de ses conseils avisés. Les travaux ont été réalisés de manière très professionnelle dans un délai raisonnable, je recommande.'},
{n:5,w:'Julie M.',v:'Nantes',d:'Plomberie (neuf et rénovation)',m:'janvier 2026',
 t:'Je recommande ce professionnel pour son sérieux et la qualité de son suivi. Il est intervenu pour des travaux de plomberie et chauffage avec une approche très carrée : les délais annoncés ont été tenus et le chantier a été rendu impeccable. Au-delà de l’aspect technique, la communication a été excellente. Il s’est montré réactif pour répondre à mes questions et très arrangeant concernant l’organisation des interventions. Un artisan fiable et transparent, ce qui devient rare.'},
{n:5,w:'Nelly P.',v:'Fégréac',d:'Réparation, salle de bain ou toilettes',m:'octobre 2025',
 t:'Professionnel compétent, efficace et sympathique.'},
{n:4,w:'Auffret',v:'Le Pouliguen',d:'Remplacement de WC',m:'avril 2025',
 t:'Plombier très professionnel, qui connaît son métier. Travail soigné et bien fait. Je suis très satisfait ; tarif correct. Je recommande cet artisan. Bravo Maxime.'},
{n:5,w:'Noël',v:'Saint-Herblain',d:'Plomberie EP, garage ou cabanon',m:'mars 2025',g:1,
 t:'Travail soigné par un professionnel compétent et aimable, dans le délai convenu. Tarif raisonnable pour la prestation fournie. Très satisfait.'},
{n:5,w:'Pierre',v:'Saint-Herblain',d:'Réparation, salle de bain ou toilettes',m:'mars 2025',
 t:'Rapide et efficace, les travaux ont été réalisés rapidement pour le remplacement du flotteur sur un WC suspendu. Tarif honnête, je recommande cet artisan.'}
];
