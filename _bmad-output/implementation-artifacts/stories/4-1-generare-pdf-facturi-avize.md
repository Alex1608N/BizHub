# User Story 4-1: Generare PDF (Facturi/Avize)

**Status:** Ready for Dev
**Epic:** Epic 4: Raportare & Exporturi Locale
**Description:** Ca Utilizator, doresc să pot genera un fișier PDF local pentru orice mișcare de stoc sau tranzacție, pentru a-l putea tipări sau trimite partenerilor.

## Acceptance Criteria
1.  **Buton Export:** Adăugarea unui buton "Descarcă PDF" în lista de mișcări de stoc sau în detaliul produsului.
2.  **Format Standard:** PDF-ul trebuie să conțină antetul firmei (din Story 4.0), data, produsele, cantitățile și prețurile.
3.  **Generare Locală:** PDF-ul se generează pe partea de server/client fără a depinde de servicii externe.
4.  **Denumire Fișier:** Numele fișierului să fie sugestiv (ex: `Factura_123_2026-03-18.pdf`).

## Implementation Steps
- [ ] Instalarea unei librării de PDF (ex: `jspdf`, `react-pdf` sau similar).
- [ ] Crearea unui template de document (factură/aviz).
- [ ] Implementarea rutei de API/Action pentru generarea stream-ului PDF.
- [ ] Testarea exportului cu date reale din DB.
