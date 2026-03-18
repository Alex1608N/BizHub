# User Story 4-2: Export Excel (.xlsx) pentru Contabil

**Status:** Ready for Dev
**Epic:** Epic 4: Raportare & Exporturi Locale
**Description:** Ca Manager, doresc să export lista mișcărilor de stoc într-un format Excel nativ pe un interval de timp selectat, pentru a ușura munca contabilului.

## Acceptance Criteria
1.  **Selector Interval:** Posibilitatea de a alege o dată de început și o dată de sfârșit.
2.  **Format Nativ:** Fișierul generat trebuie să fie `.xlsx` (nu doar CSV), cu coloane formatate corect.
3.  **Date Incluse:** Data, Tip Mișcare, SKU, Produs, Cantitate, Preț Unitar, Total, Utilizator.
4.  **Performanță:** Exportul a 1000+ rânduri să se facă în sub 2 secunde local.

## Implementation Steps
- [ ] Instalarea librăriei `exceljs` sau similară.
- [ ] Crearea utilitarului de export în `src/lib/export.ts`.
- [ ] Adăugarea funcționalității de filtrare în UI înainte de export.
- [ ] Implementarea descărcării directe din browser.
