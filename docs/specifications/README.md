# Technical Specifications

**Last Updated:** 2025-01-28  
**Owner:** Engineering & Architecture Team

This directory contains all technical specifications and requirements for the KOMPASS project.

---

## Core Specifications

### System Architecture & Design

- **[Data Model](./data-model.md)** - Complete entity definitions, validation rules, and relationships
- **[API Specification](./api-specification.md)** - REST API documentation (OpenAPI 3.0)
- **[RBAC Permissions](./rbac-permissions.md)** - Role-based access control matrix
- **[Test Strategy](./test-strategy.md)** - Testing approach, coverage, and automation

### Performance & Quality

- **[Non-Functional Requirements](./nfr-specification.md)** - Performance, scalability, availability
- **[Conflict Resolution](../../ui-ux/08-specialized/conflict-resolution.md)** - Offline sync conflict handling

### Integration & Data Flow

- **[AI Data Requirements](./AI_DATA_REQUIREMENTS.md)** - AI/ML data specifications
- **[Financial Data Flow](./FINANCIAL_DATA_FLOW.md)** - Financial system integration
- **[Import/Export Specification](./IMPORT_EXPORT_SPECIFICATION.md)** - Data import/export formats
- **[Lexware Integration](./LEXWARE_INTEGRATION_SPECIFICATION.md)** - Accounting system integration
- **[Offline PWA Data Strategy](./OFFLINE_PWA_DATA_STRATEGY.md)** - Offline-first data management

### Domain-Specific Specs

- **[Material Inventory Management](./MATERIAL_INVENTORY_MANAGEMENT_SPEC.md)** - Inventory tracking
- **[Supplier & Subcontractor Management](./SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md)** - Vendor management

---

## Status Legend

- ✅ **Finalized** - Complete and approved for implementation
- 🔄 **In Review** - Under review and refinement
- 📝 **Draft** - Initial draft, work in progress
- ⚠️ **Needs Update** - Requires updates based on recent changes

---

## Document Maintenance

### Ownership

- **Core Specifications** (Data Model, API, RBAC, Test Strategy): Architecture Team
- **Integration Specifications**: Integration Team
- **Domain Specifications**: Product Team + Domain Experts

### Update Process

1. Create Linear issue for specification changes
2. Update specification document
3. Review with stakeholders
4. Update status and cross-references
5. Notify dependent teams

### Cross-References

All specifications are cross-linked to maintain consistency:

- Changes to Data Model → Update API Specification
- Changes to RBAC → Update Test Strategy
- Changes to Integrations → Update NFR Specification

---

## Related Documentation

- **[Architecture Documentation](../architecture/README.md)** - System architecture and technical decisions
- **[Implementation Reports](../implementation/README.md)** - Implementation progress and status
- **[Product Vision](../product-vision/README.md)** - Business requirements and vision

Last updated: 2025-01-28
