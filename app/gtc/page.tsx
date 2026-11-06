export default function CGVPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>
      
      <div className="space-y-6 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Objet</h2>
          <p>Les présentes CGV régissent l'utilisation du service DevFact Flow, une application SaaS de gestion de devis et de facturation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Accès au service</h2>
          <p>L'accès au service nécessite la création d'un compte utilisateur. L'utilisateur est responsable de la confidentialité de ses identifiants.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Données et documents</h2>
          <p>L'utilisateur reste seul propriétaire des données qu'il saisit. DevFact Flow s'engage à ne pas exploiter ces données à des fins commerciales.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Responsabilité</h2>
          <p>DevFact Flow met tout en œuvre pour assurer un service de qualité mais ne saurait être tenu responsable des interruptions de service ou des pertes de données.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Contact</h2>
          <p>Pour toute question : admin@devfact-flow.com</p>
        </section>
      </div>
    </div>
  );
}