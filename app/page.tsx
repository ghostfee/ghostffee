import Link from "next/link";

export default function Home() {
  const roadmap = [
    {
      title: "Enteros con signo",
      status: "primera simulacion",
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
    {
      title: "Video y guion",
      status: "flujo editorial",
      description:
        "Conectar la simulacion con el video, el resumen didactico y los retos que apareceran en el episodio.",
      href: "/videos",
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
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-accent">
              sitio base en construccion
            </p>
            <h1 className="max-w-4xl font-sans text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Simulaciones para entender como una maquina interpreta el mundo.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)] md:text-xl">
              Este sitio sera el laboratorio interactivo del canal. Aqui viviran
              las simulaciones, el material de apoyo y la conexion directa entre
              cada video y cada experimento visual.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/simulaciones/enteros-con-signo"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-sans text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Ver primera simulacion
            </Link>
            <Link
              href="/videos"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-sans text-sm font-semibold text-foreground transition-colors hover:bg-panel"
            >
              Ver estructura del episodio
            </Link>
          </div>
        </div>

        <section className="rounded-[28px] border border-border bg-panel p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
                panel de simulacion
              </p>
              <h2 className="mt-2 font-sans text-2xl font-semibold text-foreground">
                Modo grabacion listo desde el inicio
              </h2>
            </div>
            <div className="rounded-full border border-border px-3 py-1 font-mono text-xs text-[color:var(--text-secondary)]">
              fondo plano
            </div>
          </div>

          <div className="space-y-4 rounded-[20px] border border-border bg-[#1E293B] p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 font-sans text-xs font-semibold text-slate-950">
                Blanco
              </span>
              <span className="rounded-full bg-[#00FF00] px-3 py-1 font-sans text-xs font-semibold text-slate-950">
                Chroma
              </span>
              <span className="rounded-full border border-border px-3 py-1 font-sans text-xs text-[color:var(--text-secondary)]">
                sin sombras fuertes
              </span>
            </div>

            <div className="grid gap-3 font-mono text-sm text-foreground sm:grid-cols-4">
              {[
                "0111 → 7",
                "1111 → -1",
                "1000 → -8",
                "sesgo → 0",
              ].map((value) => (
                <div key={value} className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
                  {value}
                </div>
              ))}
            </div>

            <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
              Este panel es provisional, pero ya fija la regla principal del
              proyecto: la zona de simulacion debe poder grabarse con recorte de
              pantalla sin pelearse con el fondo.
            </p>
          </div>
        </section>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="rounded-[24px] border border-border bg-panel p-6 transition-transform hover:-translate-y-1"
          >
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
              estructura minima
            </p>
            <h2 className="mt-4 font-sans text-2xl font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--text-secondary)]">
              {section.text}
            </p>
          </Link>
        ))}
      </section>

      <section className="space-y-6 rounded-[28px] border border-border bg-panel p-6 lg:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-accent">
              roadmap inicial
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold text-foreground">
              Lo primero que vamos a construir de verdad
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">
            Estos bloques marcan el orden de trabajo del sitio y sirven como
            andamio mientras el contenido real toma forma.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {roadmap.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[22px] border border-border bg-background p-5"
            >
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-warning">
                {item.status}
              </p>
              <h3 className="mt-3 font-sans text-2xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[color:var(--text-secondary)]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
