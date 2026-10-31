import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Le Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          DevFact <span className="text-brand-accent">Flow</span>
        </Link>

        {/* Les liens de navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/clients" 
            className="text-text-muted hover:text-brand-accent transition-colors"
          >
            Clients
          </Link>
          <Link 
            href="/quotes" 
            className="text-text-muted hover:text-brand-accent transition-colors"
          >
            Devis
          </Link>
        </nav>
      </div>
    </header>
  );
}