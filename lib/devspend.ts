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

export async function getSpendSummary(): Promise<SpendSummary> {
  try {
    const res = await fetch(`${process.env.DEVSPEND_API_URL}/analytics/summary`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("⚠️ API Python déconnectée (Summary):", error);
    return { total_general: 0, total_par_categorie: [] }; 
  }
}

export async function getTransactions(quoteId?: string): Promise<Transaction[]> {
  try {
    const baseUrl = process.env.DEVSPEND_API_URL;
    const url = quoteId 
      ? `${baseUrl}/transactions/?quote_id=${quoteId}` 
      : `${baseUrl}/transactions/`;
      
    const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("⚠️ API Python déconnectée (Transactions):", error);
    return []; // On renvoie un tableau vide pour ne pas crasher la page
  }
}

export async function createTransaction(data: Partial<Transaction>): Promise<Transaction> {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Erreur détaillée Backend:", errorData); 
    throw new Error(errorData.detail?.[0]?.msg || errorData.detail || "Erreur lors de la création");
  }
  return res.json();
}

export async function updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction> {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Erreur détaillée Backend:", errorData);
    throw new Error(errorData.detail?.[0]?.msg || errorData.detail || "Erreur lors de la modification");
  }
  return res.json();
}

export async function deleteTransaction(id: number): Promise<boolean> {
  const res = await fetch(`${process.env.DEVSPEND_API_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return true;
}