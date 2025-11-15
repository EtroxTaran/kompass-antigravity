# User Personas

**Last Updated:** 2025-01-28  
**Owner:** Product & UX Teams  
**Purpose:** User profiles, needs analysis, and persona-driven requirements

This directory contains detailed user personas that drive KOMPASS product development, feature prioritization, and UX design decisions.

---

## Personas Overview

KOMPASS serves a mid-sized project-based business with distributed teams. Our personas represent the core user groups with distinct needs, workflows, and pain points.

### Primary Personas (Daily Users)

| Persona                  | Role             | Primary Use Cases                                           | Documents                                                                                                  |
| ------------------------ | ---------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Geschäftsführer (GF)** | CEO/Management   | Strategic oversight, financial control, executive reporting | [CEO Persona](<./Persona-Profil_%20Geschäftsführer%20(CEO)%20im%20Projektgeschäft.md>)                     |
| **Außendienst (ADM)**    | Field Sales      | Customer visits, opportunity management, mobile CRM         | [Field Sales Persona](<./Referenzpersona_%20Außendienstmitarbeiter%20(Vertrieb%20Ladenbau-Projekte).md>)   |
| **Innendienst**          | Inside Sales     | Quote generation, customer support, order processing        | [Inside Sales Persona](<./Innendienst%20(Vertriebsinnendienst%20&%20Kalkulation)%20–%20Referenzprofil.md>) |
| **Planung (PLAN)**       | Project Planning | Project management, resource planning, coordination         | [Planning Persona](./Strategische%20Referenzpersona_%20Planungsabteilung.md)                               |

### Secondary Personas (Specialized Users)

| Persona                | Role               | Primary Use Cases                                   | Documents                                                                                           |
| ---------------------- | ------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Buchhaltung (BUCH)** | Accounting         | Financial tracking, compliance, invoicing           | [Accounting Persona](<./Persona-Bericht_%20Buchhaltung%20(Integriertes%20CRM-%20und%20PM-Tool).md>) |
| **Marketing/Grafik**   | Marketing & Design | Marketing campaigns, design assets, customer portal | [Marketing Persona](<./Persona%20Marketing%20und%20Grafik%20(Merged%20Profile).md>)                 |

---

## Persona Details

### 👔 Geschäftsführer (CEO) - Strategic Leadership

**File**: `Persona-Profil_ Geschäftsführer (CEO) im Projektgeschäft.md`

**Key Characteristics:**

- Strategic decision maker
- Needs high-level dashboards and KPIs
- Limited time for detailed data entry
- Focuses on financial performance and business growth

**Primary Needs:**

- Executive dashboards with key metrics
- Financial oversight and budget control
- Strategic insights and trend analysis
- Quick access to critical information

**KOMPASS Features:**

- Executive reporting dashboard
- Financial performance metrics
- Project portfolio overview
- Mobile access for key information

### 🚗 Außendienst (Field Sales) - Mobile-First CRM

**File**: `Referenzpersona_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte).md`

**Key Characteristics:**

- Mobile-first workflow
- Frequent customer visits
- Needs offline functionality
- Focus on customer relationships and opportunities

**Primary Needs:**

- Mobile CRM with offline capability
- Customer interaction tracking
- Opportunity pipeline management
- Route planning and visit scheduling

**KOMPASS Features:**

- Offline-first mobile PWA
- Customer visit tracking
- Opportunity management
- Mobile note-taking and photo capture

### 🏢 Innendienst (Inside Sales) - Quote & Order Processing

**File**: `Innendienst (Vertriebsinnendienst & Kalkulation) – Referenzprofil.md`

**Key Characteristics:**

- Office-based operations
- High-volume quote generation
- Customer service focus
- Integration needs with pricing systems

**Primary Needs:**

- Efficient quote generation
- Customer inquiry management
- Pricing and inventory integration
- Order tracking and fulfillment

**KOMPASS Features:**

- Quote generation workflows
- Customer service tools
- Inventory integration
- Order management system

### 📐 Planung (Project Planning) - Resource Coordination

**File**: `Strategische Referenzpersona_ Planungsabteilung.md`

**Key Characteristics:**

- Project coordination focus
- Resource planning and scheduling
- Cross-team collaboration
- Technical project requirements

**Primary Needs:**

- Project planning and scheduling
- Resource allocation and tracking
- Team coordination tools
- Technical requirement management

**KOMPASS Features:**

- Project management workflows
- Resource planning tools
- Team collaboration features
- Technical specification management

### 💰 Buchhaltung (Accounting) - Compliance & Finance

**File**: `Persona-Bericht_ Buchhaltung (Integriertes CRM- und PM-Tool).md`

**Key Characteristics:**

- Compliance and accuracy focus
- Financial reporting needs
- Integration with accounting systems
- Audit trail requirements

**Primary Needs:**

- Financial tracking and reporting
- GoBD compliance features
- Accounting system integration
- Audit trail maintenance

**KOMPASS Features:**

- GoBD-compliant audit trails
- Financial reporting tools
- Accounting system integration
- Compliance monitoring

### 🎨 Marketing/Grafik (Marketing & Design) - Brand & Customer Experience

**File**: `Persona Marketing und Grafik (Merged Profile).md`

**Key Characteristics:**

- Brand consistency focus
- Customer experience design
- Marketing campaign management
- Creative asset management

**Primary Needs:**

- Marketing campaign tools
- Brand asset management
- Customer experience optimization
- Marketing analytics

**KOMPASS Features:**

- Marketing automation integration
- Asset management system
- Customer portal management
- Marketing analytics dashboard

---

## Persona-Driven Development

### Feature Prioritization Matrix

| Feature Category        | GF     | ADM    | INNEN  | PLAN   | BUCH   | MKT    | Priority   |
| ----------------------- | ------ | ------ | ------ | ------ | ------ | ------ | ---------- |
| **Mobile CRM**          | Medium | High   | Low    | Medium | Low    | Low    | **High**   |
| **Offline Sync**        | Low    | High   | Medium | Medium | Low    | Low    | **High**   |
| **Executive Dashboard** | High   | Low    | Low    | Medium | Medium | Medium | **High**   |
| **Project Management**  | High   | Medium | Medium | High   | Low    | Low    | **High**   |
| **Financial Tracking**  | High   | Low    | Medium | Medium | High   | Low    | **Medium** |
| **Marketing Tools**     | Medium | Low    | Low    | Low    | Low    | High   | **Low**    |

### Development Phase Alignment

#### Phase 1 (MVP) - Core Personas: GF, ADM, INNEN, PLAN

Focus on core business operations:

- Customer and opportunity management
- Mobile-first design for field sales
- Basic project tracking
- Executive reporting essentials

#### Phase 2 (Extensions) - All Personas

Enhanced functionality:

- Advanced financial integration for BUCH
- Marketing automation for MKT
- Advanced project management for PLAN
- AI-powered insights for GF

#### Phase 3 (Optimization) - Persona-Specific Optimization

Specialized features:

- Role-specific dashboards
- Workflow optimization
- Advanced analytics
- Integration expansion

---

## Persona Research & Validation

### Research Methods Used

- **Stakeholder Interviews**: Direct interviews with representatives from each role
- **Workflow Analysis**: Observation of current processes and pain points
- **Competitive Analysis**: Review of existing tools and their limitations
- **Use Case Mapping**: End-to-end journey mapping for each persona

### Validation Approach

- **Prototype Testing**: User testing with persona representatives
- **Feedback Loops**: Regular validation sessions with actual users
- **Usage Analytics**: Post-launch usage pattern analysis
- **Iterative Refinement**: Continuous persona updates based on real data

---

## Using Personas for Development

### Design Decisions

- **UI/UX Design**: Interface design prioritized by primary personas
- **Feature Scope**: Feature complexity balanced across persona needs
- **Information Architecture**: Navigation optimized for most frequent use cases
- **Mobile Experience**: Prioritized for ADM persona requirements

### RBAC Mapping

Personas directly map to RBAC roles:

- **GF** → Geschäftsführer role
- **ADM** → Außendienst role
- **INNEN** → Innendienst role
- **PLAN** → Planung role
- **BUCH** → Buchhaltung role

### Testing Strategy

- **User Acceptance Testing**: Test scenarios based on persona workflows
- **Performance Testing**: Load patterns based on persona usage
- **Accessibility Testing**: Requirements driven by persona diversity
- **Mobile Testing**: Intensive testing for mobile-dependent personas (ADM)

---

## Related Documentation

### Product Strategy

- **[Product Vision](../product-vision/README.md)** - Overall product strategy and vision
- **[User Journey Maps](../specifications/USER_JOURNEY_MAPS.md)** - End-to-end user workflows

### Technical Implementation

- **[RBAC Permissions](../specifications/rbac-permissions.md)** - Role-based access control mapping
- **[API Specification](../specifications/api-specification.md)** - Persona-specific endpoint requirements

### Development Guidance

- **[Architecture](../architecture/README.md)** - Persona-driven architectural decisions
- **[Test Strategy](../specifications/test-strategy.md)** - Persona-based testing approaches

---

## Maintenance & Updates

### Update Schedule

- **Quarterly Reviews**: Validate persona accuracy with actual users
- **Feature Releases**: Update personas with new capabilities and workflows
- **Annual Deep Dive**: Comprehensive persona research and validation

### Change Management

1. New persona needs identified through user feedback
2. Research and validation with representative users
3. Documentation updates with specific examples
4. Impact analysis on existing features and roadmap
5. Communication to development team and stakeholders

---

Last updated: 2025-01-28
