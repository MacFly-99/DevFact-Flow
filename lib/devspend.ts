export interface CategoryTotal {
  categorie: string;
  total: number;
}

export interface SpendSummary {
  total_general: number;
  total_par_categorie: CategoryTotal[];
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  montant: number;
  categorie: string;
  quote_id?: string | null;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': process.env.DEVSPEND_API_KEY as string,
});

// Récupérer les transactions (avec filtre optionnel)
export async function getTransactions(quoteId?: string) {
  const url = quoteId 
    ? `${process.env.DEVSPEND_API_URL}/transactions?quote_id=${quoteId}`
    : `${process.env.DEVSPEND_API_URL}/transactions`;
    
  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' });
  if (!res.ok) return [];
  return res.json() as Promise<Transaction[]>;
}

// Créer une transaction
export async function createTransaction(data: Partial<Transaction>) {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création");
  return res.json() as Promise<Transaction>;
}

// Modifier une transaction
export async function updateTransaction(id: number, data: Partial<Transaction>) {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification");
  return res.json() as Promise<Transaction>;
}

// Supprimer une transaction
export async function deleteTransaction(id: number) {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return true;
}