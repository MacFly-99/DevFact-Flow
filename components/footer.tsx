export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-6">
      <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} DevFact Flow. Tous droits réservés.
        </p>
        <div className="flex gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-brand-accent transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-brand-accent transition-colors">CGV</a>
          <a href="#" className="hover:text-brand-accent transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}