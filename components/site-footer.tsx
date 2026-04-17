export function SiteFooter() {
  return (
    <footer className="border-t border-border/100 bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 lg:px-10">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-accent">
          ghostffee
        </p>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Simulaciones interactivas para explicar computacion, digitalizacion,
          representacion simbolica y teoria de la informacion. Este contenido es
          una base inicial y puede contener texto provisional.
        </p>
      </div>
    </footer>
  );
}