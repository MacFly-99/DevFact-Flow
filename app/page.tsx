"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { RegisterModal } from "./register-modal";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email" name="email" required
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password" name="password" required
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-night font-bold py-3 rounded-md hover:bg-brand-accent/90 transition-colors cursor-pointer"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6 flex items-center justify-center gap-1">
          Pas encore de compte ? 
          {/* On appelle la modale ici */}
          <RegisterModal />
        </p>
      </div>
    </div>
  );
}