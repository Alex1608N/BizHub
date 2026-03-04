---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['product-brief-practica-2026-02-25.md']
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: 'Web App / SaaS B2B'
  domain: 'ERP Light / Business Operations'
  complexity: 'Medium'
  projectContext: 'Greenfield'
workflowType: 'prd'
---

# Product Requirements Document - practica

**Author:** Alex
**Date:** Wednesday, March 4, 2026

---

## Executive Summary

**practica** este o platformă SaaS B2B de management operațional (ERP Light) concepută pentru a elimina incertitudinea și neîncrederea în firmele mici și medii. Produsul livrează **"Liniște Digitală"** prin centralizarea stocurilor și a operațiunilor, oferind managerilor vizibilitate totală de la distanță. Viziunea centrală elimină necesitatea prezenței fizice pentru verificări, transformând haosul proceselor manuale într-un flux digital integru și transparent.

### What Makes This Special

*   **Audit Trail Imuabil:** Orice modificare este înregistrată definitiv (cine, ce, când), garantând integritatea 100% a datelor.
*   **Mecanismul de Edit "Anti-Panică":** Angajații corectează erorile într-o fereastră de **7 zile** cu un **motiv obligatoriu**, eliminând frica de tehnologie.
*   **Daily Audit Digest:** Managerii primesc rezumate asincrone la logare, protejându-le timpul personal fără a compromite controlul.

---

## Success Criteria

### User Success
*   **Angajat (Elena):** Finalizează recepția de marfă fără asistență tehnică. Metrică: >90% din erori sunt corectate autonom prin funcția Edit.
*   **Manager (Mihai):** Monitorizează afacerea de la distanță. Obiectiv: Reducerea timpului de verificare de la ~10 ore/săptămână la **2-3 ore/săptămână**.

### Business Success
*   **Conversie Pilot:** Cel puțin 1 firmă din 5 trece la abonament plătit după trial.
*   **Adopție:** Cel puțin 2 firme utilizează platforma zilnic ca instrument principal.

### Technical Success
*   **Integritate:** 100% din modificările datelor critice sunt logate; starea stocului este reconstructibilă integral din evenimente.

---

## Product Scope

### MVP - Phase 1 (Core Integrity)
*   Gestiune stoc (catalog, intrări, ieșiri) cu izolare multi-tenant (`company_id`).
*   Import inițial de produse prin CSV.
*   Audit Trail cu versionare și fereastră de Edit (7 zile) cu motiv obligatoriu.
*   Daily Audit Digest și notificări asincrone la logare.
*   Exporturi CSV/Excel (contabilitate) și PDF (documente operaționale).
*   Management simplificat al echipei (onboarding < 1 minut).

### Growth - Phase 2 (Compliance & Mobile)
*   Integrare e-Factura / ANAF (România).
*   Aplicație mobilă pentru scanare coduri de bare în depozit.

### Vision - Phase 3 (Intelligence)
*   Predictive AI pentru optimizarea stocurilor și recomandări automate de reaprovizionare.

---

## User Journeys

### 1. Călătoria Elenei (Protecție împotriva Erorilor)
Elena introduce o recepție greșită sub presiune. Identifică eroarea, accesează **Edit**, vizualizează valorile anterioare evidențiate și corectează cifra. Introduce motivul, confirmă și continuă lucrul fără a solicita asistență sau a genera tichete de suport.

### 2. Călătoria lui Mihai (Control Asincron)
Mihai se loghează dimineața și vizualizează **Daily Audit Digest**: *"Ieri: 45 operațiuni, 3 editări"*. Analizează motivele editărilor și istoricul ("Timeline") fără a întrerupe fluxul operațional al angajaților sau a se deplasa la locație.

### 3. Călătoria de Onboarding (Viteză Maximă)
Alex (Super-Admin) creează firma. Mihai acceptă invitația și adaugă 3 angajați în sub 60 de secunde folosind formularul minimalist. Angajații încep operarea stocului imediat.

---

## [SaaS B2B] Specific Requirements

### Technical Architecture
*   **Multi-Tenancy:** Izolare logică strictă prin `company_id` pe toate tabelele de business; interogări scoped automat.
*   **RBAC Matrix:**
    *   **MANAGER:** Acces total (Echipă, Stoc, Audit Trail).
    *   **EMPLOYEE:** Operațiuni zilnice (Stoc, Documente), Edit limitat la 7 zile.
    *   **ACCOUNTANT:** Read-only (Rapoarte, Exporturi).

### Compliance & Data
*   **Tiers:** Trial (14 zile), Basic (limitat, Audit 7 zile), Pro (nelimitat, Audit 90+ zile).
*   **Retention:** Logurile de audit sunt păstrate minim 90 de zile la nivel de backend pentru toate planurile.

---

## Functional Requirements

### 1. Identity & Access
*   **FR1:** Izolarea datelor între companii prin `company_id`.
*   **FR2:** Super-Admin gestionează ciclul de viață al firmelor pilot.
*   **FR3:** Managerul administrează utilizatorii firmei (Nume, Rol, Parolă).
*   **FR4:** Autentificare securizată și autorizare bazată pe roluri (RBAC).

### 2. Operations & Stock
*   **FR5:** Utilizatorii gestionează catalogul de produse și stocurile (Intrări/Ieșiri).
*   **FR6:** Sistemul suportă importul catalogului de produse din CSV.
*   **FR7:** Generarea documentelor operaționale (Facturi/Avize) în format PDF și export date în CSV/Excel.

### 3. Audit & Transparency (Contractul de Capabilități)
*   **FR8:** Înregistrarea automată a oricărei modificări (cine, ce, când).
*   **FR9:** Orice Editare creează un snapshot nou; datele istorice sunt imuabile.
*   **FR10:** Restricționarea Editării la 7 zile pentru rolul Employee (cu tooltip informativ).
*   **FR11:** Colectarea obligatorie a motivului pentru orice editare.
*   **FR12:** Vizualizarea comparativă a valorilor anterioare în timpul editării.
*   **FR13:** Generarea și afișarea Daily Audit Digest pentru Manager.

---

## Non-Functional Requirements

### Security & Reliability
*   **NFR-S1:** Audit Trail este *append-only*; nicio intrare nu poate fi ștearsă sau modificată.
*   **NFR-S2:** Izolarea `company_id` este verificată prin teste de integritate automate (Defect P0).
*   **NFR-R1:** Operațiuni de scriere tranzacționale (atomicitate 100%).
*   **NFR-R2:** Uptime de 99.5% în intervalul 08:00 - 22:00.

### Performance & Usability
*   **NFR-P1:** Timp de răspuns sub **2 secunde** pentru operațiunile principale pe conexiune 4G.
*   **NFR-P2:** Importul a 1000 de produse din CSV în sub **30 de secunde**.
*   **NFR-U1:** Interfață "Zero-Training"; utilizatorii noi pot opera fluxul de bază fără asistență în <30 min.
