# Produktvision – Finanz- & Compliance-Management

**Document Version:** 2.0  
**Date:** 2025-01-28  
**Status:** ✅ UPDATED (Focus: Offers, Contracts, Lexware Integration)  
**Purpose:** Vision und Anforderungen für Angebotsmanagement, Vertragsmanagement, und Lexware-Integration

**⚡ Verknüpfte Spezifikationen:**
- **NFRs:** `docs/specifications/reviews/NFR_SPECIFICATION.md` – §5.3 DSGVO-Compliance-Framework, §5.4 GoBD-Compliance
- **Datenmodell:** `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` – §24 Offer Entity (interfaces, validation rules, business rules, GoBD immutability), §25 Contract Entity (interfaces, validation rules, signing workflow, project conversion), GoBD-Immutabilität, Änderungsprotokollierung
- **API-Spezifikation:** `docs/specifications/reviews/API_SPECIFICATION.md` – §13 Offer Management Endpoints (CRUD, send, accept, reject, supersede, PDF generation), §14 Contract Management Endpoints (CRUD, sign, create-project, complete, terminate), complete Opportunity→Offer→Contract→Project workflow
- **RBAC:** `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` – Offer/Contract permissions (INNEN: full CRUD, GF: approve/correct, PLAN: project creation from contracts), Buchhaltung (Zugriff auf Finanzdaten), GF (lesend auf Margen)
- **Integration:** Lexware-Integration Specification (optional, Phase 2+)

---

## 1. Vision & Zielsetzung

**Vision:**  
Das Finanz- & Compliance-Management-Modul sichert die **zentrale Verwaltung von Angeboten und Verträgen** mit nahtloser Integration zu Lexware (Rechnungswesen). Alle Finanzdaten sind zentral mit Kunden und Projekten verknüpft, was manuelle Doppelarbeit eliminiert und **Transparenz über den gesamten Vertriebszyklus** sicherstellt.

**Kernziele:**
1. **Angebotsmanagement** mit PDF-Upload und Statusverfolgung (Draft → Sent → Accepted/Rejected)
2. **Vertragsmanagement** mit PDF-Upload und Projektverknüpfung
3. **Financial Tracking** via Offers, Contracts, und Timetracking für Dashboard-Reporting
4. **Lexware-Integration** (Optional, Phase 2+): Read-only API für Rechnungsstatus und Zahlungsverfolgung
5. **DSGVO-Konformität** (Datenschutz, Löschfristen, Einwilligungen)

**⚠️ WICHTIG: Rechnungserstellung erfolgt in Lexware**  
KOMPASS erstellt **keine Rechnungen**. Lexware ist das führende System für Rechnungswesen. KOMPASS verwaltet Angebote und Verträge und ermöglicht optional die Anzeige von Rechnungsstatus aus Lexware (Phase 2+).

**📋 Geschäftsprozess-Workflow (Opportunity → Offer → Contract → Project):**

```
1. Opportunity (INNEN) → Customer qualifies
   ↓
2. Offer (INNEN creates & sends) → PDF with line items, pricing
   ↓ (Customer accepts)
3. Contract (INNEN creates, customer signs) → Immutable after signature
   ↓ (INNEN hands off to PLAN)
4. Project (PLAN creates from contract) → Project execution
   ↓
5. Project Delivery (PLAN manages) → Time tracking, cost management
   ↓
6. Lexware Invoicing (Phase 2+, BUCH) → Invoices created in Lexware
```

**Paradigm: Contract-First, Not Invoice-First**  
Unlike traditional systems that start with invoices, KOMPASS establishes a **signed contract** as the foundation for project work. This ensures:
- ✅ Clear project scope before work begins (from Offer line items)
- ✅ GoBD-compliant contract immutability after signature
- ✅ Audit trail for all project changes
- ✅ Financial tracking from contract value vs. actual costs
- ✅ Seamless handover from INNEN (pre-sales) to PLAN (execution)

---

## 2. Persona-Bedürfnisse

### 2.1 Innendienst/Kalkulation (Maria)

**Bedürfnisse:**
- Zentrale Verwaltung von Angeboten und Verträgen
- PDF-Upload für extern erstellte Angebote/Verträge
- Verknüpfung von Angeboten mit Opportunities und Kunden
- Verknüpfung von Verträgen mit Projekten
- Übersicht über Angebotsstatus (Offen/Angenommen/Abgelehnt)

**Pain Points (aktuell):**
- ⚠️ Angebote und Verträge liegen verstreut in verschiedenen Systemen
- ⚠️ Keine zentrale Übersicht über offene Angebote
- ⚠️ Manuelle Nachverfolgung von Angebotsfristen

### 2.2 Buchhaltung (Anna)

**Bedürfnisse:**
- Übersicht über Vertragswerte für Liquiditätsplanung
- Integration mit Lexware für Rechnungsstellung
- Sichtbarkeit von Projektstatus und -kosten
- Tracking von Projektmargen (Vertragswert vs. tatsächliche Kosten)

**Pain Points (aktuell):**
- ⚠️ Keine zentrale Übersicht über Vertragswerte und Projektkosten
- ⚠️ Manuelle Dateneingabe in Lexware für Rechnungen
- ⚠️ Keine Echtzeit-Sicht auf Projektmargen

### 2.3 Geschäftsführung (Herr Schmidt)

**Bedürfnisse:**
- Überblick über Pipeline-Value (offene Angebote)
- Übersicht über aktive Vertragswerte
- Margen-Analyse pro Kunde/Projekt
- Financial Dashboards mit Echtzeit-KPIs

**Pain Points (aktuell):**
- ⚠️ Warten auf wöchentliche Excel-Berichte
- ⚠️ Keine Echtzeit-Sicht auf finanzielle KPIs
- ⚠️ Fehlende Übersicht über Pipeline-Value

---

## 3. Funktionale Anforderungen

### 3.1 Angebotsmanagement (FIN-MUSS-001 bis FIN-MUSS-003)

**FIN-MUSS-001: Angebot erstellen und verwalten**
- Innendienst kann Angebot erstellen mit Grunddaten (Kunde, Opportunity, Datum, Gültigkeit, Gesamtwert)
- PDF-Upload für extern erstelltes Angebot (Drag & Drop oder Dateiauswahl)
- Automatische Angebotsnummer (Format: A-YYYY-#####)
- Status-Workflow: Entwurf → Versendet → Angenommen/Abgelehnt/Abgelaufen
- **Abnahmekriterium:** Angebot mit PDF in <5 Minuten erfasst

**FIN-MUSS-002: Angebot zu Vertrag konvertieren**
- Bei Annahme: Angebot kann zu Vertrag konvertiert werden (1-Klick)
- Vertragsdaten werden aus Angebot übernommen
- Verknüpfung bleibt erhalten (Offer → Contract)
- **Abnahmekriterium:** Konvertierung in <30 Sekunden

**FIN-MUSS-003: Angebotsverfolgung**
- Automatische Benachrichtigung bei Ablauf der Gültigkeit
- Dashboard: Offene Angebote, Pipeline-Value, Conversion-Rate
- Filter: Status, Kunde, Datum, Wert
- **Abnahmekriterium:** 95% der ablaufenden Angebote werden automatisch benachrichtigt

### 3.2 Vertragsmanagement (FIN-MUSS-004 bis FIN-MUSS-006)

**FIN-MUSS-004: Vertrag erstellen und verwalten**
- Vertrag erstellen mit Grunddaten (Kunde, Angebot, Projekt, Datum, Vertragswert)
- PDF-Upload für Auftragsbestätigung (Vertragsdokument)
- Automatische Vertragsnummer (Format: AB-YYYY-#####)
- Status-Workflow: Entwurf → Aktiv → Abgeschlossen/Storniert
- **Abnahmekriterium:** Vertrag mit PDF in <5 Minuten erfasst

**FIN-MUSS-005: Vertrag zu Projekt verknüpfen**
- Vertrag wird mit Projekt verknüpft (1:1 oder 1:n)
- Vertragswert wird in Projekt übernommen
- Projekt-Dashboard zeigt Vertragsinformationen
- **Abnahmekriterium:** Verknüpfung in <30 Sekunden

**FIN-MUSS-006: Financial Tracking**
- Dashboard: Aktive Vertragswerte, abgeschlossene Projekte, Margen
- Berechnung: Vertragswert - tatsächliche Kosten (aus Timetracking) = Marge
- Filter: Status, Kunde, Projekt, Datum
- **Abnahmekriterium:** Dashboard lädt in <2s (P95)

### 3.3 Lexware-Integration (FIN-OPTIONAL-001, Phase 2+)

**FIN-OPTIONAL-001: Lexware API-Integration (Phase 2+)**
- **Wichtig:** Rechnungserstellung erfolgt in Lexware (nicht in KOMPASS)
- **Read-only Integration:** KOMPASS zeigt Rechnungsstatus aus Lexware an
- API-Endpoints: GET Rechnungsstatus, GET Zahlungsstatus
- Anzeige im Projekt-Dashboard: "Rechnung R-2024-00123: Bezahlt am 15.12.2024"
- **Abnahmekriterium:** Rechnungsstatus wird korrekt angezeigt (optional, nur wenn Lexware-API verfügbar)

### 3.4 DSGVO-Compliance (FIN-MUSS-007)

**FIN-MUSS-007: DSGVO-Compliance für Angebote/Verträge**
- Kunden können eigene Angebots-/Vertragshistorie exportieren (Art. 15)
- Löschfristen: 10 Jahre für Verträge (GoBD), dann Anonymisierung
- PDF-Archivierung: Automatische Speicherung in MinIO/S3
- **Abnahmekriterium:** DPO bestätigt DSGVO-Konformität, Löschkonzept funktioniert

---

## 4. Nicht-funktionale Anforderungen

**Performance:**
- Angebot/Vertrag erstellen: <500ms API-Response
- PDF-Upload: <5s für 10MB PDF
- Dashboard (Financial Tracking): P95 ≤2s
- PDF-Download: <2s für 10MB PDF

**Verfügbarkeit:**
- Siehe NFR_SPECIFICATION.md: 95% Uptime (8x5)
- System benötigt täglich 9-17 Uhr

**Sicherheit:**
- Finanzdaten nur für BUCH/GF/KALK/PLAN sichtbar (RBAC)
- PDF-Dokumente verschlüsselt (at rest) in MinIO/S3
- Audit-Log für alle Finanz-Zugriffe
- Vertragsdaten verschlüsselt (at rest)

---

## 5. Compliance-Framework

### 5.1 GoBD-Compliance für Verträge

**Anforderungen (aus NFR_SPECIFICATION.md §5.4):**
1. Unveränderlichkeit von Verträgen nach Projektbeginn
2. Fortlaufende, lückenlose Vertragsnummerierung (AB-YYYY-#####)
3. Vollständiger Audit Trail aller Änderungen
4. 10-jährige Archivierung von Vertrags-PDFs (unveränderlich)
5. Zugriffskontrolle (wer durfte was sehen)

**Umsetzung:**
- Siehe DATA_MODEL_SPECIFICATION.md: Contract-Entity mit GoBD-Immutabilität
- Vertrag wird immutable wenn Projekt gestartet wird
- Change-Log für alle Korrekturen (mit Begründung + GF-Approval)
- PDF-Archivierung in MinIO/S3 mit Versionierung

**Wichtig:** Angebote sind **nicht** GoBD-relevant (können bearbeitet/gelöscht werden)

### 5.2 DSGVO-Compliance

**Konflikt GoBD/DSGVO gelöst (aus NFR_SPECIFICATION.md §5.3.2):**
- **Problem:** GoBD verlangt 10 Jahre Aufbewahrung, DSGVO verlangt Löschung nach Zweckerfüllung
- **Lösung:** Logische Löschung + Pseudonymisierung
  - Kundendaten werden anonymisiert (Name → "Gelöschter Kunde #123")
  - Vertragsdaten bleiben 10 Jahre erhalten (nur Beträge, keine Personendaten)
  - PDF-Dokumente bleiben erhalten (geschwärzte Version bei Kundenlöschung)
  - Nach 10 Jahren: Physische Löschung
- **Rechtsgrundlage:** Art. 17 Abs. 3 lit. b DSGVO (rechtliche Verpflichtung), DIN 66398

---

## 6. Integrationen

### 6.1 Lexware-Integration (Optional, Phase 2+)

**MVP (Phase 1): Keine Lexware-Integration**
- KOMPASS erstellt keine Rechnungen
- Buchhaltung erstellt Rechnungen manuell in Lexware
- Rechnungsdaten bleiben in Lexware (führendes System)

**Phase 2+ (Optional): Read-only Lexware API-Integration**
- **Wichtig:** KOMPASS erstellt **keine** Rechnungen, nur read-only Anzeige
- **Workflow-Context:** Rechnungen werden in Lexware **nach** Vertragsabschluss und Projektdurchführung erstellt
- **Data Flow:** KOMPASS (Angebot → Vertrag → Projekt) → Lexware (Rechnung)
- REST API-Integration zu Lexware (read-only)
- Anzeige von Rechnungsstatus im Projekt-Dashboard
- API-Endpoints:
  - `GET /lexware/invoices/{projectId}` - Zeige Rechnungen für Projekt
  - `GET /lexware/invoices/{invoiceId}/status` - Zeige Rechnungsstatus
  - `GET /lexware/invoices/{invoiceId}/payments` - Zeige Zahlungseingänge
- **Use Case:** GF/PLAN sieht im Projekt-Dashboard: "Rechnung R-2024-00123: Bezahlt am 15.12.2024"
- **Mapping:** Contract (KOMPASS) ← 1:n → Invoice (Lexware)
  - Ein Vertrag kann mehrere Rechnungen haben (z.B. Teilrechnungen, Schlussrechnung)
  - KOMPASS zeigt Vertragswert vs. fakturierter Betrag
  - Financial Tracking: Vertragswert (KOMPASS) - Rechnungsbetrag (Lexware) = Offener Betrag
- **Kosten-Nutzen:** €10-15k Implementierung, verbessert Transparenz

**Entscheidung:** Optional, deferred to Phase 2+ (nur wenn Lexware API verfügbar)

**Workflow-Beispiel mit Lexware:**
```
1. INNEN: Angebot A-2025-00042 erstellt (€59.500)
2. Kunde: Angebot akzeptiert
3. INNEN: Vertrag C-2025-00042 erstellt und signiert (€59.500)
4. PLAN: Projekt P-2025-B042 erstellt aus Vertrag
5. PLAN: Projekt durchgeführt (Timetracking, ProjectCost)
6. BUCH: Rechnung R-2025-00123 in Lexware erstellt (€20.000 - Teilrechnung)
7. BUCH: Rechnung R-2025-00124 in Lexware erstellt (€39.500 - Schlussrechnung)
8. KOMPASS (Phase 2+): Zeigt "Vertrag C-2025-00042: €59.500 (€59.500 fakturiert)"
```

### 6.2 PDF-Storage (MinIO/S3)

**MVP-Ansatz:**
- MinIO für selbst-gehostetes Object Storage
- Verschlüsselung at rest
- Versionierung für GoBD-Compliance
- Lifecycle-Policies für automatische Löschung nach 10 Jahren

---

## 7. Rollenbasierte Features

| Feature | Buchhaltung | Innendienst/Kalk | Planning | ADM | GF |
|---------|-------------|------------------|----------|------|-----|
| Angebot erstellen | ⚠️ Lesen | ✅ Voll | ⚠️ Lesen | ⚠️ Eigene Kunden | ✅ Voll |
| Angebot einsehen | ✅ Alle | ✅ Alle | ✅ Projekt-bezogen | ⚠️ Eigene Kunden | ✅ Alle |
| Vertrag erstellen | ✅ Voll | ✅ Voll | ⚠️ Lesen | ❌ Nein | ✅ Voll |
| Vertrag einsehen | ✅ Alle | ✅ Alle | ✅ Projekt-bezogen | ⚠️ Eigene Kunden | ✅ Alle |
| Financial Dashboards | ✅ Detail | ⚠️ Summary | ⚠️ Projekt-Marge | ⚠️ Pipeline-Value | ✅ Voll |
| PDF-Upload | ✅ Voll | ✅ Voll | ⚠️ Projekt-bezogen | ❌ Nein | ✅ Voll |
| Lexware-Status anzeigen | ✅ Voll | ✅ Status | ✅ Projekt-bezogen | ❌ Nein | ✅ Voll |

---

## 8. Akzeptanzkriterien

**Funktional:**
- [ ] Angebot mit PDF in <5 Minuten erfasst
- [ ] Vertrag mit PDF in <5 Minuten erfasst
- [ ] Angebot zu Vertrag konvertiert in <30 Sekunden
- [ ] Financial Dashboard lädt in <2s (P95)
- [ ] GoBD-Compliance für Verträge bestätigt (Steuerberater-Bestätigung)
- [ ] DSGVO-Löschkonzept funktioniert (10 Jahre GoBD, dann Anonymisierung)
- [ ] PDF-Upload funktioniert für 10MB-Dateien in <5s

**Nutzerakzeptanz:**
- [ ] Innendienst/Kalkulation: Zentrale Angebotsverwaltung als "nützlich" bewertet (4+/5)
- [ ] Buchhaltung: Financial Tracking als "nützlich" bewertet (4+/5)
- [ ] GF: Financial Dashboards als "nützlich" bewertet (4+/5)
- [ ] Steuerberater: Bestätigt GoBD-Compliance für Verträge

---

# Phase 2 Erweiterungen: Lexware Integration & Enhanced Tracking

**Status:** ⚠️ **Phase 2+** (Optional, nach MVP)

## 📊 Lexware API-Integration (Phase 2+, Optional)

**Problem:** Keine Sichtbarkeit von Rechnungsstatus in KOMPASS → GF/PLAN müssen in Lexware nachschauen.

**Lösung - Read-only Lexware API:**
- **Read-only Integration:** KOMPASS zeigt Rechnungsstatus aus Lexware an
- **API-Endpoints:**
  - `GET /lexware/invoices/{projectId}` - Zeige Rechnungen für Projekt
  - `GET /lexware/invoices/{invoiceId}/status` - Zeige Rechnungsstatus (Entwurf/Versendet/Bezahlt/Überfällig)
  - `GET /lexware/invoices/{invoiceId}/payments` - Zeige Zahlungseingänge
- **UI-Integration:** Projekt-Dashboard zeigt Rechnungen mit Status
- **Beispiel:** "Rechnung R-2024-00123: Bezahlt am 15.12.2024 (€25.000)"

**SLI/SLO Definition:**
- Lexware API Response Time: P95 <1s
- API Availability: >99%
- Data Freshness: <5 Minuten

**Alerting:**
- Warning: "Lexware API nicht erreichbar seit 15 Minuten" → E-Mail an ADMIN
- Info: "Rechnung überfällig" → Notification an Buchhaltung

---

## 🔐 Enhanced GoBD Compliance Monitoring (Phase 2)

**Automated Compliance Checks:**
- **Immutability Validation:** Automatischer Check "Ist finalisierter Vertrag unverändert?" (Hash-Vergleich)
- **10-Jahre-Archivierung-Alerts:** "Vertrag AB-2015-00045 erreicht Mindestaufbewahrungsfrist" → DSGVO-Anonymisierung prüfen
- **Change-Log-Completeness:** Alert wenn Änderungslog fehlt oder unvollständig

**Real-Time Compliance Dashboard:**
- GoBD Score: 0-100% (Wie viele Verträge GoBD-konform?)
- DSGVO-Kennzahlen: Wie viele Kunden mit abgelaufenem Consent? Wie viele Löschanfragen pending?
- Audit-Readiness-Indicator: "System bereit für Steuerprüfung" (✅ GRÜN) vs. "2 Dokumente fehlen Revision" (🟡 GELB)

---

**GAP-SCOPE-002 RESOLUTION: COMPLETE ✅**

**Prepared By:** Product & Finance Team  
**Sign-Off Required:** Innendienst, Buchhaltung, Steuerberater, DPO, GF

