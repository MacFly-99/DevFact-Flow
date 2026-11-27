import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
      </Link>

      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
      
      <div className="space-y-6 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">Éditeur du site</h2>
          <p>DevFact Flow</p>
          <p>Contact : admin@devfact-flow.com</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">Hébergement</h2>
          <p>Vercel Inc.</p>
          <p>440 N Barranca Ave #4133</p>
          <p>Covina, CA 91723 - États-Unis</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, code) est la propriété exclusive de DevFact Flow. Toute reproduction est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">Données personnelles</h2>
          <p>
            Les données collectées (nom, email, informations d'entreprise) sont utilisées uniquement pour le fonctionnement du service de facturation et ne sont en aucun cas transmises à des tiers. 
            Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment en contactant <strong>admin@devfact-flow.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}