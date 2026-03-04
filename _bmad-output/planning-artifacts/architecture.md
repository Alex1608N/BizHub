---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['product-brief-practica-2026-02-25.md', 'prd.md']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-04'
tech_stack:
  frontend: 'Next.js (Vercel Hobby)'
  backend: 'Next.js API Routes / Render'
  database: 'Supabase (PostgreSQL + Auth + Storage)'
  email: 'Resend'
---

# Architecture Decision Document - practica

_Acest document este construit colaborativ prin descoperire pas cu pas. Secțiunile sunt adăugate pe măsură ce lucrăm împreună la fiecare decizie arhitecturală._

---

## 1. Context Tehnologic Inițial

Bazat pe cerințele de simplitate extremă și integritate radicală din PRD, am stabilit următorul stack tehnologic pentru MVP:

### Componente Core:
- **Framework:** **Next.js** - Ales pentru versatilitatea de a rula atât Frontend-ul cât și API Routes (Backend), facilitând o dezvoltare rapidă și deployment facil pe Vercel.
- **Baza de Date & Auth:** **Supabase** - Oferă PostgreSQL (esențial pentru tranzacții atomice și Audit Trail), Row Level Security (RLS) pentru izolarea multi-tenant și un sistem de autentificare gata de utilizare.
- **Infrastructură:** **Vercel** pentru hosting-ul aplicației și **Render** ca alternativă pentru procese de backend mai lungi, dacă va fi cazul.
- **Comunicații:** **Resend** pentru notificările asincrone și Audit Digests către manageri.

---

## 2. Analiza Contextului Proiectului

### Requirements Overview

**Functional Requirements:**
Arhitectura trebuie să suporte o izolare multi-tenant strictă și un sistem de audit trail granular. Componentele principale includ module de Gestiune Stoc, un motor de Audit imuabil și un sistem de acces bazat pe roluri (RBAC) pentru Manageri, Angajați și Contabili.

**Non-Functional Requirements:**
- **Integritate:** 100% din modificări logate; date critice reconstructibile.
- **Securitate:** Izolare `company_id` validată prin teste automate.
- **Performanță:** Răspuns sub 2s pe 4G; import masiv CSV în sub 30s.

**Scale & Complexity:**
- Primary domain: Web App (SaaS B2B)
- Complexity level: Medium
- Estimated architectural components: ~6 module core (Auth, Tenant Manager, Stock Engine, Audit Engine, Notification Service, Export Service).

---

## 3. Decizii de Arhitectură Detaliate (Sesiunea Party Mode)

### Identitate și Multi-Tenancy
- **Sursa de Adevăr:** Sesiunea de autentificare (JWT) este singura sursă de încredere pentru `company_id`.
- **Structură Date:** Un tabel `profiles` mapează `auth.uid()` la un `company_id` și un rol (RBAC).
- **Strategie RLS:** Politicile Supabase Row Level Security (RLS) vor filtra automat toate interogările: `USING (company_id = (select company_id from profiles where id = auth.uid()))`.
- **UX URL:** Păstrăm un „slug” opțional în URL pentru claritate mentală (ex: `/dashboard/nume-firma`), dar acesta este ignorat de logica de securitate a serverului.

### Sistemul de Audit și Integritate (Audit Trail)
- **Imuabilitate:** Tabelul `audit_log` este de tip **Append-Only**. Permisiunile de `UPDATE` și `DELETE` sunt blocate la nivel de bază de date (Postgres).
- **Granularitate:** Logăm toate operațiunile de tip **CUD** (Create, Update, Delete). Fiecare intrare conține: `user_id`, `company_id`, `timestamp`, `action_type`, `old_value`, `new_value` și `reason`.
- **Fereastra de Edit (7 zile):** Validată în Backend prin logică de tip: `current_time - record_created_at < 7 days`. Orice tentativă în afara ferestrei este respinsă cu eroare 403.

### Monitorizare și Prezență (Real-Time)
- **Model de Prezență:** Folosim **Supabase Realtime (Presence)** pentru a afișa cine mai vizualizează pagina curentă (stil Microsoft Office).
- **Limitare:** Vizibilitatea este restricționată la paginile de operare critice (ex: Tabel Stoc, Document Facturare), evitând un dashboard global de monitorizare pentru a menține simplitatea.

---

## 4. Evaluarea Șabloanelor (Starter Template)

### Primary Technology Domain
Web Full-Stack bazat pe analiza cerințelor proiectului.

### Starter Options Considered
- **Supabase Next.js Starter (Recomandat):** Șablon oficial cu Next.js 15+, App Router și `@supabase/ssr`. Ideal pentru integrare profundă cu Supabase și securitate SSR.
- **T3 Stack:** Oferă siguranță tip-safe extremă cu tRPC. Evitat pentru a menține stack-ul simplu și a folosi direct capabilitățile native Supabase.

### Selected Starter: Supabase Next.js Starter

**Rationale for Selection:**
Se aliniază perfect cu viziunea „Simplitate Extremă”, oferind în același timp „Transparență Radicală” prin integrarea profundă cu Supabase SSR și RLS. Menținut de echipa de bază, asigură bunele practici de securitate.

**Initialization Command:**
```bash
npx create-next-app@latest practica -e https://github.com/vercel/next.js/tree/canary/examples/with-supabase
```

**Decizii Arhitecturale oferite de Starter:**

**Language & Runtime:**
TypeScript configurat pentru siguranță pe server și client.

**Styling Solution:**
Tailwind CSS (standard în Next.js 15+) sau CSS Modules.

**Build Tooling:**
Next.js build pipeline optimizat pentru Vercel.

**Testing Framework:**
Va fi configurat ulterior (probabil Vitest sau Jest conform standardelor Next.js).

**Code Organization:**
Structură App Router cu separare între server și client components. Utilitare pentru crearea clientului Supabase în `utils/supabase/`.

**Development Experience:**
Fast Refresh, verificare tipuri TypeScript și suport Supabase CLI pentru dezvoltare locală.

---

## 5. Decizii Arhitecturale Core

### Data Architecture
- **Database:** PostgreSQL (via Supabase) cu validări stricte la nivel de tabel (`CHECK stock >= 0`).
- **Migrations:** Gestionate exclusiv prin **Supabase CLI** pentru consistență totală între mediile de dev și producție.
- **Integritate:** Chei străine obligatorii pe `company_id` pentru a preveni „scurgerile” de date între clienți.

### Authentication & Security
- **RBAC:** Roluri predefinite (`MANAGER`, `EMPLOYEE`, `ACCOUNTANT`) stocate în tabelul `profiles`.
- **Authorization:** Strategie hibridă: RLS pe baza de date (pentru date) + Middleware în Next.js (pentru acces la pagini/rute).

### API & Communication
- **Server Actions:** Metoda principală de scriere a datelor (Data Mutations), oferind siguranță tip-safe nativă cu TypeScript.
- **API Routes:** Rezervate exclusiv pentru procese de streaming sau acces extern (ex: exporturi PDF/CSV).

### Frontend Architecture
- **State Management:** Abordare minimalistă folosind exclusiv hook-urilor native React (Server Components, `useActionState`, `optimistic updates`). Fără biblioteci externe de stare globală.
- **UI System:** Tailwind CSS + Shadcn UI pentru o interfață modernă, rapidă și complet accesibilă.

### Infrastructure & Deployment
- **Hosting:** Vercel (Frontend & Serverless) + Supabase (DB & Realtime).
- **CI/CD Pipeline:** Automatizare completă prin GitHub Actions pentru verificări de tipuri, linting și deployment automat pe Vercel la push pe `master`.

---

## 6. Implementation Patterns & Consistency Rules

### Naming Patterns
- **Database:** `snake_case` pentru tabele la plural (`products`, `audit_logs`) și coloane (`company_id`).
- **TypeScript/React:** `PascalCase` pentru componente (`ProductTable.tsx`), `kebab-case` pentru fișiere utilitare (`supabase-client.ts`), `camelCase` pentru funcții/variabile (`getProductData`).

### Structure Patterns
- **Organization:** Componente globale în `components/ui/` (Shadcn) și `components/shared/`. Componente specifice paginilor sunt co-locate în `app/`.
- **Testing:** Fișierele de test are plasate lângă fișierul testat (`ProductTable.test.tsx`) pentru vizibilitate maximă pentru agenții AI.

### Format Patterns
- **API/Server Actions:** Format standard de răspuns: `{ data: T | null, error: string | null }`.
- **Dates:** Toate datele transmise între server și client sunt **ISO 8601 strings**.

### Process Patterns
- **Error Handling:** Utilizarea `Error Boundaries` pentru erori fatale și `Toasts` (notificări) pentru validări de formular.
- **Loading States:** Utilizarea `Skeletons` pentru feedback vizual fluid, menținând „Liniștea Digitală”.
- **Consistency Rule:** Orice modificare de date (CUD) **TREBUIE** să creeze o intrare corespunzătoare în `audit_log` într-o singură tranzacție sau proces atomic.

---

## 7. Project Structure & Boundaries

### Complete Project Directory Structure

```text
practica/
├── .github/ workflows/ ci.yml        # CI/CD Pipeline (GitHub Actions)
├── .supabase/                        # Configurații locale Supabase (Migrations, Seed)
│   └── migrations/                   # SQL Migrations (RLS, Triggers, Tables)
├── public/ assets/                   # Imagini, Logo-uri, Fonturi
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Rute grupate pentru Login/Register
│   │   ├── (dashboard)/              # Rute protejate (Multi-tenant scoped)
│   │   │   ├── inventory/            # Gestiune Stoc
│   │   │   ├── audit/                # Audit Trail & History
│   │   │   ├── team/                 # Management Echipă (RBAC)
│   │   │   └── layout.tsx            # Dashboard Layout cu Real-time Presence
│   │   ├── api/                      # API Routes pentru exporturi CSV/PDF
│   │   ├── globals.css               # Tailwind Config
│   │   └── layout.tsx                # Root Layout
│   ├── components/
│   │   ├── ui/                       # Componente Shadcn (Button, Input, etc.)
│   │   ├── shared/                   # Componente reutilizabile (Navbar, Sidebar)
│   │   └── features/                 # Componente complexe (StockTable, AuditTimeline)
│   ├── lib/
│   │   ├── supabase/                 # Supabase Client Factory (Server/Client/Middleware)
│   │   ├── audit-engine.ts           # Logica de înregistrare imuabilă a evenimentelor
│   │   └── utils.ts                  # Funcții helper (Tailwind merge, etc.)
│   ├── actions/                      # Server Actions (Stock mutations, User management)
│   ├── types/                        # Definiții TypeScript globale & Database Types
│   └── middleware.ts                 # Protecție rute & Session Refresh
├── .env.local                        # Variabile de mediu (Supabase URL/Key)
├── next.config.js                    # Configurare Next.js
├── tailwind.config.js                # Configurare Tailwind
└── tsconfig.json                     # Configurare TypeScript
```

### Architectural Boundaries

**API Boundaries:**
Server Actions sunt granița principală. Acestea validează `company_id` extras din sesiunea server-side (`supabase.auth.getUser()`) înainte de orice operațiune SQL.

**Component Boundaries:**
Utilizarea strictă a `Server Components` pentru preluarea datelor și `Client Components` (marcate cu `'use client'`) exclusiv pentru interacțiuni (formulare, modale, prezență realtime).

**Data Boundaries:**
Supabase Row Level Security (RLS) este bariera de netrecut. Nicio interogare nu poate "evada" din contextul `company_id` al utilizatorului autentificat.

---

## 8. Architecture Validation Results

### Coherence Validation ✅
Toate deciziile tehnice sunt compatibile. Utilizarea Supabase RLS ca barieră de securitate se aliniază perfect cu Server Actions din Next.js 15, oferind un flux de date securizat și performant.

### Requirements Coverage Validation ✅
- **FR1-4 (Auth):** Acoperite prin Supabase Auth și Middleware.
- **FR8-13 (Audit):** Acoperite prin Audit Engine imuabil și tabele Append-only.
- **NFR (Integritate/Performanță):** Susținute prin tranzacții Postgres și hosting pe Vercel.

### Gap Analysis Results
Nu au fost identificate goluri critice. Sistemul este pregătit pentru inițializarea proiectului și configurarea bazei de date (tabelele `profiles` și `audit_logs`).

### Architecture Readiness Assessment
**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** HIGH

**Key Strengths:**
- Izolare multi-tenant nativă la nivel de DB.
- Sistem de audit imuabil care garantează „Transparență Radicală”.
- Arhitectură minimalistă (Zero-Training) care reduce complexitatea frontend-ului.

### Implementation Handoff
**Prima Prioritate:** Executarea comenzii de inițializare a șablonului:
`npx create-next-app@latest practica -e https://github.com/vercel/next.js/tree/canary/examples/with-supabase`
