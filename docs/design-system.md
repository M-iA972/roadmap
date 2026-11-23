# Design system — Roadmap

Style : pop et doux. Fond clair, grandes cartes très arrondies, couleurs vives,
quelques cartes noires pour contraster, petites icônes au trait.

## Couleurs
| Nom | Valeur | Rôle |
|---|---|---|
| Rose fuchsia | #E8308C | Couleur principale : boutons principaux, lien actif du menu, éléments sélectionnés |
| Rose fuchsia foncé | #D01F79 | Survol du bouton principal |
| Rose clair | #FCE4F0 | Survol, fond des éléments sélectionnés |
| Violet très clair | #F3EFFF | Survol du bouton secondaire |
| Violet électrique | #7B5CFA | Couleur secondaire : boutons secondaires, liens |
| Jaune soleil | #FFC93C | Accents, alertes |
| Turquoise | #2EC4B6 | Succès, « terminé » |
| Bleu ciel | #6CB8FF | Information, « en cours » |
| Rouge cerise | #F2545B | Erreurs, suppression |
| Rouge cerise foncé | #E0434A | Survol du bouton Danger |
| Noir doux | #1E1B2E | Texte principal, cartes contrastées (sprint en cours) |
| Gris texte | #6E6A80 | Texte secondaire (dates, descriptions) |
| Gris bordure | #E6E1F0 | Bordures, séparateurs |
| Fond | #F7F3FF | Fond des pages |
| Blanc | #FFFFFF | Fond des cartes et des champs |

### Statuts des features (colonne status)
| Valeur en base | Libellé affiché | Fond | Texte |
|---|---|---|---|
| backlog | Backlog | #ECEAF2 | #6E6A80 |
| todo | À faire | #FFF1C9 | #8A6200 |
| in_progress | En cours | #DCEEFF | #1F6FC4 |
| done | Terminé | #D6F5F1 | #13877C |
| cancelled | Annulé | #F3F1F6 | #9B97A8 (texte barré) |

### Statuts des sprints
| Libellé affiché | Fond | Texte |
|---|---|---|
| Planification | #EDE7FF | #5A3FD6 |
| Actif | #E8308C | #FFFFFF |
| Terminé | #D6F5F1 | #13877C |

### Priorités (colonne priority)
| Valeur en base | Libellé affiché | Fond | Texte |
|---|---|---|---|
| critical | Critique | #F2545B | #FFFFFF |
| high | Haute | #FFE0D1 | #D2541B |
| medium | Moyenne | #FFF1C9 | #8A6200 |
| low | Basse | #DCEEFF | #1F6FC4 |
| nice_to_have | Bonus | #ECEAF2 | #6E6A80 |

### Modules
Chaque module garde la couleur choisie dans la base (colonne color),
affichée en pastille ronde devant son nom.

## Typographie
- Police : Urbanist (Google Fonts), pour tout le texte.
- Titre de page : 28 px, gras (700).
- Titre de section : 20 px, gras (700).
- Titre de carte : 16 px, demi-gras (600).
- Texte courant : 15 px, normal (500).
- Petit texte (dates, aides) : 13 px, gris texte.
- Couleur du texte : noir doux, ou blanc sur fond foncé.

## Espacements
Échelle de base 4 px : 4, 8, 12, 16, 24, 32, 48.
- Intérieur des cartes : 24 px.
- Espace entre deux cartes : 16 px.
- Espace entre deux sections : 32 px.
- Marges de la page : 32 px (16 px sur mobile).

## Arrondis
- Cartes et sections : 28 px.
- Boutons, badges, champs : forme pilule (999 px).
- Avatars et pastilles de module : ronds.
- Fenêtres de confirmation : 28 px.
- Menus déroulants et blocs repliables : 28 px, comme les cartes.
- Cases à cocher : 8 px (une case ronde se confondrait avec un bouton radio).

## Ombres
Une seule ombre douce pour les cartes : 0 8px 24px rgba(30, 27, 46, 0.06).
C'est aussi l'ombre des menus déroulants et du message de confirmation : il n'y en a pas d'autre.

## Composants de base

### Bouton
- Principal : fond rose fuchsia, texte blanc, pilule, 12 px × 24 px, gras.
  Survol : un peu plus foncé (#D01F79).
- Secondaire : fond blanc, bordure 2 px violet électrique, texte violet.
- Danger (Supprimer) : fond rouge cerise, texte blanc.
- Discret (Annuler, Retour) : sans fond, texte gris texte, souligné au survol.
- Bouton icône (retour, notifications) : rond de 44 px, fond blanc, bordure gris bordure.

### Petit bouton
Pour les actions répétées sur chaque ligne d'une liste (Modifier, Supprimer, Assigner)
et dans les petites zones (champ photo, édition d'un commentaire).
- Mêmes variantes et mêmes couleurs que le bouton (principal, secondaire, danger, discret),
  mêmes survols, forme pilule.
- Intérieur 8 px × 16 px, texte 13 px gras, icône 16 px.
- Variante lien d'action (Modifier / Supprimer sur un commentaire) : sans fond ni bordure,
  intérieur 4 px × 12 px, texte 13 px demi-gras violet électrique (rouge cerise pour Supprimer),
  icône 14 px. Survol : fond blanc.

### Survols
| Élément | Au survol |
|---|---|
| Bouton principal | fond rose fuchsia foncé (#D01F79) |
| Bouton secondaire | fond violet très clair (#F3EFFF), bordure et texte inchangés |
| Bouton danger | fond rouge cerise foncé (#E0434A) |
| Bouton discret | texte souligné |
| Bouton icône, lien du menu, filtre, option de menu déroulant, ligne de tableau, case à cocher | fond rose clair |
| Lien | texte souligné |
| Carte cliquable | remonte de 2 px, bordure rose clair |

### Badge de statut
Pilule, 4 px × 12 px, texte 13 px demi-gras, couleurs des tableaux de statuts.
Un petit point de la couleur du texte avant le libellé.

### Badge de priorité
Même forme que le badge de statut, couleurs du tableau des priorités.
Une petite flèche ou un éclair avant le libellé.

### Filtres
Pastilles qui filtrent une liste (Toutes / En sprint / Backlog, statuts des sprints).
- Pilule, intérieur 8 px × 16 px, texte 13 px demi-gras noir doux.
- Fond blanc, bordure 2 px gris bordure. Survol : fond rose clair.
- Filtre actif : fond et bordure rose fuchsia, texte blanc. Un seul filtre actif par groupe.
- 8 px entre deux filtres. Deux groupes de filtres sont séparés par un trait vertical
  de 1 px × 24 px gris bordure.

### Menu déroulant avec recherche
Pour choisir dans une liste qui peut s'allonger (modules, personnes, sprints, menu de l'avatar).
- Bouton d'ouverture : même style qu'un filtre, suivi d'une flèche vers le bas (14 px).
  Quand une valeur est choisie, il prend le style du filtre actif.
- Panneau : s'ouvre 8 px sous le bouton, largeur 280 px, fond blanc, arrondi 28 px,
  bordure 1 px gris bordure, ombre des cartes, intérieur 12 px.
- Barre de recherche en haut du panneau : champ de formulaire avec une loupe gris texte (16 px)
  à gauche (intérieur gauche 40 px). La recherche ignore les accents et les majuscules.
- Options : pilule, intérieur 8 px × 12 px, texte 15 px demi-gras, 4 px entre deux options,
  8 px entre la pastille ou l'avatar et le libellé. Un nombre éventuel s'aligne à droite en petit texte gris.
  Survol : fond rose clair. Option choisie : fond rose clair, texte rose fuchsia, coche rose fuchsia à droite.
- Aucun résultat : « Aucun … trouvé », en petit texte gris.
- Le panneau se ferme au clic sur une option, au clic à l'extérieur et avec la touche Échap.
- Sans barre de recherche quand la liste est courte et fixe (menu de l'avatar, personne, sprint).

### Case à cocher
- Carré de 22 px, arrondi 8 px, fond blanc, bordure 2 px gris bordure.
- Cochée : fond et bordure rose fuchsia, coche blanche (14 px).
- Focus clavier : bordure rose fuchsia.
- Toute la ligne est cliquable : pilule, intérieur 12 px × 16 px, 12 px entre la case et le libellé,
  4 px entre deux lignes. Survol : fond rose clair.

### Bloc repliable
Pour les options facultatives d'un formulaire (« Options avancées »). Replié par défaut.
- Fond blanc, bordure 2 px gris bordure, arrondi 28 px. Ouvert : bordure rose clair.
- En-tête : intérieur 12 px × 16 px, flèche rose fuchsia (pointe à droite quand le bloc est replié,
  vers le bas quand il est ouvert), titre 15 px demi-gras, résumé du contenu en petit texte gris aligné à droite.
  Survol de l'en-tête : fond rose clair.
- Contenu : intérieur 8 px en haut, 16 px sur les côtés et en bas.

### Carte
Fond blanc, arrondi 28 px, intérieur 24 px, ombre douce.
Variante contrastée (sprint en cours sur le dashboard) : fond noir doux, texte blanc.
Une carte cliquable remonte légèrement et prend une bordure rose clair au survol.

### Champ de formulaire
- Libellé au-dessus, 13 px, demi-gras.
- Champ : fond blanc, bordure 2 px gris bordure, pilule, 12 px × 16 px.
- Au clic (focus) : bordure rose fuchsia.
- Erreur : bordure rouge cerise + message en rouge sous le champ.
- Les listes déroulantes (module, sprint, statut, priorité, personne) ont le même style.
- Zone de texte (description, commentaire) : même style, arrondi 20 px.

### Tableau (liste des features, équipe)
Chaque ligne est une carte blanche arrondie, avec 8 px d'espace entre les lignes.
En-têtes en petit texte gris. Ligne survolée : fond rose clair.

### Menu
En haut de chaque page : logo « Roadmap » à gauche, puis Dashboard, Sprints, Modules, Équipe.
Lien actif : pilule rose fuchsia, texte blanc.

### Avatar
Photo ronde (32 px dans les tableaux, 64 px sur la fiche profil), contour blanc 2 px.
Sans photo : initiales sur fond violet clair (#EDE7FF, texte #5A3FD6, les couleurs du badge « Planification »),
13 px gras dans les tableaux, 20 px gras sur la fiche profil.

### Message de confirmation
Petite pilule en bas de l'écran pendant 3 secondes :
turquoise pour « Feature ajoutée », gris pour « Ajout annulé ».
