# Non-Functional Requirements Specification

**Project:** KOMPASS CRM & Project Management  
**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Active

---

## 1. Overview

This document defines the non-functional requirements (NFRs) for the KOMPASS application, covering performance, scalability, security, usability, reliability, and compliance requirements.

---

## 2. Performance Requirements

### 2.1 API Response Times

| Endpoint Category               | P50 Target | P95 Target | P99 Target |
| ------------------------------- | ---------- | ---------- | ---------- |
| Simple CRUD (GET single entity) | ≤ 200ms    | ≤ 500ms    | ≤ 1s       |
| List queries (with filters)     | ≤ 400ms    | ≤ 1.5s     | ≤ 2.5s     |
| Complex aggregations            | ≤ 800ms    | ≤ 2s       | ≤ 4s       |
| **Calendar event aggregation**  | ≤ 500ms    | ≤ 1.5s     | ≤ 3s       |
| **ICS export generation**       | ≤ 1s       | ≤ 3s       | ≤ 5s       |
| Search queries (MeiliSearch)    | ≤ 300ms    | ≤ 800ms    | ≤ 1.5s     |
| Document upload (< 10MB)        | ≤ 2s       | ≤ 5s       | ≤ 10s      |

### 2.2 Frontend Performance

| Metric                         | Target  | Description                     |
| ------------------------------ | ------- | ------------------------------- |
| Initial Page Load (FCP)        | ≤ 1.5s  | First Contentful Paint          |
| Time to Interactive (TTI)      | ≤ 3s    | Page becomes fully interactive  |
| Largest Contentful Paint (LCP) | ≤ 2.5s  | Main content rendered           |
| Dashboard Load                 | ≤ 3s    | Complete dashboard with widgets |
| **Calendar View Load**         | ≤ 2s    | Month view with events          |
| **Calendar View Switch**       | ≤ 500ms | Between month/week/day views    |
| Form Submission Response       | ≤ 1s    | User feedback after submit      |
| Search Results Display         | ≤ 500ms | After search query entered      |
| Cumulative Layout Shift (CLS)  | ≤ 0.1   | Visual stability                |

### 2.3 Offline Sync Performance

| Operation                          | Target | Description                           |
| ---------------------------------- | ------ | ------------------------------------- |
| Initial Sync (First Login)         | ≤ 10s  | Download essential data (5 MB)        |
| Incremental Sync (100 changes)     | ≤ 30s  | Sync queued offline changes           |
| Conflict Resolution (10 conflicts) | ≤ 5s   | Detect and present conflicts          |
| Background Sync                    | ≤ 60s  | Periodic sync while online            |
| **Calendar Event Sync**            | ≤ 3s   | Sync calendar events for 90-day range |

### 2.4 Calendar-Specific Performance

| Operation                         | Target  | Description                               |
| --------------------------------- | ------- | ----------------------------------------- |
| Event Aggregation (30 days)       | ≤ 500ms | Aggregate from all sources                |
| Event Aggregation (90 days)       | ≤ 1.5s  | Maximum date range                        |
| ICS Export (100 events)           | ≤ 1s    | Generate RFC 5545 ICS file                |
| ICS Export (500 events)           | ≤ 3s    | Large export                              |
| Calendar Subscription Feed        | ≤ 2s    | Generate WebCal feed on-demand            |
| Resource Availability Calculation | ≤ 800ms | Calculate team capacity for month         |
| **Event Density Check**           | ≤ 100ms | Count events in date range                |
| **Color Assignment**              | ≤ 50ms  | Assign colors to event batch (100 events) |

---

## 3. Scalability Requirements

### 3.1 Data Volume

| Entity                           | Expected Volume (Year 1) | Max Volume Supported |
| -------------------------------- | ------------------------ | -------------------- |
| Customers                        | 500                      | 10,000               |
| Contacts                         | 2,000                    | 50,000               |
| Opportunities                    | 1,000                    | 20,000               |
| Projects                         | 200                      | 5,000                |
| UserTasks                        | 5,000                    | 100,000              |
| ProjectTasks                     | 3,000                    | 50,000               |
| **Calendar Events (aggregated)** | 10,000                   | 200,000              |
| Invoices                         | 1,500                    | 30,000               |
| Users                            | 20                       | 100                  |

### 3.2 Concurrent Users

| Scenario      | Concurrent Users | Response Time |
| ------------- | ---------------- | ------------- |
| Peak Usage    | 15               | ≤ P95 targets |
| Average Usage | 8                | ≤ P50 targets |
| Burst Load    | 25               | ≤ P99 targets |

### 3.3 Query Performance at Scale

- **Calendar Event Queries:** Max 1000 events per response
- **Date Range:** Max 90 days per calendar query
- **Pagination:** Required for lists > 100 items
- **Search Results:** Max 50 results per page
- **Filter Complexity:** Max 5 filters per query

---

## 4. Usability Requirements

### 4.1 Mobile-First Design

- Touch targets: Minimum 44px × 44px
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Offline-first architecture
- Progressive Web App (PWA) installable
- **Calendar gestures:** Swipe left/right for prev/next period
- **Calendar zoom:** Pinch-to-zoom on mobile (optional)

### 4.2 Accessibility (WCAG 2.1 AA)

- Keyboard navigation support for all interactive elements
- ARIA labels for screen readers
- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text (18pt+)
- Focus indicators visible and clear
- Skip navigation links
- **Calendar navigation:** Keyboard shortcuts (arrow keys, Home/End)
- **Event accessibility:** Screen reader announces event details

### 4.3 Internationalization

- Primary language: German (de-DE)
- Secondary language: English (en-US)
- Date format: DD.MM.YYYY (German), MM/DD/YYYY (English)
- Currency: EUR (€)
- **Calendar localization:** German day/month names by default

---

## 5. Reliability Requirements

### 5.1 Availability

- **Target Uptime:** 99.5% (excluding planned maintenance)
- **Planned Maintenance:** Max 4 hours per month, off-peak hours
- **Offline Capability:** Core features available offline (read-only)
- **Data Sync:** Auto-sync when connection restored

### 5.2 Data Integrity

- **Optimistic Locking:** Prevent concurrent update conflicts
- **Conflict Detection:** Automatic conflict detection for offline changes
- **Conflict Resolution:** User-assisted resolution with visual diff
- **Audit Trail:** All data modifications logged (GoBD compliance)
- **Calendar Event Integrity:** Events generated from source entities, no orphan events

### 5.3 Backup & Recovery

- **Backup Frequency:** Daily automated backups
- **Retention Policy:** 30 days for daily backups, 12 months for monthly
- **Recovery Time Objective (RTO):** ≤ 4 hours
- **Recovery Point Objective (RPO):** ≤ 24 hours
- **CouchDB Replication:** Multi-node replication for high availability

---

## 6. Security Requirements

### 6.1 Authentication & Authorization

- **Authentication Method:** JWT tokens with 24-hour expiration
- **Token Refresh:** Sliding expiration (refresh 30 min before expiry)
- **Role-Based Access Control (RBAC):** Mandatory for all endpoints
- **Password Policy:** Min 12 chars, uppercase + lowercase + digit + special char
- **Session Timeout:** 30 minutes inactivity timeout
- **Calendar Access:** RBAC-filtered events (users see only permitted events)

### 6.2 Data Security

- **Data at Rest:** CouchDB encryption
- **Data in Transit:** TLS 1.2+ for all API communication
- **Sensitive Data:** No passwords/tokens in logs
- **API Rate Limiting:** 100 requests/minute per user
- **Calendar Export Security:** Validate date ranges, prevent excessive exports

### 6.3 Compliance

- **GoBD Compliance:** Immutable financial records, audit trails
- **DSGVO (GDPR) Compliance:** Data privacy, consent management, right to deletion
- **Data Retention:** 10 years for financial records, configurable for CRM data
- **Audit Logs:** All CRUD operations logged with user ID, timestamp, IP

---

## 7. Maintainability Requirements

### 7.1 Code Quality

- **Test Coverage:** ≥ 80% overall, ≥ 90% for business logic
- **Code Review:** All changes require 1 approval (2 for critical features)
- **Linting:** ESLint + Prettier enforced in CI/CD
- **TypeScript Strict Mode:** Mandatory, no `any` types
- **Documentation:** JSDoc for complex functions, README for modules

### 7.2 Monitoring & Logging

- **Structured Logging:** JSON format with correlation IDs
- **Log Levels:** DEBUG (dev), INFO (prod), WARN, ERROR
- **Performance Monitoring:** Track P50/P95/P99 response times
- **Error Tracking:** Automatic error reporting with stack traces
- **Calendar Monitoring:** Track event aggregation performance, ICS export frequency

### 7.3 Deployment

- **Zero-Downtime Deployment:** Blue-green or rolling deployment
- **Rollback Capability:** Instant rollback within 5 minutes
- **CI/CD Pipeline:** Automated tests, build, and deploy
- **Feature Flags:** Gradual rollout of new features

---

## 8. Calendar-Specific NFRs

### 8.1 Event Aggregation

- **Maximum Date Range:** 90 days per query
- **Maximum Event Density:** 1000 events per response
- **Event Sources:** UserTask, ProjectTask, Project, Opportunity, Milestone
- **Source Query Parallelization:** Parallel queries to multiple collections
- **Caching:** 5-minute TTL for event aggregation results

### 8.2 ICS Export

- **RFC 5545 Compliance:** Fully compliant iCalendar format
- **UTF-8 Encoding:** Support for German characters (ä, ö, ü, ß)
- **Maximum Export Size:** 10 MB (approx. 5000 events)
- **Export Rate Limiting:** Max 10 exports per user per hour
- **One-Time vs. Subscription:** Both supported

### 8.3 Calendar Subscriptions (Phase 1)

- **WebCal Protocol:** `webcal://` URL scheme
- **Subscription Feed Update Frequency:** On-demand (no caching)
- **Secure Subscription Tokens:** 256-bit random tokens, non-guessable
- **Token Expiry:** Optional expiry (default: never expire)
- **Token Revocation:** User can revoke tokens at any time
- **Maximum Active Subscriptions:** 5 per user

### 8.4 Resource Availability

- **Working Hours Calculation:** Real-time calculation for team members
- **Capacity Planning:** Aggregate availability for up to 30-day period
- **Presence Override Priority:** Date-specific overrides > weekly schedule
- **Vacation Day Validation:** No overlapping vacation periods
- **Auto-Reset Availability:** Status resets to 'available' after expiry

### 8.5 Calendar UI Performance

- **Virtual Scrolling:** For agenda view with >100 events
- **Event Rendering:** Batch rendering (max 50 events per render cycle)
- **View Transition:** < 500ms animation between month/week/day
- **Touch Response:** < 100ms feedback for touch interactions
- **Mobile Optimization:** Lazy load event details on tap

---

## 9. Browser & Device Support

### 9.1 Supported Browsers

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 100+            |
| Firefox | 100+            |
| Safari  | 15+             |
| Edge    | 100+            |

### 9.2 Supported Devices

- **Mobile:** iOS 14+, Android 10+
- **Tablet:** iPad Air 2+, Android tablets (7"+)
- **Desktop:** 1024px minimum screen width
- **PWA Installation:** iOS, Android, Chrome OS, Windows 10+

### 9.3 Network Conditions

- **Minimum Connection:** 3G (1 Mbps)
- **Offline Support:** Full offline CRUD for core entities
- **Sync Resumption:** Auto-resume failed syncs on reconnection
- **Progressive Loading:** Critical content first, progressive enhancement

---

## 10. Storage Requirements

### 10.1 Local Storage (PWA)

- **iOS Safe Zone:** 50 MB (hard limit on iOS Safari)
- **Tiered Data Strategy:**
  - Essential Data (5 MB): Own tasks, assigned projects, user profile
  - Recent Data (10 MB): Last 30 days activity
  - Pinned Data (35 MB): User-selected offline content
- **Storage Quota Warning:** Alert at 80%, block new offline data at 95%
- **Calendar Event Storage:** Prioritize upcoming events (next 30 days)

### 10.2 Backend Storage

- **CouchDB Database:** 10 GB initial, scalable to 100 GB
- **Attachment Storage:** 50 GB for documents/images
- **Backup Storage:** 3x primary storage size (with retention)
- **Calendar Event Index:** Optimize for date range queries

---

## 11. Testing Requirements

### 11.1 Test Coverage

- **Unit Tests:** 70% of total tests, ≥ 90% coverage for services
- **Integration Tests:** 20% of total tests, ≥ 70% coverage for APIs
- **E2E Tests:** 10% of total tests, critical user workflows

### 11.2 Calendar Test Scenarios

- **Event Aggregation:** Test with 0, 10, 100, 1000 events
- **ICS Export:** Validate RFC 5545 compliance with validators
- **Date Range:** Test edge cases (leap years, DST transitions)
- **RBAC Filtering:** Verify users see only permitted events
- **Offline Calendar:** Test offline event viewing and sync
- **Performance:** Load testing with concurrent calendar requests

---

## 12. Compliance & Audit

### 12.1 GoBD Compliance

- **Immutability:** Finalized invoices and financial records immutable
- **Audit Trail:** All modifications logged with reason and approver
- **Data Retention:** 10-year retention for financial data
- **Tamper Detection:** SHA-256 hashes for immutable documents

### 12.2 DSGVO (GDPR) Compliance

- **Consent Management:** Explicit consent for AI processing, marketing
- **Right to Deletion:** Soft delete with anonymization (keep financial records)
- **Data Portability:** Export user data in machine-readable format
- **Privacy by Design:** Minimal data collection, purpose limitation
- **Calendar Privacy:** Personal calendar events visible only to user (unless shared)

### 12.3 Security Audit

- **Quarterly Reviews:** Security configuration and access controls
- **Penetration Testing:** Annual third-party penetration tests
- **Vulnerability Scanning:** Weekly automated scans
- **Incident Response:** Response plan with 24-hour notification

---

## 13. Documentation Requirements

### 13.1 Technical Documentation

- **API Documentation:** OpenAPI 3.0 specification (auto-generated)
- **Architecture Decision Records (ADRs):** Document major design decisions
- **Database Schema:** CouchDB document types and validation rules
- **Calendar API Docs:** Complete ICS export and subscription API reference

### 13.2 User Documentation

- **User Guide:** German + English versions
- **Video Tutorials:** Screen recordings for key workflows
- **Contextual Help:** In-app help tooltips and links
- **Calendar User Guide:** How to export calendars, subscribe in Outlook/Google Calendar

---

## 14. Monitoring Metrics

### 14.1 Performance Metrics

| Metric                              | Measurement Frequency | Alert Threshold |
| ----------------------------------- | --------------------- | --------------- |
| API Response Time (P95)             | Real-time             | > 2x target     |
| Error Rate                          | Real-time             | > 1%            |
| Database Query Time                 | Real-time             | > 1s            |
| Memory Usage                        | Every 5 minutes       | > 80%           |
| Disk Usage                          | Every hour            | > 85%           |
| **Calendar Event Aggregation Time** | Real-time             | > 3s            |
| **ICS Export Failures**             | Real-time             | > 5%            |

### 14.2 Business Metrics

- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **Task Completion Rate**
- **Offline Usage Rate**
- **Calendar Export Frequency**
- **Calendar Subscription Active Users**
- **Average Events per User per Month**

---

## 15. Version History

| Version | Date       | Author | Changes                                              |
| ------- | ---------- | ------ | ---------------------------------------------------- |
| 1.0     | 2025-01-28 | System | Initial NFR specification with calendar requirements |

---

**Approved By:** [Pending]  
**Review Cycle:** Quarterly  
**Next Review:** Q2 2025

---

**END OF NFR SPECIFICATION**
