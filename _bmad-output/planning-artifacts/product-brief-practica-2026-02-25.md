---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-03-06
author: Alex
---

# Product Brief: practica (Local Edition)

## Executive Summary

Platforma "practica" este o soluție de management operațional (ERP light) **local-first** dedicată firmelor mici și medii care doresc control total și viteză maximă fără dependența de servicii cloud. Scopul este eliminarea proceselor manuale prin integrarea stocurilor și facturării într-o aplicație ce rulează direct pe infrastructura locală a firmei. Produsul se diferențiază prin "Transparență Radicală" (Audit Trail local imuabil) și "Simplitate Extremă", oferind managerilor o unealtă de control discretă și ultra-rapidă.

---

## Core Vision

### Problem Statement
Managerii firmelor mici se confruntă cu haosul datelor fragmentate și cu o reticență față de software-ul complex sau serviciile cloud scumpe și greu de configurat. Există o nevoie de o unealtă care "pur și simplu funcționează" local, fără internet obligatoriu și fără baze de date externe.

### Proposed Solution
O aplicație desktop/web locală care pune accent pe **Integritate și Simplitate**. Succesul este garantat prin controlul total oferit de un sistem de **Audit Trail** stocat într-o bază de date locală securizată (SQLite), oferind o interfață intuitivă ce elimină necesitatea instruirii.

### Key Differentiators
- **Control Local Total:** Datele nu părăsesc niciodată mașina firmei. Privacy și viteză de acces instantanee.
- **Audit Trail Imuabil:** Orice modificare lasă o urmă digitală locală, eliminând suspiciunile.
- **Simplitate "Zero-Config":** Rulează local cu cerințe minime de sistem.

---

## Target Users

### Primary Users

**Managerul "Local" (ex: Domnul Mihai)**
- **Context:** Proprietar de magazin care vrea să vadă totul pe laptopul său din birou.
- **Motivație:** Vrea să elimine incertitudinea fără să plătească abonamente lunare cloud.
- **Pain Point:** Frica de a pierde datele dacă pică internetul sau dacă furnizorul de cloud dispare.

**Angajatul "Prudent" (ex: Elena de la Recepție)**
- **Context:** Operează aplicația de pe un terminal din depozit/magazin conectat la rețeaua locală.
- **Momentul "Aha!":** Când vede că aplicația răspunde instantaneu la orice click, fiind locală.

---

## Success Metrics (Local-First)

### User Success Metrics
- **Viteză de Operare:** Timp de încărcare a paginilor < 200ms (fiind local).
- **Liniștea Managerului:** Certitudinea că datele sunt salvate într-un fișier local ce poate fi arhivat oricând.

### Business Objectives
- **Eficiență Operațională:** Reducerea timpului alocat inventarului cu 50% prin acces instant la baza de date locală.

---

## MVP Scope (Local-Only)

### Core Features
- **Bază de Date Locală (SQLite):** Stocare eficientă și sigură într-un singur fișier local.
- **Gestiune Stoc & Catalog:** Managementul produselor și mișcărilor de stoc (Intrări/Ieșiri).
- **Audit Trail Local:** Jurnal de activitate imuabil înregistrat în SQLite.
- **Funcție de "Edit/Anti-Panică":** Corectare intuitivă cu logare automată.
- **Exporturi Locale:** Generare PDF și CSV direct pe disk-ul local.

### Out of Scope for MVP
- **Sincronizare Cloud:** Orice formă de replicare externă a datelor.
- **Acces de la distanță (Internet):** Aplicația este limitată la rețeaua locală/mașina locală.
- **Aplicații Mobile Cloud:** (Păstrate pentru viziunea viitoare, dar excluse din MVP-ul local).
