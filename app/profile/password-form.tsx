"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function PasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true, // Déconnecte les autres appareils par sécurité
    });

    if (error) {
      setError(error.message || "Erreur lors du changement de mot de passe");
    } else {
      setSuccess("Mot de passe modifié avec succès !");
      e.currentTarget.reset();
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
      {success && <p className="text-green-400 text-sm bg-green-500/10 p-2 rounded">{success}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
        <input
          type="password" name="currentPassword" required
          className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
        <input
          type="password" name="newPassword" required minLength={8}
          className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
        />
      </div>
      <button
        type="submit" disabled={isLoading}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? "Modification..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}