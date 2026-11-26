-- 0002 : Row Level Security (RLS) et policies.
--
-- Ce fichier décrit l'état réel de la base du projet, relevé via le MCP Supabase
-- dans pg_tables (RLS activée) et pg_policies (policies). Les conditions sont
-- recopiées telles que Postgres les stocke, sans simplification.
-- Il n'a PAS été exécuté : la base contient déjà tout cela.
-- Il sert à recréer la même sécurité sur une base neuve, après 0001_init.sql.
--
-- Règle générale : toute personne connectée (rôle « authenticated ») peut tout lire ;
-- les écritures dépendent du rôle (profiles.role = 'admin' ou 'user').
-- Les rôles non connectés (anon) n'ont aucune policy : ils ne peuvent rien faire.

-- ============================================================
-- 1. Activer la RLS sur les 5 tables
-- ============================================================

alter table public.profiles enable row level security;
alter table public.modules  enable row level security;
alter table public.sprints  enable row level security;
alter table public.features enable row level security;
alter table public.comments enable row level security;

-- ============================================================
-- 2. Policies des tables
-- ============================================================

-- ---------- profiles ----------
-- Tout le monde (connecté) lit tous les profils. Chacun ne peut modifier que son
-- propre profil, et sans jamais changer son rôle (le rôle doit rester identique).
-- Aucune policy d'insertion ni de suppression : les profils sont créés par le trigger
-- on_auth_user_created, qui ne dépend pas de la RLS.

create policy "Authenticated users can read profiles"
  on public.profiles
  as permissive
  for select
  to authenticated
  using (true);

create policy "Users can update own profile but not role"
  on public.profiles
  as permissive
  for update
  to authenticated
  using (id = auth.uid())
  with check (role = ( SELECT profiles_1.role
     FROM profiles profiles_1
    WHERE (profiles_1.id = auth.uid())));

-- ---------- modules ----------
-- Lecture pour toute personne connectée ; création, modification et suppression
-- réservées aux admins.

create policy "Authenticated users can read modules"
  on public.modules
  as permissive
  for select
  to authenticated
  using (true);

create policy modules_insert_admin
  on public.modules
  as permissive
  for insert
  to authenticated
  with check (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

create policy modules_update_admin
  on public.modules
  as permissive
  for update
  to authenticated
  using (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text)
  with check (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

create policy modules_delete_admin
  on public.modules
  as permissive
  for delete
  to authenticated
  using (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

-- ---------- sprints ----------
-- Lecture pour toute personne connectée ; création, modification et suppression
-- réservées aux admins.

create policy "Authenticated users can read sprints"
  on public.sprints
  as permissive
  for select
  to authenticated
  using (true);

create policy sprints_insert_admin
  on public.sprints
  as permissive
  for insert
  to authenticated
  with check (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

create policy sprints_update_admin
  on public.sprints
  as permissive
  for update
  to authenticated
  using (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text)
  with check (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

create policy sprints_delete_admin
  on public.sprints
  as permissive
  for delete
  to authenticated
  using (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

-- ---------- features ----------
-- Lecture pour toute personne connectée ; création réservée aux admins ;
-- modification et suppression pour les admins et pour la personne assignée
-- à la feature (features.assigned_to).
-- La policy de modification n'a pas de WITH CHECK : Postgres réutilise alors la
-- condition USING pour vérifier la ligne modifiée.

create policy "Authenticated users can read features"
  on public.features
  as permissive
  for select
  to authenticated
  using (true);

create policy features_insert_admin
  on public.features
  as permissive
  for insert
  to authenticated
  with check (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text);

create policy "Admins and assignees can update features"
  on public.features
  as permissive
  for update
  to authenticated
  using (((( SELECT profiles.role
     FROM profiles
    WHERE (profiles.id = auth.uid())) = 'admin'::text) OR (assigned_to = auth.uid())));

create policy "Admins and assignees can delete features"
  on public.features
  as permissive
  for delete
  to authenticated
  using (((( SELECT profiles.role
     FROM profiles
    WHERE (profiles.id = auth.uid())) = 'admin'::text) OR (assigned_to = auth.uid())));

-- ---------- comments ----------
-- Lecture pour toute personne connectée ; on ne crée un commentaire qu'en son nom
-- (author_id = soi) ; seul l'auteur modifie son commentaire ;
-- l'auteur ou un admin peut le supprimer.

create policy "Authenticated users can read comments"
  on public.comments
  as permissive
  for select
  to authenticated
  using (true);

create policy comments_insert_own_author
  on public.comments
  as permissive
  for insert
  to authenticated
  with check (author_id = ( SELECT auth.uid() AS uid));

create policy comments_update_author_only
  on public.comments
  as permissive
  for update
  to authenticated
  using (( SELECT auth.uid() AS uid) = author_id)
  with check (( SELECT auth.uid() AS uid) = author_id);

create policy comments_delete_author_or_admin
  on public.comments
  as permissive
  for delete
  to authenticated
  using ((author_id = ( SELECT auth.uid() AS uid)) OR (( SELECT p.role
     FROM profiles p
    WHERE (p.id = ( SELECT auth.uid() AS uid))) = 'admin'::text));

-- ============================================================
-- 3. Policies du bucket « avatars » (storage.objects)
-- ============================================================

-- ---------- storage.objects, bucket « avatars » ----------
-- Chaque personne connectée ne touche qu'à son dossier : avatars/<son id>/…
-- (storage.foldername(name))[1] est le premier dossier du chemin du fichier.
-- La policy de dépôt (INSERT), « Avatar : dépôt dans son dossier », est déjà créée
-- dans 0001_init.sql : elle n'est pas répétée ici.
-- Les deux policies ci-dessous portent le nom généré par le tableau de bord
-- Supabase, conservé tel quel. Le nom dit « modification », mais _0 couvre la
-- modification (UPDATE, nécessaire pour remplacer une photo avec upsert) et _1 la
-- lecture (SELECT, nécessaire pour que upsert retrouve le fichier existant).
-- Le bucket étant public, l'affichage des photos par leur adresse n'a pas besoin
-- de policy.

create policy "Avatar : modification dans son dossier 1oj01fe_0"
  on storage.objects
  as permissive
  for update
  to authenticated
  using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));

create policy "Avatar : modification dans son dossier 1oj01fe_1"
  on storage.objects
  as permissive
  for select
  to authenticated
  using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));
