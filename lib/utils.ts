export { cn } from "cn"

export function calculateTTC(ht: number, taxRate: number): number {
  if (ht < 0) throw new Error("Le prix ne peut pas être négatif");
  if (taxRate < 0) throw new Error("Le taux de TVA ne peut pas être négatif");
  return ht + (ht * (taxRate / 100));
}