import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo + Copyright */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="DevFact Flow" className="h-7 w-7" />
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} DevFact Flow. Tous droits réservés.
          </p>
        </div>

        {/* Liens */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
          {/* On ajoute le lien vers les dépenses ici */}
          <Link href="/expenses" className="hover:text-brand-accent transition-colors font-medium text-white/80">
            Analytics Dépenses
          </Link>
          <a href="/legal" className="hover:text-brand-accent transition-colors">Mentions légales</a>
          <a href="/gtc" className="hover:text-brand-accent transition-colors">CGV</a>
          <a href="mailto:admin@devfact-flow.com" className="hover:text-brand-accent transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}