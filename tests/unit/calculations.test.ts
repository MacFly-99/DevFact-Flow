import { describe, it, expect } from 'vitest';
import { calculateTTC } from '@/lib/utils';

describe('Calculs de facturation', () => {
  it('doit calculer le TTC correctement avec 20% de TVA', () => {
    expect(calculateTTC(100, 20)).toBe(120);
  });

  it('doit retourner le prix HT si la TVA est de 0%', () => {
    expect(calculateTTC(150, 0)).toBe(150);
  });

  it('doit rejeter les prix négatifs', () => {
    expect(() => calculateTTC(-10, 20)).toThrow("Le prix ne peut pas être négatif");
  });
});