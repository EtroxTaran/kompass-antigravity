# KOMPASS Architecture Evolution Guide

**Document Version:** 2.0  
**Last Updated:** 2025-01-28  
**Purpose:** Practical migration path from MVP (Phase 1) to Full Vision (Phases 2-3)

**Cross-References:**

- `docs/product-vision/TECHNOLOGY_ROADMAP.md` – Timeline & Budget
- `docs/architecture/system-architecture.md` – Complete Technical Specification
- `docs/architecture/README.md` – Architecture Overview and Implementation Guidance

---

## Executive Summary

This guide provides a **step-by-step migration strategy** for evolving KOMPASS from a functional MVP to a fully intelligent, real-time, and data-driven platform. Each evolution step is designed to be **non-breaking**, allowing production MVP to continue operating while new features are incrementally rolled out.

**Key Principle:** **Zero-Downtime Evolution** – MVP bleibt produktiv während Phase 2/3 gebaut wird.

---

## Evolution Timeline Overview

```
MVP (Phase 1)     Phase 1.5      Phase 2.1        Phase 2.2        Phase 3
    |                |               |                |               |
CouchDB/PouchDB → Observability → +BullMQ/n8n → +PostgreSQL → +CRDTs
    ↓                ↓               ↓               (CQRS)         ↓
RBAC             Grafana Stack   +Socket.IO      +Custom       +Advanced AI
    ↓                               ↓            Dashboards        ↓
Offline-First                   +AI Features      ↓           Collaborative
    ↓                                           +Customer       Editing
Search (MeiliSearch)                             Portal
```

---

## Phase 1 → Phase 1.5: Adding Observability (Parallel Deployment)

**Goal:** Deploy Observability Stack **parallel** zum MVP ohne MVP-Code-Änderungen.

### Step 1: OpenTelemetry Instrumentation (1-2 Tage)

#### Backend (NestJS)

```typescript
// apps/backend/src/main.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "kompass-backend",
  }),
  traceExporter: new OTLPTraceExporter({
    url: "http://grafana-tempo:4318/v1/traces",
  }),
  metricReader: new PrometheusExporter({ port: 9464 }),
});

sdk.start();

// Instrumentation ist non-invasive → Keine Code-Änderungen erforderlich
```

#### Frontend (React)

```typescript
// apps/frontend/src/instrumentation.ts
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const provider = new WebTracerProvider();
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({ url: "https://api.kompass.de/v1/traces" }),
  ),
);

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [getWebAutoInstrumentations()],
});
```

---

### Step 2: Deploy Grafana Stack (Docker Compose) (1 Tag)

```yaml
# docker-compose.observability.yml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki-data:/loki

  tempo:
    image: grafana/tempo:latest
    ports:
      - "3200:3200" # Tempo HTTP
      - "4318:4318" # OTLP gRPC
    volumes:
      - tempo-data:/tmp/tempo

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=secure_password_here
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  prometheus-data:
  loki-data:
  tempo-data:
  grafana-data:
```

**Deployment:** `docker-compose -f docker-compose.observability.yml up -d`

---

### Step 3: Configure Dashboards & Alerts (2-3 Tage)

**Grafana Dashboards:**

- `NestJS API Performance` (P50/P95/P99 Response Times)
- `CouchDB Health` (Replication Lag, Conflict Rate, Doc Count)
- `React PWA Performance` (Largest Contentful Paint, First Input Delay)
- `Offline Sync Stats` (Pending Changes, Sync Duration, Conflicts)

**Alerting Rules:**

```yaml
# alerting_rules.yml
groups:
  - name: api_performance
    rules:
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1.5
        for: 5m
        annotations:
          summary: "API P95 latency >1.5s"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 2m
        annotations:
          summary: "Error rate >1%"
```

---

### **Phase 1.5 Complete:** MVP läuft unverändert, aber jetzt vollständig überwacht. ✅

---

## Phase 1.5 → Phase 2.1: Adding AI & Real-Time (Non-Breaking Addition)

**Goal:** Neue Services deployen OHNE MVP-Code zu brechen. MVP funktioniert weiter, AI/Real-Time sind **opt-in**.

### Architecture Addition

```
MVP (existing)           New Services (Phase 2.1)
    |                           |
CouchDB/PouchDB  ──→  + BullMQ (Job Queue)
NestJS API       ──→  + n8n (Workflow Orchestration)
React PWA        ──→  + Socket.IO Gateway (Real-Time)
                      + MinIO (Object Storage)
                      + Redis (Socket.IO Adapter)
```

---

### Step 1: Deploy BullMQ + Redis (1 Tag)

```typescript
// apps/backend/src/queue/queue.module.ts
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: "ai-transcription",
    }),
    BullModule.registerQueue({
      name: "lead-scoring",
    }),
  ],
})
export class QueueModule {}
```

**No Breaking Change:** MVP-Code ruft noch keine Queues auf → Queue-System bleibt inaktiv bis AI-Features deployed.

---

### Step 2: Deploy n8n Workflow Engine (1 Tag)

```bash
# docker-compose.n8n.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=secure_password
      - WEBHOOK_URL=https://n8n.kompass.de/
    volumes:
      - n8n-data:/home/node/.n8n
```

**n8n Workflows (Pre-configured):**

1. `Whisper Transcription Workflow`: Audio Upload → Whisper API → GPT-4 Summary → CouchDB Update
2. `Lead Scoring Workflow`: New Opportunity → Python ML Service → Score Update → CouchDB Update

**Deployment:** `docker-compose -f docker-compose.n8n.yml up -d`

---

### Step 3: Deploy Socket.IO Gateway (2-3 Tage)

```typescript
// apps/backend/src/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  },
  adapter: require("socket.io-redis"), // Redis Adapter for Horizontal Scaling
})
@UseGuards(JwtAuthGuard)
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("subscribe:activity-feed")
  handleActivityFeedSubscribe(@ConnectedSocket() client: Socket) {
    const userId = client.data.user.id;
    client.join(`user:${userId}`);
    console.log(`User ${userId} subscribed to activity feed`);
  }

  // Backend emits events via this.server.to(`user:${userId}`).emit('activity', event)
}
```

**Redis Adapter for Horizontal Scaling:**

```typescript
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ host: "localhost", port: 6379 });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
```

**No Breaking Change:** Alte API-Endpoints funktionieren weiter. Socket.IO ist **zusätzlich** verfügbar.

---

### Step 4: Frontend WebSocket Integration (1-2 Tage)

```typescript
// apps/frontend/src/hooks/useWebSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const socketInstance = io("wss://api.kompass.de", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket connected");
      socketInstance.emit("subscribe:activity-feed");
    });

    socketInstance.on("activity", (event) => {
      console.log("Activity event:", event);
      // Update Redux/Zustand store
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return socket;
}
```

**Backward Compatibility:** Alte Polling-basierte Updates bleiben aktiv → Socket.IO ist **opt-in** (Feature Flag).

---

### Step 5: Feature Flags für AI/Real-Time (1 Tag)

```typescript
// packages/shared/src/constants/feature-flags.ts
export const FEATURE_FLAGS = {
  AI_TRANSCRIPTION: process.env.FEATURE_AI_TRANSCRIPTION === "true",
  AI_LEAD_SCORING: process.env.FEATURE_AI_LEAD_SCORING === "true",
  REAL_TIME_ACTIVITY_FEED: process.env.FEATURE_REALTIME_FEED === "true",
  CONTEXTUAL_COMMENTING: process.env.FEATURE_COMMENTING === "true",
} as const;

// Frontend
if (FEATURE_FLAGS.AI_TRANSCRIPTION) {
  showAudioRecordButton();
}

// Backend
if (FEATURE_FLAGS.AI_LEAD_SCORING) {
  await this.queueService.add("lead-scoring", { opportunityId });
}
```

**Rollout Strategy:**

- **Week 1:** Feature Flags OFF für alle Nutzer (Deploy & Smoke-Test)
- **Week 2:** Feature Flags ON für 3 Pilotnutzer (Außendienst)
- **Week 3:** Feature Flags ON für 10 Nutzer (A/B-Test)
- **Week 4:** Feature Flags ON für alle Nutzer (Full Rollout)

---

### **Phase 2.1 Complete:** AI & Real-Time Features aktiv, MVP bleibt unverändert funktionsfähig. ✅

---

## Phase 2.1 → Phase 2.2: Adding CQRS & Analytics (Non-Breaking Addition)

**Goal:** PostgreSQL Read Store deployen OHNE CouchDB zu ersetzen. Beide DBs laufen parallel.

### Architecture Addition

```
MVP (existing)           Phase 2.1 (existing)      New (Phase 2.2)
    |                           |                          |
CouchDB (Write)  ──→  BullMQ/n8n/Socket.IO  ──→  + PostgreSQL (Read)
    ↓                                                      ↓
PouchDB Sync                                        CQRS Replication Service
    ↓                                                      ↓
React PWA                                           Custom Dashboards (GraphQL)
```

---

### Step 1: Deploy PostgreSQL (1 Tag)

```yaml
# docker-compose.postgres.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: kompass_analytics
      POSTGRES_USER: kompass
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

**Schema Migration:**

```sql
-- PostgreSQL Read Store Schema
CREATE TABLE opportunities (
  id UUID PRIMARY KEY,
  company_name VARCHAR(200) NOT NULL,
  estimated_value DECIMAL(10,2),
  probability INT,
  status VARCHAR(50),
  owner_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_owner ON opportunities(owner_id);
CREATE INDEX idx_opportunities_created_at ON opportunities(created_at);
```

---

### Step 2: Deploy CQRS Replication Service (3-4 Tage)

```typescript
// apps/backend/src/cqrs/cqrs-replication.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Nano from "nano";

@Injectable()
export class CQRSReplicationService implements OnModuleInit {
  constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepo: Repository<OpportunityEntity>,
    private readonly nano: Nano,
  ) {}

  async onModuleInit() {
    this.startChangesFeed();
  }

  private async startChangesFeed() {
    const db = this.nano.use("kompass");
    const feed = db.changesReader.start({
      since: "now",
      includeDocs: true,
      filter: (doc: any) => doc.type === "opportunity",
    });

    feed.on("batch", async (changes: any[]) => {
      for (const change of changes) {
        await this.replicateToPostgreSQL(change.doc);
      }
    });

    feed.on("error", (err) => {
      console.error("CouchDB changes feed error:", err);
      // Retry logic
    });
  }

  private async replicateToPostgreSQL(doc: any): Promise<void> {
    const opportunity = {
      id: doc._id,
      companyName: doc.companyName,
      estimatedValue: doc.estimatedValue,
      probability: doc.probability,
      status: doc.status,
      ownerId: doc.owner,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.modifiedAt),
    };

    await this.opportunityRepo.upsert(opportunity, ["id"]); // Upsert = Insert or Update
  }
}
```

**Latency:** 1-5s (Eventual Consistency) – akzeptabel für Analytics.

**No Breaking Change:** CouchDB bleibt Single Source of Truth. PostgreSQL ist **read-only** Cache.

---

### Step 3: GraphQL API für Custom Dashboards (2-3 Tage)

```typescript
// apps/backend/src/analytics/analytics.resolver.ts
import { Query, Args, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Resolver()
export class AnalyticsResolver {
  constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepo: Repository<OpportunityEntity>,
  ) {}

  @Query(() => [OpportunitySummary])
  async opportunitiesByStatus(
    @Args("status", { nullable: true }) status?: string,
  ): Promise<OpportunitySummary[]> {
    const query = this.opportunityRepo
      .createQueryBuilder("o")
      .select("o.status", "status")
      .addSelect("COUNT(*)", "count")
      .addSelect("SUM(o.estimatedValue)", "totalValue")
      .groupBy("o.status");

    if (status) {
      query.where("o.status = :status", { status });
    }

    return query.getRawMany();
  }
}
```

**Frontend Integration:**

```typescript
// apps/frontend/src/hooks/useAnalytics.ts
import { useQuery, gql } from "@apollo/client";

const OPPORTUNITIES_BY_STATUS = gql`
  query OpportunitiesByStatus($status: String) {
    opportunitiesByStatus(status: $status) {
      status
      count
      totalValue
    }
  }
`;

export function useOpportunitiesByStatus(status?: string) {
  return useQuery(OPPORTUNITIES_BY_STATUS, { variables: { status } });
}
```

---

### Step 4: Custom Dashboard Builder (4 Wochen)

**Widget Library:**

- `UmsatzTrendChart` (React-Recharts Line Chart)
- `PipelineFunnelChart` (Recharts Bar Chart)
- `Top10DealsTable` (shadcn DataTable)
- `TeamPerformanceCard` (shadcn Card)

**Drag & Drop Editor:**

```typescript
// apps/frontend/src/features/dashboards/DashboardEditor.tsx
import GridLayout from 'react-grid-layout';
import { UmsatzTrendChart, PipelineFunnelChart } from './widgets';

export function DashboardEditor() {
  const [layout, setLayout] = useState([
    { i: 'umsatz', x: 0, y: 0, w: 6, h: 4 },
    { i: 'pipeline', x: 6, y: 0, w: 6, h: 4 },
  ]);

  return (
    <GridLayout
      layout={layout}
      cols={12}
      rowHeight={50}
      onLayoutChange={setLayout}
    >
      <div key="umsatz">
        <UmsatzTrendChart />
      </div>
      <div key="pipeline">
        <PipelineFunnelChart />
      </div>
    </GridLayout>
  );
}
```

**Persistence:** Dashboard-Layouts in CouchDB gespeichert (User Preferences).

---

### **Phase 2.2 Complete:** CQRS Analytics aktiv, MVP bleibt unverändert, Custom Dashboards deployed. ✅

---

## Phase 2.2 → Phase 3: Advanced AI & CRDTs (Research-Heavy Evolution)

**Goal:** Proof-of-Concept (PoC) für CRDTs → Pilotprojekt → Full Rollout.

### Step 1: CRDT Library Evaluation (2 Wochen PoC)

**Candidates:**

- **Yjs:** Mature, CRDT + ProseMirror/Quill Integration, 9K GitHub Stars
- **Automerge:** Pure JavaScript, Conflict-Free Merge, 12K GitHub Stars

**PoC:** Budget-Tabelle in Projekt editieren (2 Nutzer gleichzeitig) → Automatisches Merge testen.

```typescript
// Yjs PoC
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const ydoc = new Y.Doc();
const ybudget = ydoc.getMap("project-budget");

const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "project-123",
  ydoc,
);

// User 1 editiert
ybudget.set("totalBudget", 50000);

// User 2 editiert gleichzeitig
ybudget.set("usedBudget", 30000);

// Automatisches Merge: { totalBudget: 50000, usedBudget: 30000 } ✅
```

**Decision:** Yjs selected (bessere Docs, mehr Production-Ready).

---

### Step 2: Yjs + CouchDB Integration (4 Wochen)

**Challenge:** Yjs speichert CRDT-State in Binary Format → CouchDB speichert JSON Docs.

**Solution:** Hybrid Approach:

1. **Yjs State → Separate CouchDB Document:** `project-123-yjs-state` (Binary Blob in Attachment)
2. **Final JSON → Regular CouchDB Document:** `project-123` (für Queries/Indexing)
3. **Yjs Persistence Provider:** Custom Provider schreibt Yjs-Updates zu CouchDB

```typescript
// Custom Yjs CouchDB Provider
import * as Y from "yjs";
import Nano from "nano";

export class YjsCouchDBProvider {
  constructor(
    private readonly docId: string,
    private readonly nano: Nano,
  ) {}

  async persistState(ydoc: Y.Doc): Promise<void> {
    const state = Y.encodeStateAsUpdate(ydoc);
    const db = this.nano.use("kompass");

    await db.attachment.insert(
      `${this.docId}-yjs-state`,
      "yjs-state",
      Buffer.from(state),
      "application/octet-stream",
      {},
    );

    // Also persist final JSON snapshot
    const finalJSON = ydoc.toJSON();
    await db.insert({
      _id: this.docId,
      type: "project",
      ...finalJSON,
    });
  }
}
```

---

### Step 3: Collaborative Editing UI (2 Wochen)

```typescript
// apps/frontend/src/features/project/CollaborativeProjectEditor.tsx
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useState } from 'react';

export function CollaborativeProjectEditor({ projectId }: { projectId: string }) {
  const [ydoc] = useState(() => new Y.Doc());
  const [ybudget, setYbudget] = useState<Y.Map<any>>(null);

  useEffect(() => {
    const provider = new WebsocketProvider('ws://api.kompass.de/yjs', projectId, ydoc);
    const budgetMap = ydoc.getMap('budget');
    setYbudget(budgetMap);

    return () => {
      provider.disconnect();
    };
  }, [projectId, ydoc]);

  const handleBudgetChange = (field: string, value: number) => {
    ybudget.set(field, value); // Automatisch zu anderen Clients propagiert
  };

  return (
    <div>
      <input
        value={ybudget?.get('totalBudget') || 0}
        onChange={(e) => handleBudgetChange('totalBudget', parseInt(e.target.value))}
      />
      {/* Live-Updates von anderen Nutzern automatisch reflektiert */}
    </div>
  );
}
```

---

### **Phase 3 Complete:** CRDTs deployed, Collaborative Editing aktiv. ✅

---

## Rollback Strategy

### If Phase 2.1 AI Features Fail

1. **Disable Feature Flags:** `FEATURE_AI_TRANSCRIPTION=false`, `FEATURE_AI_LEAD_SCORING=false`
2. **MVP bleibt aktiv:** Keine Downtime, Nutzer arbeiten mit manueller Protokollierung weiter
3. **BullMQ/n8n bleiben deployed:** Können für Phase 2.2 weiter genutzt werden

### If Phase 2.2 CQRS Fails

1. **Disable GraphQL API:** Analytics-Endpoints returnen 503
2. **Fallback to MapReduce Views:** CouchDB MapReduce bleibt parallel aktiv
3. **PostgreSQL kann gelöscht werden:** Keine Auswirkung auf MVP

### If Phase 3 CRDTs Cause Conflicts

1. **Disable Collaborative Editing:** Fallback zu Soft-Lock-Warning (Presence Indicators)
2. **Yjs-State bleibt in CouchDB:** Kann später reaktiviert werden
3. **Regular Editing bleibt aktiv:** Keine Downtime

---

## Performance Benchmarks (Before vs. After)

| Metric                   | MVP (Phase 1)         | Phase 2.1                   | Phase 2.2      | Phase 3             |
| ------------------------ | --------------------- | --------------------------- | -------------- | ------------------- |
| **Protokoll-Zeit**       | 20 Min                | **2 Min** (-90%)            | -              | -                   |
| **Dashboard-Load**       | 10-30s (MapReduce)    | -                           | **<2s** (CQRS) | -                   |
| **Lead-Priorisierung**   | Manuell (Bauchgefühl) | **ML-Score (87% Accuracy)** | -              | **90% Accuracy**    |
| **Activity-Feed-Latenz** | Polling (5s)          | **Real-Time (<500ms)**      | -              | -                   |
| **CouchDB-Konflikte**    | 10/Woche              | -                           | -              | **5/Woche** (CRDTs) |

---

## Testing Strategy for Each Phase

### Phase 2.1 Testing

- **Unit Tests:** BullMQ Job Handlers, n8n Webhook Mock
- **Integration Tests:** Socket.IO Connection/Disconnection, Message Broadcasting
- **E2E Tests:** Audio Upload → Transcription → Protocol Auto-Fill (Playwright)
- **Load Tests:** 1000 concurrent WebSocket connections

### Phase 2.2 Testing

- **Unit Tests:** PostgreSQL Repository, CQRS Replication Logic
- **Integration Tests:** CouchDB Changes Feed → PostgreSQL Upsert
- **E2E Tests:** Dashboard Widget Drag & Drop, Custom Filter Application
- **Performance Tests:** PostgreSQL Query <500ms (P95)

### Phase 3 Testing

- **Unit Tests:** Yjs CRDT Merge Logic
- **Integration Tests:** Yjs + CouchDB Persistence
- **E2E Tests:** 2 Users edit Budget simultaneously → Conflict-Free Merge
- **Load Tests:** 10 Users editing same Project simultaneously

---

## Deployment Checklist for Each Phase

### Before Phase 2.1 Deployment

- [ ] BullMQ/Redis deployed and healthy
- [ ] n8n workflows imported and tested
- [ ] Socket.IO Gateway smoke-tested (1 connection)
- [ ] Feature Flags OFF for all users
- [ ] Grafana Alerts configured for new services

### Before Phase 2.2 Deployment

- [ ] PostgreSQL deployed and healthy
- [ ] CQRS Replication Service deployed (but not started)
- [ ] GraphQL Schema validated (no breaking changes)
- [ ] MapReduce Views still active (Fallback)
- [ ] Dashboard Editor tested with 5 widgets

### Before Phase 3 Deployment

- [ ] Yjs WebSocket Server deployed
- [ ] Yjs CouchDB Provider tested (PoC)
- [ ] Collaborative Editing tested with 2 users
- [ ] Rollback plan documented
- [ ] Soft-Lock-Warning remains active (Fallback)

---

## Maintenance & Monitoring Post-Deployment

### Phase 2.1 Monitoring

- **Grafana Dashboard:** "AI Features Health" (Transcription Success Rate, Lead Scoring Accuracy)
- **Alerts:** "BullMQ Job Failure Rate >5%" → Slack

### Phase 2.2 Monitoring

- **Grafana Dashboard:** "CQRS Replication Lag" (CouchDB → PostgreSQL Latenz)
- **Alerts:** "PostgreSQL Query P95 >2s" → PagerDuty

### Phase 3 Monitoring

- **Grafana Dashboard:** "CRDT Sync Health" (Yjs State Size, Merge Conflicts)
- **Alerts:** "CRDT Conflict Resolution Failure" → Slack

---

## Next Steps

1. **Review & Approve Evolution Guide:** Tech Lead Sign-Off
2. **Create Phase 2.1 Deployment Plan:** Detailed Sprint Tasks (Jira/Linear)
3. **Allocate Resources:** 3-4 FTEs für Phase 2.1 (Q3 2025)
4. **Kick-Off Phase 2.1:** Sprint Planning + Kick-Off Meeting

---

**Prepared By:** Engineering Team  
**Sign-Off Required:** Tech Lead, DevOps, Product Owner

**See Also:**

- `docs/TECHNOLOGY_ROADMAP.md` – Timeline & Budget
- `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md` – Technical Specs
- `docs/reviews/NFR_SPECIFICATION.md` – Performance Targets
