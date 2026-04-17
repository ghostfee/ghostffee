import { SectionShell } from "@/components/section-shell";

export default function LearnPage() {
  return (
    <SectionShell
      eyebrow="aprender"
      title="Notas, contexto y rutas de aprendizaje"
      description="Esta seccion alojara contenido de apoyo: explicaciones mas calmadas, historia, referencias y pequenos mapas para enlazar conceptos."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          "Historia de la representacion simbolica",
          "Del signo al sesgo",
          "Puente hacia coma flotante",
        ].map((item) => (
          <article key={item} className="rounded-[24px] border border-border bg-panel p-6">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
              borrador
            </p>
            <h2 className="mt-3 font-sans text-2xl font-semibold text-foreground">
              {item}
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--text-secondary)]">
              Texto provisional para reservar espacio a futuras piezas de apoyo
              conectadas con las simulaciones y los videos.
            </p>
          </article>
        ))}
      </section>
    </SectionShell>
  );
}