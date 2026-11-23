# Écrans de l'app Roadmap

## Liste des écrans
1. Dashboard
2. Nouvelle feature (formulaire)
3. Fiche feature
4. Modules
5. Nouveau module (formulaire)
6. Fiche module
7. Sprints
8. Nouveau sprint (formulaire)
9. Fiche sprint
10. Équipe
11. Fiche profil
12. Connexion
13. Créer mon compte (lien reçu par email)

Sur tous les écrans, sauf Connexion et Créer mon compte : un menu en haut avec Dashboard, Sprints, Modules, Équipe,
et à droite l'avatar et le prénom de la personne connectée.
Un clic sur l'avatar ouvre un petit menu (nom et email en tête) avec :
- « Mon profil » → Fiche profil de la personne connectée.
- « Se déconnecter » → écran Connexion, avec le message « Vous êtes déconnecté ».

## Détail

### 1. Dashboard
On y voit :
- Section 1 : un grand tableau de toutes les features, une ligne par feature :
  titre, sprint associé (ou « Backlog »), module (badge de couleur), personne assignée,
  puis « Modifier » et « Supprimer » en bout de ligne.
- Section 2 : le sprint en cours (objectif, dates, statut), avec un bouton « Tous les sprints » → écran Sprints.
- Section 3 : le bouton « Nouvelle feature ».
- Section 4 : « Action requise », la liste des features en backlog et non assignées
  (titre, module, priorité), avec leur nombre et un bouton « Assigner » sur chaque ligne.
On peut :
- Filtrer les features : en sprint, en backlog, par module.
  Le filtre par module est un menu déroulant : une barre de recherche en haut,
  puis « Tous les modules » et la liste des modules (avec leur couleur et leur nombre de features).
- Cliquer sur « Assigner » (section 4) → une petite fenêtre s'ouvre pour choisir une personne
  et un sprint (les deux sont obligatoires). Après validation, la feature passe au statut « À faire »
  dans le sprint choisi, quitte la section « Action requise », et le message « Feature assignée » s'affiche.
  « Annuler » ferme la fenêtre sans rien changer.
- Cliquer sur une feature → Fiche feature.
- Cliquer sur un sprint → Fiche sprint ; sur « Backlog » → applique le filtre backlog.
- Cliquer sur un module → Fiche module ; sur une personne → Fiche profil.
- « Modifier » rouvre le formulaire déjà rempli ; « Supprimer » demande une confirmation.
- Cliquer sur « Tous les sprints » → écran Sprints.
- Cliquer sur « Nouvelle feature » → écran Nouvelle feature.

### 2. Nouvelle feature (formulaire)
On y voit les champs : titre, description, priorité, effort, nombre d'utilisateurs impactés, module.
En dessous, un bloc « Options avancées », replié par défaut. Une fois ouvert, il permet de choisir
la personne assignée (ou « Non assignée ») et le sprint (ou « Aucun », la feature reste dans le backlog).
Si on n'ouvre pas les options avancées, la feature part automatiquement au statut « Backlog »,
non assignée et sans sprint (un message l'indique sous les champs).
Si on choisit un sprint, elle part au statut « À faire ».
On peut :
- « Enregistrer » → retour au Dashboard avec le message « Feature ajoutée ».
- « Annuler » → retour au Dashboard avec le message « Ajout annulé ».
Le même formulaire, déjà rempli, sert à modifier une feature. En modification seulement,
il contient en plus les champs statut, personne assignée et sprint (facultatif : vide = backlog).
« Enregistrer » ramène alors au Dashboard avec « Feature modifiée », « Annuler » avec « Modification annulée ».

### 3. Fiche feature
On y voit : titre, description, priorité, effort, utilisateurs impactés, statut,
module (avec sa couleur), sprint (ou « Backlog »), personne assignée (ou « Non assignée »).
Les cases « Sprint » et « Personne assignée » sont cliquables, même quand elles affichent
« Backlog » ou « Non assignée ».
En bas : tous les commentaires, du plus ancien au plus récent, avec l'auteur et la date,
et sur chacun les boutons « Modifier » et « Supprimer ».
On peut :
- Cliquer sur la case « Personne assignée » → une petite liste s'ouvre : « Non assignée » puis les membres.
  Un clic sur un nom change la personne tout de suite (message « Assignée à … »).
- Cliquer sur la case « Sprint » → une petite liste s'ouvre : « Backlog (aucun sprint) » puis les sprints
  en planification ou actifs. Un clic change le sprint tout de suite.
  Une feature qui sort du backlog passe au statut « À faire » ; une feature remise dans le backlog
  repasse au statut « Backlog » (sauf si elle est terminée ou annulée).
- Écrire un commentaire et cliquer sur « Envoyer ».
- « Modifier » un commentaire : son texte devient modifiable sur place, avec « Enregistrer »
  (message « Commentaire modifié », la mention « modifié » s'ajoute à la date) et « Annuler ».
- « Supprimer » un commentaire : une confirmation est demandée, puis le message « Commentaire supprimé » s'affiche.
- Cliquer sur « Modifier » pour changer la feature.
- Revenir au Dashboard.

### 4. Modules
On y voit la liste des modules : nom, couleur, description.
On peut :
- Cliquer sur « Nouveau module » → écran Nouveau module.
- Cliquer sur un module → Fiche module.
- « Modifier » ou « Supprimer » un module (suppression possible seulement s'il n'a plus aucune feature).

### 5. Nouveau module (formulaire)
On y voit les champs : nom, description, couleur.
On peut : « Enregistrer » ou « Annuler ». Le même formulaire, déjà rempli, sert à modifier un module.

### 6. Fiche module
On y voit : nom, couleur, description, date de création (« Créé le … »),
et la liste de ses features avec, pour chacune, son sprint ou « Backlog ».
On peut :
- Cliquer sur une feature → Fiche feature.
- Revenir à la liste des modules.

### 7. Sprints
On y voit la liste des sprints : objectif, date de début, date de fin, statut
(planification, actif, terminé), nombre de features.
Au-dessus de la liste : une barre de filtres et de tri, et le nombre de sprints affichés.
On peut :
- Filtrer par statut : Tous, Planification, Actif, Terminé.
- Filtrer par période : « Début à partir du » (date de début) et « Fin au plus tard le » (date de fin).
- Trier par date de début (plus récent ou plus ancien d'abord) ou par nombre de features
  (décroissant ou croissant). Par défaut : date de début, plus récent d'abord.
- « Réinitialiser les filtres » (à côté du nombre de sprints affichés) pour revenir aux filtres et au tri par défaut.
- Cliquer sur « Nouveau sprint » → écran Nouveau sprint.
- Cliquer sur un sprint → Fiche sprint.
- « Modifier » ou « Supprimer » un sprint (s'il contient des features, elles repartent dans le backlog).

### 8. Nouveau sprint (formulaire)
On y voit les champs : objectif, date de début, date de fin.
En dessous, un bloc « Options avancées », replié par défaut. Une fois ouvert, il liste les features du backlog
(titre, module, priorité) avec une case à cocher : les features cochées sont mises dans ce sprint
et passent au statut « À faire ».
Un nouveau sprint part automatiquement au statut « Planification » (un message l'indique sous les champs).
« Enregistrer » ramène à l'écran Sprints avec le message « Sprint ajouté » (ou « Sprint ajouté avec N features »).
On peut : « Enregistrer » ou « Annuler ». Le même formulaire, déjà rempli, sert à modifier un sprint ;
en modification seulement, il contient en plus le champ statut.

### 9. Fiche sprint
On y voit : objectif, date de début, date de fin, statut, date de création,
et la liste de ses features.
On peut :
- Cliquer sur une feature → Fiche feature.
- Cliquer sur « Modifier » (en haut, comme sur la fiche feature) → formulaire du sprint déjà rempli.
- Revenir à la liste des sprints (« Tous les sprints »).

### 10. Équipe
On y voit un tableau des membres : photo, prénom, nom, email, nombre de features assignées,
et un bouton « Inviter un membre ».
On peut :
- Cliquer sur une personne → Fiche profil.
- Cliquer sur « Inviter un membre » → une petite fenêtre s'ouvre avec seulement un champ email,
  et les boutons « Envoyer l'invitation » et « Annuler ».
  « Envoyer l'invitation » affiche le message « Invitation envoyée à … » ; la personne reçoit un email
  avec un lien vers l'écran Créer mon compte. Une adresse invalide ou déjà dans l'équipe affiche une erreur.

### 11. Fiche profil
On y voit : photo, prénom, nom, email, et la liste des features assignées à cette personne.
Sur son propre profil seulement (celui de la personne connectée) : la mention « C'est vous »
et un bouton « Modifier ».
On peut :
- Cliquer sur une feature → Fiche feature.
- Cliquer sur « Équipe » → écran Équipe.
- Sur son propre profil, cliquer sur « Modifier » → une fenêtre s'ouvre pour changer sa photo,
  son prénom, son nom et son email, avec « Enregistrer » (message « Profil modifié ») et « Annuler ».

### 12. Connexion
Écran sans menu du haut. On y voit : le logo, les champs email et mot de passe, le bouton « Se connecter ».
On peut :
- « Se connecter » → Dashboard. Un email invalide ou un mot de passe vide affiche une erreur sous le champ.

### 13. Créer mon compte (lien reçu par email)
Écran sans menu du haut, ouvert depuis le lien de l'email d'invitation.
On y voit : qui a envoyé l'invitation et l'email pour lequel le compte sera créé,
puis les champs prénom, nom, photo, mot de passe (8 caractères minimum), et le bouton « Rejoindre l'équipe ».
On peut :
- « Rejoindre l'équipe » → Dashboard, avec le message « Bienvenue dans l'équipe ! ».

## Parcours
- Consulter les features d'un sprint : Dashboard → « Tous les sprints » (ou menu Sprints) → clic sur un sprint → Fiche sprint (liste des features).
- Consulter les features du sprint en cours : Dashboard → section 2 → clic sur le sprint en cours → Fiche sprint.
- Lire les commentaires d'une feature : Dashboard → clic sur une feature → Fiche feature (commentaires en bas).
- Ajouter une idée : Dashboard → « Nouvelle feature » → remplir → « Enregistrer » → retour au Dashboard (« Feature ajoutée ») ; sans options avancées, elle apparaît dans « Action requise ».
- Ajouter une idée déjà planifiée : Dashboard → « Nouvelle feature » → remplir → ouvrir « Options avancées » → choisir la personne et le sprint → « Enregistrer ».
- Assigner une feature du backlog : Dashboard → section « Action requise » → « Assigner » → choisir une personne et un sprint → « Assigner » (« Feature assignée »).
- Changer la personne ou le sprint d'une feature : Fiche feature → clic sur la case « Personne assignée » ou « Sprint » → choisir dans la liste.
- Changer le statut ou toute autre information d'une feature : Dashboard ou Fiche feature → « Modifier ».
- Voir le backlog : Dashboard → filtre « Backlog ».
- Voir ce que fait une personne : menu Équipe → clic sur la personne → Fiche profil.
- Créer un module : menu Modules → « Nouveau module » → remplir → « Enregistrer ».
- Créer un sprint : menu Sprints → « Nouveau sprint » → remplir → « Enregistrer » (le sprint part en « Planification »).
- Créer un sprint avec des features du backlog : menu Sprints → « Nouveau sprint » → remplir → ouvrir « Options avancées » → cocher les features → « Enregistrer ».
- Modifier un sprint : Fiche sprint → « Modifier » (ou écran Sprints → « Modifier » sur la ligne).
- Retrouver un sprint : menu Sprints → filtrer par statut ou par période, trier par date ou par nombre de features.
- Inviter un membre : menu Équipe → « Inviter un membre » → saisir l'email → « Envoyer l'invitation ».
- Rejoindre l'équipe : email d'invitation → lien → Créer mon compte → remplir → « Rejoindre l'équipe » → Dashboard.
- Se connecter : Connexion → email et mot de passe → « Se connecter » → Dashboard.
- Modifier son profil : avatar en haut à droite → « Mon profil » → « Modifier ».
- Se déconnecter : avatar en haut à droite → « Se déconnecter » → Connexion.
