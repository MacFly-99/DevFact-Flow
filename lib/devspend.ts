export interface CategoryTotal {
  categorie: string;
  total: number;
}

export interface SpendSummary {
  total_general: number;
  total_par_categorie: CategoryTotal[];
}

export async function getSpendSummary(): Promise<SpendSummary> {
  const apiUrl = process.env.DEVSPEND_API_URL;
  const apiKey = process.env.DEVSPEND_API_KEY;

  console.log("URL appelée :", apiUrl);
  console.log("Clé envoyée :", apiKey);

  try {
    const res = await fetch(`${apiUrl}/analytics/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey as string,
      },
      cache: 'no-store', // Pour avoir des données toujours à jour
    });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Impossible de contacter DevSpend-Flow:", error);
    // On renvoie des données vides en cas d'erreur pour ne pas crasher Next.js
    return { total_general: 0, total_par_categorie: [] }; 
  }
}