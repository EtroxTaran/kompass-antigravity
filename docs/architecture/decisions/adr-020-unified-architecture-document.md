# ADR-020: Unified Architecture Document (Eliminate v1/v2 Versioning)

**Status**: Accepted  
**Date**: 2025-01-28  
**Deciders**: Architecture Team, User Feedback

## Context

KOMPASS had two architecture documents:
- `architecture-v1-comprehensive.md` (7000+ lines, complete vision)
- `architecture-v2-pragmatic.md` (159 lines, MVP focus)

This created confusion about which document to follow for implementation decisions. The team was uncertain whether to reference v1 for complete requirements or v2 for current implementation, leading to potential inconsistencies and implementation delays.

**User Feedback**: "I do not want v1 and v2 versions! This is stupid and confusing! Fix it and prevent it in the future."

## Decision

**Create single unified architecture document** `docs/architecture/system-architecture.md` that contains:
- Complete technical specification for all phases
- Clear phase-based implementation guidance
- Evolution path from MVP to advanced features
- All architectural decisions and patterns in one place

**Delete both versioned documents** to eliminate confusion.

## Rationale

### Why Single Document is Better

1. **Eliminates Confusion**: Team has one clear reference for all architectural decisions
2. **Reduces Maintenance**: No need to keep two documents in sync
3. **Follows Our Own Rules**: Violates `.cursor/rules/git-workflow.mdc` no file duplication principle
4. **Improves Usability**: Developers don't need to choose between documents
5. **Enables Evolution**: Single document can describe phased implementation clearly

### Content Integration Strategy

- **MVP Implementation**: Practical guidance from v2 (pragmatic approach)
- **Complete Vision**: Comprehensive specifications from v1 (full feature set)
- **Evolution Path**: Clear phases from basic MVP to advanced AI features
- **Risk Mitigation**: Balanced approach addressing both pragmatic constraints and comprehensive requirements

## Alternatives Considered

### Option A: Keep Both Documents (Rejected)
- **Pros**: Preserves existing work, different audiences
- **Cons**: Confusion, maintenance overhead, violates our rules
- **Verdict**: ❌ Rejected - User feedback clearly against this

### Option B: Choose One, Archive Other (Rejected)  
- **Pros**: Simple decision, no merge complexity
- **Cons**: Loses valuable content from unchosen document
- **Verdict**: ❌ Rejected - Would lose important information

### Option C: Create Summary Document (Rejected)
- **Pros**: Quick solution, keeps both as reference
- **Cons**: Creates third document, still maintains confusion
- **Verdict**: ❌ Rejected - Makes problem worse, not better

### Option D: Unified Document (Accepted) ✅
- **Pros**: Single source of truth, preserves all content, clear guidance
- **Cons**: Initial merge effort required
- **Verdict**: ✅ **Accepted** - Best long-term solution

## Consequences

### Positive
- **Clear Implementation Guidance**: Team knows exactly which document to follow
- **Eliminated Confusion**: No more questions about v1 vs v2
- **Better Maintenance**: Single document easier to keep current
- **Rule Compliance**: Follows no-file-duplication principle
- **Improved Navigation**: Architecture README simplified

### Negative  
- **Initial Merge Effort**: Required time to properly combine content
- **Link Updates**: All cross-references needed updating
- **Temporary Disruption**: Team needs to update bookmarks/references

## Implementation

### Steps Completed
1. ✅ Created unified `docs/architecture/system-architecture.md`
2. ✅ Merged valuable content from both v1 and v2 documents  
3. ✅ Deleted both versioned files
4. ✅ Updated `docs/architecture/README.md` to emphasize single source
5. ✅ Updated all cross-references in documentation
6. ✅ Enhanced `.cursor/rules/` to prevent future versioning

### New Document Structure
- **Executive Summary**: Clear overview and principles
- **System Overview**: High-level architecture and technology stack
- **Architecture Decisions**: All ADRs and rationale integrated
- **Phase Implementation**: Clear MVP → AI → Intelligence evolution
- **Technical Details**: Complete implementation specifications
- **Security & Compliance**: GoBD, DSGVO, RBAC patterns
- **Operations**: Deployment, monitoring, scaling guidance

## Monitoring

### Success Criteria
- ✅ Team references single architecture document consistently
- ✅ No architectural confusion reported in implementation
- ✅ Documentation remains current (no multiple versions to maintain)
- ✅ New team members can find architectural guidance easily

### Prevention Rules Added
- **Pre-commit hooks** detect versioned file patterns including `-v[0-9]*`
- **Documentation organization rule** explicitly forbids versioned files
- **Architecture rule** requires ADR for significant changes

### Quarterly Review
- Verify single architecture document meets all team needs
- Check that no versioned documents have been accidentally created
- Validate that evolution guidance remains clear and actionable

## Related

- **Strengthened Rule**: `.cursor/rules/git-workflow.mdc` - Added `-v[0-9]*` pattern
- **Enhanced Rule**: `.cursor/rules/documentation-organization.mdc` - Added versioning prevention
- **New Rule Section**: `.cursor/rules/architecture.mdc` - ADR requirements added
- **Updated Navigation**: `docs/architecture/README.md` - Single source of truth emphasized

## Future Prevention

### Automated Enforcement
- Pre-commit hooks reject files with versioning patterns
- CI/CD validates no duplicate architecture documents exist
- Code review checklist includes architecture document verification

### Team Training  
- Architecture rules clearly state single document requirement
- ADR template provided for consistent documentation
- Cross-references always point to single source of truth

This ADR ensures KOMPASS maintains architectural clarity and prevents future versioning confusion.
