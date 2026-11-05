import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@/app/clients/actions';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 1. On mocke les dépendances (Auth et Prisma)
vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/prisma', () => ({
  default: { client: { create: vi.fn() } },
}));

// On mocke next/headers pour la session
vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// On mocke next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Server Action: createClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('doit refuser si l\'utilisateur n\'est pas connecté', async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('name', 'Test');
    formData.append('email', 'test@test.com');

    await expect(createClient(formData)).rejects.toThrow('Non autorisé');
  });

  it('doit rejeter les données invalides via Zod', async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_123' } });

    const formData = new FormData();
    formData.append('name', ''); // Nom vide (Zod doit bloquer)
    formData.append('email', 'email-invalide');

    await expect(createClient(formData)).rejects.toThrow();
    // Prisma ne doit jamais être appelé si Zod échoue
    expect(prisma.client.create).not.toHaveBeenCalled(); 
  });

  it('doit appeler Prisma si les données sont valides', async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user_123' } });
    
    const formData = new FormData();
    formData.append('name', 'Jean Dupont');
    formData.append('email', 'jean@example.com');
    formData.append('companyName', 'Acme Corp');

    await createClient(formData);

    expect(prisma.client.create).toHaveBeenCalledWith({
      data: {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        companyName: 'Acme Corp',
        phone: null,
        userId: 'user_123',
      },
    });
  });
});