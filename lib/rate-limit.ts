import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// On vérifie que les variables sont bien là en production
if (process.env.NODE_ENV === "production" && !process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is required in production");
}

const redis = Redis.fromEnv();

// On crée un objet qui contient nos différents "limiteurs"
export const limiters = {
  // Limiteur global pour le middleware (toutes les routes protégées)
  // 100 requêtes par minute par IP
  global: new Ratelimit({
    redis,
    prefix: "rl:global",
    limiter: Ratelimit.slidingWindow(100, "1 m"), // "sliding window" est plus fluide qu'une fenêtre fixe
  }),

  // Limiteur pour les Server Actions (ex: création de devis)
  // 10 requêtes par minute par utilisateur
  actions: new Ratelimit({
    redis,
    prefix: "rl:actions",
    limiter: Ratelimit.slidingWindow(10, "1 m"),
  }),
};