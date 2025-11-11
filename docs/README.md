# KOMPASS Documentation Index

**Project:** KOMPASS – Integrated CRM & Project Management Tool (Offline-First PWA)  
**Last Updated:** 2025-01-27  
**Status:** ✅ Fully Specified (MVP + Phase 2/3 + 2025 AI Extensions)

---

## 📚 Quick Navigation

### 🚀 Start Here (New Team Members)
1. **[Product Vision (Nordstern-Direktive)](./product-vision/Produktvision%20für%20Projekt%20KOMPASS%20(Nordstern-Direktive).md)** – North Star Vision, MVP Scope, 4 Strategic Pillars (AI, Collaboration, Analytics, 2025 Intelligence Extensions)
2. **[AI & Automation Features Vision](./product-vision/Produktvision%20KI%20&%20Automation-Features.md)** – ✨ NEW: RAG Knowledge Management, n8n Automation, Predictive Forecasting, BI Dashboards (2025 Extensions)
3. **[Technology Roadmap](./product-vision/TECHNOLOGY_ROADMAP.md)** – Timeline, Budget, KPIs für Phases 1-3 + 2025 AI/Automation Roadmap
4. **[Architecture Documentation](./architectur/Projekt%20KOMPASS%20–%20Architekturdokumentation%20(Zielarchitektur).md)** – Technical Specs, ADRs, Stack (NestJS, React, CouchDB, Grafana, RAG, n8n, Neo4j)

### 🎯 For Product/Business
- **[Gesamtkonzept (Comprehensive Overview)](./product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md)** – Executive Summary, Domain Analysis, Requirements, MVP Scope, Phase 2/3 Strategic Outlook
- **[AI & Automation Features Vision](./product-vision/Produktvision%20KI%20&%20Automation-Features.md)** – ✨ NEW: RAG-basiertes Wissensmanagement, n8n Intelligent Automation, Predictive Forecasting & BI-Dashboards, Strategic ROI (2025 Extensions)
- **[Projektmanagement Vision](./product-vision/Produktvision%20Projektmanagement%20&%20-durchführung.md)** – Project Management Features, Workflows, Phase 2 AI Risk Assessment
- **[CRM Vision](./product-vision/Produktvision%20&%20Zielbild%20–%20Kontakt-%20&%20Kundenverwaltung%20(CRM-Basis).md)** – Customer/Contact/Opportunity Management
- **[Finanz & Compliance Vision](./product-vision/Produktvision%20Finanz-%20und%20Compliance-Management.md)** – Invoicing, GoBD, DSGVO, Phase 2 Observability

### 👥 For UX/Product Design
- **[CEO Persona](./personas/Persona-Profil_%20Geschäftsführer%20(CEO)%20im%20Projektgeschäft.md)** – GF Needs, Dashboards, Advanced Analytics (Phase 2.2) + ✨ Executive Intelligence & Forecasts, RAG-based Q&A (2025)
- **[Field Sales Persona](./personas/Referenzpersona_%20Außendienstmitarbeiter%20(Vertrieb%20Ladenbau-Projekte).md)** – Außendienst, AI Transcription (Phase 2.1), Route Planning + ✨ Prognosen & Opportunities, KI-gestützte Kundenrecherche (2025)
- **[Inside Sales Persona](./personas/Innendienst%20(Vertriebsinnendienst%20&%20Kalkulation)%20–%20Referenzprofil.md)** – Innendienst, Real-Time Collaboration (Phase 2.1) + ✨ Workload-Forecasting, n8n-Automation, KI-gestützte Angebotserstellung (2025)
- **[Planning Persona](./personas/Strategische%20Referenzpersona_%20Planungsabteilung.md)** – Planer, AI Risk Assessment (Phase 2.1), Collaboration + ✨ Timeline-Forecasting, RAG-Wissenssuche, Design-Pattern-Library (2025)
- **[Accounting Persona](./personas/Persona-Bericht_%20Buchhaltung%20(Integriertes%20CRM-%20und%20PM-Tool).md)** – Buchhaltung, GoBD Compliance, Observability (Phase 1.5) + ✨ Liquiditäts-Forecasting, BI-Dashboards, Predictive Collections (2025)
- **[Marketing Persona](./personas/Persona%20Marketing%20und%20Grafik%20(Merged%20Profile).md)** – Marketing/Grafik, Customer Portal (Phase 2.2), Analytics

### 🏗️ For Developers
- **[Architecture Documentation](./architectur/Projekt%20KOMPASS%20–%20Architekturdokumentation%20(Zielarchitektur).md)** – Complete Technical Specs with:
  - **AI Integration Architecture** (BullMQ, n8n, Whisper, Socket.IO, MinIO)
  - **✨ 2025 Extensions:** RAG System (LlamaIndex, Weaviate), n8n Automation, Neo4j Knowledge Graph, BI Layer (Grafana/Metabase)
  - **Observability & Monitoring** (Grafana Stack: Prometheus, Loki, Tempo)
  - **Real-Time Communication** (Socket.IO + Redis Adapter)
  - **CQRS for Analytics** (CouchDB → PostgreSQL Replication)
  - **ADR-015 to ADR-018** (Key Architectural Decisions)
- **[AI Extensions Implementation Guide](./architectur/AI-Extensions%20Architektur%20&%20Implementierungs-Guide.md)** – ✨ NEW: Step-by-Step Setup for RAG, n8n, Neo4j, ML-Models, BI-Dashboards (with Docker Compose, code templates, troubleshooting)
- **[Architecture Evolution Guide](./architectur/ARCHITECTURE_EVOLUTION_GUIDE.md)** – Step-by-Step Migration from MVP to Phase 2/3 (with code examples)
- **[Technology Roadmap](./product-vision/TECHNOLOGY_ROADMAP.md)** – Detailed Timeline, Tech Stack Evolution, Budget

### 📋 For QA/Testing
- **[Test Strategy Document](./reviews/TEST_STRATEGY_DOCUMENT.md)** – 70/20/10 Pyramid, 50+ E2E Scenarios, Offline Tests, Browser Matrix
- **[NFR Specification](./reviews/NFR_SPECIFICATION.md)** – Performance (P50/P95/P99), Offline Quota (50MB iOS), Availability (>95%)
- **[Conflict Resolution Specification](./reviews/CONFLICT_RESOLUTION_SPECIFICATION.md)** – Hybrid Strategy (70% auto, 25% nutzergeführt, 5% eskaliert)

### 🔐 For Security/Compliance
- **[Data Model Specification](./reviews/DATA_MODEL_SPECIFICATION.md)** – ERD, Entities, Validation, GoBD Immutability, ID Strategies
- **[RBAC Permission Matrix](./reviews/RBAC_PERMISSION_MATRIX.md)** – 5 Roles (ADM/INNEN/PLAN/BUCH/GF), Entity + Field-Level Permissions
- **[API Specification](./reviews/API_SPECIFICATION.md)** – OpenAPI 3.0, JWT Auth, RESTful Endpoints, Error Handling (RFC 7807)

### 🗓️ For Project Management
- **[Delivery Plan](./reviews/DELIVERY_PLAN.md)** – 16 Wochen MVP, 6.75 FTE, €230K Budget, Training & Rollout
- **[User Journey Maps](./reviews/USER_JOURNEY_MAPS.md)** – 5 End-to-End Journeys (Lead→Projekt, Projekt→Rechnung, GF-Review, Offline-Sync)
- **[Technology Roadmap](./product-vision/TECHNOLOGY_ROADMAP.md)** – Timeline & KPIs für Phases 2-3 (€538-608K Total Budget)

---

## 📂 Document Structure

```
docs/
├── README.md                           # ← You are here
│
├── architectur/
│   ├── Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md
│   │   # Complete Technical Specs:
│   │   # - Stack (NestJS, React, CouchDB, Grafana)
│   │   # - AI Architecture (BullMQ + n8n + Whisper + Socket.IO + MinIO)
│   │   # - ✨ 2025 Extensions: RAG (LlamaIndex, Weaviate), n8n, Neo4j, BI Layer
│   │   # - Observability (Prometheus + Loki + Tempo + Grafana)
│   │   # - Real-Time (Socket.IO + Redis Adapter)
│   │   # - CQRS (CouchDB → PostgreSQL)
│   │   # - ADR-001 to ADR-018 (Architectural Decisions)
│   │
│   ├── AI-Extensions Architektur & Implementierungs-Guide.md  # ✨ NEW (2025)
│   │   # Step-by-Step Implementation Guide:
│   │   # - RAG System Setup (Weaviate, LlamaIndex, Document Ingestion)
│   │   # - n8n Workflow Automation (Integration Patterns, Example Workflows)
│   │   # - Neo4j Knowledge Graph (Schema, Sync Strategies)
│   │   # - BI & Analytics Layer (PostgreSQL Star-Schema, Grafana, Metabase)
│   │   # - ML Model Serving (FastAPI, Training Pipelines)
│   │   # - Security Hardening (DSGVO Compliance, Prompt Injection Defense)
│   │   # - Monitoring & Observability (Prometheus Metrics, Grafana Dashboards)
│   │   # - Troubleshooting & FAQ
│   │
│   └── ARCHITECTURE_EVOLUTION_GUIDE.md # Migration Path from MVP to Full Vision
│
├── product-vision/
│   ├── Produktvision für Projekt KOMPASS (Nordstern-Direktive).md
│   │   # North Star Vision, MVP Scope, 4 Strategic Pillars:
│   │   # - Pillar 1: AI-Powered Intelligent Co-Pilot
│   │   # - Pillar 2: Active Collaboration & Customer Engagement
│   │   # - Pillar 3: Data-Driven Insights & Advanced Analytics
│   │   # - ✨ Pillar 4: 2025 Extensions – Autonomous Business Partner (RAG, Forecasting, n8n)
│   │
│   ├── Produktvision KI & Automation-Features.md  # ✨ NEW (2025)
│   │   # AI & Automation Extensions Vision:
│   │   # - RAG-basiertes Knowledge Management (Conversational Q&A, Semantic Search)
│   │   # - n8n Intelligent Automation (Proactive Workflows, Agent Orchestration)
│   │   # - Predictive Forecasting (Sales Pipeline, Cash Flow, Project Timelines)
│   │   # - BI Dashboards (Real-Time KPIs, Self-Service Analytics)
│   │   # - Strategic ROI Calculation (€82K/Jahr Zeitersparnis)
│   │   # - Security & Compliance (DSGVO-First Architecture)
│   │   # - Implementation Roadmap (Q2-Q4 2025)
│   │
│   ├── TECHNOLOGY_ROADMAP.md           # Timeline, Budget, KPIs (Phases 1-3 + 2025 Extensions)
│   │
│   ├── Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md
│   │   # Comprehensive Overview: Domain, Requirements, MVP, Phase 2/3 Outlook
│   │
│   ├── Produktvision Projektmanagement & -durchführung.md
│   │   # PM Features, Workflows, Phase 2 AI Risk Assessment & Collaboration
│   │
│   ├── Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis).md
│   │   # CRM Features, Customer/Contact/Opportunity Management
│   │
│   └── Produktvision Finanz- und Compliance-Management.md
│       # Invoicing, GoBD, DSGVO, Phase 2 Observability & Compliance Monitoring
│
├── personas/
│   ├── Persona-Profil_ Geschäftsführer (CEO) im Projektgeschäft.md
│   │   # GF Needs, Dashboards, Phase 2.2 Advanced Analytics
│   │   # ✨ 2025: Executive Intelligence, RAG-based Q&A, Predictive Forecasts, Early Warning Systems
│   │
│   ├── Referenzpersona_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte).md
│   │   # Außendienst, Phase 2.1 AI Transcription & Lead Scoring, Route Planning
│   │   # ✨ 2025: Opportunity Forecasting, AI-powered Customer Research, Pipeline Visualization
│   │
│   ├── Innendienst (Vertriebsinnendienst & Kalkulation) – Referenzprofil.md
│   │   # Innendienst, Phase 2.1 Real-Time Activity Feed & Contextual Commenting
│   │   # ✨ 2025: Workload Forecasting, n8n Automation (Follow-Ups, Supplier Inquiry), AI Quote Assistant
│   │
│   ├── Strategische Referenzpersona_ Planungsabteilung.md
│   │   # Planer, Phase 2.1 AI Risk Assessment & Real-Time Collaboration
│   │   # ✨ 2025: Project Timeline Forecasting, RAG Knowledge Search, Design Pattern Library, Capacity Dashboards
│   │
│   ├── Persona-Bericht_ Buchhaltung (Integriertes CRM- und PM-Tool).md
│   │   # Buchhaltung, GoBD Compliance, Phase 2 Observability
│   │   # ✨ 2025: Cash Flow Forecasting, BI Dashboards, Predictive Collections, AI Financial Analysis
│   │
│   └── Persona Marketing und Grafik (Merged Profile).md
│       # Marketing/Grafik, Phase 2.2 Customer Portal & Analytics für Marketing-ROI
│
└── reviews/
    ├── DATA_MODEL_SPECIFICATION.md     # ERD, Entities, Validation, GoBD, IDs
    ├── RBAC_PERMISSION_MATRIX.md       # 5 Roles, Entity + Field-Level Permissions
    ├── API_SPECIFICATION.md            # OpenAPI 3.0, JWT, REST, Error Handling (RFC 7807)
    ├── NFR_SPECIFICATION.md            # Performance, Offline Quota, Availability
    ├── TEST_STRATEGY_DOCUMENT.md       # 70/20/10 Pyramid, 50+ E2E Scenarios
    ├── CONFLICT_RESOLUTION_SPECIFICATION.md  # Hybrid Strategy (70%/25%/5%)
    ├── USER_JOURNEY_MAPS.md            # 5 End-to-End Journeys
    ├── DELIVERY_PLAN.md                # 16 Wochen MVP, 6.75 FTE, €230K Budget
    ├── VALIDATION_REPORT.md            # Gap Resolution Validation (100% Complete)
    └── FINAL_SUMMARY.md                # Documentation Update Summary
```

---

## 🗺️ Project Roadmap Summary

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1 (MVP)** | Wochen 1-16, Q1-Q2 2025 | CRM-Kern, Offline-First PWA, RBAC, Import/Export | 🟢 In Progress |
| **Phase 1.5 (Observability)** | Parallel zum MVP, Q2 2025 | Grafana Stack (Prometheus, Loki, Tempo, Grafana) | ⚠️ Planned |
| **✨ Phase 2.1 (AI Extensions)** | Q2 2025 (8 Wochen) | RAG Foundation (Weaviate, LlamaIndex), n8n Basic Automation | ⚠️ NEW - Fully Specified |
| **Phase 2.2** | Q3 2025 (8-10 Wochen) | Core Intelligence (ML Forecasting, Grafana Dashboards, n8n Advanced Workflows) | ⚠️ Fully Specified |
| **✨ Phase 2.3 (Intelligence Layer)** | Q4 2025 (8 Wochen) | Neo4j Knowledge Graph, Metabase BI, CQRS Analytics, Model Retraining | ⚠️ NEW - Fully Specified |
| **Phase 3** | 10-12 Wochen, Q1-Q2 2026 | Optimization & Scaling (A/B-Testing, Monte Carlo Forecasting, CRDTs) | ⚠️ Conceptually Defined |

**Total Budget (Phases 1-3 + AI Extensions):** €718-788K (includes €180K AI/Automation Development)  
**Total Timeline:** 52-58 Wochen (13-14 Monate)  
**AI Extensions ROI:** €82K/Jahr Zeitersparnis (Break-Even after 26 Monate)

---

## 🎯 Key Features by Phase

### Phase 1 (MVP) Features
✅ CRM: Customer, Contact, Opportunity, Protocol Management  
✅ Offline-First: PouchDB/CouchDB Sync, 50MB iOS Quota Management  
✅ RBAC: 5 Roles (ADM/INNEN/PLAN/BUCH/GF), Entity + Field-Level Permissions  
✅ Search: MeiliSearch for Performance  
✅ Authentication: Keycloak SSO  
✅ Import/Export: CSV, Excel, Lexware-kompatibel

### ✨ Phase 2.1 Features (AI Extensions Q2 2025)
🔍 **RAG Foundation:** Weaviate Vector DB + LlamaIndex → Semantic Search über alle Dokumente  
💬 **Conversational Q&A:** Natural Language Queries → "Zeige mir ähnliche Hofladen-Projekte mit regionalem Sortiment"  
🤖 **n8n Basic Automation:** Automated Follow-Up Sequences, Invoice Reminders, Project Kickoff Workflows  
🔒 **On-Premise LLM:** Llama 3 70B lokal → 100% DSGVO-konform  
📚 **Knowledge Base Ingestion:** Projekte, Protokolle, Angebote, CAD-Beschreibungen werden embedded

### Phase 2.2 Features (Core Intelligence Q3 2025)
📊 **ML-Forecasting:** Opportunity Scoring (Random Forest), Payment Prediction, Timeline Forecasts  
📈 **Grafana Dashboards:** Team-Auslastung, Projekt-Status, Financial KPIs, Real-Time-Updates  
🤖 **n8n Advanced Workflows:** Supplier Performance Tracking, Proactive Risk Alerts, Weekly Report Generation  
🎯 **Predictive Alerts:** Liquiditäts-Warnungen, Budget-Überschreitungs-Prognosen, Zahlungsverzugs-Prediction  
💼 **Executive Intelligence:** Rolling 6-Month Cash Flow Forecast, Forecast Dashboards für GF

### ✨ Phase 2.3 Features (Intelligence Layer Q4 2025)
🗂️ **Neo4j Knowledge Graph:** Relationship Modeling (Projekte ↔ Kunden ↔ Materialien ↔ Lieferanten)  
📊 **Metabase Self-Service BI:** No-Code Query Builder, Custom Dashboards, Scheduled Reports  
🗄️ **CQRS Analytics:** PostgreSQL Star-Schema → Sub-Second-Queries, Materialized Views  
🤖 **Model Retraining:** Automated ML-Pipeline via n8n, Continuous Improvement, Drift Detection  
🎨 **Design Pattern Library:** Automatische Pattern-Extraktion aus historischen Projekten

### Phase 3 Features (Optimization & Scaling Q1-Q2 2026)
🔬 **A/B-Testing:** Experimentierung mit AI-Features, Conversion-Optimierung  
📈 **Monte Carlo Forecasting:** Confidence Intervals für Prognosen, Scenario Analysis  
🔄 **Collaborative Editing:** CRDTs (Yjs) → Google Docs-style Live-Editing (Conflict-Free)  
🚀 **Advanced Forecasting:** Sensitivity Analysis, Multi-Variate Predictions, Break-Even-Analysen  
🤖 **Multi-Agent Orchestration:** Autonome Agents koordinieren komplexe Workflows

---

## 🏗️ Technical Stack Evolution

| Component | MVP (Phase 1) | Phase 2.1 (AI Extensions) | Phase 2.2 (Intelligence) | Phase 2.3 (BI Layer) | Phase 3 |
|-----------|--------------|---------------------------|-------------------------|---------------------|---------|
| **Backend** | NestJS + CouchDB | + BullMQ, n8n, Socket.IO, Redis | + ML Services (FastAPI) | + PostgreSQL (CQRS) | + Multi-Agent Orchestration |
| **Frontend** | React PWA + PouchDB | + Socket.IO Client | + Grafana Embedded | + Metabase Embedded, React-Grid-Layout | + Yjs/Automerge (CRDTs) |
| **AI/ML** | - | **✨ Llama 3 70B (On-Premise)**, Whisper, GPT-4 (Optional) | **✨ Random Forest, XGBoost (Forecasting)** | - | Monte Carlo Simulation, Advanced ML |
| **RAG/Vector** | - | **✨ Weaviate, LlamaIndex, Multilingual E5** | - | - | Hybrid Search, Multi-Modal Embeddings |
| **Knowledge Graph** | - | - | - | **✨ Neo4j** | Advanced Graph Algorithms |
| **Workflow Automation** | - | **✨ n8n (Self-Hosted), Basic Workflows** | **✨ n8n Advanced (LLM-Integration, Monitoring)** | **✨ n8n Production (Git-Versioning)** | Autonomous Agents |
| **BI & Analytics** | - | - | **✨ Grafana (Real-Time Dashboards)** | **✨ Metabase (Self-Service), PostgreSQL Star-Schema** | Advanced Analytics, Predictive Reports |
| **Observability** | - | **Prometheus, Loki, Tempo, Grafana** | + ML Metrics (Model Performance) | + BI Query Performance | + A/B-Test Metrics |
| **Storage** | CouchDB | + MinIO (Object Storage) | - | + PostgreSQL (Read Store) | + Time-Series DB (InfluxDB) |
| **Real-Time** | - | Socket.IO + Redis Adapter | - | - | + CRDT Sync |

---

## 📊 Success Metrics (KPIs)

### MVP KPIs
- 360°-Sicht auf Kunden: ✅ Alle Daten in 1 Tool (CRM + PM + Rechnungen)
- Offline-Fähigkeit: ✅ iOS 50MB Quota Management, Sync-Konflikte <5%
- Nutzerakzeptanz: ✅ >80% User Adoption nach 3 Monaten
- Performance: ✅ API P95 <1.5s, Dashboard-Load <3s

### ✨ Phase 2.1 KPIs (AI Extensions)
- RAG Adoption: >70% aktive User nutzen Q&A-Feature monatlich
- Query Response Time: <2s (P95) für RAG-Queries
- Relevanz Score: >85% (gemessen via User-Feedback "War diese Antwort hilfreich?")
- n8n Automation: 30 aktive Workflows, >95% Success Rate
- On-Premise LLM: 100% Queries on-premise (kein Cloud-LLM für Kundendaten)

### Phase 2.2 KPIs (Core Intelligence)
- Forecast Accuracy: >90% bei Quartals-Umsatz-Prognosen, >85% bei Cash-Flow
- ML Model Performance: Opportunity Scoring AUC >0.85, Payment Prediction Accuracy >80%
- Dashboard Load: <2s (P95) für Grafana Real-Time-Dashboards
- Proactive Alerts: >75% Precision (keine False Positives), <10% False Negatives
- Time Savings: 39,5h/Woche Team-wide (gemessen via Time-Tracking-Surveys)

### ✨ Phase 2.3 KPIs (Intelligence Layer)
- Neo4j Graph Queries: <500ms (P95) für komplexe Relationship-Queries
- Metabase Self-Service: >60% BI-Queries ohne Dev-Involvement
- CQRS Analytics: Dashboard-Load <1s (P95), PostgreSQL Query Performance <200ms
- Model Retraining: Automated Pipeline läuft monatlich, Drift Detection <5% Accuracy Loss
- Pattern Library: >50 automatisch extrahierte Design-Patterns

### Phase 3 KPIs (Optimization & Scaling)
- Predictive Forecasting: <5% Abweichung Prognose vs. Ist-Umsatz (Monte Carlo)
- A/B-Testing: >10 laufende Experimente, Conversion-Uplift >8%
- Collaborative Editing: -70% CouchDB-Konflikte (von 10/Woche → 3/Woche via CRDTs)
- Multi-Agent Efficiency: >80% autonome Task-Completion ohne Human-Intervention

---

## 🔗 External References

### Official Documentation
- **NestJS:** https://docs.nestjs.com/
- **React:** https://react.dev/
- **CouchDB:** https://docs.couchdb.org/
- **PouchDB:** https://pouchdb.com/
- **Grafana:** https://grafana.com/docs/
- **OpenTelemetry:** https://opentelemetry.io/docs/
- **Socket.IO:** https://socket.io/docs/

### ✨ AI/ML/RAG Documentation (2025 Extensions)
- **LlamaIndex:** https://docs.llamaindex.ai/
- **LangChain:** https://python.langchain.com/docs/
- **Weaviate Vector DB:** https://weaviate.io/developers/weaviate
- **Neo4j Knowledge Graph:** https://neo4j.com/docs/
- **Hugging Face (Embeddings):** https://huggingface.co/docs/transformers
- **Llama 3 (Meta AI):** https://llama.meta.com/docs/
- **vLLM (LLM Serving):** https://docs.vllm.ai/
- **FastAPI:** https://fastapi.tiangolo.com/
- **Scikit-Learn (ML):** https://scikit-learn.org/stable/

### ✨ Automation & BI (2025 Extensions)
- **n8n:** https://docs.n8n.io/
- **Metabase:** https://www.metabase.com/docs/
- **Grafana:** https://grafana.com/docs/grafana/latest/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Prometheus:** https://prometheus.io/docs/

### Best Practices & Standards
- **OpenAPI 3.0 Spec:** https://swagger.io/specification/
- **RFC 7807 (Problem Details):** https://tools.ietf.org/html/rfc7807
- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/
- **GoBD Compliance:** https://www.bundesfinanzministerium.de/
- **✨ RAG Best Practices:** https://www.pinecone.io/learn/retrieval-augmented-generation/
- **✨ Prompt Engineering Guide:** https://www.promptingguide.ai/

### Tooling
- **BullMQ:** https://docs.bullmq.io/
- **Whisper API:** https://platform.openai.com/docs/guides/speech-to-text
- **MeiliSearch:** https://www.meilisearch.com/docs
- **Keycloak:** https://www.keycloak.org/documentation
- **✨ Docker Compose:** https://docs.docker.com/compose/
- **✨ Kubernetes:** https://kubernetes.io/docs/

---

## 📧 Contact & Support

**Product Owner:** [TBD]  
**Tech Lead:** [TBD]  
**DevOps:** [TBD]

**Documentation Issues:** Create GitHub Issue or Linear Ticket  
**Security Issues:** Email security@kompass.de

---

## 🔄 Document Versioning

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | 2025-01-11 | Initial comprehensive documentation after Gap Resolution |
| **2.0** | 2025-01-27 | ✨ **AI & Automation Extensions 2025** – Added Pillar 4 (RAG, n8n, Forecasting, BI), updated all personas, created AI Extensions Implementation Guide, expanded architecture with Intelligence Layer |

---

**Last Updated:** 2025-01-27  
**Maintained By:** Product & Engineering Team  
**Next Review:** Q2 2025 (After MVP Launch + AI Extensions Q2 Kickoff)

