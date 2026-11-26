-- 0003 : colonne updated_at et trigger qui la met à jour automatiquement.
--
-- Ce fichier n'a PAS été exécuté : la base contient déjà tout cela.
-- Il a été comparé à la base réelle via le MCP Supabase (information_schema.columns,
-- pg_proc, pg_trigger) : les colonnes, la fonction et les 5 triggers y existent
-- à l'identique. Il sert à recréer la même chose sur une base neuve,
-- après 0001_init.sql et 0002_rls_policies.sql.

-- ============================================================
-- 1. Colonne updated_at sur les 5 tables
-- ============================================================
-- Date de la dernière modification d'une ligne. À la création, elle vaut la date du jour
-- (DEFAULT now()). Elle est ensuite mise à jour par le trigger du bloc 3.
-- Dans la base, la colonne accepte NULL (pas de NOT NULL).

alter table public.profiles add column updated_at timestamptz default now();
alter table public.modules  add column updated_at timestamptz default now();
alter table public.sprints  add column updated_at timestamptz default now();
alter table public.features add column updated_at timestamptz default now();
alter table public.comments add column updated_at timestamptz default now();

-- ============================================================
-- 2. Fonction update_updated_at()
-- ============================================================
-- Fonction de trigger, commune aux 5 tables : elle remplace updated_at par la date
-- et l'heure actuelles dans la ligne qui est en train d'être modifiée (NEW),
-- puis renvoie cette ligne pour que la modification continue.

create or replace function public.update_updated_at()
  returns trigger
  language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- ============================================================
-- 3. Triggers set_updated_at (un par table)
-- ============================================================
-- Avant chaque UPDATE d'une ligne (BEFORE UPDATE ... FOR EACH ROW), la base appelle
-- update_updated_at() : updated_at est donc toujours à jour, sans que l'application
-- ait à s'en occuper. Les 5 triggers portent le même nom, set_updated_at,
-- chacun sur sa propre table.

create trigger set_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

create trigger set_updated_at
  before update on public.modules
  for each row execute function update_updated_at();

create trigger set_updated_at
  before update on public.sprints
  for each row execute function update_updated_at();

create trigger set_updated_at
  before update on public.features
  for each row execute function update_updated_at();

create trigger set_updated_at
  before update on public.comments
  for each row execute function update_updated_at();
