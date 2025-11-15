# Persona: Marketing & Grafik (Merged Profile)

**Document Version:** 1.0  
**Date:** 2025-11-10  
**Status:** ✅ NEW PERSONA (resolves GAP-JOURNEY-003)  
**Purpose:** Consolidated persona for Marketing and Grafik roles (merged with Innendienst workflow)

**⚡ Relevante Spezifikationen:**

- **Rolle im System:** Unterstützende Rolle, **merged mit Innendienst-Workflows**
- **RBAC:** Siehe RBAC_PERMISSION_MATRIX.md – Read-Zugriff auf Kunden/Opportunities, Write für Marketing-Materials
- **Hauptnutzung:** CRM-Daten für Kampagnen, Success-Stories, Präsentationsmaterialien

---

## 1. Persona Übersicht

**Name:** Julia Weber (Beispielpersona)  
**Alter:** 32  
**Rolle:** Marketing & Grafik  
**Abteilung:** Marketing (oft Teil von oder eng zusammenarbeitend mit Innendienst)  
**Standort:** Büro (keine Offline-Anforderungen)

---

## 2. Verantwortlichkeiten

**Marketing:**

- Lead-Anreicherung (Kampagnen-Tracking)
- Success-Stories erstellen (aus abgeschlossenen Projekten)
- Präsentationsmaterialien für Innendienst/ADM
- Website/Social-Media-Content

**Grafik:**

- Visualisierungen für Angebote
- Projekt-Rendering (3D-Ansichten)
- Corporate Design für Dokumente

---

## 3. CRM-Nutzung

**Benötigte Funktionen:**

1. **Lesezugriff auf Kunden** (für Lead-Enrichment)
2. **Lesezugriff auf abgeschlossene Projekte** (für Success-Stories)
3. **Upload von Marketing-Materials** (verknüpft mit Kunden/Projekten)
4. **Tag-System** (z.B. "Referenz-Kunde", "Case-Study")

**Workflow-Integration:**

- Innendienst erstellt Angebot → Marketing bereitstellt Grafiken
- Projekt abgeschlossen → Marketing erstellt Success-Story
- Messe ansteht → Marketing bereitet Kunden-Präsentationen vor

**System-Rolle:** Read-Only auf Business-Daten + Write auf eigene Marketing-Dokumente

---

## 4. Entscheidung: Merge mit Innendienst (Empfehlung)

**Begründung:**

- Marketing/Grafik nutzt KOMPASS **unterstützend**, keine primäre Rolle
- Workflow eng mit Innendienst verzahnt
- Geringe Nutzungsfrequenz (wöchentlich statt täglich)
- Vermeidet Komplexität einer 6. Rolle

**Alternative:** Separate Rolle "Marketing" in Phase 2 bei Bedarf

**MVP-Implementierung:**

- Marketing-Nutzer erhalten Innendienst-Rolle (mit eingeschränkten Permissions via RBAC)
- Oder: Eigene Rolle "MARKETING" mit Custom Permission Set (read-only CRM, write Marketing-Docs)

---

**GAP-JOURNEY-003 RESOLUTION: COMPLETE ✅ (Merged Approach Recommended)**

**Prepared By:** Product Team  
**Decision:** Merge Marketing function into Innendienst permissions for MVP, separate role in Phase 2 if needed

---

# Phase 2/3: Customer Portal & Analytics für Marketing

**Relevant für:** Marketing/Grafik – Customer Success Stories & Data-Driven Campaigns

## 🌐 Customer Portal for Success Stories (Phase 2.2)

**Problem:** Marketing muss für Referenz-Cases Kunden manuell kontaktieren ("Können wir Ihr Projekt als Success Story zeigen?").

**Lösung:**

- **Kunden-Portal** zeigt abgeschlossene Projekte mit Foto-Gallery
- **1-Click-Consent:** Kunde klickt "Ja, ihr dürft das als Referenz nutzen" → Marketing bekommt Auto-Notification
- **Material-Download:** Kunde lädt eigene Projekt-Fotos hoch → Marketing kann für Case Studies nutzen

**Impact:**

- -60% Zeit für Success-Story-Akquise (von 5h → 2h pro Case)
- Mehr authentische Referenzen (Kunde fühlt sich wertgeschätzt)

---

## 📊 Analytics für Marketing-ROI (Phase 2.2)

**Custom Dashboards:**

- "Welche Branchen konvertieren am besten?" → Marketing fokussiert Kampagnen
- "Welche Lead-Quelle hat höchste Conversion?" (Messe vs. Online vs. Kaltakquise)
- "Durchschnittlicher Deal-Wert pro Branche" → Budget-Allokation optimieren

**Impact:**

- Data-driven Marketing-Decisions statt Bauchgefühl
- +20% Marketing-ROI durch bessere Zielgruppen-Fokussierung

---

**Siehe auch:**

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 2 (Customer Portal), Pillar 3 (Analytics)
- `docs/product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md` → Customer Portal KPIs

---
