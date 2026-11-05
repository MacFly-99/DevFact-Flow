import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuoteForm } from '@/app/quotes/new/quote-form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// On mocke l'action serveur (on teste juste l'UI ici)
vi.mock('@/app/quotes/actions', () => ({ createQuote: vi.fn() }));

const mockClients = [{ id: '1', name: 'Client Test' }];

describe('Composant: QuoteForm', () => {
  it('doit ajouter une nouvelle ligne quand on clique sur le bouton', async () => {
    render(<QuoteForm clients={mockClients} />);
    
    // Au début, il y a 1 champ description
    const initialInputs = screen.getAllByPlaceholderText('Ex: Création de site web');
    expect(initialInputs).toHaveLength(1);

    // On clique sur "Ajouter une ligne"
    await userEvent.click(screen.getByText('Ajouter une ligne'));

    // Maintenant, il y a 2 champs description
    const newInputs = screen.getAllByPlaceholderText('Ex: Création de site web');
    expect(newInputs).toHaveLength(2);
  });

  it('doit mettre à jour le total TTC en temps réel', async () => {
    render(<QuoteForm clients={mockClients} />);
    
    // On remplit le prix et la quantité
    const priceInput = screen.getByPlaceholderText('0.00');
    await userEvent.type(priceInput, '1000');
    
    // Le total TTC (1000 + 20% de TVA par défaut = 1200.00 €) doit s'afficher
    expect(screen.getByText('1200.00 €')).toBeInTheDocument();
  });
});