# KOMPASS Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-01-27

### Breaking Changes 🚨

#### Customer Entity Schema Change

- **BREAKING**: Renamed `address` field to `billingAddress` in Customer entity
- **Migration Required**: Run `scripts/migrations/001-customer-address-to-billing-address.ts`
- **Impact**: All code referencing `customer.address` must be updated to `customer.billingAddress`

### Added ✨

#### Location Management (Phase 1)

- New `Location` entity for managing multiple delivery addresses per customer
- Location types: headquarter, branch, warehouse, project_site, other
- Nested REST API: `/api/v1/customers/{customerId}/locations`
- Location CRUD with RBAC permissions
- Location-specific operational details (delivery notes, opening hours, parking)
- Frontend components: `LocationForm`, `LocationCard`, `LocationList`

#### Contact Decision-Making Roles (Phase 1)

- Enhanced `ContactPerson` entity with decision-making capabilities
- Decision roles: decision_maker, key_influencer, recommender, gatekeeper, operational_contact, informational
- Authority levels: low, medium, high, final_authority
- Approval limits for order approvals (€0 - €10M)
- Functional roles: owner_ceo, purchasing_manager, facility_manager, etc.
- Department influence tracking
- Location assignment for contacts
- API endpoints: `/api/v1/contacts/{contactId}/decision-authority` (RESTRICTED to PLAN/GF)
- Frontend components: `ContactDecisionBadge`, `DecisionAuthorityCard`, `DecisionAuthorityForm`

#### Customer Entity Enhancements

- Added `locations: string[]` - array of Location IDs
- Added `defaultDeliveryLocationId: string` - default delivery location
- Added `contactPersons: string[]` - array of Contact IDs
- Added `customerBusinessType` enum field

#### New Enums

- `DecisionMakingRole`: Decision-making roles in purchasing process
- `FunctionalRole`: Functional responsibilities
- `AuthorityLevel`: Authority level type
- `LocationType`: Physical location types
- `CustomerType`: Customer lifecycle status
- `CustomerBusinessType`: Type of customer business

#### AI & Automation Groundwork (Phase 2.x Prep)

- Feature flags for AI extensions (`AI_RAG_ENABLED`, `AI_N8N_ENABLED`, `AI_ML_ENABLED`)
- Stub services: `RagService`, `N8nService`, `ForecastingService`
- Updated `.env.example` with AI configuration options
- Feature flag management in `packages/shared/src/constants/feature-flags.ts`

#### Database Migrations

- Migration script: Customer address → billingAddress
- Migration script: Add Contact decision fields with intelligent inference
- Migration script: Create CouchDB views and indexes
- Validation script: Verify data model compliance

#### Documentation & Rules

- New rule: `.cursor/rules/nested-resources.mdc` - Nested REST API patterns
- Updated `.cursor/rules/domain-model.mdc` - Location and Contact validation rules
- Updated API specification with Location and Contact endpoints
- Updated RBAC permission matrix with new permissions

### Changed 📝

#### Customer Entity

- `address` → `billingAddress` (BREAKING)
- `customerType` now uses `CustomerType` enum (previously string union)
- `rating` now uses `CustomerRating` type

#### RBAC Permissions

- Added `Location.CREATE`, `Location.READ`, `Location.UPDATE`, `Location.DELETE` permissions
- Added `Location.VIEW_ALL`, `Location.VIEW_ASSIGNED` record-level permissions
- Added `Contact.UPDATE_DECISION_ROLE` (RESTRICTED: PLAN/GF only)
- Added `Contact.VIEW_AUTHORITY_LEVELS` permission

### Migration Guide

#### For Existing Installations

1. **Backup Database**

   ```bash
   # Backup CouchDB before migration
   curl -X GET http://localhost:5984/kompass/_all_docs?include_docs=true > backup.json
   ```

2. **Run Migrations (Dry Run First)**

   ```bash
   # Test customer migration
   node scripts/migrations/001-customer-address-to-billing-address.ts --dry-run

   # Execute customer migration
   node scripts/migrations/001-customer-address-to-billing-address.ts --execute

   # Test contact migration
   node scripts/migrations/003-add-contact-decision-fields.ts --dry-run

   # Execute contact migration
   node scripts/migrations/003-add-contact-decision-fields.ts --execute

   # Create CouchDB views
   node scripts/migrations/002-create-couchdb-views.ts
   ```

3. **Validate Data Model**

   ```bash
   node scripts/validate-data-model.ts
   ```

4. **Review Generated Reports**
   - Check `contact-migration-report.csv` for assigned decision roles
   - Manually adjust roles if needed via UI (PLAN/GF users)

5. **Update Environment Variables**

   ```bash
   # Add AI feature flags to .env
   AI_RAG_ENABLED=false
   AI_N8N_ENABLED=false
   AI_ML_ENABLED=false
   ```

6. **Update Application Code**
   - Replace all `customer.address` with `customer.billingAddress`
   - Update API clients to use new Customer response shape
   - Test thoroughly before deploying to production

### Deprecations ⚠️

- `customer.address` field is deprecated and will be removed in next major version
- Use `customer.billingAddress` instead

### Roadmap 🗺️

#### Phase 2.1: RAG Implementation (Q2 2025)

- LlamaIndex integration for document intelligence
- Weaviate vector database for semantic search
- Customer insights and document Q&A

#### Phase 2.2: n8n Automation (Q2 2025)

- Intelligent workflow automation
- Email/Slack notifications
- Third-party integrations

#### Phase 2.3: ML Predictive Analytics (Q3 2025)

- Opportunity win probability prediction
- Cash flow forecasting
- Customer churn prediction

## References

- Full documentation: `docs/README.md`
- Data model: `docs/specifications/data-model.md`
- API specification: `docs/reviews/API_SPECIFICATION.md`
- RBAC matrix: `docs/reviews/RBAC_PERMISSION_MATRIX.md`
