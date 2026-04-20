import Link from "next/link";

export default function Home() {
  const roadmap = [
    {
      title: "Pick a Box",
      status: "primera simulacion",
      description:
        "Teoría de la información: usa preguntas binarias para encontrar la moneda escondida en el mínimo de intentos posible.",
      href: "/simulaciones/pick-a-box",
    },
    {
      title: "Enteros con signo",
      status: "en desarrollo",
      description:
        "Comparar el mismo patron de bits en signo-magnitud, complemento a 1, complemento a 2 y sesgo.",
      href: "/simulaciones/enteros-con-signo",
    },
    {
      title: "Coma flotante",
      status: "siguiente modulo",
      description:
        "Introducir mantisa, exponente sesgado, normalizacion y casos especiales con una UI reutilizable.",
      href: "/simulaciones",
    },
  ];

  const sections = [
    {
      title: "Simulaciones",
      text: "Experimentos interactivos para mover bits, rangos y modelos de representacion.",
      href: "/simulaciones",
    },
    {
      title: "Aprender",
      text: "Textos de apoyo, contexto historico y rutas para quien quiera profundizar.",
      href: "/aprender",
    },
    {
      title: "Videos",
      text: "Cada episodio tendra su pagina con resumen, enlaces y accesos a las simulaciones relacionadas.",
      href: "/videos",
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-6 py-16 lg:px-10 lg:py-20">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#4f46e5]">
              sitio base en construccion
            </p>
            <h1 className="max-w-4xl font-sans text-5xl font-semibold tracking-tight text-[#111827] md:text-6xl lg:text-7xl">
              Simulaciones para entender como una maquina interpreta el mundo.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#4b5563] md:text-xl">
              Este sitio sera el laboratorio interactivo del canal. Aqui viviran
              las simulaciones, el material de apoyo y la conexion directa entre
              cada video y cada experimento visual.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/simulaciones/pick-a-box"
              className="inline-flex items-center justify-center rounded-full bg-[#4f46e5] px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-[#6366f1] hover:shadow-indigo-300"
            >
              Ir a Pick a Box
            </Link>
            <Link
              href="/simulaciones"
              className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 py-3 font-sans text-sm font-semibold text-[#374151] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Ver todas las simulaciones
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[#4f46e5]">
                simulacion activa
              </p>
              <h2 className="mt-2 font-sans text-2xl font-semibold text-[#111827]">
                Pick a Box
              </h2>
            </div>
            <div className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1 font-sans text-xs text-[#4b5563]">
              teoría de la información
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] font-sans text-lg font-bold text-white shadow-[0_8px_20px_rgba(79,70,229,0.4)]"
              >
                {n}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-7 text-[#4b5563]">
            ¿En cuántas preguntas puedes encontrar la moneda? Modo individual, grupo o pregunta binaria.
          </p>
        </section>
      </section>

      {/* Sections grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.10)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)]"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[#4f46e5]">
              estructura minima
            </p>
            <h2 className="mt-4 font-sans text-2xl font-semibold text-[#111827]">
              {section.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              {section.text}
            </p>
          </Link>
        ))}
      </section>

      {/* Roadmap */}
      <section className="space-y-6 rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.10)] lg:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#4f46e5]">
              roadmap inicial
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold text-[#111827]">
              Lo primero que vamos a construir de verdad
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#4b5563]">
            Estos bloques marcan el orden de trabajo del sitio y sirven como
            andamio mientras el contenido real toma forma.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {roadmap.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[22px] border border-[#e5e7eb] bg-[#f9fafb] p-5 transition-all hover:border-[#4f46e5]/30 hover:shadow-md"
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                {item.status}
              </p>
              <h3 className="mt-3 font-sans text-2xl font-semibold text-[#111827]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#4b5563]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
