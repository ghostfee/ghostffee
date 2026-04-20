import Link from "next/link";
import { SectionShell } from "@/components/section-shell";

const simulations = [
  {
    title: "Pick a Box",
    status: "disponible",
    href: "/simulaciones/pick-a-box",
    description:
      "Encuentra la moneda escondida con el mínimo de preguntas. Compara búsqueda lineal vs. búsqueda binaria.",
  },
  {
    title: "Laboratorio de enteros con signo",
    status: "en desarrollo",
    href: "/simulaciones/enteros-con-signo",
    description:
      "Un mismo patrón de bits interpretado en signo-magnitud, complemento a 1, complemento a 2 y sesgo.",
  },
  {
    title: "Coma flotante simplificada",
    status: "próximamente",
    href: "/simulaciones",
    description:
      "Mantisa, exponente sesgado y normalización con una vista preparada para reutilizar el mismo estilo visual.",
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
            className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.10)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)]"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {simulation.status}
            </p>
            <h2 className="mt-3 font-sans text-3xl font-semibold text-[#111827]">
              {simulation.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              {simulation.description}
            </p>
          </Link>
        ))}
      </section>
    </SectionShell>
  );
}