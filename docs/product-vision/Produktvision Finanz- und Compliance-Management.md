# Produktvision – Finanz- & Compliance-Management

**Document Version:** 1.0  
**Date:** 2025-11-10  
**Status:** ✅ NEW DOCUMENT (resolves GAP-SCOPE-002)  
**Purpose:** Vision und Anforderungen für Finanzmanagement, Rechnungswesen, und DSGVO/GoBD-Compliance

**⚡ Verknüpfte Spezifikationen:**
- **NFRs:** `docs/reviews/NFR_SPECIFICATION.md` – §5.3 DSGVO-Compliance-Framework, §5.4 GoBD-Compliance
- **Datenmodell:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` – Invoice/Payment-Entities, GoBD-Immutabilität, Änderungsprotokollierung
- **RBAC:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` – Buchhaltung (exklusiver Zugriff auf Finanzdaten), GF (lesend auf Margen)
- **Journeys:** `docs/reviews/USER_JOURNEY_MAPS.md` – Journey 2 (Projekt→Rechnung→Zahlung)
- **Tests:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` – E2E-INV-001 bis E2E-INV-008, GoBD-Immutabilitäts-Tests
- **Integration:** `docs/reviews/INTEGRATION_SPECIFICATIONS.md` – Lexware-Integration (Phase 2), DPA-Compliance

---

## 1. Vision & Zielsetzung

**Vision:**  
Das Finanz- & Compliance-Management-Modul sichert die **nahtlose Abwicklung von Rechnungsstellung und Zahlungsverfolgung** im Einklang mit deutschen Rechtsvorschriften (DSGVO, GoBD). Alle Finanzdaten sind zentral mit Kunden und Projekten verknüpft, was manuelle Doppelarbeit eliminiert und **Compliance automatisch sicherstellt**.

**Kernziele:**
1. **Automatisierte Rechnungserstellung** aus abgeschlossenen Projekten
2. **GoBD-konforme Unveränderlichkeit** von Rechnungen (Audit Trail)
3. **Zahlungsverfolgung** mit automatischen Mahnungen
4. **Lexware-Integration** (Phase 2: API-Sync, MVP: manueller Export)
5. **DSGVO-Konformität** (Datenschutz, Löschfristen, Einwilligungen)

---

## 2. Persona-Bedürfnisse

### 2.1 Buchhaltung (Maria)

**Bedürfnisse:**
- Schnelle Rechnungserstellung ohne manuelle Dateneingabe
- Automatischer Export zu Lexware (Phase 2)
- Übersicht über offene Forderungen
- DSGVO/GoBD-konforme Archivierung

**Pain Points (aktuell):**
- ⚠️ Manuelles Übertragen von Projektdaten in Lexware (fehleranfällig, 15-30 min/Rechnung)
- ⚠️ Keine zentrale Übersicht über Zahlungsstatus
- ⚠️ Mahnwesen manuell, Fristen werden vergessen

### 2.2 Geschäftsführung (Herr Schmidt)

**Bedürfnisse:**
- Überblick über offene Forderungen und Cash Flow
- Warnung bei überfälligen Zahlungen
- Margen-Analyse pro Kunde/Projekt

**Pain Points (aktuell):**
- ⚠️ Warten auf wöchentliche Excel-Berichte aus Buchhaltung
- ⚠️ Keine Echtzeit-Sicht auf finanzielle KPIs

---

## 3. Funktionale Anforderungen

### 3.1 Rechnungserstellung (FIN-MUSS-001 bis FIN-MUSS-005)

**FIN-MUSS-001: Rechnung aus Projekt erstellen**
- Buchhaltung kann mit einem Klick Rechnung aus abgeschlossenem Projekt erstellen
- Rechnungspositionen vorausgefüllt aus Projektdaten
- Rechnungsnummer automatisch vergeben (GoBD-konform: R-YYYY-xxxxx)
- **Abnahmekriterium:** Rechnung erstellt in <15 Minuten (vs. aktuell 30-45 Minuten)

**FIN-MUSS-002: GoBD-Konformität**
- Rechnungen nach Finalisierung unveränderlich (immutable)
- Änderungen nur mit Korrektur-Rechnung und GF-Freigabe
- Vollständiger Change-Log (wer, wann, was, warum)
- PDF-Archiv automatisch erstellt
- **Abnahmekriterium:** GoBD-Audit besteht, Steuerberater signiert Konformität

**FIN-MUSS-003: Zahlungsverfolgung**
- Fälligkeitsdatum automatisch berechnet (Zahlungsziel aus Kundenstamm)
- Status-Tracking: Entwurf → Versendet → Bezahlt → Überfällig
- Automatische Erinnerungen: 7 Tage vor Fälligkeit, am Fälligkeitstag, 7/14 Tage nach Fälligkeit
- **Abnahmekriterium:** 95% der Mahnungen automatisch versendet, <5% vergessen

**FIN-MUSS-004: Lexware-Integration (Phase 2)**
- **MVP:** Manueller CSV-Export für Lexware-Import
- **Phase 2:** API-basierte Synchronisation zu Lexware
- **Abnahmekriterium MVP:** Export-Format von Lexware akzeptiert ohne manuelle Nachbearbeitung

**FIN-MUSS-005: DSGVO-Compliance (Finanz-spezifisch)**
- Kunden können eigene Rechnungs-/Zahlungshistorie exportieren (Art. 15)
- Löschfristen: 10 Jahre für Rechnungen (GoBD), dann Anonymisierung (DSGVO-Konflikt gelöst via Pseudonymisierung)
- **Abnahmekriterium:** DPO bestätigt DSGVO-Konformität, Löschkonzept funktioniert

---

## 4. Nicht-funktionale Anforderungen

**Performance:**
- Rechnungserstellung: <500ms API-Response
- Dashboard (Forderungen): P95 ≤2s
- Zahlungs-Export: 500 Rechnungen in <60s

**Verfügbarkeit:**
- Siehe NFR_SPECIFICATION.md: 95% Uptime (8x5)
- Buchhaltung benötigt System täglich 9-17 Uhr

**Sicherheit:**
- Finanzdaten nur für BUCH/GF/ADMIN sichtbar (RBAC)
- Rechnungsdaten verschlüsselt (at rest)
- Audit-Log für alle Finanz-Zugriffe

---

## 5. Compliance-Framework

### 5.1 GoBD-Compliance

**Anforderungen (aus NFR_SPECIFICATION.md §5.4):**
1. Unveränderlichkeit finalisierter Rechnungen
2. Fortlaufende, lückenlose Rechnungsnummerierung
3. Vollständiger Audit Trail aller Änderungen
4. 10-jährige Archivierung (unveränderlich)
5. Zugriffskontrolle (wer durfte was sehen)

**Umsetzung:**
- Siehe DATA_MODEL_SPECIFICATION.md §7: GoBD-Immutabilität
- Finalisierungs-Workflow mit SHA-256-Hash
- Change-Log für alle Korrekturen (mit Begründung + GF-Approval)

### 5.2 DSGVO-Compliance

**Konflikt GoBD/DSGVO gelöst (aus NFR_SPECIFICATION.md §5.3.2):**
- **Problem:** GoBD verlangt 10 Jahre Aufbewahrung, DSGVO verlangt Löschung nach Zweckerfüllung
- **Lösung:** Logische Löschung + Pseudonymisierung
  - Kundendaten werden anonymisiert (Name → "Gelöschter Kunde #123")
  - Rechnungsdaten bleiben 10 Jahre erhalten (nur Beträge, keine Personendaten)
  - Nach 10 Jahren: Physische Löschung
- **Rechtsgrundlage:** Art. 17 Abs. 3 lit. b DSGVO (rechtliche Verpflichtung), DIN 66398

---

## 6. Integrationen

### 6.1 Lexware-Integration (ISS-007 Resolution)

**MVP-Ansatz (Manuell):**
- Wöchentlicher/monatlicher CSV-Export aus KOMPASS
- Buchhaltung importiert in Lexware manuell
- Aufwand: 15-30 Minuten/Woche

**Phase 2-Ansatz (Automatisiert):**
- REST API-Integration zu Lexware
- Echtzeit-Sync von Rechnungen
- Automatischer Abgleich von Zahlungseingängen
- **Kosten-Nutzen:** €20-30k Implementierung spart 24-48 Stunden/Jahr

**Entscheidung:** Deferred to Phase 2 (dokumentiert in NFR_SPECIFICATION.md §15)

### 6.2 Bank-Integration (Phase 3+)

**Vision:** Automatischer Zahlungsabgleich via EBICS/FinTS  
**MVP:** Manuelles Erfassen von Zahlungseingängen in Lexware, Status-Update in KOMPASS

---

## 7. Rollenbez

ogene Features

| Feature | Buchhaltung | Innendienst | Planning | ADM | GF |
|---------|-------------|-------------|----------|------|-----|
| Rechnung erstellen | ✅ Voll | ❌ Nein | ❌ Nein | ❌ Nein | ⚠️ Notfall |
| Rechnung einsehen | ✅ Alle | ✅ Alle | ✅ Projekt-bezogen | ⚠️ Eigene Kunden (Status) | ✅ Alle |
| Zahlungsstatus sehen | ✅ Voll | ✅ Status | ✅ Projekt-bezogen | ⚠️ Bezahlt/Offen | ✅ Voll |
| Mahnungen versenden | ✅ Voll | ❌ Nein | ❌ Nein | ⚠️ Unterstützung | ⚠️ Eskalation |
| Finanz-Reports | ✅ Detail | ⚠️ Summary | ⚠️ Projekt-Marge | ❌ Nein | ✅ Voll |

---

## 8. Akzeptanzkriterien

**Funktional:**
- [ ] Rechnung aus Projekt in <15 Minuten erstellt
- [ ] GoBD-Audit besteht (Steuerberater-Bestätigung)
- [ ] 95%+ Mahnungen automatisch versendet
- [ ] CSV-Export kompatibel mit Lexware
- [ ] DSGVO-Löschkonzept funktioniert (10 Jahre GoBD, dann Anonymisierung)

**Nutzerakzeptanz:**
- [ ] Buchhaltung: 80%+ Zeitersparnis vs. aktuell
- [ ] GF: Finanz-Dashboard als "nützlich" bewertet (4+/5)
- [ ] Steuerberater: Bestätigt Compliance

---

# Phase 2 Erweiterungen: Observability & Enhanced Compliance Monitoring

**Status:** ⚠️ **Phase 1.5-2** (Parallel zum MVP/Post-MVP)

## 📊 Production-Ready Observability (Phase 1.5)

**Problem:** Keine Sichtbarkeit in Finanz-Prozess-Health → Probleme erst bei Steuerprüfung oder Audit entdeckt.

**Lösung - Grafana Stack Monitoring:**
- **Metrics (Prometheus):** Rechnungs-Durchsatz (Invoices/Tag), Mahnungen-Rate, Export-Performance
- **Logs (Loki):** Alle Finanz-Transaktionen logged (GoBD Audit Trail), Query: "Zeige alle Rechnungs-Stornos Q4 2025"
- **Distributed Tracing (Tempo):** End-to-End Nachvollziehbarkeit "Projekt → Rechnung → Export → Lexware"
- **Dashboards (Grafana):** Echtzeit-KPIs für Buchhaltung/GF (Offene Forderungen, Überfällige Zahlungen, Export-Fehlerrate)

**SLI/SLO Definition:**
- Invoice Generation Time: P95 <2s
- CSV Export Success Rate: >99%
- Zahlungsimport-Latenz: <30 Min
- GoBD Audit-Log Completeness: 100%

**Alerting:**
- Critical: "Export nach Lexware fehlgeschlagen 3x" → E-Mail an Buchhaltung
- Warning: "Offene Forderungen >€100K" → Slack-Notification an GF

**Compliance-Benefits:**
- 100% Nachvollziehbarkeit für Steuerprüfung (Distributed Traces zeigen jeden Änderungsschritt)
- Automatische Anomalie-Detection (z.B. "Rechnungs-Storno-Rate plötzlich 3x höher")

**Siehe auch:** 
- `docs/architectur/` → "Observability & Monitoring (Production-Ready Operations)"
- `docs/reviews/OBSERVABILITY_STRATEGY.md`
- ADR-015 (Observability-Stack Entscheidung)

---

## 🔐 Enhanced GoBD Compliance Monitoring (Phase 2)

**Automated Compliance Checks:**
- **Immutability Validation:** Automatischer Check "Ist finalisierte Rechnung unverändert?" (Hash-Vergleich)
- **10-Jahre-Archivierung-Alerts:** "Rechnung R-2015-00123 erreicht Mindestaufbewahrungsfrist" → DSGVO-Anonymisierung prüfen
- **Change-Log-Completeness:** Alert wenn Änderungslog fehlt oder unvollständig

**Real-Time Compliance Dashboard:**
- GoBD Score: 0-100% (Wie viele Dokumente GoBD-konform?)
- DSGVO-Kennzahlen: Wie viele Kunden mit abgelaufenem Consent? Wie viele Löschanfragen pending?
- Audit-Readiness-Indicator: "System bereit für Steuerprüfung" (✅ GRÜN) vs. "2 Dokumente fehlen Revision" (🟡 GELB)

---

**GAP-SCOPE-002 RESOLUTION: COMPLETE ✅**

**Prepared By:** Product & Finance Team  
**Sign-Off Required:** Buchhaltung, Steuerberater, DPO, GF

