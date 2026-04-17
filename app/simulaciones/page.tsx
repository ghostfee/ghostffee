import Link from "next/link";
import { SectionShell } from "@/components/section-shell";

const simulations = [
  {
    title: "Laboratorio de enteros con signo",
    status: "siguiente implementacion",
    href: "/simulaciones/enteros-con-signo",
    description:
      "La primera simulacion real del sitio: un mismo patron de bits interpretado en varios esquemas.",
  },
  {
    title: "Coma flotante simplificada",
    status: "placeholder",
    href: "/simulaciones",
    description:
      "Mantisa, exponente sesgado y normalizacion con una vista preparada para reutilizar el mismo estilo visual.",
  },
];

export default function SimulationsPage() {
  return (
    <SectionShell
      eyebrow="simulaciones"
      title="Catalogo inicial de experimentos"
      description="Aqui iran viviendo los experimentos interactivos del canal. Por ahora esta es una estructura minima para ordenar el trabajo y empezar con la primera simulacion real."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        {simulations.map((simulation) => (
          <Link
            key={simulation.title}
            href={simulation.href}
            className="rounded-[24px] border border-border bg-panel p-6"
          >
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-warning">
              {simulation.status}
            </p>
            <h2 className="mt-3 font-sans text-3xl font-semibold text-foreground">
              {simulation.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--text-secondary)]">
              {simulation.description}
            </p>
          </Link>
        ))}
      </section>
    </SectionShell>
  );
}