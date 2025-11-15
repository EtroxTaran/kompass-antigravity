# KOMPASS Technology Roadmap (2025-2026)

**Document Version:** 2.0  
**Last Updated:** 2025-01-27  
**Status:** ✅ Fully Specified (Including 2025 AI & Automation Extensions)

**Cross-References:**

- `docs/architecture/system-architecture.md` – Complete Technical Architecture Specification
- `docs/architecture/ai-extensions/AI_Automation_Extensions_Implementation_Guide.md` – ✨ NEW: AI/RAG/n8n Implementation Guide
- `docs/product-vision/Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` – Product Vision (incl. Pillar 4: 2025 Intelligence)
- `docs/product-vision/Produktvision KI & Automation-Features.md` – ✨ NEW: AI & Automation Vision
- `docs/product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md` – Phase 2/3 Strategic Outlook

---

## Executive Summary

This roadmap consolidates all technical initiatives for KOMPASS, providing a unified view of the evolution from MVP (Phase 1) to a fully intelligent, collaborative, and data-driven CRM/PM platform.

**✨ 2025 Extensions (Pillar 4):** This version 2.0 integrates the **AI & Automation Extensions** featuring RAG-based knowledge management, n8n intelligent automation, predictive forecasting, and BI dashboards. These extensions transform KOMPASS from an "Intelligent Co-Pilot" to an "Autonomous Business Partner."

All initiatives are **fully specified** with architecture designs, implementation guides, and KPIs.

---

## Phase 1: MVP (Weeks 1-16, Q1-Q2 2025)

**Status:** 🟢 **In Progress** (Lieferplan: 16 Wochen, €230K Budget, 6.75 FTE)

### Core Features

- CRM-Kern: Customer, Contact, Opportunity, Protocol Management
- Offline-First PWA: PouchDB/CouchDB Sync, iOS 50MB Quota Management
- RBAC: 5 Rollen (ADM/INNEN/PLAN/BUCH/GF), Entity + Field-Level Permissions
- Data Import/Export: CSV, Excel, Lexware-kompatibel
- Search: MeiliSearch für Performance
- Authentication: Keycloak SSO

### Technical Foundation

- **Backend:** NestJS, CouchDB, TypeScript
- **Frontend:** React, Vite, PWA, shadcn/ui
- **Shared:** pnpm Monorepo, shared types/validation
- **Tests:** 70/20/10 Pyramid (Unit/Integration/E2E), 80%+ Coverage

**Deferred to Phase 2:**

- AI Features (Whisper Transcription, Lead Scoring)
- Real-Time Collaboration (WebSockets, Activity Feed)
- Customer Portal
- Advanced Analytics/BI

---

## Phase 1.5: Observability Stack (Parallel to MVP, Q2 2025)

**Status:** ⚠️ **Parallel zum MVP** – Production-Ready Launch erfordert Monitoring

### Why Phase 1.5?

MVP ohne Observability = Blindflug im Produktiv-Betrieb. Daher parallel implementiert, sodass Launch-Day bereits vollständiges Monitoring steht.

### Implementation

**Grafana Stack:**

- **Metrics:** Prometheus (API Response Times, Error Rates, CouchDB Performance)
- **Logs:** Grafana Loki (Structured Logging, Query: "Zeige alle 5xx Errors Q2 2025")
- **Traces:** Grafana Tempo (Distributed Tracing für Offline-Sync, API Calls)
- **Dashboards:** Grafana (Real-Time KPIs für Dev/GF)

**OpenTelemetry Instrumentation:**

- NestJS: Auto-Instrumentation für Express, CouchDB, Redis
- React: RUM (Real User Monitoring), Performance Metrics
- PouchDB/CouchDB Sync: Custom Spans für Conflict Resolution

**SLI/SLO Definition:**

- API Response Time: P50 ≤400ms, P95 ≤1.5s, P99 ≤2.5s
- Error Rate: <1%
- Availability: >95%
- Dashboard Load: <3s

**Alerting:**

- Critical: "API P95 >2s for 5 Min" → PagerDuty/Slack
- Warning: "CouchDB Replication Lag >30s" → Slack

**Timeline:** 2 Wochen (1 FTE DevOps)

**Siehe:**

- Architecture Doc → "Observability & Monitoring (Production-Ready Operations)"
- ADR-015: Observability-Stack (Prometheus+Grafana+Loki+Tempo vs. ELK vs. Datadog)
- `docs/reviews/OBSERVABILITY_STRATEGY.md`

---

## ✨ Phase 2.1: AI Extensions – RAG Foundation (Q2 2025, 8 Wochen)

**Status:** ⚠️ **Fully Specified (2025 Extension), Ready for Implementation**

**Strategic Context:** This phase lays the foundation for intelligent knowledge management and automation, transforming KOMPASS from a data repository into an intelligent co-pilot that proactively surfaces insights and automates routine tasks.

**Cross-References:**

- `docs/architecture/ai-extensions/AI_Automation_Extensions_Implementation_Guide.md` – Complete Implementation Guide
- `docs/product-vision/Produktvision KI & Automation-Features.md` – AI & Automation Vision
- Architecture Doc → "Erweiterte Architektur 2025: AI, Automation & Intelligence Layer"

---

### 🔍 RAG System Foundation (4 Wochen, 2 FTE)

#### Weaviate Vector Database Setup

- **Tech Stack:** Weaviate 1.24+, Docker Compose, Multilingual-E5-Large (Embeddings)
- **Schema Design:**
  - Collections: `Customer`, `Project`, `Protocol`, `Opportunity`, `Document`
  - Cross-References: Customer ← hasProjects → Projects ← hasProtocols → Protocols
- **Embedding Strategy:** Multilingual-E5-Large (1024 dimensions), German language optimized
- **Batch Ingestion:** Initial import all historical data (customers, projects, protocols)
- **Expected Impact:** <2s (P95) für semantische Suche über alle Dokumente

#### LlamaIndex Integration

- **Tech Stack:** LlamaIndex 0.10+, Python FastAPI Service, Weaviate Backend
- **Query Patterns:**
  - Semantic Search: "Alle Hofladen-Projekte mit regionalem Sortiment"
  - Conversational Q&A: "Was waren die größten Herausforderungen bei Projekt X?"
  - Contextual Recommendations: "Ähnliche Projekte wie P-2024-B015"
- **Retrieval Strategy:** Hybrid Search (Vector + BM25), Top-5 Results + Re-Ranking
- **Expected Impact:** >85% Relevanz Score (User-Feedback "War hilfreich?")

#### Document Ingestion Pipeline

- **Tech Stack:** n8n Workflow, Python Embedding Service, Weaviate API
- **Flow:** CouchDB Change-Feed → n8n Trigger → Text Extraction → Embedding → Weaviate Upsert
- **Supported Formats:** Text (Protokolle), Structured Data (Opportunities), Metadata (Projects)
- **Real-Time Sync:** <30s Latenz von CouchDB-Update bis Weaviate-Index
- **Expected Impact:** Automatische Indexierung ohne manuelles Tagging

**Timeline:** 4 Wochen (1 Backend Dev + 1 ML Engineer)

---

### 🤖 n8n Basic Automation (2 Wochen, 1 FTE)

#### Automated Follow-Up Sequences

- **Tech Stack:** n8n Self-Hosted, CouchDB Trigger Nodes, SendGrid Integration
- **Workflows:**
  - "Opportunity Follow-Up": Tag 3, 7, 14 nach letztem Kontakt → Auto-E-Mail
  - "Invoice Reminder": 7 Tage vor Fälligkeit → E-Mail an Buchhaltung
  - "Project Kickoff": Neues Projekt → Checklist an Planer + Innendienst
- **Expected Impact:** -6h/Woche manuelle Follow-Ups

#### Basic CRM Automation

- **Workflows:**
  - "New Lead Assignment": Lead kommt rein → Auto-Assignment nach Postleitzahl
  - "Status Change Notifications": Opportunity Status → "Proposal" → Slack-Benachrichtigung an GF
  - "Weekly Report Generation": Jeden Montag 8 Uhr → Umsatz-Summary als E-Mail
- **Expected Impact:** -8h/Woche manuelle Benachrichtigungen und Reports

**Timeline:** 2 Wochen (1 Backend Dev)

---

### 🔒 On-Premise LLM Hosting (2 Wochen, 1 DevOps)

#### Llama 3 70B Setup

- **Tech Stack:** vLLM (Inference Server), Llama 3 70B Instruct, Docker Compose
- **Hardware Requirements:** 2x NVIDIA A100 80GB oder 4x RTX 4090 (Rented/Cloud)
- **Deployment:** Docker Compose auf dediziertem GPU-Server
- **DSGVO Compliance:** 100% on-premise, keine Kundendaten verlassen Server
- **Expected Performance:** <3s Response Time (P95) für Q&A-Queries

#### Fallback to GPT-4 (Optional)

- **Use Case:** Komplexe Reasoning-Tasks, die Llama 3 nicht gut löst
- **DSGVO:** Nur anonymisierte/pseudonymisierte Daten an OpenAI
- **Cost Control:** Rate Limiting (10 Queries/User/Tag)

**Timeline:** 2 Wochen (1 DevOps)

---

### **Phase 2.1 Total:** 8 Wochen, 4 FTE, Budget: ~€80K

**Deliverables:**

- ✅ Weaviate Vector DB deployed mit initialem Datenbestand
- ✅ LlamaIndex Q&A-Service funktional (Semantic Search + Conversational Q&A)
- ✅ n8n deployed mit 10+ Basic Automation Workflows
- ✅ Llama 3 70B on-premise deployed + DSGVO-konform
- ✅ Documentation für Admins + End-User-Guides

---

## Phase 2.2: Core Intelligence & Advanced Automation (Q3 2025, 8-10 Wochen)

**Status:** ⚠️ **Fully Specified (Merged from old 2.1 + new features), Ready for Implementation**

**Strategic Context:** This phase builds on the RAG foundation to deliver predictive intelligence, real-time dashboards, and advanced automation workflows, providing proactive insights and reducing manual workload.

---

### 🤖 AI-Powered Features (4 Wochen, 2 FTE)

#### Audio Transcription & Summarization

- **Tech Stack:** BullMQ (Job Queue), n8n (Workflow Orchestration), OpenAI Whisper (Transcription), Llama 3/GPT-4 (Summarization), MinIO (Object Storage), Socket.IO (Real-Time Progress)
- **Flow:** Audio Upload → BullMQ Job → n8n Workflow → Whisper API → LLM Summary → Socket.IO Update → CouchDB Protocol Doc
- **DSGVO:** Opt-In Consent, Optional lokales Whisper (keine Cloud-Daten), Auto-Delete nach 30 Tagen
- **Expected Impact:** -18 Min/Besuch für Außendienst = 6h/Woche = ~3 Arbeitstage/Monat

#### Predictive Lead Scoring

- **Tech Stack:** Python ML Service (Random Forest/XGBoost), FastAPI, PostgreSQL (Feature Store), SHAP (Explainability)
- **Training Data:** Historical Opportunities (Win/Loss), Firmographics, Interaction History
- **Deployment:** Docker Container, n8n Integration, Daily Re-Training
- **Expected Impact:** +15-20% höhere Conversion Rate, -30% Zeit für Dead-End-Leads

#### Intelligent Task Generation

- **Tech Stack:** Llama 3 70B (On-Premise), n8n Parser-Workflow
- **Flow:** Meeting Transkript → LLM "Extract Tasks" → Structured JSON (Task, Assignee, Due-Date, Priority) → User Review → Auto-Insert in CouchDB
- **Expected Impact:** -13-28 Min/Meeting Protokoll-Nacharbeit

**Timeline:** 4 Wochen (2 FTE: 1 Backend Dev + 1 ML Engineer)

**Siehe:**

- Architecture Doc → "KI-Integrationsarchitektur (Phase 2+)"
- ADR-018: AI Integration Architecture (Message-Queue-Based Pattern)

---

### 📊 ML Forecasting & Predictive Analytics (3 Wochen, 2 FTE)

#### Opportunity Scoring & Sales Forecasting

- **Tech Stack:** Scikit-Learn (Random Forest, Logistic Regression), XGBoost, FastAPI, PostgreSQL (Training Data)
- **Models:**
  - **Win Probability:** 75-90% Accuracy (based on deal size, customer interactions, stage duration)
  - **Sales Forecast:** Rolling 3/6/12-month revenue predictions with confidence intervals
  - **Deal Close Date:** ±7 days accuracy for >€50K opportunities
- **Features:** Deal Age, Customer Engagement Score, Budget vs. Average Deal Size, Historical Win Rate by Industry
- **Expected Impact:** >90% Quartals-Umsatz-Prognose Accuracy, +12% Conversion via better Opportunity Prioritization

#### Cash Flow & Payment Prediction

- **Tech Stack:** LightGBM, Time-Series Analysis (ARIMA for trend), PostgreSQL (Historical Invoices)
- **Models:**
  - **Payment Probability:** 80-85% Accuracy (predicts if customer will pay on time)
  - **Cash Flow Forecast:** Rolling 6-month liquidity prediction (€±10% Genauigkeit)
  - **Zahlungsverzug-Risk:** Early Warning 14 days before expected delay
- **Expected Impact:** -€50K Liquiditäts-Puffer (bessere Planung), -40% Mahnwesen-Aufwand

#### Project Timeline & Resource Forecasting

- **Tech Stack:** XGBoost (Regression), Critical Path Analysis, Neo4j (Dependency Graph)
- **Models:**
  - **Completion Date:** ±5 days accuracy for projects <6 months
  - **Resource Bottlenecks:** Predicts "Planer X wird in KW 25 zu 140% ausgelastet"
  - **Budget Overrun Risk:** 70% Precision für "Projekt wird Budget um >10% überziehen"
- **Expected Impact:** -8% Project Delays, +15% Resource Utilization (optimal allocation)

**Timeline:** 3 Wochen (1 ML Engineer + 1 Backend Dev)

---

### 📈 Grafana Real-Time Dashboards (2 Wochen, 1.5 FTE)

#### Executive Dashboard (GF)

- **Widgets:**
  - Revenue Forecast (Rolling 6 Months, Confidence Intervals)
  - Cash Flow Timeline (€-Beträge + Payment Risk Heatmap)
  - Opportunity Pipeline (Funnel mit Win-Probability-Layering)
  - Team Utilization (Planer, Innendienst Real-Time Capacity)
  - Top 10 Deals (sortiert nach Expected Value × Win-Probability)
- **Real-Time Updates:** Socket.IO pushes via WebSocket, <3s Latenz
- **Export:** PDF/Excel Export für Board-Meetings

#### Team Workload Dashboard (Innendienst, Planer)

- **Widgets:**
  - Personal Task List (Priority-sorted, Due-Today highlighted)
  - Team Capacity Overview (Who's overbooked? Who has capacity?)
  - Project Status Grid (All active projects, RAG-status colored)
  - Upcoming Deadlines (Next 14 days, sorted by criticality)
- **Alerts:** Browser-Push wenn "Deine Auslastung >120% nächste Woche"

#### Financial KPI Dashboard (Buchhaltung)

- **Widgets:**
  - Outstanding Invoices (€-Betrag + Aging Report)
  - Payment Prediction (Which invoices will be late?)
  - Cash Flow Forecast (Next 6 months, Monte Carlo simulation)
  - GoBD Compliance Status (All invoices properly logged?)
- **Automation:** Auto-generated Mahnung-Liste jeden Montag

**Tech Stack:** Grafana 10+, Prometheus (Metrics), PostgreSQL (CQRS Read Store), Socket.IO (Real-Time)

**Timeline:** 2 Wochen (1 Frontend Dev + 0.5 Backend Dev)

---

### 🤖 n8n Advanced Workflows (2 Wochen, 1 FTE)

#### LLM-Integrated Workflows

- **"Supplier Performance Tracker":** n8n sammelt Lieferzeiten, Preise, Qualität → wöchentlicher Report mit LLM-Summary
- **"Proactive Risk Alerts":** n8n überwacht Budget, Timeline, Resource-Auslastung → bei Risiko >70% → Slack-Alert + LLM-Vorschlag zur Mitigation
- **"Weekly GF Report":** n8n sammelt KPIs, Opportunities, Projekt-Status → LLM generiert Executive Summary → Auto-E-Mail jeden Montag 8 Uhr

#### Advanced CRM Automation

- **"Opportunity Stage Progression":** Automatisches Stage-Update basierend auf Aktivität (z.B. Angebot versendet → Auto-Update zu "Proposal")
- **"Customer Health Score":** n8n berechnet monatlich Customer Engagement Score → bei Rückgang >20% → Alert an Außendienst
- **"Project Milestone Tracking":** Automatische Checklisten bei Projekt-Phasen-Wechsel (z.B. "Planning" → "Execution" → Kickoff-Checklist an Team)

**Timeline:** 2 Wochen (1 Backend Dev)

---

### 🔔 Real-Time Collaboration (1 Woche, 1 FTE)

#### Socket.IO WebSocket Gateway

- **Tech Stack:** Socket.IO (WebSocket), Redis Adapter (Horizontal Scaling), NestJS @nestjs/websockets
- **Features:**
  - Activity Feed (Real-Time Events: Task Assigned, Status Changed, Document Approved)
  - Smart Notifications (@-Mentions, Priority Alerts)
  - Presence Indicators ("Max bearbeitet gerade Angebot A-2024-015")
  - Live Dashboard Updates (Grafana Widgets update ohne Page Reload)
  - Offline Message Queuing (Messages während Offline gespeichert → Replay bei Reconnect)

#### Contextual Commenting

- **Tech Stack:** CouchDB Documents mit Comments-Array, Socket.IO für Live-Updates
- **Features:**
  - Comments direkt an Entities (Offer-Position, Task, Milestone)
  - Threaded Discussions
  - @-Mentions (mit Auto-Notification)
  - GoBD-konform: Alle Kommentare im Audit Trail

**Timeline:** 3 Wochen (1 Backend Dev + 0.5 Frontend Dev)

**Siehe:**

- Architecture Doc → "Real-Time-Kommunikationsarchitektur (Phase 2+)"
- ADR-016: Real-Time-Kommunikationslayer (Socket.IO + Redis Adapter)

**Timeline:** 1 Woche (1 Frontend Dev)

---

### **Phase 2.2 Total:** 8-10 Wochen, 5-6 FTE, Budget: ~€120-140K

**Deliverables:**

- ✅ ML Forecasting Models deployed (Opportunity, Payment, Timeline Prediction)
- ✅ Grafana Dashboards funktional (Executive, Team, Financial KPIs)
- ✅ n8n Advanced Workflows mit LLM-Integration (30+ Workflows)
- ✅ Socket.IO Real-Time Collaboration (Activity Feed, Comments, Presence)
- ✅ Audio Transcription + Task Generation deployed
- ✅ BullMQ Job Queue für AI-Tasks

**Siehe:**

- Architecture Doc → "Erweiterte Architektur 2025: AI, Automation & Intelligence Layer"
- ADR-018: AI Integration Architecture (Message-Queue-Based Pattern)

---

## ✨ Phase 2.3: Intelligence Layer – Neo4j, BI & Model Retraining (Q4 2025, 8 Wochen)

**Status:** ⚠️ **Fully Specified (2025 Extension), Ready for Implementation**

**Strategic Context:** This phase completes the intelligence layer by adding a knowledge graph for relationship analysis, self-service BI tools, optimized analytics architecture (CQRS), and automated ML model retraining pipelines.

**Cross-References:**

- `docs/architecture/ai-extensions/AI_Automation_Extensions_Implementation_Guide.md` – Neo4j, BI Layer Implementation
- Architecture Doc → "Erweiterte Architektur 2025: Neo4j Knowledge Graph, BI & Analytics Layer"

---

### 🗂️ Neo4j Knowledge Graph (3 Wochen, 2 FTE)

#### Schema Design

- **Nodes:** `Customer`, `Project`, `Contact`, `Product`, `Supplier`, `Material`, `DesignPattern`
- **Relationships:**
  - `CUSTOMER -[:PURCHASED]-> PROJECT`
  - `PROJECT -[:USES]-> MATERIAL`
  - `MATERIAL -[:SUPPLIED_BY]-> SUPPLIER`
  - `PROJECT -[:FOLLOWS_PATTERN]-> DESIGN_PATTERN`
  - `PROJECT -[:SIMILAR_TO]-> PROJECT` (Cosine Similarity >0.8)

#### Graph Queries & Use Cases

- **"Find Similar Projects":** Cypher query returns projects with similar materials, design patterns, and customer profiles
- **"Supplier Network Analysis":** Which suppliers are critical bottlenecks? (High betweenness centrality)
- **"Design Pattern Extraction":** Automatically cluster projects with similar CAD-descriptions → extract reusable patterns
- **"Customer Relationship Mapping":** Which customers share suppliers, materials, or design preferences?

#### Sync Strategy

- **Initial Load:** Batch import from CouchDB (all historical projects, customers, materials)
- **Real-Time Sync:** n8n workflow listens to CouchDB changes → updates Neo4j via Cypher API
- **Latency:** <60s from CouchDB-Update bis Neo4j-Sync

**Tech Stack:** Neo4j 5+, Python Neo4j Driver, n8n (Sync Workflows), Cypher Query Language

**Timeline:** 3 Wochen (1 Backend Dev + 1 Data Engineer)

---

### 📊 Metabase Self-Service BI (2 Wochen, 1 FTE)

#### Features

- **No-Code Query Builder:** "Zeige mir alle Projekte aus Q1 2025 mit Budget >€100K"
- **Custom Dashboards:** Drag & Drop Widgets (Bar Chart, Line Chart, Table, KPI Cards)
- **Scheduled Reports:** Auto-E-Mail Reports (täglich/wöchentlich/monatlich)
- **SQL Editor:** Power-User können eigene SQL-Queries schreiben
- **RBAC Integration:** Nutzer sehen nur Daten, für die sie RBAC-Permissions haben

**Tech Stack:** Metabase 0.50+, PostgreSQL (CQRS Read Store), Docker Compose

**Expected Impact:** 60% Self-Service-Rate (GF und Teamleiter bauen eigene Reports ohne Dev-Involvement)

**Timeline:** 2 Wochen (1 Backend Dev)

---

### 📊 CQRS Analytics Layer Optimization (2 Wochen, 1 FTE)

#### PostgreSQL Star-Schema

- **Fact Tables:**
  - `fact_sales` (Opportunity, Invoice, Revenue per Month)
  - `fact_projects` (Project, Budget, Timeline, Resource Allocation)
  - `fact_interactions` (Protocol, Contact, Activity per Customer)
- **Dimension Tables:**
  - `dim_customer`, `dim_time`, `dim_product`, `dim_user`, `dim_location`
- **Materialized Views:** Pre-aggregated KPIs (aktualisiert alle 5 Min via Trigger)

#### Replication Flow Optimization

- **CouchDB → PostgreSQL:** Change-Feed → NestJS Worker → Batch Insert (100 docs/batch)
- **Latency:** <30s von CouchDB-Update bis PostgreSQL-Sync
- **Monitoring:** Grafana Dashboard zeigt Replication Lag, Error Rate

**Tech Stack:** PostgreSQL 15+, NestJS Replication Service, TypeORM, Change Data Capture (CDC)

**Timeline:** 2 Wochen (1 Backend Dev)

**Siehe:**

- Architecture Doc → "Erweiterte Datenbankarchitektur & Skalierung (CQRS Pattern)"
- ADR-017: CQRS für Analytics (CouchDB + PostgreSQL vs. Single DB)

---

### 🤖 ML Model Retraining & Production Pipeline (1 Woche, 1 ML Engineer)

#### Automated Training Pipeline

- **n8n Scheduler:** Trigger monatliches Model-Retraining (oder bei Drift >5%)
- **Training Flow:** n8n → Python FastAPI → Fetch Training Data from PostgreSQL → Train Model → Validate → Deploy via Docker
- **Model Versioning:** Git-versioned Models (MLflow für Experiment-Tracking)
- **A/B-Testing:** New Model vs. Old Model (50/50 Split) → Monitor Accuracy for 2 Wochen → Rollout Winner

#### Drift Detection

- **Kolmogorov-Smirnov Test:** Erkennt wenn Feature-Distribution sich signifikant ändert
- **Performance Monitoring:** Accuracy drop >5% → Auto-Trigger Retraining
- **Alerts:** Slack-Benachrichtigung bei Model-Drift

**Tech Stack:** n8n (Orchestration), FastAPI (ML Service), MLflow (Experiment Tracking), Prometheus (Monitoring)

**Timeline:** 1 Woche (1 ML Engineer)

---

### **Phase 2.3 Total:** 8 Wochen, 5 FTE, Budget: ~€100K

**Deliverables:**

- ✅ Neo4j Knowledge Graph deployed mit Initial Load (all historical data)
- ✅ Metabase Self-Service BI funktional
- ✅ PostgreSQL Star-Schema optimized, CQRS Replication <30s Latenz
- ✅ ML Model Retraining Pipeline automated (monatlich oder bei Drift)
- ✅ Documentation für Admins + Power-User-Guides

**Siehe:**

- Architecture Doc → "Erweiterte Architektur 2025: Neo4j Knowledge Graph, BI Layer, CQRS Analytics"
- `docs/architecture/ai-extensions/AI_Automation_Extensions_Implementation_Guide.md` – Implementation Details

---

## Phase 3: Optimization & Scaling (Q1-Q2 2026, 10-12 Wochen)

**Status:** ⚠️ **Conceptually Defined, Detailed Spec after Phase 2.3 Complete**

**Strategic Context:** This phase focuses on optimization, advanced AI experimentation, and scaling features. Most core predictive analytics and intelligence features are now implemented in Phases 2.2-2.3, so Phase 3 focuses on refining, optimizing, and adding advanced experimental features.

---

### 📊 Advanced Forecasting & Monte Carlo Simulation (4 Wochen, 2 FTE)

#### Monte Carlo Revenue Forecasting

- **Tech Stack:** Python (NumPy/SciPy), Monte Carlo Simulation, FastAPI
- **Features:**
  - Probabilistic Revenue Forecasts: "90% Wahrscheinlichkeit Umsatz Q2 zwischen €280K-€420K"
  - Scenario Analysis: Best-Case, Worst-Case, Most-Likely-Case mit Confidence Intervals
  - Sensitivity Analysis: "Wenn Conversion Rate +5%, dann Umsatz +€45K"
- **Expected Impact:** <5% Abweichung Prognose vs. Ist-Umsatz (verbessert von >90% Accuracy in Phase 2.2)

#### Enhanced Project Risk Assessment

- **Evolution from Phase 2.2:** Verbesserte ML-Modelle mit mehr Features (Sentiment Analysis aus Kommentaren, Kommunikations-Frequenz)
- **New Feature:** Automated Risk Mitigation Suggestions ("Projekt X Risiko 85% → Empfehlung: 1 zusätzlicher Planer für 2 Wochen")
- **Expected Impact:** >80% korrekte Vorhersagen (up from >70% in Phase 2.2)

**Timeline:** 4 Wochen (1 ML Engineer + 1 Backend Dev)

---

### 🔬 A/B-Testing Framework & Experimentation (2 Wochen, 1.5 FTE)

#### Features

- **A/B-Testing Infrastructure:** Test different UI-Varianten, ML-Model-Versionen, Automation-Workflows
- **Metrics Tracking:** Conversion Rate, User Engagement, Time-on-Task, Feature Adoption
- **Statistical Significance:** Automated Winner-Detection (z-Test, Chi-Square, Bayesian A/B)
- **Use Cases:**
  - Test "Opportunity Win-Probability Widget" vs. "Classic Pipeline View" → Which drives more conversions?
  - Test "Llama 3 70B" vs. "GPT-4" for Task Generation → Which is faster/more accurate?

**Tech Stack:** LaunchDarkly / Unleash (Feature Flags), Mixpanel / Amplitude (Event Tracking), Python (Statistical Analysis)

**Expected Impact:** +8% Conversion-Uplift via Continuous Experimentation

**Timeline:** 2 Wochen (0.5 Backend Dev + 1 Frontend Dev)

---

### 🔄 Collaborative Editing (CRDTs) (6 Wochen, 3 FTE)

#### Real-Time Collaborative Editing

- **Tech Stack:** CRDTs (Yjs oder Automerge), Socket.IO für Sync, CouchDB Integration
- **Features:**
  - Google Docs-style Live-Editing von Angeboten/Projekten
  - Mehrere Nutzer editieren gleichzeitig Budget/Zeitplan → Automatic Merge (Conflict-Free)
  - Offline-First: CRDTs funktionieren auch ohne Internet → Sync bei Reconnect
  - Conflict Resolution: -70% CouchDB-Konflikte (von 10/Woche → 3/Woche via CRDTs)

**Herausforderung:** CRDTs + CouchDB Integration komplex → 6 Wochen R&D + Proof-of-Concept

**Expected Impact:** -50% Merge-Konflikte, +30% Collaboration-Effizienz

**Timeline:** 6 Wochen (2 Backend Devs + 1 Frontend Dev)

---

### 🤖 Multi-Agent Orchestration (Experimental) (2 Wochen, 1.5 FTE)

#### Autonomous Agent Workflows

- **Tech Stack:** LangGraph (Multi-Agent Framework), Llama 3 70B, n8n (Agent Orchestration)
- **Use Cases:**
  - **"Opportunity Research Agent":** Automatically researches customer (LinkedIn, Company Website, News) → generates Customer Profile
  - **"Supplier Negotiation Agent":** Drafts negotiation emails based on historical pricing data
  - **"Project Health Check Agent":** Weekly autonomous analysis of all active projects → flags risks proactively
- **Human-in-the-Loop:** All agent actions require approval before execution (no fully autonomous changes)

**Status:** Experimental - Pilot mit 3 Power-Users

**Timeline:** 2 Wochen (1 ML Engineer + 0.5 Backend Dev)

---

### **Phase 3 Total:** 10-12 Wochen, 6-7 FTE, Budget: ~€140-160K

---

## Technology Stack Evolution

| Component               | Phase 1 (MVP)       | Phase 2.1 (AI Extensions)                                  | Phase 2.2 (Core Intelligence)                     | Phase 2.3 (Intelligence Layer)                         | Phase 3 (Optimization)                 |
| ----------------------- | ------------------- | ---------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------ | -------------------------------------- |
| **Backend**             | NestJS + CouchDB    | + BullMQ, n8n, Socket.IO, Redis                            | + ML Services (FastAPI), Grafana                  | + PostgreSQL (CQRS)                                    | + Multi-Agent Orchestration            |
| **Frontend**            | React PWA + PouchDB | + Socket.IO Client                                         | + Grafana Embedded                                | + Metabase Embedded, React-Grid-Layout                 | + Yjs/Automerge (CRDTs)                |
| **AI/ML**               | -                   | **✨ Llama 3 70B (On-Premise)**, Whisper, GPT-4 (Optional) | **✨ Random Forest, XGBoost (Forecasting)**       | -                                                      | Monte Carlo Simulation, Advanced ML    |
| **RAG/Vector**          | -                   | **✨ Weaviate, LlamaIndex, Multilingual E5**               | -                                                 | -                                                      | Hybrid Search, Multi-Modal Embeddings  |
| **Knowledge Graph**     | -                   | -                                                          | -                                                 | **✨ Neo4j**                                           | Advanced Graph Algorithms              |
| **Workflow Automation** | -                   | **✨ n8n (Self-Hosted), Basic Workflows**                  | **✨ n8n Advanced (LLM-Integration, Monitoring)** | **✨ n8n Production (Git-Versioning)**                 | Autonomous Agents                      |
| **BI & Analytics**      | -                   | -                                                          | **✨ Grafana (Real-Time Dashboards)**             | **✨ Metabase (Self-Service), PostgreSQL Star-Schema** | Advanced Analytics, Predictive Reports |
| **Observability**       | -                   | **Prometheus, Loki, Tempo, Grafana**                       | + ML Metrics (Model Performance)                  | + BI Query Performance                                 | + A/B-Test Metrics                     |
| **Storage**             | CouchDB             | + MinIO (Object Storage)                                   | -                                                 | + PostgreSQL (Read Store)                              | + Time-Series DB (InfluxDB)            |
| **Real-Time**           | -                   | Socket.IO + Redis Adapter                                  | -                                                 | -                                                      | + CRDT Sync                            |

---

## Budget Summary (Phases 1-3 + AI Extensions)

| Phase                                 | Timeline         | Duration         | FTE           | Budget (€)    | Focus                                                                |
| ------------------------------------- | ---------------- | ---------------- | ------------- | ------------- | -------------------------------------------------------------------- |
| **Phase 1 (MVP)**                     | Q1-Q2 2025       | 16 Wochen        | 6.75          | €230K         | CRM-Kern, Offline-First PWA, RBAC                                    |
| **Phase 1.5 (Observability)**         | Q2 2025          | 2 Wochen         | 1             | €8K           | Grafana Stack (Prometheus, Loki, Tempo)                              |
| **✨ Phase 2.1 (AI Extensions)**      | Q2 2025          | 8 Wochen         | 4             | €80K          | RAG Foundation (Weaviate, LlamaIndex), n8n Basic, Llama 3 70B        |
| **Phase 2.2 (Core Intelligence)**     | Q3 2025          | 8-10 Wochen      | 5-6           | €120-140K     | ML Forecasting, Grafana Dashboards, n8n Advanced, Real-Time          |
| **✨ Phase 2.3 (Intelligence Layer)** | Q4 2025          | 8 Wochen         | 5             | €100K         | Neo4j Knowledge Graph, Metabase BI, CQRS Analytics, Model Retraining |
| **Phase 3 (Optimization)**            | Q1-Q2 2026       | 10-12 Wochen     | 6-7           | €140-160K     | Monte Carlo Forecasting, A/B-Testing, CRDTs, Multi-Agent             |
| **TOTAL (Phases 1-3)**                | **52-58 Wochen** | **13-14 Monate** | **27-29 FTE** | **€678-738K** | Complete Vision                                                      |
| **AI Extensions Only (2.1-2.3)**      | Q2-Q4 2025       | **24 Wochen**    | **14 FTE**    | **€300K**     | RAG, Forecasting, n8n, Neo4j, BI                                     |

**Annahmen:**

- FTE-Rate: €10K/Woche (Blended Rate: Senior Dev + Junior Dev + DevOps)
- GPU-Rental für Llama 3 70B: €2-3K/Monat (inkludiert in AI Extensions Budget)
- Externe API-Kosten (OpenAI, Whisper): Operating Expense, ~€500-1000/Monat
- Weaviate Cloud vs. Self-Hosted: Self-Hosted (kostenlos), Cloud option €200-500/Monat

**ROI AI Extensions:**

- **Zeitersparnis:** 39,5h/Woche Team-wide (€82K/Jahr @ €40/h Blended Rate)
- **Break-Even:** 26 Monate (€300K Investment / €11,5K/Monat Savings)
- **Strategic Value:** Competitive AI features, Intelligent Decision Support, Proactive Automation

---

## Success Metrics (KPIs)

### MVP KPIs

- 360°-Sicht auf Kunden: ✅ Alle Daten in 1 Tool (CRM + PM + Rechnungen)
- Offline-Fähigkeit: ✅ iOS 50MB Quota Management, Sync-Konflikte <5%
- Nutzerakzeptanz: ✅ >80% User Adoption nach 3 Monaten
- Performance: ✅ API P95 <1.5s, Dashboard-Load <3s

### ✨ Phase 2.1 KPIs (AI Extensions)

- **RAG Adoption:** >70% aktive User nutzen Q&A-Feature monatlich
- **Query Response Time:** <2s (P95) für RAG-Queries
- **Relevanz Score:** >85% (gemessen via User-Feedback "War diese Antwort hilfreich?")
- **n8n Automation:** 30 aktive Workflows, >95% Success Rate
- **On-Premise LLM:** 100% Queries on-premise (kein Cloud-LLM für Kundendaten)

### Phase 2.2 KPIs (Core Intelligence)

- **Forecast Accuracy:** >90% bei Quartals-Umsatz-Prognosen, >85% bei Cash-Flow
- **ML Model Performance:** Opportunity Scoring AUC >0.85, Payment Prediction Accuracy >80%
- **Dashboard Load:** <2s (P95) für Grafana Real-Time-Dashboards
- **Proactive Alerts:** >75% Precision (keine False Positives), <10% False Negatives
- **Time Savings:** 39,5h/Woche Team-wide (gemessen via Time-Tracking-Surveys)
- **Audio Transcription:** 70% Adoption (Außendienst nutzt bei Besuchen)

### ✨ Phase 2.3 KPIs (Intelligence Layer)

- **Neo4j Graph Queries:** <500ms (P95) für komplexe Relationship-Queries
- **Metabase Self-Service:** >60% BI-Queries ohne Dev-Involvement
- **CQRS Analytics:** Dashboard-Load <1s (P95), PostgreSQL Query Performance <200ms
- **Model Retraining:** Automated Pipeline läuft monatlich, Drift Detection <5% Accuracy Loss
- **Pattern Library:** >50 automatisch extrahierte Design-Patterns

### Phase 3 KPIs (Optimization & Scaling)

- **Predictive Forecasting:** <5% Abweichung Prognose vs. Ist-Umsatz (Monte Carlo)
- **A/B-Testing:** >10 laufende Experimente, Conversion-Uplift >8%
- **Collaborative Editing:** -70% CouchDB-Konflikte (von 10/Woche → 3/Woche via CRDTs)
- **Multi-Agent Efficiency:** >80% autonome Task-Completion ohne Human-Intervention

---

## Risk Mitigation

### Technical Risks

**Risk 1: RAG Query Latency >3s**

- Mitigation: Weaviate Performance Tuning, Caching Layer, Hybrid Search Optimization
- Fallback: Synchronous Search (ohne RAG) parallel verfügbar als Fallback

**Risk 2: On-Premise LLM (Llama 3 70B) Performance <Erwartung**

- Mitigation: GPU-Load-Testing vor Deployment, vLLM Optimization, Quantization (INT8)
- Fallback: GPT-4 API als Fallback (mit DSGVO-konformer Anonymisierung)

**Risk 3: ML Model Accuracy <70%**

- Mitigation: Mehr Training-Daten sammeln (6+ Monate MVP-Daten), Feature Engineering, A/B-Testing
- Fallback: Manuelle Prognosen bleiben aktiv (ML nur Suggestion, kein Autopilot)

**Risk 4: Neo4j Sync Latency >60s**

- Mitigation: Optimierung des n8n-Sync-Workflows, Batch-Inserts, Incremental Sync
- Fallback: Scheduled Batch-Sync (stündlich) statt Real-Time

**Risk 5: CQRS Replication Lag >30s**

- Mitigation: PostgreSQL-Optimierung, Batch-Inserts, Monitoring via Grafana
- Fallback: MapReduce-Views parallel aktiv lassen für 2 Wochen

**Risk 6: CRDTs + CouchDB Integration komplex**

- Mitigation: 6 Wochen R&D, Proof-of-Concept vor Vollimplementierung (Phase 3)
- Fallback: Soft-Lock-Warning statt Collaborative Editing (Presence Indicators reichen)

---

## Dependencies & Prerequisites

### ✨ Phase 2.1 (AI Extensions) Prerequisites

- ✅ MVP deployed (CouchDB, PouchDB, RBAC funktioniert)
- ✅ Observability Stack aktiv (Monitoring für RAG/LLM erforderlich)
- ✅ GPU-Server verfügbar (On-Premise oder Cloud-Rental für Llama 3 70B)
- ✅ MinIO Object Storage deployed (für Dokumente/Audio-Files)
- ✅ n8n Deployment (für Workflow-Orchestrierung)

### Phase 2.2 (Core Intelligence) Prerequisites

- ✅ Phase 2.1 complete (RAG + n8n Basic + Llama 3 deployed)
- ✅ 3+ Monate Produktiv-Daten (für ML-Training)
- ✅ BullMQ + Redis Setup (für AI-Job-Queue)
- ✅ PostgreSQL Setup (für Feature Store)

### ✨ Phase 2.3 (Intelligence Layer) Prerequisites

- ✅ Phase 2.2 complete (ML-Models deployed, Grafana Dashboards funktional)
- ✅ 6+ Monate Produktiv-Daten (für Knowledge Graph + Advanced ML)
- ✅ PostgreSQL Read Store deployed (für CQRS)

### Phase 3 (Optimization) Prerequisites

- ✅ Phase 2.3 complete (Neo4j + Metabase + CQRS Analytics deployed)
- ✅ 9+ Monate Produktiv-Daten (für Advanced Forecasting)
- ✅ CRDT Library Evaluation (Yjs vs. Automerge Proof-of-Concept)

---

## Recommendation: Inkrementeller Rollout

**AI Extensions (Phases 2.1-2.3) nicht als "Big Bang", sondern iterative Releases:**

1. **Phase 2.1a (Woche 1-4):** RAG Foundation (Weaviate + LlamaIndex) → Semantic Search MVP
2. **Phase 2.1b (Woche 5-6):** n8n Basic Automation (10+ Workflows) → Auto-Follow-Ups
3. **Phase 2.1c (Woche 7-8):** Llama 3 70B On-Premise → Q&A-Feature Pilotgruppe (5 User)
4. **Phase 2.2a (Woche 9-12):** ML Forecasting (Opportunity, Payment, Timeline) → GF Dashboard
5. **Phase 2.2b (Woche 13-16):** Grafana Dashboards + n8n Advanced → Team Rollout
6. **Phase 2.3a (Woche 17-20):** Neo4j + Metabase → Self-Service BI für Power-User
7. **Phase 2.3b (Woche 21-24):** CQRS Optimization + Model Retraining → Full Team Rollout
8. **Phase 3 (Q1-Q2 2026):** Monte Carlo Forecasting, A/B-Testing, CRDTs, Multi-Agent

**Change Management:**

- **Woche 1:** Kick-Off Workshop (2h) → "Was ist RAG? Wie nutze ich Q&A?"
- **Woche 4:** Feedback-Session (1h) → "Was funktioniert? Was fehlt?"
- **Woche 8:** Power-User-Training (3h) → "Advanced n8n Workflows selbst bauen"
- **Woche 16:** Team-Review (2h) → "ML-Forecasts verstehen und nutzen"
- **Woche 24:** Executive Review (1h) → "ROI-Analyse, KPI-Review, Phase 3 Approval"

---

## Next Steps

### Q2 2025 (Phase 2.1 Kick-Off)

1. **Approve AI Extensions Roadmap:** Sign-Off von GF, Product Owner, Tech Lead, Finance
2. **Resourcen-Allokation:** 4 FTEs für Phase 2.1 (1 Backend Dev, 1 ML Engineer, 1 DevOps, 1 Data Engineer)
3. **Vendor Selection:**
   - GPU-Rental (On-Premise vs. Cloud: NVIDIA A100 vs. AWS p4d.24xlarge)
   - LLM Hosting (Llama 3 70B Self-Hosted vs. GPT-4 API Fallback)
   - Weaviate Cloud vs. Self-Hosted
4. **Technical Setup:**
   - GPU-Server Provisioning (2 Wochen Lead-Time)
   - Weaviate + LlamaIndex PoC (1 Woche)
   - n8n Deployment + Initial Workflows (1 Woche)
5. **Kick-Off Phase 2.1:** Detailed Sprint Planning (Linear Epics, 2-Wochen-Sprints)

---

**Prepared By:** Product & Engineering Team  
**Sign-Off Required:** GF, Product Owner, Tech Lead, Finance

**See Also:**

- `docs/architecture/system-architecture.md` – Complete Technical Architecture (incl. 2025 AI Extensions)
- `docs/architecture/ai-extensions/AI_Automation_Extensions_Implementation_Guide.md` – ✨ NEW: Step-by-Step Implementation Guide for RAG, n8n, Neo4j, ML, BI
- `docs/architecture/evolution/ARCHITECTURE_EVOLUTION_GUIDE.md` – Migration Path from MVP to Full Vision
- `docs/product-vision/Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` – North Star Product Vision (incl. Pillar 4: 2025 Intelligence)
- `docs/product-vision/Produktvision KI & Automation-Features.md` – ✨ NEW: AI & Automation Extensions Product Vision
- `docs/README.md` – Complete Documentation Index
