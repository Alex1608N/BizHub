"use server";

import { generateContent } from "@/lib/gemini";

export async function generateProductDescription(name: string, categoryName?: string) {
  if (!name) return "";

  const prompt = `Ești un asistent de management de inventar profesional. 
  Generează o descriere scurtă (max 250 caractere) și atractivă pentru un produs numit "${name}"${categoryName ? ` din categoria "${categoryName}"` : ""}.
  Descrierea trebuie să fie în limba română, să sune profesional și să evidențieze utilitatea produsului.
  Trimite doar textul descrierii, fără alte comentarii.`;

  try {
    const description = await generateContent(prompt);
    return description.trim();
  } catch (error) {
    console.error("Error generating AI description:", error);
    // Return a fallback message instead of throwing to avoid 500 error
    return "Descrierea nu a putut fi generată momentan (limită API atinsă).";
  }
}


export async function getInventoryInsights(products: any[], auditLogs: any[]) {
  // Vom implementa asta la pasul următor pentru reaprovizionare
  const prompt = `Ești un analist de date de inventar expert. Analizează următoarele produse și istoricul lor de audit pentru a oferi sugestii de reaprovizionare.
  
  Produse actuale: ${JSON.stringify(products.map(p => ({ nume: p.nume, stoc: p.stoc, unitate: p.unitate?.nume })))}
  Istoric audit (ultimele 20 acțiuni): ${JSON.stringify(auditLogs.slice(0, 20).map(l => ({ actiune: l.actiune, tabel: l.tabel, data: l.timestamp })))}

  Oferă 3 sugestii concrete de reaprovizionare sub formă de listă cu puncte în limba română. 
  Dacă totul este în regulă, confirmă acest lucru. 
  Răspunsul să fie scurt și la obiect.`;

  try {
    const insights = await generateContent(prompt);
    return insights.trim();
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return "Nu am putut genera sugestii în acest moment.";
  }
}
