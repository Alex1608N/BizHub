---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['product-brief-practica-2026-03-06.md', 'prd.md']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-06'
tech_stack:
  frontend: 'Next.js (Local)'
  backend: 'Next.js API / Server Actions'
  database: 'SQLite (via Drizzle ORM)'
  auth: 'Local Session-based Auth'
---

# Architecture Decision Document - practica (Local-Only)

---

## 1. Context Tehnologic Local

Bazat pe cerința de "Local-Only" și "Simplitate Extremă", am regândit stack-ul tehnologic pentru MVP:

### Componente Core (Local):
- **Framework:** **Next.js 15+** - Aplicația web care rulează local, servind interfața și procesând datele.
- **Baza de Date:** **SQLite** - Stocare bazată pe un singur fișier local (`practica.db`), ideal pentru viteză și mentenanță locală ușoară.
- **ORM:** **Drizzle ORM** - Tip-safe și performant, oferă control total asupra schemei SQLite.
- **Auth:** **Lucia** sau sistem propriu de **Sesiuni în DB**, stocat local, pentru a diferenția rolurile (Manager/Angajat/Contabil).

---

## 2. Decizii de Arhitectură Detaliate (Local-First)

### Data Architecture
- **SQLite Engine:** Folosim driverul `better-sqlite3` pentru performanță maximă locală.
- **Audit Trail Imuabil:** Implementat prin **SQLite Triggers** sau logică strictă în Server Actions care blochează orice `DELETE` sau `UPDATE` pe tabelul `audit_logs`.
- **Integritate:** Migrările sunt gestionate prin `drizzle-kit` local.
- **Entități Vânzări:**
    - `vanzari`: Antetul tranzacției (cine, când, la ce firmă).
    - `vanzari_detalii`: Liniile de vânzare (ce produs, ce cantitate, ce preț la momentul respectiv).

### Autentificare & Securitate (Local)
- **Fără Cloud:** Nu folosim Supabase Auth. Autentificarea se face prin verificarea locală a parolelor hashed în tabelul `users`.
- **Izolare Roluri:** Controlat prin Middleware în Next.js, care verifică rolul utilizatorului din sesiune înainte de a servi pagini sau a permite acțiuni pe date.

---

## 3. Project Structure & Boundaries (Local)

### Directory Structure

```text
practica/
├── db/
│   ├── schema.ts            # Definiții tabele SQLite (products, audit_logs, users)
│   └── index.ts             # Initializare Drizzle cu local SQLite file
├── public/                  # Assets locale
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # UI components (Shadcn)
│   ├── lib/                 # Utilitare (Audit Engine local, Auth utils)
│   └── actions/             # Server Actions (Mutări de stoc cu Audit logic)
├── practica.db              # Baza de date SQLite (single-file)
├── drizzle.config.ts        # Configurare Migrări
└── next.config.js
```

### Architectural Boundaries
- Toate operațiunile de business sunt grupate în **Server Actions**.
- Orice Server Action care modifică datele este obligat să apeleze `auditEngine.log()` în aceeași tranzacție SQLite.
