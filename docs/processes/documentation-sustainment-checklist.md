# Documentation Sustainment Checklist

**Last Updated:** 2025-03-09  
**Owner:** Technical Writer + Engineering Leads  
**Purpose:** Next-step checklist to keep architecture and product vision documentation aligned after the restructuring tasks are implemented.

---

## Immediate Follow-Ups (Week 1)
- [ ] **Owner assignment:** Confirm a DRI for architecture docs and a DRI for product vision; record them in each index.
- [ ] **Link validation:** Run link checkers on `docs/README.md`, `docs/architecture/README.md`, and `docs/product-vision/README.md`; fix broken anchors or outdated references.
- [ ] **Archive verification:** Ensure any legacy/product-vision archives are labeled and referenced as archives only.

## Short-Term Cadence (Weeks 2–4)
- [ ] **Cross-reference audit:** Verify that architecture risks/reviews referenced in `system-architecture.md` and the Critical Review stay in sync with ADRs.
- [ ] **Roadmap consistency:** Align product vision roadmaps with the latest engineering plans; flag mismatches as "needs review" instead of deleting content.
- [ ] **Glossary alignment:** Check that shared terminology is consistent across architecture and product vision; add missing terms to the central glossary if available.

## Recurring Maintenance (Monthly/Quarterly)
- [ ] **Monthly doc health check:** Confirm indexes point to the current sources of truth; demote stale docs to `archive/` with a status note.
- [ ] **Quarterly architecture review:** Incorporate learnings from AI/Evolution guides, critical reviews, and new ADRs into `system-architecture.md`.
- [ ] **Product vision validation:** Reconfirm North Star and domain visions with stakeholders; mark speculative items for verification rather than removing them.

## Tooling & Automation
- [ ] **Pre-commit/CI guards:** Ensure link checkers and file-organization enforcement run in CI for docs changes.
- [ ] **Template enforcement:** Apply consistent section templates for new architecture and product vision documents (Purpose, Scope, Status, Owner, Last Updated).
- [ ] **Notification hooks:** Send updates to the relevant Slack/Linear channels when indexes or source-of-truth docs change.

## Exit Criteria (Definition of Done for Sustainment)
- ✅ Document owners recorded and discoverable from each index.
- ✅ No broken links in architecture or product vision indexes.
- ✅ Active vs. archived documents clearly labeled.
- ✅ Review cadences scheduled (monthly/quarterly) with owners.
- ✅ Automation in place to prevent regressions.
