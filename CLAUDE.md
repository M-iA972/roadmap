# Roadmap

## Le projet
Roadmap est une application web pour organiser le développement d'un produit logiciel.
Le fondateur y capture ses idées de features (nouvelles fonctionnalités, bugs, améliorations),
les rattache à un module du produit (facturation, onboarding, dashboard…),
les priorise, puis les planifie dans des sprints d'une ou deux semaines.
Les features sans sprint restent dans le backlog.
Une équipe de 4 personnes, chacune avec son compte, peut se voir assigner des features et les commenter.

## Fonctionnement
- Une feature a un titre, une description, une priorité, un effort, un nombre d'utilisateurs impactés,
  un statut, un module, éventuellement un sprint et une personne assignée.
- Un sprint a un objectif, une date de début, une date de fin et un statut (planification, actif, terminé).
- Un module a un nom, une description et une couleur.
- Les commentaires sont liés à une feature, avec leur auteur et leur date.
- Tables Supabase : features, sprints, modules, profiles, comments.

## Pages et design
- Écrans, contenu, actions et parcours : voir docs/ecrans.md
- Design (couleurs, typographie, composants) : voir docs/design-system.md
- Prototype HTML de référence : voir prototype/
Lis ces fichiers avant de créer ou de modifier un écran.

## Règles techniques
Tu génères du code en respectant strictement cette stack.
Objectif prioritaire : le code doit être lu et compris par des étudiants qui débutent en code. Clarté avant élégance.

### Stack
- Framework : Next.js (App Router, Server Components par défaut, "use client" uniquement quand nécessaire)
- Langage : TypeScript (strict mode). Pas de any ; si un type est vraiment impossible, unknown + narrowing, jamais any
- UI : React 19
- Styling : Tailwind CSS v4 (utility-first ; thème et tokens définis dans globals.css via @theme, pas de fichier de config JS ; pas de CSS modules ni styled-components)
- Composants : shadcn/ui (Radix UI + Tailwind). Utilise les composants existants avant d'en créer. Installe-les via npx shadcn@latest add <component>
- Icônes : lucide-react
- Formulaires : react-hook-form + zod
- Données : Supabase via @supabase/ssr
- State serveur : Server Actions (pas de React Query pour ces apps)

### Supabase
- La base Supabase existe déjà : tu la réutilises, tu ne la (re)crées pas.
- Avant d'écrire le moindre code de données, lis le schéma existant (via le MCP Supabase). N'invente jamais de table ni de colonne.
- Aucune migration, aucun CREATE TABLE / ALTER TABLE, aucun seed : tu ne modifies pas le schéma.
- Reprends exactement les noms de tables et de colonnes existants.
- Génère les types TypeScript à partir du schéma réel (generate_typescript_types via le MCP, ou des types strictement alignés sur les colonnes existantes) — pas de types inventés.
- Deux clients séparés : createServerClient côté serveur (lit les cookies) et createBrowserClient côté navigateur, rangés dans lib/supabase/.
- Lecture/écriture via Server Components et Server Actions par défaut.
- Variables d'environnement (dans app/.env, modèle dans app/.env.example) : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
- Clé publishable (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, l'ancienne « clé anon ») côté client (protégée par RLS). Clé service_role server-only, jamais dans un bundle client.
- L'introspection du schéma passe par le MCP (outil de dev) ; le code applicatif lit et écrit toujours via @supabase/ssr.

### Conventions
- Structure : app/ pour les routes, components/ pour le réutilisable, lib/ pour les utilitaires.
- Server Components par défaut ; passe en "use client" seulement pour l'interactivité (state, effects, event handlers). Garde ces composants client petits et en feuille de l'arbre.
- Place un commentaire en français au-dessus de chaque "use client" qui explique pourquoi ce composant doit être client.
- cn() (clsx + tailwind-merge) pour composer les classes conditionnelles.
- Accessibilité : composants sémantiques, attributs ARIA quand pertinents.
