# Produktvision für Projekt KOMPASS (Nordstern-Direktive)

_Converted from: Produktvision für Projekt KOMPASS (Nordstern-Direktive).pdf_  
_Last Updated: 2025-11-10 – Verknüpft mit quantifizierten NFRs und Gap-Resolution_  
_Document Version: 2.0_

**⚡ Verknüpfte Spezifikationen:**

- **Nicht-funktionale Anforderungen:** `docs/reviews/NFR_SPECIFICATION.md` – Alle Qualitätsziele quantifiziert: Performance (API ≤1,5s P95, Dashboard ≤3s), Skalierung (20 Nutzer gleichzeitig, Infrastruktur 8,5 vCPU/15,5GB RAM), Verfügbarkeit (95% Uptime 8x5, RTO=4h), Offline-Speicher (pro Rolle berechnet, alle unter iOS-Limit), Browser-Support, Monitoring-SLIs, Lasttest-Szenarien. Basis: Salesforce/Dynamics-Benchmarks, CouchDB-Forschung, PWA-Best-Practices.
- **Datenmodell:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` – Vollständiges ERD, Entity-Definitionen, Validierungsregeln, ID-Strategien, GoBD-Konformität
- **Benutzerreisen:** `docs/reviews/USER_JOURNEY_MAPS.md` – 5 End-to-End-Journeys mit Swim-Lanes, Fehlerszenarien, Handoff-Punkten
- **Konfliktauflösung:** `docs/reviews/CONFLICT_RESOLUTION_SPECIFICATION.md` – UX-Mockups, Trainingsprogramm, Auto-Resolution-Strategien
- **Teststrategie:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` – 70/20/10-Pyramide, 50+ E2E-Szenarien, Offline-Tests, Mobile-Testing
- **API-Spezifikation:** `docs/reviews/API_SPECIFICATION.md` – OpenAPI 3.0, Versionierung, Authentifizierung
- **RBAC-Matrix:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` – Rollen-/Feldebene-Berechtigungen, Eskalationsregeln

---

## 🚨 KRITISCHE AKTUALISIERUNG: Post-Pre-Mortem Strategie (2025-11-12)

**Status:** AKTIV - Strategische Neuausrichtung nach Pre-Mortem-Analyse

### Hintergrund

Eine umfassende Pre-Mortem-Analyse ([siehe Dokument](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md)) hat **vier existenzielle Risiken** identifiziert, die ohne sofortige Kurskorrektur zum Scheitern von KOMPASS führen würden:

1. **Fatale Überreichweite:** Shift von fokussiertem CRM zu "Autonomem Business Partner" überdehnt Ressourcen
2. **"AI Magic" Trugschluss:** KI-Features setzen Daten voraus, die nicht existieren
3. **Kritische Workflow-Lücken:** Keine Module für Lieferanten- und Materialverwaltung
4. **Brüchige Integration:** Manuelle Lexware-CSV-Integration ist Ausfallpunkt

### Strategische Antwort: Phasenweise Roadmap zum "Autonomen Partner"

**Kernbotschaft:** Die KI-Vision bleibt bestehen, aber als **Reise** über 3 Jahre, nicht als Launch-Feature.

#### Phase 1 (Monate 0-6): Fundament - "Zuverlässig, Vollständig, Benutzbar"

**Priorität:** Offline-First CRM/PM mit **vollständigen Workflows** für Ladenbau-Geschäft.

**Was wird geliefert:**

- ✅ Customer/Contact/Location Management (wie geplant)
- ✅ Opportunity/Offer/Contract Management
- ✅ **NEU: Supplier & Subcontractor Management** (komplett)
- ✅ **NEU: Material & Inventory Management** (komplett)
- ✅ Project execution with real-time cost tracking
- ✅ Time tracking & expense management
- ✅ **Phase 1 AI:** RAG-basierte Suche (Projekte, Materialien, Notizen) + Audio-Transkription (Deutsch)
- ✅ Lexware Integration Phase 1 (manuelles CSV mit Reconciliation-Tools)
- ✅ Offline-First PWA mit Tiered Storage (iOS 50MB-sicher)

**Was NICHT geliefert wird:**

- ❌ Prädiktive Analysen (Lead Scoring, Risk Assessment, Cashflow Forecasting)
- ❌ Automatisierte Empfehlungen (Routenoptimierung, Team-Zuweisungen)
- ❌ Anomalie-Erkennung
- ❌ Alle "AI-gestützte" Dashboard-Sektionen (Phase 3 markiert)

**Wert-Proposition (Jahr 1):**

- "Single Source of Truth" für Ladenbau-Geschäft (nicht nur CRM)
- INN-Persona kann **100% der Beschaffungs-Workflows** in KOMPASS ausführen (kein Excel mehr)
- PLAN-Persona sieht **Echtzeit-Projektkosten** aus Material-Lieferungen
- ADM-Persona hat **zuverlässige Offline-App** mit Voice-Input (keine Datenverluste)

#### Phase 2 (Monate 6-12): Einfache Intelligenz - "Verstärken, nicht Ersetzen"

**Priorität:** Pattern-basierte Intelligenz (kein ML), Lexware-Automatisierung.

**Was wird geliefert:**

- ✅ Smart Template Recommendations (Pattern Matching, kein ML)
- ✅ Duplicate Detection (Fuzzy Matching)
- ✅ Material Price Trends (↑↓→ basierend auf historischen Daten)
- ✅ Similar Project Finder (Vector-Similarity, kein ML)
- ✅ **Lexware Integration Phase 2:** Semi-automatische Synchronisation (90% automatisiert, 4h Latenz)
- ✅ Inventory Management (Lagerbestand-Tracking)
- ✅ RFQ Workflow (Request for Quotes)

**Datenanforderung:**

- 3-6 Monate KOMPASS-Betriebsdaten
- 30+ abgeschlossene Projekte
- 50+ Angebote mit Template-Zuordnung

**Wert-Proposition (Jahr 1-2):**

- BUCH-Persona: Lexware-Synchronisation **unter 15 Minuten pro Woche** (statt 60 Minuten)
- KALK-Persona: Material-Preisvergleich **automatisch** (spare 30 Minuten pro Kalkulation)
- INN-Persona: Lagerbestand-Alerts **automatisch** (verhindert Fehlbestellungen)

#### Phase 3 (Monate 12-24+): Prädiktive Analysen - "Intelligente Vorhersage"

**Priorität:** ML-basierte Vorhersagen **NUR wenn Datenqualitäts-Gates bestanden**.

**Voraussetzung (HARTE ANFORDERUNG):**

- ✅ 12+ Monate saubere KOMPASS-Daten
- ✅ 100+ abgeschlossene Opportunities (50 gewonnen, 50 verloren)
- ✅ 50+ abgeschlossene Projekte mit vollständigem Kosten-Tracking
- ✅ 90%+ Feldausfüllrate (alle kritischen Felder)
- ✅ <5% Fehlerrate in Datenqualitäts-Audit
- ✅ **Validierung:** ML-Backtesting zeigt ≥75% Genauigkeit

**Was wird geliefert (NUR wenn Gates bestanden):**

- Lead Scoring & Win Probability
- Project Risk Assessment
- Cashflow Forecasting
- Route Optimization
- Anomaly Detection

**Wert-Proposition (Jahr 2-3):**

- GF-Persona: **Datenbasierte Forecasts** statt Bauchgefühl
- PLAN-Persona: **Frühwarnung für Budget-Überschreitungen** (2+ Wochen im Voraus)
- ADM-Persona: **Optimierte Routen** (15% Kraftstoff-Ersparnis)

**Wenn Gates NICHT bestanden:**

- Phase 3 Features bleiben **gesperrt**
- Dashboard zeigt: "KI-Features noch nicht verfügbar. Datenqualität: 78% (Ziel: 90%). Weiter Daten sammeln."
- Keine Ausnahmen. Keine vorzeitigen Launches.

### Siehe Detaillierte Dokumentation

- [AI Strategy & Phasing](AI_STRATEGY_AND_PHASING.md) - Vollständige Phasen-Roadmap mit Datenqualitäts-Gates
- [AI Data Requirements](../specifications/AI_DATA_REQUIREMENTS.md) - Exakte Datenanforderungen pro Feature
- [Supplier Management Spec](../specifications/SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Lieferanten-Modul (Phase 1)
- [Material Management Spec](../specifications/MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) - Material-Modul (Phase 1)
- [Lexware Integration Strategy](../specifications/LEXWARE_INTEGRATION_STRATEGY.md) - 4-Phasen Integrations-Roadmap
- [Revised Implementation Roadmap](../implementation/REVISED_IMPLEMENTATION_ROADMAP.md) - Sprint-Level Planung
- [User Adoption Strategy](USER_ADOPTION_STRATEGY.md) - Adoptions-Strategien pro Persona

---

**📋 MVP Scope (AKTUALISIERT nach Pre-Mortem):**

- ✅ **Phase 1 (Monate 0-6):** CRM-Basis + Supplier-Modul + Material-Modul + Lexware CSV + RAG Search + Audio STT - €190k, 6 Sprints
- ✅ **Phase 2 (Monate 6-12):** Pattern-basierte Intelligenz + Lexware Semi-Auto - €120k, 6 Sprints
- ⚠️ **Phase 3 (Monate 12-24+):** ML-Vorhersagen **NUR wenn Datenqualität ≥90%** - €150k, 12 Sprints
- 🎯 **Fokus:** Jahr 1 Wert **ohne KI-Vorhersagen**. KI ist Enhancement, nicht Requirement.

**🌍 Internationalisierung (i18n) - Strategie (GAP-SCOPE-003):**

- **MVP:** Deutsch-only (hardcoded strings, keine i18n-Bibliothek)
- **Architektur:** i18n-ready (React Komponenten vorbereitet für spätere Externalisierung)
- **Phase 2:** Bei internationaler Expansion: i18next Integration (Aufwand: 2-3 Wochen)
- **Begründung:**
  - ✅ Schnellere MVP-Entwicklung (keine Externalisierungs-Overhead)
  - ✅ Einfachere Tests (eine Sprache)
  - ✅ Niedrigere Kosten (€15-20k gespart)
  - ⚠️ Refactoring-Risiko wenn früher als erwartet international expandiert (Kosten: €20-30k)
  - **Empfehlung:** Deutsch-only für MVP, i18n-Architektur vorbereitet, Entscheidung nach 12 Monaten Betrieb

---

# Produktvision für Projekt KOMPASS (Nordstern-

### Einleitung & Zielsetzung

Projekt **KOMPASS** zielt darauf ab, ein integriertes CRM- und Projektmanagement-Tool für ein
mittelständisches Ladenbau-Unternehmen zu entwickeln. Diese **Nordstern-Direktive** soll als inspirierende
Produktvision dienen und allen Beteiligten Orientierung geben. Basierend auf Interviews, Personas,
Produktspezifikationen sowie Architektur- und Konzeptdokumenten wurden die Kernbedürfnisse der
Nutzer, geschäftliche Ziele, technische Leitprinzipien und Unternehmenswerte analysiert. Das Ergebnis ist
eine klare Vision, die **transparente** , **effiziente** und **kundenorientierte** Zusammenarbeit fördert und als
strategischer Leitfaden für die Produktentwicklung von KOMPASS dient. In den folgenden Abschnitten
werden die wichtigsten wiederkehrenden Themen herausgearbeitet, das Nordstern-Statement formuliert
und dessen Stärke anhand definierter Kriterien validiert.

# Synthese der Erkenntnisse (Clusterbildung)

Aus der Analyse der
**Nutzerbedürfnisse** ,
**Zielgruppen-Personas** ,
**Produktziele** ,
**technischen**
**Leitprinzipien** und **Projektwerte** lassen sich mehrere wiederkehrende Leitmotive erkennen. Diese wurden
in fünf Cluster-Kernbotschaften verdichtet, um die zentralen Ziele von KOMPASS prägnant zu beschreiben:

**Transparenz statt Dateninseln:** Der aktuelle Zustand ist geprägt von verteilten Datenquellen und
Informationssilos, was zu Intransparenz führt. Wichtige Kunden- und Projektdaten liegen in
getrennten Excel-Listen, Insellösungen oder Abteilungstools – der Gesamtüberblick muss mühsam
manuell zusammengesucht werden
. KOMPASS adressiert dies durch zentrale,
bereichsübergreifende Datenhaltung. Alle relevanten Informationen werden an einem Ort
gebündelt verfügbar, sodass eine **360°-Sicht** auf jeden Kunden und jedes Projekt entsteht. Dadurch
gehören isolierte „Dateninseln“ der Vergangenheit an, und Wissen wird firmenweit transparent
geteilt (kein Abteilungs-Chaos mehr).

# Nahtlose Prozesse statt Medienbrüchen: Heute gibt es häufig Brüche im Informationsfluss – z. B.

**Effizienz statt Doppelarbeit:** Doppelarbeit und manuelle Routineaufgaben kosten dem Team
derzeit viel Zeit und führen zu Verzögerungen. Beispielsweise müssen Vertriebler handschriftliche
Besuchsnotizen später am PC nachpflegen, was nicht nur ineffizient ist, sondern auch zu Fehlern
oder vergessenen Einträgen führen kann
. KOMPASS steigert die **operative Effizienz** , indem es
solche redundanten Tätigkeiten überflüssig macht. Informationen werden nur einmal erfasst und
automatisch weiterverarbeitet. Zudem unterstützt das System durch **Automatisierung** – etwa
automatische Erinnerungen für Follow-ups oder vordefinierte Aufgabenlisten – sodass nichts
“durchrutscht”. Insgesamt können Mitarbeiter mehr Zeit wertschöpfend einsetzen, anstatt Daten
mehrfach zu bearbeiten. Die Einführung von KOMPASS verspricht dadurch spürbare **Zeitersparnis**
und produktiveres Arbeiten (weniger Aufwand, mehr Ergebnis
).

# Fundierte Entscheidungen statt Bauchgefühl: Die Geschäftsführung und Teamleiter sollen

# Kundenfokus statt Verwaltungsaufwand: Alle Nutzer – insbesondere der Vertrieb im Außendienst

# Nordstern-Statement (Langform + Kurzform)

**Nordstern-Statement (Langform):**
Für die
**abteilungsübergreifenden Vertriebsteams und**
**Projektbeteiligten** eines mittelständischen Ladenbau-Unternehmens, die einen **nahtlosen Überblick über**
**alle Kunden und Projekte** benötigen und **zeitraubende Doppelarbeit** vermeiden wollen, ist **KOMPASS**
eine **integrierte CRM- und Projektmanagement-Lösung** , die **alle Kundeninformationen und**
**Projektabläufe in einer Plattform vereint** und **automatisierte Workflows** bereitstellt, um **Transparenz,**
**Effizienz und fundierte Entscheidungen** zu ermöglichen. Im Gegensatz zu **herkömmlichen**
**Insellösungen oder generischen Cloud-Tools** bietet KOMPASS **eine vollständig offline-fähige,**
**selbstgehostete Plattform**
mit
**360°-Echtzeitblick**
auf alle Vorgänge, wodurch
**Datenbrüche**
ausgeschlossen sind und das Unternehmen **datensouverän** und DSGVO-konform arbeiten kann.

**Kurzform (Leitstern):** _„Ein Team, ein Tool – volle Transparenz und Effizienz für nachhaltigen Projekterfolg.“_

---

# Pillar 1: Evolve from Data Repository to Intelligent Co-Pilot (KI-gestützte Intelligenz)

**Vision:** KOMPASS wird von einem passiven Datenrepositorium zu einem **proaktiven, intelligenten Assistenten**, der Nutzer entlastet, Zeit spart und datenbasierte Handlungsempfehlungen gibt. Statt nur Daten zu speichern, "versteht" das System Zusammenhänge, erkennt Muster und unterstützt Entscheidungen.

**Strategische Ausrichtung:**

- **Vom "System of Record" zum "System of Intelligence"** – KOMPASS speichert nicht nur Daten, sondern extrahiert Wissen und liefert Insights.
- **KI als integraler Produktbestandteil** – Nicht als Add-On, sondern als Kern-Differenzierungsmerkmal zur Konkurrenz (Salesforce Einstein, HubSpot AI, Monday.com AI).
- **Self-Hosted & DSGVO-konform** – Alle KI-Modelle (Whisper, Llama 3, scikit-learn) können lokal laufen, keine Daten an Cloud-KI-Anbieter nötig.

---

## Phase 2.1 (Q3 2025): Foundational AI Features – Time-Saving Automation

### 🎙️ Automated Audio Transcription & Summarization (Whisper + GPT-4/Llama 3)

**Problem:** Außendienstmitarbeiter müssen nach Kundengesprächen handschriftliche Notizen am PC nachpflegen → 15-30 Min pro Besuch → 2-3h/Woche Verwaltungsaufwand.

**Lösung: Voice-to-Text mit intelligenter Zusammenfassung**

**Workflow:**

1. **Audio-Aufnahme während Kundengespräch** (mobiles PWA, offline-fähig)
2. **Automatische Transkription via Whisper** (OpenAI oder self-hosted) → vollständiger Gesprächstext
3. **KI-Summarization** (GPT-4 oder Llama 3 via n8n) → 5-Zeilen-Zusammenfassung extrahiert:
   - **Hauptthemen** (z.B. "Neues Projekt Ladenumgestaltung besprochen")
   - **Action Items** (z.B. "Muster schicken bis 15.03.", "Angebot erstellen für €50K Budget")
   - **Follow-Up-Datum** (z.B. "Nächster Termin: 20.03.2025")
4. **Automatische Task-Generierung** → System legt Tasks automatisch in Aufgabenliste an
5. **Speicherung in Kundenprotokoll** → Volltext + Zusammenfassung + Audio-Datei (MinIO Object Storage)

**Nutzen:**

- ✅ **Zeit sparen**: 15-30 Min → 2 Min (nur prüfen & bestätigen) = 13-28 Min/Besuch gespart
- ✅ **Keine Vergesslichkeit**: Alle Details im System, nichts geht verloren
- ✅ **Bessere Übergaben**: Innendienst kann Audio anhören statt unleserliche Notizen interpretieren
- ✅ **Compliance**: Vollständige Dokumentation (GoBD-konform)

**Technology Stack:**

- **Whisper** (OpenAI oder self-hosted via Docker) → Transkription
- **n8n Workflow** → Orchestrierung (Audio → MinIO → Whisper → GPT-4 → CouchDB)
- **BullMQ** → Job-Queue für async Processing (Transkription dauert 30-120s)
- **Socket.IO** → Real-Time-Progress-Updates an Frontend ("Transkription läuft... 75%")

**Akzeptanzkriterien:**

- ✅ Transkriptions-Genauigkeit >95% (Deutsch, Branchen-Fachbegriffe via Fine-Tuning)
- ✅ Durchschnittliche Processing-Zeit <90s für 5-Min-Audio
- ✅ Nutzer-Akzeptanzrate >80% (User finden Summary "hilfreich")

---

### 🤖 Smart Task & Reminder Generation (NLP-basierte Erkennung)

**Problem:** Wichtige Follow-Ups gehen unter, weil im Gesprächsverlauf erwähnte Zusagen nicht systematisch getrackt werden.

**Lösung: Intelligente Intent-Erkennung aus Protokollen**

**Use Cases:**

- **Explizite Zusagen**: "Ich schicke Ihnen das Muster nächste Woche" → Task: "Muster an [Kunde] schicken" (Fällig: 7 Tage)
- **Implizite Deadlines**: "Angebot muss bis Monatsende vorliegen" → Task: "Angebot erstellen" (Fällig: Ende Monat)
- **Wiedervorlagen**: "Rufe mich in 2 Wochen nochmal an" → Erinnerung in 14 Tagen

**Implementierung:**

- **NLP-Pipeline** (spaCy oder Transformers-basiert):
  1. Named Entity Recognition (NER) → Extraktion von Daten, Beträgen, Produktnamen
  2. Intent Classification → "Zusage", "Wiedervorlage", "Information"
  3. Temporal Expression Extraction → "nächste Woche", "Ende Monat" → konkretes Datum
- **Confidence Threshold**: Nur Tasks mit >80% Confidence automatisch anlegen, Rest als Vorschlag

**Nutzen:**

- ✅ **Nichts vergessen**: System "erinnert" an Zusagen
- ✅ **Proaktivität**: Follow-Ups kommen automatisch ins System
- ✅ **Geschäftsführer-Oversight**: GF sieht Dashboard "Offene Zusagen" → Kontrolle, ob Team nachfasst

**Roadmap:**

- **Phase 2.1**: Basis-Intent-Recognition (explizite Zusagen)
- **Phase 2.2**: Erweitert um implizite Intents (Sentiment Analysis, "Kunde unzufrieden" → GF-Alert)

---

## Phase 2.2 (Q4 2025): Predictive AI – Proactive Intelligence

### 📊 Predictive Lead Scoring (ML-basierte Opportunity-Bewertung)

**Problem:** Vertrieb arbeitet oft mit "Bauchgefühl" statt Daten → ineffiziente Priorisierung → verpasste Chancen bei High-Value-Leads.

**Lösung: ML-Modell berechnet "Conversion-Wahrscheinlichkeit" für jede Opportunity**

**Input-Features (Training Data):**

- **Firmographics**: Branche, Unternehmensgröße, Standort
- **Interaction History**: Anzahl Besuche, E-Mails, Anrufe, Protokolle
- **Deal Characteristics**: Estimated Value, Projekt-Typ (Neubau vs. Umbau), Budget-Range
- **Sentiment**: Positive vs. Negative Wörter in Protokollen (NLP)
- **Timing**: Saison (Q4 oft besser), Zeit seit Erstanfrage

**Output:**

- **Lead Score**: 0-100 Punkte (≥80: "Hot Lead", 50-79: "Warm", <50: "Cold")
- **Conversion Probability**: z.B. "72% Chance auf Abschluss"
- **Empfohlene Nächste Aktion**: "Angebot nachfassen" vs. "Langfristig pflegen"

**Algorithmen:**

- **Gradient Boosting** (XGBoost/LightGBM) → State-of-the-Art für Tabellen-Daten
- **Training**: Historische Opportunities (2 Jahre Daten, mindestens 200 Abschlüsse + 500 nicht-gewonnene)
- **Features**: 20-30 Features (nicht zu komplex, Overfitting-Gefahr)
- **Evaluation**: AUC-ROC >0,75 (Minimum), Precision/Recall-Balance

**UI-Integration:**

- **Opportunity-Liste**: Sortierung nach Lead Score (höchster Score oben)
- **Detailansicht**: Score-Badge + Erklärung ("Score hoch wegen: häufiger Kontakt, großes Budget, positive Sentiment")
- **Dashboard**: "Top 10 Hot Leads diese Woche" Widget für GF

**Nutzen:**

- ✅ **Höhere Conversion Rate**: Vertrieb fokussiert sich auf beste Chancen → +10-20% mehr Abschlüsse (Benchmark: Salesforce Einstein)
- ✅ **Zeitersparnis**: Keine Zeit für "Dead Ends", fokussierte Akquise
- ✅ **Datenbasierte Priorisierung**: Ersetzt Bauchgefühl durch Fakten

**Explainability (SHAP/LIME):**

- **Transparenz**: Nutzer sieht, WARUM Score hoch/niedrig ist → Vertrauen in KI
- **Regulatory Compliance**: DSGVO verlangt Erklärbarkeit bei automatisierten Entscheidungen

**A/B-Testing:**

- **Phase 2.2**: Pilotgruppe (5 Nutzer) arbeitet mit Lead Scoring, Kontrollgruppe ohne
- **Messung**: Conversion Rate, Zeit bis Abschluss, Nutzer-Feedback
- **Rollout**: Wenn Pilotgruppe +15% bessere Conversion → Vollständiger Rollout

---

### ⚠️ Project Risk Assessment (Risikofrüherkennung für Geschäftsführung)

**Problem:** Projekte geraten "plötzlich" in Schieflage (Budgetüberschreitung, Verzögerungen) → Reaktiv statt proaktiv.

**Lösung: KI-Dashboard mit Frühwarnsystem**

**Risk Indicators (automatisch berechnet):**

1. **Budget-Risiko**: Tatsächliche Kosten > 80% Planbudget → Rot
2. **Terminrisiko**: Projekt >10% hinter Zeitplan → Orange
3. **Historisches Risiko**: Ähnliche Projekte hatten oft Probleme (ML-Modell) → Gelb
4. **Stakeholder-Sentiment**: Viele negative Protokolle/E-Mails → Rot

**ML-Modell: "Project Delay Prediction"**

- **Training**: 100+ abgeschlossene Projekte (Features: Komplexität, Team-Größe, Kundenkommunikation-Frequenz, Change Requests)
- **Output**: "Wahrscheinlichkeit für >2 Wochen Verzögerung": z.B. 65%
- **Algorithmus**: Random Forest oder Gradient Boosting
- **Evaluation**: Precision >70% (wenig False Positives, GF soll nicht überalarmiert werden)

**Dashboard-Widget:**

```
┌──────────────────────────────────────────┐
│ 🚨 Projekte mit erhöhtem Risiko          │
├──────────────────────────────────────────┤
│ Projekt "Hofladen XY" – Budgetrisiko     │
│   - 85% Budget verbraucht (85K/100K)     │
│   - Nur 60% fertig → Budget reicht nicht │
│   - Empfehlung: Nachverhandlung Budget  │
│                                          │
│ Projekt "Baumarkt Z" – Terminrisiko      │
│   - 12 Tage im Verzug                    │
│   - Kritischer Pfad betroffen            │
│   - Empfehlung: Ressourcen aufstocken    │
└──────────────────────────────────────────┘
```

**Nutzen:**

- ✅ **Früherkennung**: Probleme werden sichtbar BEVOR sie kritisch sind
- ✅ **Proaktive Steuerung**: GF kann rechtzeitig eingreifen (Ressourcen umverteilen, Kunde informieren)
- ✅ **Reputation**: Weniger "Überraschungen" beim Kunden → bessere Zufriedenheit

---

## Phase 3 (Q1 2026): Advanced AI – Autonomous Actions

### 🧠 Automated Sales Summarization & Insights

**Vision**: System generiert automatisch **Wochen-/Monatsberichte** für GF → "Top 5 Deals diese Woche", "Umsatzprognose Q1", "Risiken & Chancen"

**Technologie:**

- **LLM** (GPT-4 oder selbst-gehostetes Llama 3 70B via n8n)
- **Data Aggregation**: CouchDB Analytics (via CQRS PostgreSQL) + Sentiment aus Protokollen
- **Natural Language Generation**: Report in verständlicher Sprache (Deutsch)

### 🔮 Predictive Forecasting (Umsatzprognose mit ML)

**Vision**: "Wie viel Umsatz machen wir voraussichtlich in Q2?" → System berechnet basierend auf:

- **Pipeline-Analyse**: Opportunities mit Abschluss-Wahrscheinlichkeit × Wert
- **Saisonalität**: Historische Patterns (Q4 oft stärker als Q1)
- **Externe Faktoren**: Wirtschaftslage (optional: Integration von Wirtschaftsdaten)

**Algorithmen:**

- **Time-Series Forecasting**: ARIMA, Prophet (Facebook), LightGBM
- **Confidence Intervals**: "Umsatz Q2: €250K-€350K (80% Konfidenz)"

**Nutzen:**

- ✅ **Finanzplanung**: GF kann Liquidität besser steuern
- ✅ **Kapazitätsplanung**: "Wir brauchen mehr Planer im März" (vorausschauend)

---

## Sicherheit & Datenschutz (DSGVO-Konformität)

**DSGVO-Consent-Management:**

- ❌ **Kein AI-Processing ohne explizites Opt-In**: `customer.dsgvoConsent.aiProcessing = true` (per Kunde)
- ✅ **Opt-In-Dialog**: "Möchten Sie, dass wir KI zur Analyse verwenden? (Verbesserung Ihrer Experience)" → User wählt bewusst

**Data Anonymization:**

- **Vor KI-Call**: Sensible Felder (Namen, Adressen, Telefonnummern) werden maskiert
- **Beispiel**: Protokoll-Text "Herr Müller aus München, Tel. 089-123456" → "PERSON aus ORT, Tel. **_-_**" → KI sieht anonymisierte Version

**Local AI Option (100% On-Premise):**

- **Whisper**: Lokales Docker-Container (keine Daten an OpenAI)
- **Llama 3**: Selbst-gehostetes LLM (70B Modell via Ollama/LM Studio)
- **Vorteil**: Vollständige Datenkontrolle, kein Cloud-Vendor-Lockin, DSGVO-sicher

**Audit-Log:**

- **Alle KI-Operationen geloggt**: Wer hat wann welches Modell mit welchen Daten genutzt?
- **Compliance-Report**: GF kann jederzeit nachweisen, wie KI genutzt wurde (für Audits)

---

## Erfolgsmetriken (KPIs für KI-Features)

| Metrik                                | Ziel (Phase 2)                                      | Messung                     |
| ------------------------------------- | --------------------------------------------------- | --------------------------- |
| **Transkriptions-Adoption**           | 70% aller Außendienst-Besuche nutzen Audio-Aufnahme | CouchDB Analytics           |
| **Zeit-Ersparnis pro Protokoll**      | Durchschnittlich 15 Min gespart                     | User-Survey + Time-Tracking |
| **Lead-Scoring-Accuracy**             | >75% AUC-ROC                                        | ML-Evaluation               |
| **Conversion Rate (mit KI vs. ohne)** | +15% höhere Abschlussrate bei KI-Nutzern            | A/B-Test                    |
| **Project Risk Precision**            | >70% korrekte Vorhersagen (keine False Alarms)      | Historical Validation       |
| **User Satisfaction (KI-Features)**   | Net Promoter Score (NPS) >50 für KI-Features        | Quartals-Survey             |

---

**Siehe auch:**

- **Technische Umsetzung**: `docs/architectur/` → "KI-Integrationsarchitektur (Phase 2+)"
- **ADR-018**: AI-Integrationsarchitektur (Message Queue + n8n + WebSocket)
- **Review**: `docs/reviews/AI_INTEGRATION_STRATEGY.md` → Detaillierte Implementierungsstrategie

# Pillar 2: Enable Active Collaboration & Customer Engagement (Echtzeit-Zusammenarbeit)

**Vision:** KOMPASS entwickelt sich von einer "Datenteilung" zu **aktiver, kontextueller Kollaboration**. Teams arbeiten in Echtzeit zusammen, Kommunikation ist in Vorgänge eingebettet (nicht in separatem E-Mail/Chat), und Kunden werden proaktiv eingebunden.

**Strategische Ausrichtung:**

- **Von asynchron (E-Mail) zu synchron (Real-Time)** → Schnellere Reaktionszeiten, weniger "Wer hat was übersehen?"
- **Von isoliert (Slack/Teams) zu integriert (Kommunikation IN den Daten)** → Kontext bleibt erhalten
- **Von B2B zu B2B2C (Customer Portal)** → Kunde wird Teil des Prozesses, nicht externer Empfänger

---

## Phase 2.1 (Q3 2025): Real-Time Internal Collaboration – Team-Synchronisation

### 🔔 Activity Feed & Smart Notifications (Echtzeit-Benachrichtigungen)

**Problem:** Wichtige Änderungen (Task zugewiesen, Angebot genehmigt, Projekt-Status geändert) gehen in E-Mail-Flut unter → Mitarbeiter verpassen Infos → Verzögerungen.

**Lösung: Echtzeit-Activity-Feed mit intelligentem Notification-System**

**Features:**

1. **Zentral Customer/Account/Project Activity Stream:**

   ```
   ┌────────────────────────────────────────────────────┐
   │ Kunde "Hofladen Müller"                            │
   ├────────────────────────────────────────────────────┤
   │ ⏰ Vor 2 Min  @lisa hat Angebot aktualisiert       │
   │ 💬 Vor 15 Min @max: "Budget-Freigabe eingeholt"   │
   │ ✅ Vor 1h     Offer #2024-045 von GF genehmigt     │
   │ 📝 Vor 3h     Neues Protokoll von @sarah added     │
   └────────────────────────────────────────────────────┘
   ```

2. **@-Mentions & Task-Assignments:**
   - **Use Case**: Lisa (Innendienst) schreibt Kommentar: "@Max bitte Muster-Lieferung prüfen" → Max bekommt Push-Notification (PWA) + In-App-Badge
   - **Technologie**: Socket.IO Real-Time, Redis Pub/Sub für Multi-User-Notifications

3. **Status-Change-Alerts:**
   - **Automatisch**: "Opportunity 'Baumarkt XY' auf Status 'Won' geändert" → GF, Planung, Innendienst werden benachrichtigt
   - **Konfigurierbar**: User wählt, für welche Events Benachrichtigung (z.B. nur "High-Value Deals >€50K")

4. **Notification Channels:**
   - **In-App** (Badge + Dropdown) → Immer
   - **Push (PWA)** → Auch wenn App nicht offen
   - **E-Mail-Digest** (Optional) → "Täglich um 8 Uhr: Zusammenfassung gestern"

**Intelligentes Filtering (Noise Reduction):**

- ❌ **NICHT** jede Kleinigkeit notifizieren ("User hat Kunde geöffnet" → zu viel Spam)
- ✅ **Nur relevante Events**: Task Assignments, @-Mentions, Status Changes (Critical Path), Approvals
- ✅ **Mute-Funktion**: "Benachrichtigungen für Projekt X pausieren" (wenn temporär nicht relevant)

**Technologie:**

- **Socket.IO + Redis Adapter** (für horizontale Skalierung) → Siehe ADR-016
- **Notification Storage**: CouchDB `notifications`-Collection (pro User)
- **Read/Unread-Tracking**: `notification.read = false` → Badge-Counter

**Nutzen:**

- ✅ **Schnellere Reaktionszeiten**: Mitarbeiter sehen Updates sofort, statt alle 30 Min E-Mails checken
- ✅ **Weniger "Hab ich nicht gesehen"-Ausreden**: Klare Notification-History
- ✅ **Bessere Übergaben**: Activity Feed zeigt chronologisch alle Änderungen (Audit Trail)

---

### 💬 Contextual Commenting (Kommentare direkt an Entitäten)

**Problem:** Diskussionen über Angebots-Positionen/Projekt-Aufgaben laufen in E-Mail/Slack → Kontext geht verloren, mühsames Suchen "Welche Mail meinte der?".

**Lösung: Kommentare direkt IN den Daten**

**Use Cases:**

1. **Angebots-Position-Level-Kommentar:**

   ```
   Offer #2024-045, Position 3 "LED-Beleuchtung"
   💬 @max: "Ist die Menge 50 Stück korrekt? Kunde hatte 60 genannt."
   💬 @lisa: "@max stimmt, korrigiere auf 60. Danke!"
   ```

2. **Task-Level-Kommentar:**

   ```
   Projekt "Baumarkt Z", Task "Elektro-Installation"
   💬 @planer: "Verzögerung wegen fehlendem Material"
   💬 @gf: "Lieferant kontaktiert, Material kommt Freitag"
   ```

3. **Dokument-Approval-Kommentare:**
   ```
   Invoice #R-2024-00456
   💬 @buchhaltung: "Position 2 unklar – was ist 'Diverse Kleinteile'?"
   💬 @planer: "Das sind Schrauben/Dübel, €120 Material. Kann ich aufschlüsseln."
   ✅ @gf: "OK, so freigegeben."
   ```

**Technologie:**

- **CouchDB Embedded Comments**: `entity.comments: Comment[]` (Array of Comment-Objects)
- **Comment-Schema:**
  ```typescript
  interface Comment {
    id: string;
    author: string; // User ID
    text: string;
    createdAt: Date;
    mentions: string[]; // ["user-123", "user-456"]
    attachments?: string[]; // Optional: File-Referenzen
    resolved?: boolean; // "Diskussion abgeschlossen"
  }
  ```
- **Real-Time**: Neue Comments via Socket.IO an alle offenen Clients pushen

**UI-Integration:**

- **Kommentar-Button** neben jeder relevanten Entity (Offer-Position, Task, Document)
- **Thread-View**: Diskussion chronologisch, @-Mentions hervorgehoben
- **Resolve-Button**: "Diskussion abgeschlossen" → ausgeblendet (aber archiviert)

**Nutzen:**

- ✅ **Kontext bleibt erhalten**: Kommentar ist direkt bei der Sache (nicht in separatem Chat)
- ✅ **Audit Trail**: Alle Diskussionen nachvollziehbar (GoBD-konform)
- ✅ **Weniger E-Mail-Ping-Pong**: Diskussion im System statt endlose Mail-Threads

---

### 👥 Presence Indicators (Wer arbeitet gerade woran?)

**Vision (Phase 2.2):** Nutzer sehen in Echtzeit, wer gerade welchen Kunden/Projekt öffnet → verhindert gleichzeitige Bearbeitungen (Konflikte).

**Use Case:**

- Max öffnet "Kunde Hofladen Müller" → Lisa sieht Badge "🟢 Max arbeitet gerade hier" → Lisa wartet oder koordiniert sich
- GF öffnet Dashboard → System zeigt "3 aktive Nutzer: Max, Lisa, Sarah" (Übersicht wer gerade arbeitet)

**Technologie:**

- **Socket.IO Rooms**: User "betritt" Room, wenn Entity öffnet → andere User in Room sehen Presence
- **Heartbeat**: Alle 30s sendet Client "Ich bin noch hier" → bei Timeout (2 Min) = "User hat verlassen"

**Nutzen:**

- ✅ **Kollisions-Vermeidung**: Weniger CouchDB-Konflikte (2 User bearbeiten gleichzeitig)
- ✅ **Transparenz**: "Wer macht was?" – sichtbar in Echtzeit

---

## Phase 2.2 (Q4 2025): Customer Portal – B2B2C Engagement

### 🌐 Customer Self-Service Portal (Kunden-Portal für Projekt-Transparenz)

**Problem:** Kunde muss ständig anrufen/mailen "Wie weit ist das Projekt?" → Planer muss manuell Statusbericht schreiben → Zeitverschwendung.

**Lösung: Kunden-Portal mit transparentem Projekt-Status**

**Features:**

#### 1. **Project Status Dashboard (für Kunden)**

```
┌────────────────────────────────────────────────────┐
│ Projekt "Ladenumbau Hofladen Müller"               │
├────────────────────────────────────────────────────┤
│ Status: 🟡 In Progress (60% fertig)                │
│ Budget: €85K / €100K verbraucht                    │
│ Zeitplan: 2 Wochen Verzug (ursprünglich 15.03.)   │
│                                                    │
│ ✅ Phase 1: Planung (abgeschlossen)               │
│ 🟡 Phase 2: Elektro-Installation (läuft)          │
│ ⏳ Phase 3: Innenausbau (startet 20.03.)          │
└────────────────────────────────────────────────────┘
```

#### 2. **Document Access & Approval**

- Kunde kann **Angebote/Rechnungen downloaden** (PDF)
- **Approval-Workflow**: "Angebot #2024-045 bitte freigeben" → Kunde klickt "Genehmigen" → System notifiziert Planer
- **Change Requests**: Kunde kann Änderungswünsche direkt im Portal eingeben (statt E-Mail)

#### 3. **Secure Communication Channel**

- **Nachrichten-Thread** zwischen Kunde und Team (wie Kommentare, aber Kunde sieht nur seine Konversation)
- **File-Upload**: Kunde kann Dateien hochladen (z.B. Logo für Beschilderung)
- **Push-Notifications**: "Projekt-Status aktualisiert" → Kunde bekommt E-Mail

#### 4. **Photo Gallery (Baufortschritt)**

- Planer lädt Fotos vom Bau hoch → Kunde sieht Timeline "Vorher/Nachher" → professioneller Eindruck

**Sicherheit & Datenschutz:**

**Authentication:**

- **Magic Link** (passwortlos) → Kunde bekommt E-Mail mit Einmal-Link → Zugriff auf Portal
- **Alternative**: SSO (falls Kunde Unternehmens-Login hat)
- **Kein Passwort-Reset-Stress** → Einfach neuen Link anfordern

**Authorization (Feingranulare Berechtigungen):**

- Kunde sieht **NUR eigene Projekte** (nicht Projekte anderer Kunden)
- Kunde sieht **KEINE internen Daten** (Kosten-Kalkulationen, interne Notizen)
- **Feldebene-Filtering**: Budget-Feld optional (manche Kunden sollen Budget sehen, manche nicht)

**Audit Log:**

- **Alle Portal-Zugriffe geloggt**: Wer hat wann welches Dokument heruntergeladen?
- **Compliance**: GoBD & DSGVO-konform (Kunde kann Datenauskunft anfordern)

**Technology Stack:**

- **Backend**: NestJS API mit Customer-Portal-Endpoints (`/api/portal/*`)
- **Frontend**: Separate React-App (oder Sub-Route in KOMPASS PWA) mit vereinfachtem UI für Kunden
- **CouchDB Filtered Replication**: Kunde-User bekommt nur gefilterte Ansicht (nur eigene Projekte)

**Benefits:**

- ✅ **Kunde zufriedener**: Transparenz → Vertrauen → weniger "Wo bleibt ihr?"-Anrufe
- ✅ **Team entlastet**: Weniger manuelle Statusberichte, Kunde schaut selbst nach
- ✅ **Professioneller Eindruck**: "Die haben ein modernes System" → Wettbewerbsvorteil
- ✅ **Umsatzpotenzial**: Kunde sieht Fortschritt → empfiehlt Firma weiter → mehr Projekte

**Rollout-Strategie:**

- **Phase 2.2 (Q4 2025)**: MVP Portal (Status Dashboard + Document Download)
- **Phase 3 (Q1 2026)**: Approval-Workflow + Communication Channel
- **Phase 3+ (Q2 2026)**: Photo Gallery, Mobile-optimiertes Portal (Customer PWA)

---

### 📱 Customer Engagement KPIs

| Metrik                        | Ziel (Phase 2.2)                                                    | Messung                |
| ----------------------------- | ------------------------------------------------------------------- | ---------------------- |
| **Portal-Adoption**           | 50% aller aktiven Projekte nutzen Portal                            | CouchDB Analytics      |
| **Reduktion Status-Anfragen** | -40% weniger "Wie weit seid ihr?"-Anrufe                            | User-Survey + Call-Log |
| **Customer Satisfaction**     | Net Promoter Score (NPS) >60 bei Portal-Nutzern                     | Post-Project-Survey    |
| **Approval-Cycle-Time**       | Angebots-Freigabe durchschnittlich 2 Tage schneller (vorher 5 Tage) | Process Analytics      |
| **Dokumenten-Zugriff**        | 80% aller Kunden laden mind. 1 Dokument herunter                    | Portal-Analytics       |

---

**Siehe auch:**

- **Technische Umsetzung**: `docs/architectur/` → "Real-Time-Kommunikationsarchitektur (Phase 2+)"
- **ADR-016**: Real-Time-Kommunikationslayer (Socket.IO + Redis Adapter)
- **Security**: `docs/reviews/NFR_SPECIFICATION.md` § Sicherheit (Kundendaten-Isolation)

# Pillar 3: Deliver True Data-Driven Insights (Advanced Analytics & Selbstbestimmte BI)

**Vision:** KOMPASS liefert der Geschäftsführung **actionable Intelligence** statt roher Daten. Dashboards sind nicht statisch, sondern **anpassbar**. Analysen laufen performant (SQL-basiert via CQRS), und Außendienst erhält **effiziente Route Planning** für maximale Kundenbesuche.

**Strategische Ausrichtung:**

- **Vom "Daten-Dump" zu "Insights-Engine"** → Nicht nur Zahlen, sondern Handlungsempfehlungen
- **Von starren Reports zu Self-Service-BI** → GF baut eigene Dashboards (kein Dev-Involvement nötig)
- **Von CouchDB-Limitierung zu SQL-Power** → CQRS-Pattern für 10-100x schnellere Analytics

---

## Phase 2.1 (Q3 2025): Advanced Route Planning – Außendienst-Effizienz

### 🗺️ Intelligent Route Optimization (Multi-Stop-Routing mit Lead-Mapping)

**Problem:** Außendienst plant Touren manuell → suboptimale Reihenfolge → Zeitverschwendung, hohe Spritkosten.

**Lösung: KI-gestützte Routenplanung mit CRM-Daten-Integration**

**Features:**

#### 1. **Multi-Stop Route Optimization (Traveling Salesman Problem)**

- **Input**: Außendienst wählt 5 Kunden aus, die er diese Woche besuchen will
- **Output**: Optimale Reihenfolge (kürzeste Gesamtstrecke) + Zeitplan ("10:00 Kunde A, 11:30 Kunde B, ...")
- **Algorithmus**: Google Maps Directions API + Heuristiken (Nearest Neighbor, Genetic Algorithm)

**Use Case:**

```
Montag-Tour:
1. 09:00 - Hofladen Müller (München)
2. 11:00 - Baumarkt XY (Freising)
3. 13:00 - Lunch Break
4. 14:00 - Gartencenter Z (Erding)
5. 16:00 - Möbelhaus A (Landshut)

Gesamt: 180 km, 6h (inkl. Pausen)
Statt: 240 km bei manueller Planung → 60 km gespart = €15 Sprit
```

#### 2. **Nearby Lead Mapping (Opportunistische Besuche)**

- **Use Case**: Außendienst ist bei "Hofladen Müller" → System zeigt: "3 potenzielle Leads in 10 km Umkreis"
- **Benefit**: Spontane Zusatzbesuche ("Ich bin eh in der Nähe") → mehr Kontakte, bessere Ausnutzung

**UI:**

```
┌────────────────────────────────────────────────────┐
│ 📍 In deiner Nähe (aktuell: München-Ost)          │
├────────────────────────────────────────────────────┤
│ 🟢 Baumarkt "DIY Center" (5,2 km)                 │
│    Status: Warm Lead (Score: 65)                  │
│    Letzter Kontakt: Vor 3 Wochen                  │
│    [Route hinzufügen]                             │
│                                                    │
│ 🟡 Gartencenter "Blumen Meier" (8,7 km)          │
│    Status: Cold Lead (Score: 40)                  │
│    Letzter Kontakt: Vor 6 Monaten                │
│    [Route hinzufügen]                             │
└────────────────────────────────────────────────────┘
```

#### 3. **Automated Check-Ins & Visit Logging**

- **Geofencing**: Wenn Außendienst am Kunden-Standort ankommt (GPS-Radius 100m) → Auto-Prompt "Check-In bei Hofladen Müller?"
- **One-Click-Protokoll**: Nach Check-Out → "Besuch dokumentieren?" → Voice-Memo aufnehmen (Whisper-Transkription, siehe Pillar 1)
- **Zeiterfassung**: System loggt automatisch Besuchsdauer (für Abrechnung/Statistik)

**Nutzen:**

- ✅ **Zeit sparen**: 1-2h/Woche durch optimierte Routen
- ✅ **Kosten sparen**: €50-100/Monat weniger Sprit (bei 5 Außendienstlern = €600-1200/Jahr)
- ✅ **Mehr Besuche**: +15-20% mehr Kundenkontakte durch opportunistische Leads
- ✅ **Automatische Dokumentation**: Kein manuelles Fahrtenbuch nötig

**Technology Stack:**

- **Routing**: Google Maps Directions API (oder self-hosted OSRM)
- **Geofencing**: Browser Geolocation API + CouchDB Geo-Queries (`_spatial` Views)
- **Offline-Support**: Route wird lokal gecacht (PouchDB) → funktioniert auch ohne Netz

---

## Phase 2.2 (Q4 2025): BI & Analytics Layer – Self-Service Business Intelligence

### 📊 Customizable Dashboards (GF baut eigene KPI-Views)

**Problem:** GF will unterschiedliche KPIs tracken (heute: Umsatz, nächste Woche: Lead-Conversion) → muss Developer beauftragen → 3 Tage Wartezeit.

**Lösung: Drag & Drop Dashboard-Builder (Low-Code für GF)**

**Features:**

#### 1. **Widget Library (vorkonfigurierte Komponenten)**

- **Sales-Widgets**: "Umsatz YTD", "Top 10 Opportunities", "Pipeline-Value", "Conversion Rate"
- **Project-Widgets**: "Laufende Projekte", "Budget-Auslastung", "Verspätete Projekte"
- **Team-Widgets**: "Außendienst-Aktivität", "Offene Tasks pro User", "Durchschnittl. Response-Time"

#### 2. **Dashboard-Editor (No-Code UI)**

```
┌────────────────────────────────────────────────────┐
│ Dashboard: "GF-Übersicht Q1 2025"                  │
├────────────────────────────────────────────────────┤
│ [Drag Widgets from Library]                       │
│                                                    │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│ │ Umsatz   │  │ Pipeline │  │ Top Deals│        │
│ │ YTD      │  │ Value    │  │          │        │
│ │ €1,2M    │  │ €850K    │  │ 1. €120K │        │
│ └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
│ ┌──────────────────────────────┐                 │
│ │ Pipeline-Funnel (Chart)      │                 │
│ │ [Bar Chart Widget]           │                 │
│ └──────────────────────────────┘                 │
│                                                    │
│ [Save Dashboard] [Share with Team]               │
└────────────────────────────────────────────────────┘
```

#### 3. **Custom Filters & Drill-Downs**

- **Filter**: "Zeige nur Opportunities >€50K aus Q1 2025"
- **Drill-Down**: Klick auf "Umsatz YTD" → Detail-Tabelle alle Rechnungen

#### 4. **Dashboard-Sharing**

- GF kann Dashboard "Team-Performance" mit allen Teamleitern teilen
- **Permissions**: Manche Dashboards nur für GF (z.B. Gehaltsdaten), andere für alle

**Technology Stack:**

- **Frontend**: React + Recharts/Chart.js für Visualisierungen
- **Backend**: PostgreSQL (via CQRS) → SQL-Queries für Aggregationen
- **Dashboard-Persistence**: Dashboard-Config als JSON in CouchDB gespeichert

**Nutzen:**

- ✅ **Autonomie**: GF kann selbst KPIs definieren, keine Dev-Abhängigkeit
- ✅ **Schnelligkeit**: Dashboard in 5 Min erstellt statt 3 Tage Wartezeit
- ✅ **Flexibilität**: GF kann Dashboards wöchentlich anpassen (je nach Fokus)

---

### 🚀 Data Replication for High-Performance Analytics (CQRS)

**Problem:** CouchDB MapReduce-Views sind zu langsam für komplexe Analysen (10-30s Load-Time für "Umsatz pro Quartal pro Branche").

**Lösung: CQRS Pattern mit PostgreSQL als Read-Store (siehe ADR-017)**

**Architektur:**

```
CouchDB (OLTP - Write Store)
   ↓ _changes Feed
PostgreSQL (OLAP - Read Store)
   ↓ SQL Queries
Grafana Dashboards / Custom BI-Widgets
```

**Performance-Gewinn:**

- **Vorher (CouchDB MapReduce)**: 10-30s für "Umsatz pro Quartal" (Full-Doc-Scan)
- **Nachher (PostgreSQL SQL)**: <100ms für gleiche Query (Indexes!)

**Replication Latency:**

- **Eventual Consistency**: 1-5s Verzögerung zwischen CouchDB-Update → PostgreSQL
- **Akzeptabel für Dashboards**: Reports müssen nicht Realtime sein

**Nutzen:**

- ✅ **10-100x schnellere Analytics**: Dashboards laden <2s statt >10s
- ✅ **SQL-Flexibilität**: Ad-hoc-Queries ohne neue MapReduce-Views
- ✅ **BI-Tool-Integration**: Grafana, Metabase, Apache Superset können direkt PostgreSQL anbinden

**Siehe auch:**

- **Detaillierte Architektur**: `docs/architectur/` → "Erweiterte Datenbankarchitektur & Skalierung (CQRS Pattern)"
- **ADR-017**: CQRS für Analytics

---

### 📈 Advanced Analytics KPIs

| Metrik                            | Ziel (Phase 2.2)                                            | Messung                |
| --------------------------------- | ----------------------------------------------------------- | ---------------------- |
| **Dashboard-Adoption**            | 80% aller GF-relevanten User nutzen mind. 1 Dashboard       | User-Analytics         |
| **Dashboard-Load-Time**           | <2s (P95) für alle Widgets                                  | Performance-Monitoring |
| **Self-Service-Rate**             | 60% aller Dashboard-Änderungen durch User selbst (ohne Dev) | Support-Tickets        |
| **Route-Optimization-Adoption**   | 70% aller Außendienst-Touren nutzen Route Planning          | CouchDB Analytics      |
| **Zeit-Ersparnis Route Planning** | Durchschnittlich 1,5h/Woche pro Außendienst                 | User-Survey            |

---

**Siehe auch:**

- **CQRS-Implementierung**: `docs/architectur/` → "Erweiterte Datenbankarchitektur & Skalierung (CQRS Pattern)"
- **Performance-Ziele**: `docs/reviews/NFR_SPECIFICATION.md` § Performance & Skalierung
- **ADR-017**: CQRS für Analytics (CouchDB → PostgreSQL)

---

# Validierungstabelle

Prüfkriterium
Bewertung
Begründung / Belegquelle

Die Vision ist inhaltlich konsistent mit den Analyseergebnissen.
Sie hebt die zentralen Punkte hervor – etwa zentrale **360°-**
**Datenhaltung** und Zusammenführung von CRM und PM in
**einem System** , um Doppelarbeit und Medienbrüche zu
beseitigen
. Ebenso spiegelt sie den Bedarf an **effizienter,**
**silofreier Zusammenarbeit** wider, der im Projekt als
leistungsteigernd identifiziert wurde
. Keine Aussage
widerspricht den erhobenen Anforderungen oder Zielen, alle
Elemente (Transparenz, Effizienz, Nutzerfokus etc.) ergeben ein

# Konsistenz

# stimmiges Gesamtbild.

Die Nordstern-Direktive wurde klar an den Bedürfnissen der
Endnutzer ausgerichtet. Sie adressiert direkt die Pain Points der
Personas: Der Außendienst möchte **“möglichst wenig Zeit mit**
**Administration verbringen, sondern mehr beim Kunden**
**sein”**
und benötigt mobile Offline-Funktionen, während die
Geschäftsführung **datengetriebene Entscheidungen** statt
Bauchgefühl treffen will
. Diese echten Nutzerbedürfnisse –
erhoben in Interviews und Persona-Profilen – finden sich explizit
in der Vision wieder. Dadurch fühlen sich die Anwender mit ihren
Zielen ernstgenommen.

# Nutzerorientierung

# Die formulierte Vision ist motivierend und zeigt den höheren

# Inspiration

# Trotz ihres aspirativen Charakters bleibt die Vision realistisch und

# Umsetzungsbezug

Prüfkriterium
Bewertung
Begründung / Belegquelle

---

# Pillar 4: Erweiterte Vision 2025 – Von Intelligent Co-Pilot zu Autonomous Business Partner

## Strategischer Kontext

Die **ursprüngliche Nordstern-Vision** positionierte KOMPASS als "Intelligent Co-Pilot". Die **Erweiterungen 2025** heben dieses Zielbild auf die nächste Stufe: **KOMPASS wird zum autonomen Business Partner**, der nicht nur assistiert, sondern **proaktiv Chancen erkennt, Risiken vorhersagt und Workflows orchestriert**.

**Evolution der Vision:**

```
Phase 1 (MVP):         Daten-Repository → Zentrale Informationsquelle
Phase 2 (2025 Q1-Q2):  Intelligent Co-Pilot → KI-Assistenz bei Routineaufgaben
Phase 3 (2025 Q3-Q4):  Autonomous Partner → Proaktive Intelligence & Forecasting
Phase 4 (2026+):       Self-Optimizing System → Continuous Learning & Adaptation
```

**Strategische Differenzierung** gegenüber Wettbewerbern (Salesforce Einstein, Dynamics 365 Copilot, SAP AI)[^comp]:

- **On-Premise RAG**: 100% Datensouveränität (kein Vendor-Lock-in wie Salesforce)
- **n8n-native Automation**: Flexible Workflow-Orchestrierung (vs. proprietäre Automation-Engines)
- **Open-Source-Foundation**: LlamaIndex, Llama 3, Weaviate (vs. Black-Box-AI)
- **DSGVO-first**: Deutsche KI-Lösung für deutsche Unternehmen

[^comp]: Quelle: Research "Competitive Analysis" – Salesforce Einstein, Dynamics 365 Copilot, SAP AI, HubSpot AI

---

## 🔮 Phase 3: RAG-basiertes Knowledge Management

### Vision: "Jede Frage sofort beantwortet – als hätte man das gesamte Unternehmensgedächtnis zur Hand"

**Herausforderung:**

- Wissen ist fragmentiert: Projekt-Dokumentationen, E-Mails, Notizen, CAD-Zeichnungen
- Suche ist ineffizient: Keyword-Suche findet nur exakte Treffer
- Expertise geht verloren: Wenn erfahrene Mitarbeiter gehen, geht Wissen mit

**Lösung: Retrieval-Augmented Generation (RAG) Architecture**[^rag]

**Technische Architektur:**

```
┌─────────────────────────────────────────────────────────┐
│                     KOMPASS Frontend                     │
│              Natural Language Query Interface            │
└─────────────────────────────────────────────────────────┘
                         ↓ REST API
┌─────────────────────────────────────────────────────────┐
│                    RAG Orchestration                     │
│               (LlamaIndex + LangChain)                   │
├─────────────────────────────────────────────────────────┤
│  1. Query Understanding (Intent Detection)              │
│  2. Retrieval (Vector + Graph Search)                   │
│  3. Context Assembly (Document Ranking)                 │
│  4. Generation (LLM Response with Sources)              │
└─────────────────────────────────────────────────────────┘
           ↓                  ↓                 ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐
│  Vector Database │ │  Graph Database  │ │  CouchDB     │
│  (Pinecone/      │ │  (Neo4j)         │ │  (Documents) │
│   Weaviate)      │ │  Relationships   │ │  Raw Data    │
└──────────────────┘ └──────────────────┘ └──────────────┘
```

[^rag]: Quelle: Research "RAG Architecture" – Production-Ready RAG Systems

**Funktions-Features:**

**1. Semantic Search über gesamte Knowledge Base:**

- **Alle Dokumente embedded**: Projekte, Protokolle, Angebote, E-Mails, CAD-Beschreibungen
- **Vector Embeddings**: Multilingual E5-Modell (optimal für Deutsch)[^embed]
  - "Hofladen regionale Produkte" findet auch "Bauernladen Direktvermarkter"
  - Synonym-Verständnis ohne manuelle Pflege
- **Hybrid Search**: Kombination Vector + Keyword für beste Ergebnisse[^hybrid]
  - Vector: Semantische Ähnlichkeit (Konzept-Matching)
  - Keyword: Exakte Treffer (Projekt-IDs, Namen)
  - Weighted Fusion: 70% Vector + 30% Keyword

[^embed]: Quelle: Research "Embedding Strategies" – Multilingual E5 für German Text

[^hybrid]: Quelle: Research "RAG Architecture" – Hybrid Search Best Practices

**2. Conversational Q&A mit Kontext-Erhaltung:**

- **Multi-Turn-Dialoge**:
  ```
  User: "Zeige mir ähnliche Hofläden-Projekte"
  AI: [Liste von 8 Projekten]
  User: "Welches hatte die höchste Kundenzufriedenheit?"
  AI: "Projekt 'Hofladen Müller' mit 5/5 Sternen. Besonderheiten: ..."
  User: "Zeig mir das CAD-Layout davon"
  AI: [Öffnet CAD-Datei oder zeigt Thumbnail]
  ```
- **Kontext-Speicherung**: System erinnert sich an vorherige Fragen im Dialog (Session-basiert)

**3. Cross-Entity-Queries:**

- **Graph-Enhanced RAG** (Neo4j + Vector Search)[^graph-rag]:
  - "Welche Projekte von Kunde X verwendeten Material Y von Lieferant Z?"
  - Graph-Traversierung findet Beziehungen → Vector Search findet semantisch ähnliche Materialien
  - Beispiel-Ergebnis: "3 Projekte: Hofladen Müller (2024), Vinothek Schmidt (2023), ..."
- **Relationship Reasoning**: KI versteht Zusammenhänge zwischen Entities
  - "Wer sind die Entscheider bei Kunde X?" → Traversiert Contact → Customer → Influence-Graph

[^graph-rag]: Quelle: Research "Neo4j" – Graph Database + Vector Search Hybrid

**4. Auto-Summarization & Report Generation:**

- **Executive Summaries**: Automatisch generierte Zusammenfassungen
  - Wöchentlicher GF-Report: KI fasst alle Events der Woche zusammen (Opportunities, Projekte, Risiken)
  - Projekt-Abschluss-Report: KI generiert Lessons Learned aus Protokollen + Notizen
- **Meeting Briefs**: Vor Kundentermin → KI erstellt automatisch Briefing
  - "Kunde X: 3 vergangene Projekte (€180K Gesamt), 1 offene Opportunity (€45K), 2 offene Rechnungen (€12K)"

**5. DSGVO-konforme Umsetzung:**

- **On-Premise LLM Hosting**: Llama 3 70B läuft lokal (keine Cloud-Abhängigkeit)[^dsgvo-llm]
- **Feldebene-Verschlüsselung**: Sensitive Daten verschlüsselt in Vector DB
- **Access Control**: RAG respektiert RBAC (User sieht nur erlaubte Dokumente)
- **Audit Trails**: Alle Queries geloggt (Wer hat was gesucht?)

[^dsgvo-llm]: Quelle: Research "DSGVO Compliance for LLMs" – On-Premise Hosting

**6. Quality Assurance & Hallucination Prevention:**

- **Source Attribution**: Jede Antwort mit Quellenangaben (CRM-IDs, Projekt-Links)
- **Confidence Scores**: "Antwort basierend auf 12 Dokumenten (Konfidenz: 92%)"
- **Hallucination Detection**: System warnt wenn Konfidenz <70% ("Manuelle Prüfung empfohlen")
- **Human-in-the-Loop**: Kritische Entscheidungen erfordern manuelle Bestätigung

**Use Cases pro Persona:**

- **GF**: "Warum ist Umsatz Q1 gesunken?" → KI analysiert & liefert Ursachen mit Quellen
- **Außendienst**: "Zeig mir erfolgreiche Pitches für Hofläden" → Best-Practice-Beispiele
- **Innendienst**: "Was kostete Position X im letzten ähnlichen Projekt?" → Preis-Historie
- **Planung**: "Welche Design-Patterns funktionieren bei Vinotheken?" → Pattern-Library
- **Buchhaltung**: "Welche Kunden zahlen am häufigsten zu spät?" → Risiko-Ranking

**Performance-Ziele:**

- Query Response Time: <2s (P95)[^perf]
- Relevanz-Score: >85% (gemessen via User-Feedback)
- Adoption: >70% monatlich aktive User nutzen RAG-Suche

[^perf]: Quelle: Research "RAG Architecture" – Performance Benchmarks für Production Systems

---

## 🤖 Phase 3: n8n-gesteuerte Intelligente Automation

### Vision: "Workflows arbeiten für dich – nicht umgekehrt"

**Herausforderung:**

- Repetitive Tasks (Mahnungen, Follow-Ups, Reporting) binden Kapazität
- Prozess-Lücken: Dinge fallen durch Raster (vergessene Nachfass-E-Mails)
- Manuelle Koordination: Übergaben zwischen Abteilungen ineffizient

**Lösung: n8n als Workflow-Orchestrierungs-Engine**[^n8n-arch]

**Technische Architektur:**

```
┌───────────────────────────────────────────────────────────┐
│                    KOMPASS Backend                        │
│               (NestJS REST API + Events)                  │
└───────────────────────────────────────────────────────────┘
                         ↓ Webhooks / Events
┌───────────────────────────────────────────────────────────┐
│                   n8n Workflow Engine                     │
│          (Self-Hosted, Visual Workflow Editor)            │
├───────────────────────────────────────────────────────────┤
│  • Event Triggers (CouchDB Changes, Time-based, Manual)  │
│  • LLM Integration (GPT-4, Llama 3 via LangChain)        │
│  • External APIs (Lieferanten, Creditreform, E-Mail)     │
│  • Conditional Logic (If/Else, Loops, Error Handling)    │
└───────────────────────────────────────────────────────────┘
           ↓                    ↓                  ↓
  ┌─────────────────┐  ┌───────────────┐  ┌──────────────┐
  │  CouchDB        │  │  SMTP/Slack   │  │  External    │
  │  (Data Updates) │  │  (Notifications)│  │  APIs        │
  └─────────────────┘  └───────────────┘  └──────────────┘
```

[^n8n-arch]: Quelle: Research "n8n Automation" – Enterprise n8n Architecture Patterns

**Automation-Katalog:**

**Kategorie 1: Proaktive Kunden-Workflows**

**1.1 Automated Follow-Up Sequences:**

- **Trigger**: Angebot versendet, keine Antwort nach X Tagen
- **Workflow**[^n8n-workflows]:
  - Tag 3: Freundliche Nachfass-E-Mail (Personalisiert via LLM-Template)
  - Tag 7: Zweite Erinnerung + Benachrichtigung an Außendienst
  - Tag 14: Eskalation an Vertriebsleiter + Opportunity-Status auf "Stagnating"
  - Tag 21: Auto-Vorschlag "Opportunity als Lost markieren?"
- **Personalisierung**: KI passt Ton & Inhalt an Kundentyp an (VIP vs. Standard)
- **ROI**: -60% "vergessene" Follow-Ups, +15% Conversion-Rate durch Timing

[^n8n-workflows]: Quelle: Research "n8n CRM Automation" – Automated Follow-Up Patterns

**1.2 Customer Health Monitoring:**

- **Trigger**: Täglich um 6 Uhr morgens
- **Workflow**:
  1. Für jeden Kunden: Analysiere Engagement-Metriken
     - Letzte Interaktion >90 Tage → "At-Risk"
     - Offene Rechnungen >30 Tage → "Payment-Risk"
     - Keine neuen Opportunities seit 6 Monaten → "Churn-Risk"
  2. **Automated Alerts** an zuständigen Außendienst
     - "⚠️ Kunde X seit 92 Tagen kein Kontakt → At-Risk für Churn"
  3. **Auto-Actions** (optional):
     - E-Mail-Template erstellen "Wie können wir helfen?"
     - Task erstellen "Kunde X kontaktieren (Relationship-Pflege)"

**Kategorie 2: Interne Prozess-Automation**

**2.1 Automated Project Kickoff:**

- **Trigger**: Opportunity-Status → "Won"
- **Workflow** (Multi-Step-Orchestration)[^n8n-orchestration]:
  1. **Projekt auto-anlegen**: Daten aus Opportunity → neues Projekt (CouchDB)
  2. **Teams benachrichtigen**: @Planung, @Innendienst, @Montage via Slack
  3. **Standard-Tasks generieren**: "Materialbestellung", "CAD-Erstellung", "Liefertermin koordinieren"
  4. **Calendar-Sync**: Meilensteine in Team-Kalender eintragen (Google Calendar API)
  5. **Dokumente vorbereiten**: PDF-Templates für Auftragsbestätigung generieren
  6. **CRM-Update**: Opportunity-Status, Customer-Historie aktualisieren
- **Time Savings**: 45 Min manuelle Arbeit → 2 Min Review

[^n8n-orchestration]: Quelle: Research "n8n Agent Orchestration" – Multi-Step Workflows

**2.2 Supplier Performance Tracking:**

- **Trigger**: Kontinuierlich (Event-driven bei jeder Lieferung)
- **Workflow**:
  1. **Liefertermin-Tracking**: Vergleich "zugesagt" vs. "tatsächlich geliefert"
  2. **Scoring-Update**: Lieferanten-Zuverlässigkeits-Score neu berechnen
  3. **Alerts bei Auffälligkeiten**:
     - "Lieferant X 3× verspätet in letzten 4 Wochen → Reliability-Score von 95% auf 68% gefallen"
  4. **Auto-Recommendations**: Bei nächster Bestellung → System schlägt zuverlässigeren Lieferanten vor

**2.3 Invoice Reminder Automation:**

- **Trigger**: Rechnung fällig + X Tage nach Fälligkeit
- **Workflow** (Mehrstufig):
  - Tag 3: Freundliche Zahlungserinnerung (E-Mail)
  - Tag 10: Zahlungserinnerung + CC an Außendienst
  - Tag 14: Mahnstufe 1 (generiert, Buchhaltung reviewt)
  - Tag 30: Mahnstufe 2 + Mahngebühren
  - Tag 45: Eskalation → GF + Inkasso-Vorschlag
- **Smart Timing**: ML-Modell optimiert Zeitpunkte basierend auf Kundenverhalten
  - Kunde A zahlt typischerweise nach 2. Erinnerung → Workflow pausiert bei Stufe 2

**Kategorie 3: Predictive Intelligence Workflows**

**3.1 Weekly Forecast Generation:**

- **Trigger**: Jeden Freitagabend 17 Uhr
- **Workflow** (LLM-Powered)[^n8n-llm]:
  1. **Daten aggregieren**: Pipeline, Umsatz, Margen, Liquidität, Team-Auslastung
  2. **ML-Forecasts ausführen**: Opportunity-Scoring, Cash-Flow-Prediction, Timeline-Forecasts
  3. **LLM-Zusammenfassung generieren**:
     - "KW 15 Highlights: 3 neue Projekte (€95K), Pipeline +€120K, Liquidität stabil (€87K)"
     - "Risiken: 2 Projekte verzögert, Kunde C weiterhin säumig (€18K offen)"
     - "Chancen: 5 warme Opportunities in Negotiation (72% Ø Wahrscheinlichkeit)"
     - "Actions: Nachfassen bei 3 stagnierten Opportunities"
  4. **PDF-Report generieren** (mit Charts)
  5. **E-Mail an GF** + Team-Leads

[^n8n-llm]: Quelle: Research "n8n Automation" – LLM Integration für Report Generation

**3.2 Proactive Risk Alerts:**

- **Trigger**: Stündlich (n8n Cron)
- **Workflow**:
  1. **ML-Modelle ausführen**: Projekt-Delay-Risk, Budget-Overrun-Risk, Payment-Risk
  2. **Schwellenwerte prüfen**: Risiko >80% → Alert triggern
  3. **Kontext-Analyse via RAG**: "Warum ist Projekt X at-risk?"
     - KI durchsucht Projekt-Notizen, identifiziert Ursache: "CAD-Phase überfällig seit 5 Tagen"
  4. **Personalisierte Alerts**: An zuständigen Projekt-Manager
     - "🔴 Projekt X: 85% Verzögerungs-Risiko – CAD-Phase überfällig, Empfehlung: Priorisieren"
  5. **Recommended Actions**: KI schlägt Maßnahmen vor
     - "Tipp: Externe CAD-Unterstützung buchen (Lieferant Architektur-Plus, 3 Tage Lieferzeit)"

**Kategorie 4: External Integrations**

**4.1 Supplier API Integration:**

- **Trigger**: Neues Angebot benötigt Sonderteile (nicht in Preisliste)
- **Workflow**:
  1. **Specs extrahieren** aus Angebots-Position (LLM parst Text)
  2. **API-Anfragen** an 3 Lieferanten (REST APIs / E-Mail-Gateways)
  3. **Antworten sammeln** (Timeouts nach 48h)
  4. **Vergleichstabelle erstellen** (Preis, Lieferzeit, Qualität)
  5. **Benachrichtigung** an Innendienst: "Lieferantenangebote ready for review"

**4.2 Credit Check Automation:**

- **Trigger**: Neuer Großkunde (Opportunity >€50K)
- **Workflow**:
  1. **Bonitätsprüfung** via Creditreform/Schufa-API
  2. **Credit-Score abrufen**
  3. **Risk-Assessment**: Score <600 → High-Risk-Flag
  4. **Auto-Alert** an GF + Vertrieb:
     - "⚠️ Neukunde Y: Bonitäts-Score 580 (High-Risk) → Empfehlung: Vorauskasse 50% verlangen"

**Workflow-Governance & Monitoring:**

**No-Code Visual Editor:**

- **n8n UI**: Nicht-technische User (Innendienst, GF) können Workflows modifizieren
- **Drag & Drop**: Nodes verbinden (Trigger → Action → Condition → Notification)
- **Template Library**: Vorgefertigte Workflow-Templates für häufige Use Cases
  - "Customer Follow-Up Sequence"
  - "Project Kickoff Automation"
  - "Invoice Reminder Cascade"

**Monitoring & Error Handling:**

- **Execution Logs**: Jede Workflow-Ausführung geloggt (Erfolg/Fehler, Dauer)
- **Error Alerts**: Bei Workflow-Fehlern → Benachrichtigung an Admin
  - "🔴 Workflow 'Invoice Reminder' failed 3× – E-Mail-Server nicht erreichbar"
- **Retry Logic**: Automatische Wiederholungen bei transienten Fehlern (3× Retry mit Exponential Backoff)
- **Grafana Dashboard**: n8n-Metrics (Execution Count, Error Rate, Avg Duration)

**Adoption & ROI:**

- **Time Savings**: Ø 8h/Woche pro Team (Innendienst: 5h, Buchhaltung: 3h, Vertrieb: 2h)
- **Error Reduction**: -40% "vergessene" Tasks durch Automation
- **Consistency**: 100% der Workflows laufen standardisiert ab (keine Ad-hoc-Abweichungen)
- **User Satisfaction**: >85% finden n8n-Automationen hilfreich (Target aus User-Survey)

---

## 📊 Phase 3: Predictive Forecasting & Business Intelligence

### Vision: "Zukunft sehen statt nachschauen – Entscheidungen treffen bevor Probleme entstehen"

**Herausforderung:**

- Reaktives Management: Probleme werden erkannt wenn es zu spät ist
- Bauchgefühl-Entscheidungen: Mangels Daten/Prognosen keine fundierten Entscheidungen
- Reporting-Overhead: Manuelle Excel-Reports kosten 2-3h/Woche

**Lösung: ML-Powered Forecasting + Real-Time BI Dashboards**[^bi-arch]

**Forecasting-Katalog:**

**1. Sales Pipeline Forecasting:**

- **Gewichtete Pipeline-Methode**[^forecast-methods]:
  - Jede Opportunity mit ML-Wahrscheinlichkeit gewichtet
  - Q1 Forecast: €450K (aus €720K Pipeline bei Ø 62% Wahrscheinlichkeit)
  - **Confidence Intervals**: Best Case (+20%), Most Likely, Worst Case (-20%)
- **Opportunity Scoring ML-Modell** (Random Forest)[^ml-scoring]:
  - Features: Opportunity-Größe, Branche, Verkäufer, Kundenhistorie, Engagement-Metriken
  - Output: Wahrscheinlichkeit 0-100% für "Won"
  - Accuracy: >85% (validiert auf historischen Daten 2022-2024)

[^bi-arch]: Quelle: Research "BI Solutions" – Metabase/Grafana for Real-Time Dashboards

[^forecast-methods]: Quelle: Research "Sales Forecasting Methods" – Weighted Pipeline Best Practices

[^ml-scoring]: Quelle: Research "ML Opportunity Scoring" – Random Forest für Win-Prediction

**2. Cash Flow & Liquiditäts-Forecasting:**

- **Rolling 6-Month Cash Flow Prediction**[^cashflow]:
  - Erwartete Zahlungseingänge (Invoice Aging + Payment Pattern ML)
  - Geplante Ausgaben (Gehälter, Lieferanten, Projektkosten)
  - Liquiditätskurve mit Kritisch-Schwellenwerten (€50K Minimum)
- **Payment Prediction ML**: Wann zahlt Kunde? (Ø Abweichung: ±3 Tage)
- **Scenario Analysis**: What-If-Simulationen (Monte Carlo)
  - "Was passiert wenn Kunde X 4 Wochen später zahlt?" → Liquidität sinkt auf €38K (kritisch!)

[^cashflow]: Quelle: Research "Cash Flow Prediction" – Invoice Aging & ML-Based Forecasting

**3. Project Timeline Forecasting:**

- **Critical Path Analysis** mit ML-Enhanced Estimates[^cpm]:
  - System berechnet realistische Fertigstellungsdaten (nicht nur geplante)
  - Projekt A: Geplant KW 16, ML-Forecast KW 17 (75% Wahrscheinlichkeit +1 Woche Verzögerung)
- **Resource Capacity Forecasting**:
  - Workload-Prognose: "KW 20: Team-Auslastung 119% (Überlastung!) → Externe Hilfe buchen"
- **Bottleneck Detection**: Identifiziert kritische Ressourcen (3D-Visualisierer überlastet)

[^cpm]: Quelle: Research "Forecasting Methods" – Critical Path Method mit ML-Enhancements

**4. Financial KPI Forecasting:**

- **Margin Trends**: Prognose Durchschnitts-Marge nächste 3 Monate
  - Q2 Forecast: 26,5% (unter Ziel 30%, Ursache: Materialkosten +15%)
- **Revenue Forecasting**: Umsatz-Prognose mit Seasonality-Adjustments
  - Q4 historisch +18% vs. Q3 → Prognose Q4 2025: €520K
- **Break-Even-Analysen**: "Bei aktueller Kostenstruktur: Break-Even bei €42K Monatsumsatz"

**BI-Dashboard-Architektur:**

**Technology Stack-Entscheidung** (basierend auf Research)[^bi-comparison]:

| Tool         | Pros                                                           | Cons                                     | Use Case                                                   |
| ------------ | -------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| **Grafana**  | Echtzeit-fähig, Infrastructure Monitoring, Open-Source         | Weniger BI-Features, SQL-lastig          | **Operations Dashboards** (Team-Auslastung, System-Health) |
| **Metabase** | Business-User-friendly, No-Code, Auto-SQL-Generation           | Nicht Echtzeit, limitierte Anpassbarkeit | **Executive Dashboards** (GF, Buchhaltung)                 |
| **PowerBI**  | Enterprise-Features, Microsoft-Integration, Advanced Analytics | Kosten (€10/User/Monat), Cloud-only      | **Optional** für Kunden mit Office 365                     |

**KOMPASS-Strategie**: **Grafana (Primary) + Metabase (Secondary)**

- **Grafana**: Operations-Dashboards, Real-Time-KPIs
- **Metabase**: Executive-Reports, Ad-hoc-Queries (Self-Service BI)

[^bi-comparison]: Quelle: Research "BI Solutions" – Metabase vs Grafana vs PowerBI Feature Comparison

**Data Warehouse Architecture:**

**Star Schema Design** für schnelle Aggregationen[^dw-design]:

```
                     ┌──────────────────┐
                     │   Fact: Sales    │
                     │  ├─ Revenue      │
                     │  ├─ Margin       │
                     │  ├─ Quantity     │
                     │  └─ Date_ID ──┐  │
                     └────────┬────────┘
                 ┌────────────┼────────────┐
                 ↓            ↓            ↓
       ┌─────────────┐ ┌──────────┐ ┌───────────┐
       │ Dim: Customer│ │Dim: Time │ │Dim: Product│
       │ ├─ Industry │ │├─ Quarter│ │├─ Category│
       │ ├─ Rating   │ │├─ Month  │ │└─ Type    │
       │ └─ Location │ │└─ Week   │ └───────────┘
       └─────────────┘ └──────────┘
```

- **Incremental Updates**: CDC (Change Data Capture) repliziert CouchDB → PostgreSQL[^cdc]
- **Materialized Views**: Vorberechnete Aggregationen für Sub-Second-Query-Performance
- **Partitioning**: Nach Zeit partitioniert (Quarter) für schnelle Historical Queries

[^dw-design]: Quelle: Research "Data Warehouse Design" – Star Schema for Operational BI

[^cdc]: Quelle: Research "Real-Time Dashboards" – CDC für Live-Updates

**Self-Service BI für Power-User:**

- **Metabase SQL-Editor**: GF und Buchhaltung können eigene Ad-hoc-Queries erstellen
- **No-Code Query Builder**: Drag & Drop Interface für nicht-SQL-User
- **Dashboard-Sharing**: Dashboards können mit Team geteilt werden (URL-basiert)
- **Scheduled Reports**: Automatischer E-Mail-Versand (täglich/wöchentlich/monatlich)

---

## 🎯 Strategischer Nutzen & Zielbild

### ROI-Kalkulation für AI/Automation-Features

**Quantifizierter Business Value:**

**Zeitersparnis pro Woche** (bei 15 Mitarbeitern)[^roi]:

- **Außendienst** (5 Mitarbeiter): 2h/Person = 10h/Woche
  - Transkription: 1h, AI-Recherche: 0,5h, Pipeline-Viz: 0,5h
- **Innendienst** (3 Mitarbeiter): 5h/Person = 15h/Woche
  - n8n-Automation: 3h, AI-Quote-Assist: 2h
- **Buchhaltung** (2 Mitarbeiter): 3h/Person = 6h/Woche
  - Automated Reminders: 2h, Dashboard statt Excel: 1h
- **Planung** (3 Mitarbeiter): 1,5h/Person = 4,5h/Woche
  - RAG-Wissenssuche: 1h, Timeline-Forecasts: 0,5h
- **GF** (2 Personen): 2h/Person = 4h/Woche
  - Auto-Reports: 1h, RAG-Q&A statt manuelle Analysen: 1h

**Gesamt: 39,5h/Woche = €1.580/Woche = €82K/Jahr** (bei Ø €40/h Stundensatz)

**ROI-Berechnung:**

- **Entwicklungskosten**: €180K (RAG + n8n + ML-Modelle + BI-Dashboards)
- **Betriebs Kosten**: €24K/Jahr (Cloud-Hosting für Vector DB, LLM-APIs optional)
- **Zeitersparnis-Wert**: €82K/Jahr
- **ROI**: 45% nach Jahr 1, 145% nach Jahr 2 (Break-Even nach 26 Monaten)

[^roi]: Quelle: Conservative Estimates basierend auf Research "n8n Automation" & "RAG Architecture" Time Savings

**Qualitative Benefits:**

- **Bessere Entscheidungen**: GF hat datenbasierte Forecasts statt Bauchgefühl
- **Risiko-Reduktion**: Frühwarnsysteme verhindern Liquiditätsengpässe, Projektüberschreitungen
- **Wettbewerbsvorteil**: Schnellere Angebotsstellung, proaktive Kundenbetreuung
- **Mitarbeiter-Zufriedenheit**: Weniger Frustration durch repetitive Tasks

**Strategisches Zielbild 2026:**

**KOMPASS als "Unternehmens-Intelligence-Layer":**

- **Nicht nur CRM/PM-Tool**, sondern **zentrale Intelligenz-Plattform**
- **Alle Entscheidungen datenbasiert**: Forecasts, Alerts, Recommendations durchdringen alle Prozesse
- **Autonome Prozesse**: 60% aller Routine-Workflows laufen automatisiert (ohne manuellen Trigger)
- **Continuous Learning**: ML-Modelle werden besser je mehr Daten gesammelt werden
- **Knowledge Accumulation**: RAG-System wird mächtiger mit jedem abgeschlossenen Projekt

**Marktpositionierung:**

- **Target**: KMU (10-50 Mitarbeiter) mit projektbasiertem Geschäft (Dienstleistung + Produkt)
- **USP**: "On-Premise AI-CRM mit deutscher DSGVO-Garantie" (vs. US-Cloud-Anbieter)
- **Preismodell**: Self-Hosted → Keine monatlichen SaaS-Kosten (Einmalentwicklung + Wartung)

---

## 🔐 Security & Compliance (Erweitert)

### DSGVO-First Architecture

**Datenschutz-Architektur-Prinzipien**[^dsgvo-arch]:

**1. Data Minimization:**

- Nur notwendige Daten an LLMs gesendet
- Pseudonymisierung bei Cloud-LLM-Nutzung (Namen → IDs)

**2. On-Premise-First:**

- **Default**: Alle KI-Modelle lokal (Llama 3 70B, Whisper Large)
- **Optional**: Cloud-LLMs (GPT-4) nur mit explizitem Consent & Anonymisierung

**3. Access Control:**

- **RAG respektiert RBAC**: User sehen nur Dokumente gemäß Rollen-Berechtigungen
- **Field-Level Encryption**: Margen, Gehälter verschlüsselt at-rest

**4. Audit Trails:**

- **Alle KI-Interaktionen geloggt**: Wer hat was gefragt? Welche Daten wurden verwendet?
- **Löschbarkeit**: RTBF (Right To Be Forgotten) – User-Daten aus Vector DB löschbar

**5. Consent Management:**

- **Opt-In für AI-Features**: User können KI-Assistenz deaktivieren
- **Granulare Kontrolle**: Consent pro Feature (Transkription, Forecasting, RAG-Suche)

[^dsgvo-arch]: Quelle: Research "DSGVO Compliance for LLMs" – Architecture Patterns

**GoBD-Konformität für AI-Generierungen:**

- **AI-generierte Dokumente** (Reports, Summaries) werden als "System-Generated" markiert
- **Immutability**: Nach Finalisierung unveränderbar (Hash-basiert)
- **Traceability**: Jede KI-Generierung referenziert Eingabedaten + Modell-Version
- **Human-Review**: Kritische AI-Outputs (Rechnungen, Verträge) erfordern manuelle Freigabe

---

## 🚀 Implementierungs-Roadmap (2025-2026)

### Phasenplan für AI/Automation/BI-Features

**Q2 2025: Foundation (RAG + n8n Basics)**

- [ ] Vector Database Setup (Weaviate Self-Hosted)
- [ ] LlamaIndex Integration (Document Ingestion Pipeline)
- [ ] n8n Installation & Basic Workflows (Follow-Ups, Reminders)
- [ ] On-Premise LLM Setup (Llama 3 70B)
- [ ] RAG-Prototype: Q&A über Projekt-Dokumentation

**Q3 2025: Core Intelligence (Forecasting + Dashboards)**

- [ ] ML-Modelle trainieren (Opportunity Scoring, Payment Prediction, Timeline Forecasts)
- [ ] Grafana Dashboards (Team-Auslastung, Projekt-Status, Financial KPIs)
- [ ] n8n Advanced Workflows (Project Kickoff, Supplier Tracking, Risk Alerts)
- [ ] RAG Expansion: Semantische Suche über alle Entities

**Q4 2025: Advanced Features (Neo4j + BI Self-Service)**

- [ ] Neo4j Integration (Knowledge Graph für Relationships)
- [ ] Hybrid Search (Graph + Vector)
- [ ] Metabase Integration (Self-Service BI für GF)
- [ ] CQRS Pattern (CouchDB → PostgreSQL für Analytics)
- [ ] Automated Report Generation (Weekly Summaries via LLM)

**Q1 2026: Optimization & Scaling (Continuous Improvement)**

- [ ] Model Retraining Pipeline (Automated via n8n)
- [ ] A/B-Testing für AI-Features (Welche Workflows performen besser?)
- [ ] Advanced Forecasting (Monte Carlo, Sensitivity Analysis)
- [ ] Mobile-Optimierung (RAG-Q&A auf Smartphone-App)
- [ ] User Onboarding (Interne Schulungen + Video-Tutorials)

**Success Metrics:**

- **AI Adoption**: >70% aktive User nutzen mindestens 1 AI-Feature monatlich
- **Time Savings**: 39,5h/Woche (gemessen via Time-Tracking-Surveys)
- **Forecast Accuracy**: >90% Genauigkeit bei Quartals-Umsatz-Prognosen
- **User Satisfaction**: NPS >40 für AI/Automation-Features

---

Persona-Profil\_ Geschäftsführer (CEO) im Projektgeschäft.pdf

## file://file-6u9mbbeUE2U8xbjEUwdjcN

### Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf

## file://file-FbKUtfPLzdQxRsRczADzbb
