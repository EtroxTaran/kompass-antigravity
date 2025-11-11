# KOMPASS UI/UX Design Prompts for Figma Make

> **60 comprehensive Figma Make prompts** for designing the KOMPASS CRM & Project Management application

## 📋 Overview

This directory contains **60 ready-to-use Figma Make prompts** organized into 8 categories, covering the complete UI/UX design system for KOMPASS. Each prompt follows best practices for Figma Make generation and is tailored to the German market (MVP language: German).

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
├── 01-foundation/          # 5 prompts - Design system foundations
├── 02-core-components/     # 15 prompts - Reusable UI components
├── 03-entity-forms/        # 8 prompts - Data entry forms
├── 04-list-views/          # 7 prompts - Data tables and lists
├── 05-detail-pages/        # 6 prompts - 360° entity views
├── 06-dashboards/          # 5 prompts - Role-specific dashboards
├── 07-mobile/              # 6 prompts - Mobile-optimized (ADM)
├── 08-specialized/         # 8 prompts - Advanced patterns
└── README.md               # This file
```

**Total: 60 Figma Make prompts**

---

## 🚀 Quick Start

### How to Use These Prompts with Figma Make

1. **Open Figma** and create a new file or page
2. **Access Figma Make**: Click "Make with AI" or use the prompt input
3. **Copy a prompt** from the `.md` files in this directory
4. **Paste and generate**: Figma Make will create the design
5. **Iterate**: Refine the prompt or adjust the generated design
6. **Apply theme**: Use `shadcn/ui` color tokens and design system

### Best Practices

- **Start with Foundation**: Begin with design tokens and grid system
- **Build Incrementally**: Core components → Forms → Pages → Dashboards
- **Use Context**: Reference existing components in subsequent prompts
- **Iterate**: Generate, review, refine, regenerate
- **Test Accessibility**: Verify WCAG 2.1 AA compliance
- **Mobile Preview**: Always check mobile responsiveness

### Prompt Template Structure

Each prompt file contains:
```markdown
# Component Name - Figma Make Prompt

## Context & Purpose
- Component type, user roles, usage context

## Figma Make Prompt
[Detailed, structured prompt for Figma Make]

## Design Requirements
- Visual hierarchy, components, interactions

## Implementation Notes
- shadcn/ui components, technical details
```

---

## 📚 Complete Prompt Index

### 01. Foundation (5 prompts)
Design system fundamentals and core patterns.

| # | Prompt | Description |
|---|--------|-------------|
| 1 | `design-tokens.md` | Colors, typography, spacing, shadows, border-radius |
| 2 | `grid-system.md` | Responsive grid, breakpoints, columns, gutters |
| 3 | `navigation-patterns.md` | Sidebar, top nav, mobile menu, breadcrumbs |
| 4 | `loading-states.md` | Skeletons, spinners, progress bars |
| 5 | `error-empty-states.md` | Error messages, toasts, empty states |

### 02. Core Components (15 prompts)
Reusable UI building blocks using shadcn/ui.

| # | Prompt | Description |
|---|--------|-------------|
| 6 | `form-inputs.md` | Text, number, email, password, textarea, checkbox, radio, switch |
| 7 | `buttons.md` | Primary, secondary, ghost, destructive, link, icon buttons |
| 8 | `cards.md` | Content cards with header, title, content, footer |
| 9 | `tables-datagrids.md` | Data tables with sorting, filtering, pagination |
| 10 | `dialogs-modals.md` | Confirmation, form, detail dialogs |
| 11 | `toasts-notifications.md` | Success, error, warning, info toasts |
| 12 | `badges-status.md` | Status indicators, role badges, count badges |
| 13 | `tabs-accordions.md` | Tabbed interfaces, collapsible sections |
| 14 | `dropdowns-selects.md` | Single select, multi-select, searchable |
| 15 | `date-time-pickers.md` | Calendar, date range, time picker |
| 16 | `search-filters.md` | Search input, filter panel, quick filters |
| 17 | `pagination.md` | Page navigation, previous/next, ellipsis |
| 18 | `breadcrumbs.md` | Navigation trail, current location |
| 19 | `tooltips-popovers.md` | Contextual help, hover/click popups |
| 20 | `progress-indicators.md` | Linear progress, circular spinners |

### 03. Entity Forms (8 prompts)
Data entry forms for core business entities.

| # | Prompt | Description |
|---|--------|-------------|
| 21 | `customer-form.md` | Company name, VAT, email, billing address, DSGVO consent |
| 22 | `location-form.md` | Location name, type, delivery address, contacts |
| 23 | `contact-form.md` | Name, position, email, phone, decision authority |
| 24 | `opportunity-form.md` | Customer, value, stage, probability, close date |
| 25 | `project-form.md` | Project name, dates, budget, team, description |
| 26 | `invoice-form.md` | Customer, items, totals, GoBD immutability |
| 27 | `activity-protocol-form.md` | Type, entity, date, description, voice-to-text |
| 28 | `bulk-import-form.md` | CSV upload, field mapping, validation, preview |

### 04. List Views (7 prompts)
Data tables and visualizations with RBAC filtering.

| # | Prompt | Description |
|---|--------|-------------|
| 29 | `customer-list.md` | Paginated customer table, RBAC filters (ADM sees own) |
| 30 | `location-list.md` | Location table, nested under customer or global |
| 31 | `contact-list.md` | Contact list with decision authority badges |
| 32 | `opportunity-pipeline.md` | Kanban board, drag-and-drop stages |
| 33 | `project-portfolio.md` | Project table with status, budget, timeline |
| 34 | `invoice-list.md` | Invoice table with GoBD indicators |
| 35 | `activity-timeline.md` | Chronological activity log with filters |

### 05. Detail Pages (6 prompts)
360° entity views with tabbed sections.

| # | Prompt | Description |
|---|--------|-------------|
| 36 | `customer-detail.md` | Tabs: Overview, Locations, Contacts, Opportunities, Projects |
| 37 | `location-detail.md` | Address, map, contacts, delivery info, linked projects |
| 38 | `contact-detail.md` | Contact info, decision authority, assigned locations, activities |
| 39 | `opportunity-detail.md` | Customer, value, probability, status flow, next steps |
| 40 | `project-detail.md` | Timeline, budget, team, milestones, time tracking |
| 41 | `invoice-detail.md` | Line items, calculations, payment tracking, GoBD compliance |

### 06. Role-Specific Dashboards (5 prompts)
Tailored dashboards for each RBAC role.

| # | Prompt | Description |
|---|--------|-------------|
| 42 | `gf-dashboard.md` | CEO: High-level KPIs, financial overview, team performance |
| 43 | `plan-dashboard.md` | Planning: Projects, Gantt chart, resource allocation |
| 44 | `adm-dashboard.md` | Sales Field: Own customers, map, route, mobile-first |
| 45 | `kalk-dashboard.md` | Cost Estimator: Estimates, margin analysis, pricing tools |
| 46 | `buch-dashboard.md` | Accountant: Cash flow, invoices, payments, GoBD compliance |

### 07. Mobile-Optimized (6 prompts)
Mobile-first components for ADM field sales.

| # | Prompt | Description |
|---|--------|-------------|
| 47 | `quick-activity-log.md` | Voice-to-text, quick templates, offline queue |
| 48 | `business-card-scan.md` | Camera capture, OCR, auto-fill contact form |
| 49 | `customer-quick-view.md` | Bottom sheet, quick contact, one-tap actions |
| 50 | `map-route-planner.md` | GPS tracking, multi-stop routing, navigation |
| 51 | `offline-sync-status.md` | Sync queue, manual sync, conflict alerts |
| 52 | `photo-documentation.md` | Multi-photo capture, annotation, entity linking |

### 08. Specialized Patterns (8 prompts)
Advanced UI patterns for security, compliance, and system management.

| # | Prompt | Description |
|---|--------|-------------|
| 53 | `rbac-permission-indicators.md` | Role badges, disabled actions, permission tooltips |
| 54 | `conflict-resolution.md` | Side-by-side comparison, merge options, auto-resolution |
| 55 | `audit-trail-viewer.md` | Change history, field-level diffs, GoBD compliance |
| 56 | `gobd-compliance-indicators.md` | Immutability status, hash verification, finalization |
| 57 | `data-export-import.md` | CSV/Excel export, field mapping, DATEV integration |
| 58 | `system-settings.md` | Account, appearance, notifications, sync, privacy |
| 59 | `user-profile.md` | User info, activity, stats, team, role badge |
| 60 | `help-onboarding.md` | Product tour, tooltips, help center, video tutorials |

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

| Role | Code | Description | Data Access |
|------|------|-------------|-------------|
| **Geschäftsführer** | GF | CEO, full access | ALL data, ALL actions |
| **Planung** | PLAN | Project planning | ALL customers, projects, reports |
| **Außendienst** | ADM | Sales field | OWN customers, opportunities |
| **Kalkulation** | KALK | Cost estimation | ALL projects (read), estimates |
| **Buchhaltung** | BUCH | Accounting | ALL financial data, invoices |

### RBAC in UI/UX

- **ADM**: Sees only own customers, edit own, read-only financial data
- **GF/PLAN**: Full CRUD on all entities
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
- **Figma Make**: https://www.figma.com/blog/8-ways-to-build-with-figma-make/
- **Figma Best Practices**: https://www.figma.com/best-practices/
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

### Iteration Strategy

1. **Generate**: Use Figma Make with prompt
2. **Review**: Check design against requirements
3. **Refine**: Adjust prompt or design
4. **Validate**: WCAG, mobile, RBAC, GoBD
5. **Implement**: Hand off to developers

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
- **Last Updated**: November 15, 2024
- **Version**: 1.0.0
- **Total Prompts**: 60
- **Status**: ✅ Complete

---

## 🎯 Success Metrics

### Expected Outcomes

- **Design Consistency**: All screens follow design system
- **Figma Make Efficiency**: 60-80% time savings vs. manual design
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Developer Handoff**: Clear component specifications
- **User Testing**: Designs ready for validation

---

**Built for KOMPASS** - Integrated CRM & Project Management Tool  
**Powered by**: shadcn/ui, RadixUI, Tailwind CSS, Figma Make

