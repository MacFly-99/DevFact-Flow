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

        {/* Liens Légaux */}
        <div className="flex gap-6 text-sm text-text-muted">
          <a href="/legal" className="hover:text-brand-accent transition-colors">Mentions légales</a>
          <a href="/privacy" className="hover:text-brand-accent transition-colors">Politique de confidentialité</a>
          <a href="mailto:admin@devfact-flow.com" className="hover:text-brand-accent transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}