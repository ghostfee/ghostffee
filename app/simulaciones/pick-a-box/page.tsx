import { PickABox } from "@/components/pick-a-box";

export const metadata = {
  title: "Pick a Box — Teoría de la Información | ghostffee",
  description:
    "Simulador interactivo de búsqueda binaria: encuentra la moneda escondida usando el mínimo de preguntas posible.",
};

export default function PickABoxPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 px-6 py-16 lg:px-10">
      {/* Header */}
      <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="space-y-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#4f46e5]">
            simulaciones · teoría de la información
          </p>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-[#111827] md:text-5xl">
            Pick a Box
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-[#4b5563]">
          Una moneda está escondida en una de las cajas. ¿Cuántas preguntas necesitas para encontrarla?
          Compara el modo caja a caja con la búsqueda binaria y ve cómo la entropía cae a la mitad en cada pregunta.
        </p>
      </section>

      <PickABox />
    </main>
  );
}
