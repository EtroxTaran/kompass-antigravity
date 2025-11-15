# Lexware Integration Specification

**Version:** 1.0  
**Date:** 2025-01-28  
**Status:** Phase 2+ (Optional)  
**Priority:** Low (Nice to have)

---

## Overview

This document specifies the **optional** Lexware integration for KOMPASS. This is a **Phase 2+** feature that is NOT part of the MVP.

**Important:** KOMPASS does NOT create invoices. Lexware is the authoritative system for invoicing. KOMPASS only provides **read-only** access to invoice status for project tracking purposes.

---

## Business Requirements

### Phase 1 (MVP): No Integration

**Current State:**

- Buchhaltung creates invoices manually in Lexware
- No automated data exchange between KOMPASS and Lexware
- Manual workflow: Project data → Manual entry in Lexware → Invoice creation

**Rationale:**

- Invoicing is complex and legally regulated
- Lexware is already in place and working
- Focus MVP on core CRM/PM features
- Avoid legal compliance risks with custom invoicing

### Phase 2+ (Optional): Read-Only Integration

**Goal:**  
Provide visibility of invoice status within KOMPASS for project tracking, without creating invoices in KOMPASS.

**Use Cases:**

1. **Project Manager (PLAN):** See if project invoices have been sent/paid
2. **Geschäftsführung (GF):** Dashboard shows payment status across all projects
3. **Außendienst (ADM):** Check if customer has paid (for collections follow-up)

**Out of Scope:**

- Invoice creation in KOMPASS
- Invoice editing in KOMPASS
- Payment booking in KOMPASS
- Mahnwesen (dunning) in KOMPASS
- Any write operations to Lexware

---

## Technical Architecture

### Integration Type

**Read-Only REST API Integration**

- KOMPASS → Lexware (read only)
- Lexware remains authoritative system
- No write operations from KOMPASS

### API Endpoints Required

#### 1. Get Invoice Status

```http
GET /api/v1/lexware/invoices/{invoiceId}/status
```

**Response:**

```json
{
  "invoiceId": "R-2024-00123",
  "customerId": "customer-abc123",
  "projectReference": "P-2025-M001",
  "invoiceDate": "2025-01-15",
  "dueDate": "2025-02-14",
  "totalAmount": 25000.0,
  "currency": "EUR",
  "status": "paid",
  "paidDate": "2025-02-10",
  "paidAmount": 25000.0
}
```

**Status Values:**

- `draft` - Invoice created but not sent
- `sent` - Invoice sent to customer
- `partial_paid` - Partially paid
- `paid` - Fully paid
- `overdue` - Past due date, not paid
- `cancelled` - Invoice cancelled

#### 2. List Invoices for Project

```http
GET /api/v1/projects/{projectId}/lexware-invoices
```

**Response:**

```json
{
  "projectId": "P-2025-M001",
  "invoices": [
    {
      "invoiceId": "R-2024-00120",
      "type": "deposit",
      "amount": 50000.0,
      "status": "paid",
      "dueDate": "2024-12-15",
      "paidDate": "2024-12-10"
    },
    {
      "invoiceId": "R-2025-00015",
      "type": "progress",
      "amount": 50000.0,
      "status": "sent",
      "dueDate": "2025-02-01",
      "paidDate": null
    },
    {
      "invoiceId": "R-2025-00045",
      "type": "final",
      "amount": 25000.0,
      "status": "draft",
      "dueDate": "2025-03-15",
      "paidDate": null
    }
  ],
  "summary": {
    "totalInvoiced": 125000.0,
    "totalPaid": 50000.0,
    "totalOutstanding": 75000.0
  }
}
```

---

## Data Flow

### Sync Strategy

**Pull-Based Sync (KOMPASS initiates):**

1. KOMPASS sends request to Lexware API
2. Lexware returns invoice data
3. KOMPASS caches data temporarily (5 minutes TTL)
4. KOMPASS displays data in UI

**Sync Frequency:**

- Manual: User clicks "Refresh" button
- Automatic: Every 5 minutes for active project views
- On-demand: When project detail page is opened

**No Push Operations:**

- KOMPASS never writes to Lexware
- Lexware is always authoritative

---

## UI Integration

### Project Detail Page

**Invoice Status Widget:**

```
┌─────────────────────────────────────────┐
│ 💰 Rechnungen (Lexware)                │
├─────────────────────────────────────────┤
│ Anzahlung (R-2024-00120)                │
│ ✓ Bezahlt am 10.12.2024    € 50.000    │
│                                          │
│ Abschlag (R-2025-00015)                 │
│ ⏳ Fällig am 01.02.2025    € 50.000     │
│                                          │
│ Schlussrechnung (R-2025-00045)          │
│ 📝 Entwurf                  € 25.000    │
│                                          │
│ Gesamt: € 125.000 | Bezahlt: € 50.000  │
│ Offen: € 75.000                         │
│                                          │
│ [Zu Lexware] (external link)            │
└─────────────────────────────────────────┘
```

**Status Icons:**

- ✓ Paid (green checkmark)
- ⏳ Sent, waiting for payment (blue clock)
- 📝 Draft (gray document)
- ⚠️ Overdue (red warning)

### Dashboard Widgets

**BUCH Dashboard:**

- Optional widget: "Lexware-Status"
- Shows connection status
- Last sync timestamp
- Quick link to Lexware

**GF Dashboard:**

- Financial summary includes Lexware data (if connected)
- "Outstanding Invoices" from Lexware (read-only)

---

## Authentication & Security

### API Authentication

**Lexware API Credentials:**

- **Client ID:** Stored in environment variables
- **Client Secret:** Stored in environment variables
- **OAuth 2.0:** Authorization Code flow
- **Scopes:** `invoices:read` (read-only)

**Security Requirements:**

- Credentials stored encrypted in backend only
- Never exposed to frontend
- HTTPS required for all API calls
- Token refresh handled automatically

### RBAC Integration

**Who can see Lexware data:**

- **BUCH:** Full access to all invoice data
- **GF:** Full access to all invoice data
- **PLAN:** Read access to project-related invoices only
- **ADM:** Read access to own customers' invoice status (paid/unpaid only, no amounts)
- **INNEN:** Read access to project-related invoice status

---

## Error Handling

### Connection Errors

**If Lexware API is unreachable:**

- Show warning: "⚠️ Lexware-Verbindung fehlgeschlagen. Rechnungsdaten sind möglicherweise nicht aktuell."
- Cache last successful response (up to 24 hours)
- Retry after 15 minutes
- Alert ADMIN via email after 3 failed attempts

### Data Inconsistencies

**If project reference mismatch:**

- Log warning in system log
- Show in UI: "⚠️ Rechnungszuordnung unklar - Bitte in Lexware prüfen"
- Provide link to Lexware for manual verification

---

## Performance Requirements

- **API Response Time:** P95 < 1 second
- **Cache Duration:** 5 minutes for active projects
- **Retry Strategy:** 3 retries with exponential backoff (1s, 2s, 4s)
- **Timeout:** 10 seconds per API call
- **Rate Limiting:** Max 60 requests/minute (1 per second)

---

## Implementation Phases

### Phase 1 (MVP): No Integration

- **Timeline:** Months 1-4
- **Status:** KOMPASS launched without Lexware integration
- **Workflow:** Manual invoicing in Lexware
- **Cost:** €0 (no implementation)

### Phase 2 (Optional): Read-Only Integration

- **Timeline:** Months 6-9 (after MVP validation)
- **Effort:** 3-4 weeks development + 1 week testing
- **Cost Estimate:** €10,000 - €15,000
- **Dependencies:**
  - Lexware API access confirmed
  - Customer approval for API usage
  - Budget approval from GF

### Phase 3 (Future): Enhanced Integration

- **Potential Features:**
  - Automated project-to-invoice data export
  - Payment notifications via webhook
  - Real-time sync (websockets)
- **Timeline:** Post Phase 2, based on user feedback
- **Cost Estimate:** €20,000 - €30,000

---

## Lexware API Research

### Lexware REST API Availability

**Supported Lexware Products:**

- Lexware office (Yes, REST API available)
- Lexware professional (Yes, REST API available)
- Lexware financial office (Limited API)

**API Documentation:**

- URL: https://developer.lexware.de/
- Authentication: OAuth 2.0
- Rate Limits: 60 requests/minute
- Endpoints: Customers, Invoices, Payments

**Customer Setup Required:**

- API access must be enabled in Lexware
- OAuth credentials must be generated
- Webhooks available for payment notifications (Phase 3)

---

## Testing Strategy

### Integration Tests

**Phase 2 Testing:**

1. **API Connection Test:** Verify OAuth flow works
2. **Invoice Retrieval Test:** Fetch invoice by ID
3. **Project Invoice List Test:** Fetch all invoices for project
4. **Error Handling Test:** Simulate API downtime
5. **Cache Test:** Verify 5-minute caching works
6. **Permission Test:** Verify RBAC restrictions apply

### Manual Acceptance Testing

**Test Scenarios:**

1. Create invoice in Lexware → Verify appears in KOMPASS project view (5 min delay)
2. Mark invoice as paid in Lexware → Verify status updates in KOMPASS
3. Disconnect Lexware API → Verify graceful fallback to cached data
4. As ADM user → Verify can only see paid/unpaid status (no amounts)
5. As PLAN user → Verify can see project-related invoices only

---

## Rollback Plan

**If Lexware integration fails:**

- Feature flag: `ENABLE_LEXWARE_INTEGRATION=false`
- Gracefully hide Lexware widgets from UI
- System continues to work without Lexware data
- No impact on core KOMPASS functionality

---

## Alternatives Considered

### Alternative 1: CSV Export/Import

- **Pros:** Simple, no API dependency
- **Cons:** Manual work, no real-time data
- **Decision:** Not sufficient for Phase 2 goals

### Alternative 2: DATEV Format Export

- **Pros:** Standard accounting format
- **Cons:** No read-back capability, manual process
- **Decision:** Useful supplement, but not replacement for API

### Alternative 3: Build Custom Invoice System

- **Pros:** Full control, tight integration
- **Cons:** High development cost (€50k+), legal compliance risks, GoBD complexity
- **Decision:** Rejected - Lexware is already in place and compliant

---

## Compliance Considerations

### DSGVO

- Lexware data may contain personal information (customer names, addresses)
- KOMPASS must handle this data per DSGVO regulations
- Data Processing Agreement (DPA) required between KOMPASS and Lexware
- Customer consent may be required for data sharing

### GoBD

- KOMPASS does not create GoBD-relevant financial documents (Lexware does)
- KOMPASS displays read-only data from Lexware
- No GoBD archiving requirements in KOMPASS for invoice data
- Contract documents in KOMPASS are GoBD-relevant (separate from invoices)

---

## Documentation References

- **Product Vision:** `docs/product-vision/Produktvision Finanz- und Compliance-Management.md`
- **API Specification:** `docs/specifications/reviews/API_SPECIFICATION.md` - Section 8: Lexware Integration
- **NFR Specification:** `docs/specifications/reviews/NFR_SPECIFICATION.md` - Performance requirements
- **Data Model:** `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Offer/Contract entities

---

## Decision Log

| Date       | Decision                                 | Rationale                                                       |
| ---------- | ---------------------------------------- | --------------------------------------------------------------- |
| 2025-01-28 | Lexware integration deferred to Phase 2+ | MVP focus on core CRM/PM, avoid invoice creation complexity     |
| 2025-01-28 | Read-only integration only               | Lexware is authoritative for invoicing, reduces compliance risk |
| 2025-01-28 | Optional feature flag                    | Customer may not have Lexware API access, must work without it  |

---

## Open Questions

1. **Lexware API Access:** Does customer's Lexware license include API access?
2. **OAuth Setup:** Who will generate OAuth credentials (customer or us)?
3. **Project Reference Mapping:** How to map KOMPASS projects to Lexware invoices? (Free-text field in Lexware?)
4. **Budget Approval:** €10-15k integration cost approved by GF?
5. **Timeline:** When should this be implemented (after MVP validation)?

---

## Success Criteria

**Phase 2 integration is successful if:**

- [ ] Project detail page shows invoice status from Lexware
- [ ] Dashboard displays payment status accurately
- [ ] Data syncs within 5 minutes
- [ ] System gracefully handles Lexware API downtime
- [ ] RBAC permissions are enforced correctly
- [ ] No manual work required after initial setup
- [ ] Buchhaltung confirms integration is "helpful" (4+/5 rating)
- [ ] GF confirms financial visibility is improved

---

## Contact

**Lexware Support:** https://www.lexware.de/support  
**Lexware Developer Portal:** https://developer.lexware.de/

---

**Prepared By:** Product & Engineering Team  
**Approval Required:** GF, Buchhaltung (for Phase 2 implementation)
