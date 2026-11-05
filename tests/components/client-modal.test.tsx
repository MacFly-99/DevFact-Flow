import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientModal } from '@/app/clients/client-modal';
import { createClient } from '@/app/clients/actions';

// On mocke la Server Action (on ne veut pas la vraie exécution ici)
vi.mock('@/app/clients/actions', () => ({
  createClient: vi.fn(),
}));

describe('Composant: ClientModal', () => {
  it('doit s\'ouvrir et afficher les champs du formulaire', async () => {
    render(<ClientModal />);
    
    // Le bouton pour ouvrir
    await userEvent.click(screen.getByText('+ Nouveau Client'));

    // On vérifie que les champs sont visibles
    expect(screen.getByPlaceholderText('Ex: Jean Dupont')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('contact@acme.com')).toBeInTheDocument();
  });

  it('doit appeler la Server Action lors de la soumission', async () => {
    render(<ClientModal />);
    
    await userEvent.click(screen.getByText('+ Nouveau Client'));

    // L'utilisateur remplit
    await userEvent.type(screen.getByPlaceholderText('Ex: Jean Dupont'), 'Jean Test');
    await userEvent.type(screen.getByPlaceholderText('contact@acme.com'), 'jean@test.com');

    // Il clique sur Enregistrer
    await userEvent.click(screen.getByText('Enregistrer le client'));

    // On vérifie que l'action a été appelée
    expect(createClient).toHaveBeenCalled();
  });
});