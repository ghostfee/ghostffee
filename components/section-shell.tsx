import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-16 lg:px-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="space-y-4">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)]">
          {description}
        </p>
      </section>

      {children}
    </main>
  );
}