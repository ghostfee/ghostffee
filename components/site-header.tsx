import Link from "next/link";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/simulaciones", label: "Simulaciones" },
  { href: "/videos", label: "Videos" },
  { href: "/aprender", label: "Aprender" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/100 bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="flex flex-col">
          <span className="font-sans text-xs uppercase tracking-[0.28em] text-accent">
            ghostffee
          </span>
          <span className="font-sans text-lg font-semibold text-foreground">
            Laboratorio de computacion
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm font-medium text-[color:var(--text-secondary)] transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}