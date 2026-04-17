import { SectionShell } from "@/components/section-shell";

export default function VideosPage() {
  return (
    <SectionShell
      eyebrow="videos"
      title="Episodios y simulaciones asociadas"
      description="Cada video del canal terminara teniendo una pagina propia con resumen, enlaces, simulaciones relacionadas y material complementario."
    >
      <section className="rounded-[24px] border border-border bg-panel p-6">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-warning">
          episodio en preparacion
        </p>
        <h2 className="mt-3 font-sans text-3xl font-semibold text-foreground">
          De discretos a reales
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--text-secondary)]">
          Esta pagina enlazara el guion, la primera simulacion sobre enteros con
          signo y las futuras piezas sobre coma flotante. El texto de esta vista
          es provisional y sirve para fijar la arquitectura minima del sitio.
        </p>
      </section>
    </SectionShell>
  );
}