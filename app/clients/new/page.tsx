import { createClient } from "../actions";
import Link from "next/link";

export default function NewClientPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <Link href="/clients" className="text-brand-accent hover:underline mb-8 inline-block">
        ← Retour à la liste
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau client</h1>

      <form action={createClient} className="space-y-6 bg-white/5 p-8 rounded-xl border border-white/10">
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-main">
            Nom de l'entreprise / du client *
          </label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            required
            className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
            placeholder="Ex: Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-main">
            Email
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
            placeholder="contact@acme.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-text-main">
            Téléphone
          </label>
          <input 
            type="tel" 
            name="phone" 
            id="phone" 
            className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
            placeholder="06 12 34 56 78"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-brand-accent text-brand-night font-bold py-3 rounded-md hover:bg-brand-accent/90 transition-colors"
        >
          Enregistrer le client
        </button>
      </form>
    </div>
  );
}