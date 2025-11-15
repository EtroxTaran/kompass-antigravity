# Produktvision Tourenplanung & Spesen

_Document Version: 1.0_  
_Last Updated: 2025-01-28_  
_Status: Phase 2 (Q3 2025)_

**⚡ Verknüpfte Spezifikationen:**

- **Datenmodell:** `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` – Tour, Meeting, HotelStay, Expense, MileageLog Entitäten (Sektionen 17-21)
- **RBAC-Matrix:** `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` – Tour Planning & Expense Management Permissions (Sektion 13)
- **API-Spezifikation:** `docs/specifications/reviews/API_SPECIFICATION.md` – Tour Planning & Expense Management Endpoints
- **Personas:** `docs/personas/Referenzpersona_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte).md` – ADM Persona mit Tour Planning Workflows

---

## Einleitung & Zielsetzung

Die **Tourenplanung & Spesenverwaltung** ist ein zentrales Modul für den Außendienst (ADM) im KOMPASS-System. Es ermöglicht effiziente Planung von Kundenbesuchen, automatische Routenoptimierung, GPS-gestützte Kilometererfassung, mobile Spesenerfassung mit OCR und monatliche Abrechnungsberichte. Das Modul ist vollständig **offline-fähig** und integriert nahtlos mit dem bestehenden CRM und Projektmanagement.

**Kernziel:** Reduzierung der Planungszeit für wöchentliche Touren von **30 Minuten auf 10 Minuten** und der monatlichen Spesenabrechnung von **2-3 Stunden auf 5-10 Minuten** durch Automatisierung und mobile Erfassung.

---

## Problemstellung

### Aktuelle Pain Points

**Manuelle Tourenplanung:**

- ADM plant Touren manuell in Excel oder auf Papier
- Keine automatische Routenoptimierung → suboptimale Reihenfolge, höhere Fahrtkosten
- Keine Integration mit Kundenprioritäten oder Besuchsintervallen
- Planung dauert **ca. 30 Minuten pro Woche**

**Spesenabrechnung:**

- Belege werden gesammelt und am Monatsende manuell eingetragen
- Excel-Listen müssen erstellt werden
- Quittungen müssen gescannt und angehängt werden
- Abrechnung dauert **2-3 Stunden pro Monat**
- Fehleranfällig durch manuelle Eingabe

**Kilometererfassung:**

- Manuelle Eingabe der gefahrenen Kilometer
- Keine Validierung gegen tatsächliche Route
- Oft ungenau oder vergessen

**Hotelverwaltung:**

- Keine Übersicht über vergangene Hotels
- Manuelle Suche nach Hotels in der Nähe
- Keine Bewertungen oder Preisvergleiche

---

## Lösung: Integrierte Tour Planning & Expense Management

### Kernfunktionen

**1. Automatische Tourenplanung**

- System analysiert Kundenprioritäten (`lastVisitDate`, `visitFrequencyDays`)
- Vorschläge basierend auf geografischer Nähe und Umsatzpotenzial
- Automatische Routenoptimierung (TSP-Algorithmus)
- Integration mit Kalender und bestehenden Terminen

**2. GPS-gestützte Navigation & Tracking**

- Interaktive Karte mit geplanten Besuchen
- GPS-Tracking während der Tour
- Automatische Kilometererfassung
- GeoJSON-Route für Steuerprüfung
- Check-In-Funktion bei Ankunft am Kundenstandort

**3. Mobile Spesenerfassung**

- Belege fotografieren mit Smartphone-Kamera
- OCR-Verarbeitung (Tesseract.js) erkennt automatisch Betrag, Datum, Händler
- Manuelle Korrektur bei Bedarf
- Offline-Speicherung, Upload bei Verbindung
- Automatische Zuordnung zu Tour/Kunde basierend auf GPS und Datum

**4. Hotelverwaltung**

- Liste vergangener Hotels mit Bewertungen und Preisen
- Google Places API Integration für Hotelsuche
- Karte zeigt Hotels in der Nähe der geplanten Termine
- Schnelles Hinzufügen zu Tour

**5. Expense Approval Workflow**

- Ausgaben >€100 erfordern GF-Genehmigung
- Status-Tracking: Entwurf → Eingereicht → Genehmigt/Abgelehnt → Bezahlt
- Audit-Trail für GoBD-Compliance
- Rejection-Reason bei Ablehnung

**6. Monatliche Abrechnungsberichte**

- Automatische Generierung von PDF-Reports
- Gruppierung nach Kategorie, Tour, Monat
- Alle Belege als Anhang
- Export für Buchhaltung (PDF/Excel)

---

## Integration mit bestehendem CRM/PM

### Datenverknüpfungen

**Tour ↔ Customer:**

- Tour enthält mehrere Meetings mit verschiedenen Kunden
- Customer-Entity erweitert um `lastVisitDate`, `visitFrequencyDays`, `preferredVisitTime`
- Automatische Vorschläge basierend auf Kundenhistorie

**Tour ↔ Opportunity:**

- Meetings können mit Opportunities verknüpft werden
- Tour-ROI-Berechnung (zukünftig): Tour-Kosten vs. gewonnene Opportunities

**Tour ↔ Project:**

- Expenses können Projekten zugeordnet werden
- Projektkosten-Tracking inkl. Tour-Ausgaben

**Tour ↔ Location:**

- Location-Entity erweitert um `gpsCoordinates` für Navigation
- Hotels als spezielle Locations (`isHotel: true`)

---

## Offline-First Architektur

### Mobile Field Sales Requirements

**Offline-Speicher:**

- Tour-Daten lokal in IndexedDB (via PouchDB)
- Belege lokal gespeichert, Upload bei Sync
- GPS-Logs gepuffert offline
- Meeting-Check-Ins funktionieren offline

**Synchronisation:**

- Bidirektionale Sync mit CouchDB
- Konflikt-Erkennung und -Auflösung
- Automatische Sync bei Verbindung
- Manueller Sync-Trigger

**iOS 50MB Limit:**

- Tiered Data Strategy:
  - Essential: Eigene Touren, zugewiesene Meetings (5 MB)
  - Recent: Letzte 30 Tage (10 MB)
  - Pinned: Benutzer-ausgewählte Daten (35 MB)

---

## Technische Umsetzung

### Backend-Module (5 neue Module)

**Tour Module:**

- CRUD-Operationen für Touren
- Auto-Create bei Meeting ohne Tour
- Tour-Vorschläge (gleicher Tag ±1, Region <50km)
- Kostenberechnung (Summe Expenses + Mileage)
- Status-Transitions

**Meeting Module:**

- Meeting-CRUD mit Tour-Verknüpfung
- GPS-Check-In (Geofencing)
- Auto-Tour-Vorschläge
- Meeting-Outcome-Tracking
- Konflikt-Erkennung mit Kalender

**Hotel Module:**

- Hotel-Stay-CRUD
- Vergangene Hotels-Liste (ADM-spezifisch)
- Google Places API Integration
- Bewertungs-/Review-System
- Kartenbasierte Hotel-Suche

**Expense Module:**

- Expense-CRUD mit Validierung
- Receipt-Upload (MinIO Storage)
- OCR-Verarbeitung (n8n Workflow + Tesseract.js)
- Approval-Workflow (GF für >€100)
- Kategorie-basierte Regeln
- Monatlicher Report-Generator (PDF/Excel)

**Mileage Module:**

- GPS-Tracking-Integration
- Route-Recording (GeoJSON)
- Distanzberechnung (Haversine-Formel)
- Kostenberechnung (€0.30/km Deutschland-Standard)
- Manuelle Übernahme (GF-Genehmigung)
- Export für Steuerprüfung

### Frontend-Features (7 neue Feature-Module)

**Tour Management:**

- Tour-Liste (nach Monat, Status)
- Tour-Detail (Meetings, Hotels, Expenses Summary)
- Create/Edit Tour Form
- Tour-Kalender-Ansicht
- Kostenaufschlüsselung-Visualisierung

**Meeting Scheduler:**

- Meeting-Planer (integriert mit Customer/Location)
- Meeting-Detail mit Notizen
- Check-In-Button (GPS-getriggert bei Nähe zu Location)
- Schneller Activity-Log nach Meeting
- Meeting-Outcome-Form

**Hotel Management:**

- Vergangene Hotels-Liste (durchsuchbar, filterbar)
- Add Hotel Form (manuelle Eingabe)
- Kartenbasierte Hotel-Suche (Google Maps Integration)
- Hotel-Detail mit Bewertung
- Quick-Add von Karte

**Expense Capture:**

- Expense-Eingabe-Form
- Kamera-Integration (Receipt-Aufnahme)
- OCR-Ergebnis-Review/Edit
- Expense-Liste (gruppierbar nach Tour, Monat, Kategorie)
- Receipt-Viewer
- Approval-Status-Tracking

**Mileage Tracking:**

- Mileage-Log-Viewer
- Start/Stop Tracking Controls
- Route-Karten-Visualisierung
- Manuelle Eingabe-Form (Fallback)
- Monatliche Zusammenfassung

**Route Planner (Erweiterung bestehend):**

- Multi-Stop Route Builder
- Heutige geplante Meetings auf Karte
- Auto-Optimierung Route (TSP-Algorithmus)
- Navigation-Integration (Google Maps/Apple Maps)
- Nearby Customer Vorschläge

**Expense Report:**

- Monatlicher Expense-Report-Builder
- Filter nach Datum, Kategorie, Tour
- Export PDF/Excel
- Receipt-Anhang-Zusammenstellung
- Summary-Dashboard (Kosten nach Kategorie)

---

## Business Rules & Validierung

### Tour Business Rules

**TR-001:** Tour kann nur abgeschlossen werden, wenn alle Meetings besucht oder abgesagt wurden

**TR-002:** `actualDistance` sollte Summe der Mileage-Logs ±5% entsprechen

**TR-003:** `actualCosts` sollte Summe der Expenses entsprechen

**TR-004:** Nur Tour-Besitzer (ADM) oder GF kann Tour modifizieren

### Meeting Business Rules

**MT-001:** Auto-Tour-Vorschlag: Gleicher Tag ±1 Tag, Region <50km entfernt

**MT-002:** GPS-Check-In erfordert Nähe zu Location (<100m)

**MT-003:** Meeting-Outcome erforderlich wenn `attended = true`

### Expense Business Rules

**EX-001:** Receipt-Image erforderlich für Ausgaben >€25 (außer Mileage)

**EX-002:** Ausgaben >€100 erfordern GF-Genehmigung

**EX-003:** Abgelehnte Expenses können mit Korrekturen erneut eingereicht werden

**EX-004:** Expense muss mit Tour, Meeting oder Project verknüpft sein

### Mileage Business Rules

**ML-001:** Distanz muss GPS-Route-Berechnung ±5% entsprechen (außer manuelle Übernahme)

**ML-002:** Kosten = Distanz × Rate (€0.30/km Deutschland-Standard)

**ML-003:** Manuelle Übernahme erlaubt mit Grund (GF-Genehmigung)

**ML-004:** Route als GeoJSON für Audit-Trail gespeichert

---

## RBAC & Berechtigungen

### Tour Permissions

- **ADM:** Vollständiges CRUD für eigene Touren (`tour.ownerId = user.id`)
- **PLAN:** Lesen und Aktualisieren aller Touren (Koordination)
- **GF:** Vollzugriff auf alle Touren
- **BUCH:** Lesen aller Touren (finanzielle Übersicht)

### Meeting Permissions

- **ADM:** Vollständiges CRUD für eigene Meetings
- **PLAN:** Lesen aller Meetings
- **GF:** Vollzugriff auf alle Meetings
- **GPS-Check-In:** Nur ADM für eigene Meetings

### Expense Permissions

- **ADM:** CREATE, READ eigene Expenses. UPDATE/DELETE nur wenn 'draft' oder 'rejected'
- **GF:** Vollzugriff, inkl. APPROVE/REJECT/MARK_PAID
- **BUCH:** Lesen aller Expenses, MARK_PAID

### Approval Workflow

- Expenses >€100: Status 'submitted' → GF erhält Notification → APPROVE/REJECT
- Rejection erfordert `rejectionReason` (min. 10 Zeichen)
- Approved Expenses können von BUCH als 'paid' markiert werden

---

## Erfolgsmetriken

### Quantitative Metriken

- **Planungszeit:** Reduzierung von 30 Min → 10 Min pro Woche (**-67%**)
- **Spesenabrechnung:** Reduzierung von 2-3h → 5-10 Min pro Monat (**-95%**)
- **OCR-Genauigkeit:** >85% für deutsche Quittungen
- **GPS-Mileage-Genauigkeit:** ±3% vs. manuelles Odometer
- **Fahrtkosten:** Reduzierung um **10-15%** durch Routenoptimierung
- **ADM-Adoption:** >80% innerhalb 3 Monate nach Phase 2 Launch

### Qualitative Metriken

- **Zufriedenheit:** ADM empfindet Tour-Planung als deutlich einfacher
- **Fehlerrate:** Reduzierung von Spesen-Fehlern durch OCR und Validierung
- **Transparenz:** GF hat vollständigen Überblick über Tour-Kosten
- **Compliance:** GoBD-konforme Audit-Trails für alle Expenses

---

## ROI-Berechnung (Zukünftig - Phase 2.3)

### Tour-ROI-Modell

**Berechnung:**

```
Tour-ROI = (Gewonnener Umsatz aus Tour) / (Tour-Kosten) × 100%

Beispiel:
- Tour-Kosten: €450 (Fahrt, Hotel, Verpflegung)
- Gewonnene Opportunities: €25.000 (2 Deals geschlossen)
- Tour-ROI: 5.556%
```

**Metriken:**

- Durchschnittlicher Tour-ROI pro ADM
- ROI-Trend über Zeit
- Vergleich: Welche Touren haben höchsten ROI?
- Empfehlungen: Welche Kunden sollten häufiger besucht werden?

---

## Phasenplanung

### Phase 2.1 (Wochen 1-4): Core Tour & Meeting

1. Datenmodell + Backend-Module (Tour, Meeting)
2. Frontend Tour-Management-UI
3. Meeting-Scheduler mit Tour-Vorschlag
4. Basis-Route-Planner-Erweiterung

**Deliverables:**

- Tour-CRUD funktional
- Meeting-CRUD mit Tour-Verknüpfung
- Auto-Tour-Vorschläge
- Route-Optimierung (TSP)

### Phase 2.2 (Wochen 5-8): Expense & Mileage

1. Expense-Modul mit OCR-Workflow
2. Mileage-Tracking mit GPS
3. Hotel-Management
4. Expense-Capture-UI

**Deliverables:**

- OCR-Verarbeitung (Tesseract.js via n8n)
- GPS-Tracking und Kilometererfassung
- Hotel-Suche (Google Places API)
- Expense-Approval-Workflow

### Phase 2.3 (Wochen 9-10): Reporting & Polish

1. Monatlicher Expense-Report-Generator
2. Tour-Kosten-Analytics
3. E2E-Tests
4. Dokumentation finalisieren

**Deliverables:**

- PDF/Excel-Report-Generator
- Tour-ROI-Berechnung (Basis)
- Vollständige Test-Abdeckung
- UI/UX-Dokumentation aktualisiert

---

## Technische Architektur

### GPS & Maps Integration

**Google Maps Platform:**

- Directions API für Routenoptimierung
- Places API für Hotel-Suche
- Maps JavaScript API für Kartenvisualisierung
- Geolocation API für Position-Tracking

**Background Tracking:**

- Service Worker für GPS-Tracking im Hintergrund
- Battery-Optimierung (Tracking nur bei aktiver Tour)
- Fallback auf manuelle Eingabe wenn GPS nicht verfügbar

### OCR Processing

**n8n Workflow:**

1. Receipt-Upload → MinIO Storage
2. Tesseract.js OCR-Verarbeitung
3. Parsing: Betrag, Datum, Händler erkennen
4. Strukturierte Daten zurückgeben
5. Frontend: Manuelle Korrektur möglich

**Training:**

- Deutsche Quittungsformate (Quittung)
- Verbesserung der Genauigkeit durch Training-Daten

### Cost Calculation

**Mileage:** €0.30/km (deutscher Steuer-Standard)

**Per Diem:** Konfigurierbare Sätze nach Land/Region

**Hotel:** Tatsächliche Kosten aus Receipt

**Total Tour Cost:** Σ(Expenses) + Mileage Cost

**Tour ROI (zukünftig):** Vergleich Tour-Kosten vs. gewonnene Opportunities

---

## Sicherheit & Compliance

### GoBD-Compliance

**Audit-Trail:**

- Alle Expense-Änderungen werden geloggt
- Approval-Workflow vollständig nachvollziehbar
- Receipt-Images unveränderlich gespeichert (MinIO)

**Immutability:**

- Approved/Paid Expenses können nicht mehr geändert werden
- Korrekturen nur durch GF mit Grund

### DSGVO-Compliance

**GPS-Tracking:**

- Benutzer kann Tracking pausieren
- Consent-Management für GPS-Daten
- Daten werden nur lokal gespeichert, Sync optional

**Receipt-Images:**

- Verschlüsselt gespeichert (at rest)
- Zugriff nur für berechtigte Rollen (ADM, GF, BUCH)
- Retention-Policy: 10 Jahre (GoBD-Anforderung)

---

## Integration mit bestehenden Systemen

### CRM-Integration

- Customer-Entity erweitert um Tour-Planungs-Felder
- Location-Entity erweitert um GPS-Koordinaten
- Activity-Protokoll kann automatisch aus Meeting-Check-In erstellt werden

### PM-Integration

- Expenses können Projekten zugeordnet werden
- Projektkosten-Tracking inkl. Tour-Ausgaben
- Tour-ROI kann mit Projekt-Margen verglichen werden

### Calendar-Integration (Zukünftig)

- Meetings synchronisieren mit externen Kalendern (Google Calendar, Outlook)
- Konflikt-Erkennung mit bestehenden Terminen

---

## UI/UX Design Principles

### Mobile-First

- **Thumb-optimierte Controls:** Wichtige Aktionen im unteren Drittel
- **Touch-Targets:** Minimum 44px × 44px
- **Swipe-Gesten:** Für Navigation und Aktionen
- **Offline-Indikator:** Klare Anzeige wenn offline

### Accessibility (WCAG 2.1 AA)

- **Semantisches HTML:** Korrekte Verwendung von `<main>`, `<nav>`, `<section>`
- **ARIA-Labels:** Für alle Icons und interaktiven Elemente
- **Keyboard-Navigation:** Vollständig per Tastatur bedienbar
- **Kontrast:** Text erfüllt 4.5:1 Kontrast-Verhältnis

### German Language

- **Labels:** Alle UI-Elemente auf Deutsch
- **Placeholder-Text:** Kontextbezogene deutsche Beispiele
- **Error-Messages:** Klare, verständliche deutsche Fehlermeldungen
- **Date-Format:** DD.MM.YYYY (deutsches Format)

---

## Erfolgsfaktoren

### Adoption

- **Einfache Bedienung:** Intuitive UI, keine komplexen Workflows
- **Schneller Nutzen:** Erste Tour in <5 Minuten erstellt
- **Offline-Fähigkeit:** Funktioniert auch ohne Internet
- **Zeitersparnis:** Spürbare Verbesserung gegenüber manueller Planung

### Datenqualität

- **Automatische Validierung:** Fehler werden sofort erkannt
- **OCR-Genauigkeit:** >85% reduziert manuelle Eingabe
- **GPS-Validierung:** Automatische Distanzprüfung verhindert Fehler

### Compliance

- **GoBD-konform:** Vollständige Audit-Trails
- **DSGVO-konform:** Datenschutz-Bestimmungen eingehalten
- **Steuerprüfung:** GeoJSON-Routen für Nachweis

---

## Risiken & Mitigation

### Technische Risiken

**GPS-Tracking-Batterieverbrauch:**

- Mitigation: Service Worker mit Battery-Optimierung, Tracking nur bei aktiver Tour

**OCR-Genauigkeit:**

- Mitigation: Manuelle Korrektur-Möglichkeit, Training mit deutschen Quittungen

**Offline-Speicher-Limit (iOS 50MB):**

- Mitigation: Tiered Data Strategy, automatische Bereinigung alter Daten

### Organisatorische Risiken

**ADM-Akzeptanz:**

- Mitigation: Einfache Bedienung, klarer Nutzen, Schulungen

**GF-Genehmigungs-Workflow:**

- Mitigation: Klare Benachrichtigungen, Mobile-Zugriff für GF

---

## Roadmap & Zukunftsvision

### Phase 2.3 (Q3 2025): Tour-ROI-Berechnung

- Automatische Verknüpfung Tour-Kosten mit gewonnenen Opportunities
- ROI-Dashboard für GF
- Empfehlungen: Welche Kunden sollten häufiger besucht werden?

### Phase 3 (Q4 2025): AI-gestützte Optimierung

- Predictive Tour Planning: ML-Modell schlägt optimale Touren vor
- Churn-Prediction: Welche Kunden drohen abzuwandern? → Tour-Vorschlag
- Smart Routing: Berücksichtigung von Verkehr, Wetter, Öffnungszeiten

### Phase 4 (2026): Erweiterte Analytics

- Benchmarking: Vergleich Tour-Effizienz zwischen ADM-Mitarbeitern
- Trend-Analysen: Welche Regionen/Touren haben höchsten ROI?
- Integration mit externen Daten: Wetter, Verkehr, Events

---

## Zusammenfassung

Die **Tourenplanung & Spesenverwaltung** ist ein zentrales Modul für den Außendienst, das durch Automatisierung, mobile Erfassung und Offline-Fähigkeit erhebliche Zeitersparnis und Effizienzsteigerung bringt. Die Integration mit bestehendem CRM/PM sorgt für nahtlose Workflows und vollständige Transparenz für die Geschäftsführung.

**Kernversprechen:**

- **67% Zeitersparnis** bei Tour-Planung
- **95% Zeitersparnis** bei Spesenabrechnung
- **10-15% Reduzierung** der Fahrtkosten durch Routenoptimierung
- **Vollständige GoBD-Compliance** für Audit-Trails

---

**Related Documents:**

- Implementation Plan: `tour-planning.plan.md`
- Data Model: `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` (Sektionen 17-21)
- RBAC: `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` (Sektion 13)
- API: `docs/specifications/reviews/API_SPECIFICATION.md` (Tour Planning & Expense Management)
