# User Story 4-0: Setări Firmă (Logo & Date Fiscale)

**Status:** Ready for Dev
**Epic:** Epic 4: Raportare & Exporturi Locale
**Description:** Ca Manager, doresc să pot salva datele de identificare ale firmei (Nume, CUI, Adresă) și să încarc un logo, astfel încât toate documentele generate (PDF/Excel) să fie personalizate și corecte din punct de vedere fiscal.

## Acceptance Criteria
1.  **Pagina Setări:** Crearea unei rute `/settings` (accesibilă doar pentru MANAGER).
2.  **Formular Identitate:** Câmpuri pentru: Nume Firmă, CUI, Registrul Comerțului, Adresă Sediu, Cont IBAN, Bancă.
3.  **Încărcare Logo:** Posibilitatea de a încărca o imagine (PNG/JPG) care să fie stocată local (public folder sau base64 în DB).
4.  **Persistență:** Datele sunt salvate în tabelul `settings` sau `companies` din SQLite.
5.  **Validare:** CUI-ul să fie validat minimal (format cifre).

## Implementation Steps
- [ ] Crearea tabelului `companies` în schema Drizzle (`src/db/schema.ts`).
- [ ] Implementarea Server Action-ului pentru salvarea setărilor.
- [ ] Crearea paginii `src/app/(dashboard)/settings/page.tsx`.
- [ ] Integrarea previzualizării logo-ului în formular.
