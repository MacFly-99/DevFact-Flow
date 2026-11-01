"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RegisterModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      setError(error.message || "Une erreur est survenue");
    } else {
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button className="text-brand-accent hover:underline font-medium cursor-pointer" />}>
        S'inscrire
      </DialogTrigger>
      
      <DialogContent className="bg-brand-night border-white/10 text-text-main sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl">Créer un compte</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}

        <form action={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text" name="name" required
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
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
              type="password" name="password" required minLength={8}
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-night font-bold py-3 rounded-md hover:bg-brand-accent/90 transition-colors mt-2 cursor-pointer"
          >
            S'inscrire
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}