import { SectionShell } from "@/components/section-shell";

export default function SignedIntegersPage() {
  return (
    <SectionShell
      eyebrow="simulacion 01"
      title="Laboratorio de enteros con signo"
      description="Esta pagina es el destino de la primera simulacion. Aun es un placeholder, pero ya fija el espacio, el tono y el tipo de panel que usaremos para el laboratorio interactivo."
    >
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <article className="rounded-[24px] border border-border bg-panel p-6">
          <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
            configuracion
          </p>
          <div className="mt-5 grid gap-4 font-mono text-sm text-foreground sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">bits: 4 / 8 / 16</div>
            <div className="rounded-2xl border border-border bg-background p-4">esquema: comp2</div>
            <div className="rounded-2xl border border-border bg-background p-4">entrada: binario</div>
            <div className="rounded-2xl border border-border bg-background p-4">valor: 1111</div>
          </div>
        </article>

        <article className="rounded-[24px] border border-border bg-panel p-6">
          <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
            panel de grabacion
          </p>
          <div className="mt-5 rounded-[20px] border border-border bg-[#1E293B] p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 font-sans text-xs font-semibold text-slate-950">
                Blanco
              </span>
              <span className="rounded-full bg-[#00FF00] px-3 py-1 font-sans text-xs font-semibold text-slate-950">
                Chroma
              </span>
            </div>
            <div className="mt-5 grid gap-3 font-mono text-sm sm:grid-cols-4">
              {[
                "1000",
                "0111",
                "1111",
                "0000",
              ].map((pattern) => (
                <div key={pattern} className="rounded-2xl border border-border bg-background px-4 py-3 text-center text-foreground">
                  {pattern}
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </SectionShell>
  );
}