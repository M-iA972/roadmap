import { ModuleBadge } from "@/components/module-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { getActionRequiredFeatures } from "@/lib/data/features";

// Grille commune à l'en-tête et aux lignes. Sur mobile, tout passe sur une colonne.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_130px] md:items-center md:gap-4";

// Section 4 du Dashboard : features du backlog sans personne assignée.
export async function ActionRequired() {
  const features = await getActionRequiredFeatures();

  return (
    <section aria-labelledby="action-title" className="mb-entre-sections">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 id="action-title" className="flex items-center gap-2 text-titre-section">
          Action requise
          {features.length > 0 && (
            <span className="rounded-pilule bg-jaune-soleil px-3 py-1 text-libelle">
              {features.length}
              <span className="sr-only"> features à traiter</span>
            </span>
          )}
        </h2>
        <span className="text-petit text-gris-texte">
          Features du backlog sans personne assignée
        </span>
      </div>

      {features.length === 0 ? (
        <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
          Rien à traiter : toutes les features du backlog ont une personne assignée.
        </p>
      ) : (
        <div role="table" aria-labelledby="action-title" className="flex flex-col gap-entre-lignes">
          <div role="row" className={`${columns} hidden px-6 md:grid`}>
            <span role="columnheader" className="text-libelle text-gris-texte">Feature</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Module</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Priorité</span>
          </div>

          {features.map((feature) => (
            // Bordure jaune soleil : ces lignes demandent une action.
            <div
              key={feature.id}
              role="row"
              className={`${columns} rounded-carte border-2 border-jaune-soleil bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair`}
            >
              <span role="cell" className="font-semibold">{feature.title}</span>
              <span role="cell"><ModuleBadge module={feature.module} /></span>
              <span role="cell"><PriorityBadge priority={feature.priority} /></span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
