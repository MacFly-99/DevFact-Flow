import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuote } from '@/app/quotes/actions';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// On ajoute revalidateTag au mock
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('next/headers', () => ({ 
  headers: vi.fn(() => Promise.resolve(new Headers())) 
}));

vi.mock('@/lib/auth', () => ({ 
  auth: { api: { getSession: vi.fn() } } 
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    quote: { count: vi.fn(), create: vi.fn() },
  },
}));

describe('Server Action: createQuote', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_123' } });
    (prisma.quote.count as any).mockResolvedValue(0); 
  });

  it('doit rejeter si les articles sont vides (Zod)', async () => {
    const formData = new FormData();
    formData.append('clientId', '123e4567-e89b-12d3-a456-426614174000');
    formData.append('taxRate', '20');
    formData.append('items', JSON.stringify([])); 

    await expect(createQuote(formData)).rejects.toThrow();
    expect(prisma.quote.create).not.toHaveBeenCalled();
  });

  it('doit calculer la TVA et créer le devis correctement', async () => {
    const formData = new FormData();
    formData.append('clientId', '123e4567-e89b-12d3-a456-426614174000');
    formData.append('taxRate', '20');
    formData.append('items', JSON.stringify([
      { description: 'Site web', quantity: 1, unitPrice: 1000 }
    ]));

    await createQuote(formData);

    expect(prisma.quote.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        total: 1000,       
        taxAmount: 200,    
        totalTTC: 1200,    
        number: 'DEV-2026-001-USER', 
      }),
    });
  });
});