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
  } catch (error: any) {
    console.error("AI Description Error:", error.message || error);
    if (error.status === 403 || error.message?.includes('Forbidden')) {
      return "Descrierea nu a putut fi generată (acces neautorizat). Verifică API key.";
    }
    return "Descrierea nu a putut fi generată momentan.";
  }
}


function sanitizeForAI(data: string): string {
  if (!data) return "";
  // Eliminăm caracterele care ar putea fi folosite pentru prompt injection sau structuri JSON malformați
  return data
    .replace(/[\\<>'"$]/g, '')
    .substring(0, 300)
    .trim();
}

export async function getInventoryInsights(products: any[], auditLogs: any[]) {
  // Sortăm produsele după stoc (cele mai mici primele) pentru a oferi context relevant AI-ului
  const lowStockContext = [...products]
    .sort((a, b) => (Number(a.stoc) || 0) - (Number(b.stoc) || 0))
    .slice(0, 10);

  const safeProducts = lowStockContext.map(p => ({
    nume: sanitizeForAI(p.nume || ''),
    stoc: Number(p.stoc) || 0,
    unitate: sanitizeForAI(p.unitate?.simbol || '') // Corectat: simbol în loc de nume
  }));
  
  const safeLogs = auditLogs.slice(0, 15).map(l => ({
    actiune: sanitizeForAI(l.actiune || ''),
    tabel: sanitizeForAI(l.tabel || '')
  }));
  
  const prompt = `Ești un analist de date de inventar expert. Analizează următoarele produse (prioritizate după stoc mic) și istoricul lor de audit pentru a oferi sugestii de reaprovizionare.
  
  Produse actuale: ${JSON.stringify(safeProducts)}
  Istoric audit: ${JSON.stringify(safeLogs)}

  Oferă 3 sugestii concrete de reaprovizionare sub formă de listă cu puncte în limba română. 
  Dacă totul este în regulă și stocurile sunt suficiente, confirmă acest lucru. 
  Răspunsul să fie scurt, profesional și direct. Trimite DOAR textul sugestiilor.`;

  console.log("=== SENDING TO GEMINI ===");
  console.log("Prompt context size:", prompt.length);

  try {
    const insights = await generateContent(prompt);
    console.log("=== GEMINI RESPONSE SUCCESS ===");
    return insights.trim();
  } catch (error: any) {
    console.error("=== GEMINI RESPONSE ERROR ===");
    console.error("AI Insights Error:", error.message || error);
    return "Nu am putut genera sugestii în acest moment. Verifică configurația API.";
  }
}
