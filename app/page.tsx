import { LoginForm } from "./login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace DevFact Flow.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  );
}