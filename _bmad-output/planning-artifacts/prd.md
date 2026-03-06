---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
inputDocuments: ['product-brief-practica-2026-02-25.md']
classification:
  projectType: 'Local Management App / ERP Light'
  domain: 'Inventory & Operations'
  complexity: 'Medium'
  projectContext: 'Local-Only MVP'
workflowType: 'prd'
---

# Product Requirements Document - practica (Local-First)

**Author:** Alex
**Date:** Friday, March 6, 2026

---

## Executive Summary

**practica** este o aplicație de management operațional local-first concepută pentru a elimina incertitudinea prin stocarea securizată și transparentă a datelor pe infrastructura proprie a firmei. Produsul livrează **"Liniște Digitală"** prin centralizarea stocurilor, oferind managerilor vizibilitate totală fără a depinde de conexiunea la internet sau servicii cloud.

### What Makes This Special (Local-Only)

*   **Audit Trail Local Imuabil:** Stocat în SQLite local, inatacabil prin interfață.
*   **Zero-Dependency Cloud:** Rulează offline, oferind protecție totală a datelor firmei.
*   **Viteză Instant:** Timp de răspuns la nivel de sistem local (sub 100ms).

---

## Success Criteria

### Technical Success
*   **Bază de Date Locală:** Schema SQLite configurată și funcțională pentru tranzacții atomice locale.
*   **Integritate:** 100% din modificări logate în fișierul de audit local.

---

## Product Scope (Local-Only MVP)

### MVP - Phase 1 (Local Foundation)
*   Gestiune stoc locală (SQLite database).
*   Import inițial de produse prin CSV local.
*   Audit Trail cu fereastră de Edit (7 zile) stocată local.
*   Exporturi locale în format PDF/CSV (pentru Contabilitate).

---

## Functional Requirements

### 1. Local Identity & Access
*   **FR1:** Autentificare locală simplă (fără cloud).
*   **FR2:** Administrarea profilurilor locale (Manager, Employee, Accountant).
*   **FR3:** Izolarea rolurilor la nivel de interfață locală.

### 2. Operations & Stock (Local DB)
*   **FR4:** CRUD pe Catalog Produse stocat în SQLite local.
*   **FR5:** Înregistrarea tranzacțiilor de stoc (Intrări/Ieșiri) în DB locală.
*   **FR6:** Import CSV local pentru popularea catalogului.

### 3. Audit & Transparency (Local Integrity)
*   **FR7:** Logarea automată a oricărei acțiuni locale în tabelul `audit_log`.
*   **FR8:** Fereastra de Edit (7 zile) verificată prin ceasul sistemului local.
*   **FR9:** Vizualizarea Timeline-ului de audit în Dashboard-ul local.

---

## Non-Functional Requirements (Local Performance)

### Security & Reliability
*   **NFR-S1:** Baza de date locală SQLite este singura sursă de adevăr.
*   **NFR-R1:** Tranzacții atomice locale pentru a preveni coruperea datelor la închiderea aplicației.

### Performance
*   **NFR-P1:** Timp de răspuns instant (sub 100ms pe orice pagină).
*   **NFR-P2:** Import CSV de 1000 produse în sub 5 secunde local.
