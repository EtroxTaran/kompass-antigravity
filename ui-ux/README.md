# KOMPASS UI/UX Documentation

> **UI/UX documentation** for the KOMPASS CRM & Project Management application, referencing the canonical GitHub UI reference repository

## 📋 Overview

This directory contains **UI/UX documentation** organized into 8 categories, covering the complete UI/UX design system for KOMPASS. All UI patterns must reference and mirror the canonical GitHub UI reference repository: `EtroxTaran/Kompassuimusterbibliothek`.

**CRITICAL:** The GitHub UI reference repository is the **ONLY authoritative source** for UI patterns. Always check the reference repository before implementing any UI component.

### Key Features

- ✅ **shadcn/ui** and **RadixUI** component library exclusively
- ✅ **WCAG 2.1 AA** accessibility compliance
- ✅ **Mobile-first** responsive design
- ✅ **Offline-first** PWA patterns
- ✅ **RBAC** (5 roles: GF, PLAN, ADM, KALK, BUCH)
- ✅ **GoBD** compliance for financial records
- ✅ **German language** labels and content

---

## 📂 Directory Structure

```
ui-ux/
├── 00-updates/             # Migration and update documentation
│   └── MIGRATION-001-rich-text-editor-integration.md (reference)
├── 01-foundation/          # 5 prompts - Design system foundations
├── 02-core-components/     # 16 prompts - Reusable UI components (includes rich text editor)
├── 03-entity-forms/        # 8 prompts - Data entry forms (integrated with rich text editor)
├── 04-list-views/          # 7 prompts - Data tables and lists
├── 05-detail-pages/        # 6 prompts - 360° entity views
├── 06-dashboards/          # 5 prompts - Role-specific dashboards
├── 07-mobile/              # 6 prompts - Mobile-optimized (ADM)
├── 08-specialized/         # 8 prompts - Advanced patterns
└── README.md               # This file
```

**Total: UI/UX documentation files organized by category**

---

## 🚀 Quick Start

### 📚 Using GitHub UI Reference Repository

**The canonical source for all UI patterns is:** `EtroxTaran/Kompassuimusterbibliothek`

**Workflow for Implementing UI:**

1. **Check GitHub UI Reference Repository FIRST**
   - Use GitHub MCP to fetch files from `EtroxTaran/Kompassuimusterbibliothek`
   - Identify matching components/pages
   - Read component source code, layout structures, styling conventions

2. **Update Documentation**
   - Update relevant markdown files in `ui-ux/` directory
   - Document which reference files were used
   - Include exact specifications from reference

3. **Implement Code**
   - Mirror/adapt patterns from reference repository
   - Rebuild using our stack (React + shadcn/ui + Tailwind)
   - Match reference patterns precisely

**CRITICAL RULES:**

- **NO Figma MCP** - There is no Figma MCP involved
- **NO external references** - Only the GitHub UI reference repository
- **Complete reference** - If something seems missing, ask for clarification
- **Mirror patterns** - Everything must mirror, extend, or adapt from reference repo
- **No invention** - Do NOT invent new UI patterns unless explicitly requested

See `docs/design-system/github-ui-reference.md` for complete workflow documentation.

---

### How to Use This Documentation

1. **Check GitHub UI Reference** - Always fetch from `EtroxTaran/Kompassuimusterbibliothek` first
2. **Review Documentation** - Check relevant `.md` files in this directory for specifications
3. **Implement** - Build using shadcn/ui matching reference patterns
4. **Document** - Update documentation with reference source and adaptations

### Best Practices

- **Start with Foundation**: Begin with design tokens and grid system
- **Build Incrementally**: Core components → Forms → Pages → Dashboards
- **Use Context**: Reference existing components in subsequent prompts
- **Iterate**: Generate, review, refine, regenerate
- **Test Accessibility**: Verify WCAG 2.1 AA compliance
- **Mobile Preview**: Always check mobile responsiveness

### Documentation Structure

Each documentation file contains:

```markdown
# Component Name

## Context & Purpose

- Component type, user roles, usage context
- Reference source: Which file from EtroxTaran/Kompassuimusterbibliothek

## Design Specifications

- Visual hierarchy, components, interactions
- Exact specifications from reference repository

## Implementation Notes

- shadcn/ui components, technical details
- Adaptations made from reference
```

---

## 📚 Complete Prompt Index

### 01. Foundation (5 prompts)

Design system fundamentals and core patterns.

| #   | Prompt                   | Description                                         |
| --- | ------------------------ | --------------------------------------------------- |
| 1   | `design-tokens.md`       | Colors, typography, spacing, shadows, border-radius |
| 2   | `grid-system.md`         | Responsive grid, breakpoints, columns, gutters      |
| 3   | `navigation-patterns.md` | Sidebar, top nav, mobile menu, breadcrumbs          |
| 4   | `loading-states.md`      | Skeletons, spinners, progress bars                  |
| 5   | `error-empty-states.md`  | Error messages, toasts, empty states                |

### 02. Core Components (16 prompts)

Reusable UI building blocks using shadcn/ui.

| #   | Prompt                    | Description                                                                |
| --- | ------------------------- | -------------------------------------------------------------------------- |
| 6   | `form-inputs.md`          | Text, number, email, password, textarea, checkbox, radio, switch           |
| 7   | `buttons.md`              | Primary, secondary, ghost, destructive, link, icon buttons                 |
| 8   | `cards.md`                | Content cards with header, title, content, footer                          |
| 9   | `tables-datagrids.md`     | Data tables with sorting, filtering, pagination                            |
| 10  | `dialogs-modals.md`       | Confirmation, form, detail dialogs                                         |
| 11  | `toasts-notifications.md` | Success, error, warning, info toasts                                       |
| 12  | `badges-status.md`        | Status indicators, role badges, count badges                               |
| 13  | `tabs-accordions.md`      | Tabbed interfaces, collapsible sections                                    |
| 14  | `dropdowns-selects.md`    | Single select, multi-select, searchable                                    |
| 15  | `date-time-pickers.md`    | Calendar, date range, time picker                                          |
| 16  | `search-filters.md`       | Search input, filter panel, quick filters                                  |
| 17  | `pagination.md`           | Page navigation, previous/next, ellipsis                                   |
| 18  | `breadcrumbs.md`          | Navigation trail, current location                                         |
| 19  | `tooltips-popovers.md`    | Contextual help, hover/click popups                                        |
| 20  | `progress-indicators.md`  | Linear progress, circular spinners                                         |
| 21  | `rich-text-editor.md`     | WYSIWYG editor with toolbar, formatting, task lists, tables, accessibility |

### 03. Entity Forms (8 prompts)

Data entry forms for core business entities.

| #   | Prompt                      | Description                                                                               |
| --- | --------------------------- | ----------------------------------------------------------------------------------------- |
| 22  | `customer-form.md`          | Company name, VAT, email, billing address, DSGVO consent, internal notes (rich text)      |
| 23  | `location-form.md`          | Location name, type, delivery address, contacts, description (rich text)                  |
| 24  | `contact-form.md`           | Name, position, email, phone, decision authority, internal notes (rich text)              |
| 25  | `opportunity-form.md`       | Customer, value, stage, probability, close date, description (rich text with task lists)  |
| 26  | `project-form.md`           | Project name, dates, budget, team, description (rich text with tables), notes (rich text) |
| 27  | `invoice-form.md`           | Customer, items, totals, GoBD immutability, remarks (rich text, immutable)                |
| 28  | `activity-protocol-form.md` | Type, entity, date, description (rich text with voice-to-text), task lists                |
| 29  | `bulk-import-form.md`       | CSV upload, field mapping, validation, preview (imports rich text as plain text)          |

### 04. List Views (7 prompts)

Data tables and visualizations with RBAC filtering.

| #   | Prompt                    | Description                                           |
| --- | ------------------------- | ----------------------------------------------------- |
| 29  | `customer-list.md`        | Paginated customer table, RBAC filters (ADM sees own) |
| 30  | `location-list.md`        | Location table, nested under customer or global       |
| 31  | `contact-list.md`         | Contact list with decision authority badges           |
| 32  | `opportunity-pipeline.md` | Kanban board, drag-and-drop stages                    |
| 33  | `project-portfolio.md`    | Project table with status, budget, timeline           |
| 34  | `invoice-list.md`         | Invoice table with GoBD indicators                    |
| 35  | `activity-timeline.md`    | Chronological activity log with filters               |

### 05. Detail Pages (6 prompts)

360° entity views with tabbed sections.

| #   | Prompt                  | Description                                                      |
| --- | ----------------------- | ---------------------------------------------------------------- |
| 36  | `customer-detail.md`    | Tabs: Overview, Locations, Contacts, Opportunities, Projects     |
| 37  | `location-detail.md`    | Address, map, contacts, delivery info, linked projects           |
| 38  | `contact-detail.md`     | Contact info, decision authority, assigned locations, activities |
| 39  | `opportunity-detail.md` | Customer, value, probability, status flow, next steps            |
| 40  | `project-detail.md`     | Timeline, budget, team, milestones, time tracking                |
| 41  | `invoice-detail.md`     | Line items, calculations, payment tracking, GoBD compliance      |

### 06. Role-Specific Dashboards (5 prompts)

Tailored dashboards for each RBAC role.

| #   | Prompt              | Description                                                |
| --- | ------------------- | ---------------------------------------------------------- |
| 42  | `gf-dashboard.md`   | CEO: High-level KPIs, financial overview, team performance |
| 43  | `plan-dashboard.md` | Planning: Projects, Gantt chart, resource allocation       |
| 44  | `adm-dashboard.md`  | Sales Field: Own customers, map, route, mobile-first       |
| 45  | `kalk-dashboard.md` | Cost Estimator: Estimates, margin analysis, pricing tools  |
| 46  | `buch-dashboard.md` | Accountant: Cash flow, invoices, payments, GoBD compliance |

### 07. Mobile-Optimized (6 prompts)

Mobile-first components for ADM field sales.

| #   | Prompt                   | Description                                     |
| --- | ------------------------ | ----------------------------------------------- |
| 47  | `quick-activity-log.md`  | Voice-to-text, quick templates, offline queue   |
| 48  | `business-card-scan.md`  | Camera capture, OCR, auto-fill contact form     |
| 49  | `customer-quick-view.md` | Bottom sheet, quick contact, one-tap actions    |
| 50  | `map-route-planner.md`   | GPS tracking, multi-stop routing, navigation    |
| 51  | `offline-sync-status.md` | Sync queue, manual sync, conflict alerts        |
| 52  | `photo-documentation.md` | Multi-photo capture, annotation, entity linking |

### 08. Specialized Patterns (8 prompts)

Advanced UI patterns for security, compliance, and system management.

| #   | Prompt                          | Description                                             |
| --- | ------------------------------- | ------------------------------------------------------- |
| 53  | `rbac-permission-indicators.md` | Role badges, disabled actions, permission tooltips      |
| 54  | `conflict-resolution.md`        | Side-by-side comparison, merge options, auto-resolution |
| 55  | `audit-trail-viewer.md`         | Change history, field-level diffs, GoBD compliance      |
| 56  | `gobd-compliance-indicators.md` | Immutability status, hash verification, finalization    |
| 57  | `data-export-import.md`         | CSV/Excel export, field mapping, DATEV integration      |
| 58  | `system-settings.md`            | Account, appearance, notifications, sync, privacy       |
| 59  | `user-profile.md`               | User info, activity, stats, team, role badge            |
| 60  | `help-onboarding.md`            | Product tour, tooltips, help center, video tutorials    |

---

## 🎨 Design System

### shadcn/ui Components Used

This project exclusively uses **shadcn/ui** components built on **RadixUI** primitives:

```bash
# Install all required components
npx shadcn-ui@latest add button input form card table dialog sheet
npx shadcn-ui@latest add tabs accordion badge checkbox radio-group
npx shadcn-ui@latest add select dropdown-menu toast alert skeleton
npx shadcn-ui@latest add calendar popover tooltip progress avatar
npx shadcn-ui@latest add separator label textarea switch slider
```

### TipTap Rich Text Editor

```bash
# Core TipTap packages for rich text editing
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-underline
pnpm add @tiptap/extension-table @tiptap/extension-table-row
pnpm add @tiptap/extension-table-cell @tiptap/extension-table-header
```

Used in: Activity Protocols (meeting notes with voice-to-text), Project Descriptions (structured content with tables), Customer/Contact/Location Notes (internal notes), Opportunity Descriptions (with task lists), Invoice Remarks (GoBD immutable after finalization).

### Color Palette (German Market)

- **Primary**: Blue (#3B82F6) - Trust, professionalism
- **Success**: Green (#10B981) - Confirmation, positive actions
- **Warning**: Amber (#F59E0B) - Caution, attention needed
- **Error**: Red (#EF4444) - Errors, destructive actions
- **Info**: Blue (#3B82F6) - Information, neutral

### Typography

- **Headings**: Inter or System UI (German characters: äöüÄÖÜß)
- **Body**: Inter or System UI
- **Monospace**: JetBrains Mono or Fira Code (for codes, IDs)

### Accessibility (WCAG 2.1 AA)

All prompts include:

- ✅ Minimum contrast ratio 4.5:1
- ✅ Touch targets ≥ 44px
- ✅ ARIA labels for icons
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators

---

## 🔐 RBAC Roles

### 5 User Roles in KOMPASS

| Role                | Code | Description      | Data Access                      |
| ------------------- | ---- | ---------------- | -------------------------------- |
| **Geschäftsführer** | GF   | CEO, full access | ALL data, ALL actions            |
| **Planung**         | PLAN | Project planning | ALL customers, projects, reports |
| **Außendienst**     | ADM  | Sales field      | OWN customers, opportunities     |
| **Kalkulation**     | KALK | Cost estimation  | ALL projects (read), estimates   |
| **Buchhaltung**     | BUCH | Accounting       | ALL financial data, invoices     |

### RBAC in UI/UX

- **ADM**: Sees only own customers, edit own, read-only financial data
- **GF**: Full CRUD on all entities
- **PLAN**: Full CRUD on projects/tasks, read-only customers, limited other entities
- **INNEN**: Full CRUD on customers/opportunities/offers
- **BUCH**: Full access to invoices, payments, financial reports
- **KALK**: Read-only projects, create/edit estimates
- Visual indicators: Role badges, disabled actions, permission tooltips

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (iOS/Android)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach

1. Design for mobile (320px - 768px)
2. Enhance for tablet (768px - 1024px)
3. Optimize for desktop (> 1024px)

### PWA Considerations

- ✅ Offline-first architecture
- ✅ Add to home screen
- ✅ Push notifications
- ✅ Background sync
- ✅ Service workers

---

## 🔒 GoBD Compliance

### Financial Records Immutability

- **Invoices**: Immutable after finalization (lock icon)
- **Hash**: SHA-256 integrity verification
- **Audit Trail**: Complete change log
- **Retention**: 10 years (German law)
- **DATEV Export**: GoBD-compliant format

### UI Indicators

- 🔒 Lock icon: Finalized, immutable
- 🛡️ Shield icon: GoBD-compliant
- ⚠️ Warning: Post-finalization correction (GF only)
- ✅ Checkmark: Hash verified

---

## 🌍 Internationalization (i18n)

### MVP: German Only

- All labels, messages, tooltips in German
- Date format: `DD.MM.YYYY`
- Currency: `€` (Euro)
- Number format: `1.234,56` (German)

### Future: i18n-Ready

Architecture supports future localization:

- React i18next integration
- Language switcher (Settings)
- RTL support (if needed)

---

## 📊 Data Entities

### Core Entities

1. **Customer**: Company, VAT, billing address, DSGVO consent
2. **Location**: Delivery address, contact persons, opening hours
3. **Contact**: Name, position, email, phone, decision authority
4. **Opportunity**: Value, probability, status, customer, close date
5. **Project**: Timeline, budget, team, milestones, GoBD ID
6. **Invoice**: Line items, totals, GoBD compliance, hash
7. **Activity/Protocol**: Type, entity, date, description, voice-to-text

### Relationships

- Customer → Locations (1:N)
- Customer → Contacts (1:N)
- Customer → Opportunities (1:N)
- Opportunity → Project (1:1, if won)
- Project → Invoices (1:N)
- All entities → Activities (1:N)

---

## 🛠️ Technical Stack

### Frontend

- **Framework**: React 18+ (TypeScript)
- **Build**: Vite
- **UI**: shadcn/ui + RadixUI
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit / Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: CouchDB (offline-first)
- **Auth**: Keycloak (OIDC)
- **Search**: MeiliSearch
- **Automation**: n8n

### Offline

- **Local DB**: PouchDB
- **Sync**: PouchDB ↔ CouchDB replication
- **Conflict**: Manual resolution UI
- **Storage**: 50 MB limit (iOS consideration)

---

## 📖 References

### Documentation

- [Product Vision](../docs/product-vision/Produktvision für Projekt KOMPASS (Nordstern-Direktive).md)
- [Architecture](../docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md)
- [Data Model](../docs/reviews/DATA_MODEL_SPECIFICATION.md)
- [API Specification](../docs/reviews/API_SPECIFICATION.md)
- [RBAC Matrix](../docs/reviews/RBAC_PERMISSION_MATRIX.md)
- [NFR Specification](../docs/reviews/NFR_SPECIFICATION.md)
- [Test Strategy](../docs/reviews/TEST_STRATEGY_DOCUMENT.md)

### External Resources

- **shadcn/ui**: https://ui.shadcn.com/
- **shadcraft.com**: https://shadcraft.com/ (components, blocks, templates)
- **RadixUI**: https://www.radix-ui.com/
- **GitHub UI Reference**: https://github.com/EtroxTaran/Kompassuimusterbibliothek
- **GitHub UI Reference Documentation**: `../docs/design-system/github-ui-reference.md`
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 🚦 Usage Workflow

### Recommended Order

1. **Foundation** (01-foundation): Start here
   - Design tokens → Grid → Navigation → Loading/Error states

2. **Core Components** (02-core-components): Build UI library
   - Inputs → Buttons → Cards → Tables → Dialogs → etc.

3. **Entity Forms** (03-entity-forms): Data entry
   - Customer → Location → Contact → Opportunity → etc.

4. **List Views** (04-list-views): Data display
   - Customer list → Opportunity pipeline → Project portfolio

5. **Detail Pages** (05-detail-pages): 360° views
   - Customer detail → Project detail → Invoice detail

6. **Dashboards** (06-dashboards): Role-specific
   - GF dashboard → ADM dashboard → BUCH dashboard

7. **Mobile** (07-mobile): Field sales optimization
   - Quick activity log → Business card scan → Map/route planner

8. **Specialized** (08-specialized): Advanced patterns
   - RBAC indicators → Conflict resolution → GoBD compliance

### Implementation Strategy

1. **Fetch Reference**: Use GitHub MCP to get patterns from `EtroxTaran/Kompassuimusterbibliothek`
2. **Review**: Check reference patterns against requirements
3. **Document**: Update documentation with reference source
4. **Implement**: Build using shadcn/ui matching reference patterns
5. **Validate**: WCAG, mobile, RBAC, GoBD compliance

---

## ✅ Quality Checklist

### Before Finalizing Designs

- [ ] Uses shadcn/ui components exclusively
- [ ] German labels and content (MVP)
- [ ] WCAG 2.1 AA compliant
- [ ] Mobile-first responsive
- [ ] RBAC role indicators visible
- [ ] GoBD compliance (if financial)
- [ ] Offline-first patterns (if applicable)
- [ ] Loading and error states
- [ ] Empty states
- [ ] Keyboard navigation
- [ ] Touch targets ≥ 44px
- [ ] Consistent with design tokens

---

## 📞 Support

### Questions or Issues?

- **Project Documentation**: `../docs/`
- **Development Team**: Contact via Linear
- **UI/UX Review**: Submit to PLAN or GF

---

## 📅 Version

- **Created**: November 2024
- **Last Updated**: January 27, 2025
- **Version**: 2.0.0
- **UI Reference**: GitHub repository `EtroxTaran/Kompassuimusterbibliothek`
- **Status**: ✅ Complete (migrated to GitHub UI reference repository)

---

## 🎯 Success Metrics

### Expected Outcomes

- **Design Consistency**: All screens follow design system
- **Reference-Based Development**: Consistent patterns from canonical source
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Developer Handoff**: Clear component specifications
- **User Testing**: Designs ready for validation

---

**Built for KOMPASS** - Integrated CRM & Project Management Tool  
**UI Reference**: `EtroxTaran/Kompassuimusterbibliothek` (GitHub)  
**Powered by**: shadcn/ui, RadixUI, Tailwind CSS
