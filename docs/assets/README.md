# Documentation Assets

**Last Updated:** 2025-01-28  
**Owner:** Documentation Team  
**Purpose:** Supporting assets for documentation including images, diagrams, and templates

This directory contains all supporting assets referenced by KOMPASS documentation.

---

## Asset Types

### 📊 Diagrams

**Location**: `./diagrams/`

- Architecture diagrams (C4 model, system context)
- Data flow diagrams
- Process flow charts
- Network diagrams

### 🖼️ Images

**Location**: `./images/`

- Screenshots and UI mockups
- User interface examples
- Process illustrations
- Logo and branding assets

### 📋 Templates

**Location**: `./templates/`

- Document templates for consistency
- Code generation templates
- Report templates
- Process templates

### 📁 Other Assets

- Video files (for complex demonstrations)
- Audio files (for voice guidelines)
- Interactive prototypes
- Downloadable resources

---

## File Organization

### Naming Conventions

- **Diagrams**: Use descriptive names with context
  - `architecture-system-overview.svg`
  - `data-flow-customer-sync.png`
  - `process-deployment-workflow.drawio`

- **Images**: Include purpose and context
  - `ui-customer-list-mobile.png`
  - `dashboard-executive-overview.jpg`
  - `wireframe-login-desktop.png`

- **Templates**: Indicate type and usage
  - `adr-template.md`
  - `user-story-template.md`
  - `implementation-report-template.md`

### Directory Structure

```
assets/
├── diagrams/
│   ├── architecture/
│   ├── data-flows/
│   ├── processes/
│   └── user-journeys/
├── images/
│   ├── ui-screenshots/
│   ├── mockups/
│   ├── logos/
│   └── illustrations/
├── templates/
│   ├── documents/
│   ├── reports/
│   └── processes/
└── other/
    ├── videos/
    ├── prototypes/
    └── downloads/
```

---

## Asset Standards

### Image Standards

- **Format**: SVG for diagrams, PNG for screenshots, JPG for photos
- **Resolution**: Minimum 1920px width for screenshots
- **Compression**: Optimize for web without quality loss
- **Alt Text**: All images must have descriptive alt text when referenced

### Diagram Standards

- **Tools**: Draw.io/Diagrams.net preferred, Lucidchart acceptable
- **Style**: Consistent color scheme and fonts
- **Formats**: Save both editable source (.drawio) and export (.svg/.png)
- **Documentation**: Include legend and context for complex diagrams

### Template Standards

- **Format**: Markdown preferred, Word acceptable for complex layouts
- **Variables**: Use `{{VARIABLE_NAME}}` format for replaceable content
- **Instructions**: Include clear usage instructions within templates
- **Examples**: Provide filled examples alongside blank templates

---

## Usage Guidelines

### Referencing Assets

Always use relative paths when referencing assets in documentation:

```markdown
![Architecture Overview](../assets/diagrams/architecture/system-overview.svg)
```

### Version Control

- **Images**: Commit compressed, web-optimized versions
- **Source Files**: Include editable source files for maintainability
- **Large Assets**: Consider using Git LFS for files >1MB
- **Cleanup**: Regular cleanup of unused assets

### Accessibility

- **Alt Text**: Provide descriptive alt text for all images
- **Color Contrast**: Ensure diagrams meet accessibility standards
- **Text Alternatives**: Provide text descriptions for complex visual information
- **Screen Reader**: Test with screen readers for accessibility compliance

---

## Maintenance

### Regular Tasks

- **Quarterly**: Review and remove unused assets
- **With Updates**: Update screenshots when UI changes
- **Version Control**: Archive old versions when assets are updated
- **Optimization**: Regular compression and optimization of assets

### Asset Lifecycle

1. **Creation**: New assets created following standards
2. **Review**: Assets reviewed for quality and accessibility
3. **Usage**: Assets referenced in appropriate documentation
4. **Maintenance**: Regular updates when content changes
5. **Archive**: Old assets moved to archive when no longer used

---

## Tools & Software

### Recommended Tools

- **Diagrams**: Draw.io (free), Lucidchart (paid)
- **Screenshots**: Built-in OS tools, Snagit (paid)
- **Image Editing**: GIMP (free), Photoshop (paid)
- **Compression**: TinyPNG, ImageOptim
- **Version Control**: Git LFS for large files

### Asset Creation Workflow

1. Create asset using appropriate tool
2. Save source file in appropriate directory
3. Export web-optimized version
4. Add to documentation with proper alt text
5. Test accessibility and rendering
6. Commit both source and optimized versions

---

## Related Documentation

- **[Architecture](../architecture/README.md)** - Uses architecture diagrams and technical illustrations
- **[Guides](../guides/README.md)** - References UI screenshots and process diagrams
- **[Specifications](../specifications/README.md)** - Includes data model diagrams and API illustrations
- **[Implementation](../implementation/README.md)** - Contains implementation screenshots and progress diagrams

---

## Contributing Assets

### For New Assets

1. Check if similar asset already exists
2. Follow naming conventions
3. Create in appropriate subdirectory
4. Include both source and optimized versions
5. Add descriptive commit message
6. Update any documentation referencing the asset

### For Asset Updates

1. Update source file first
2. Re-export optimized version
3. Check all documentation references
4. Test rendering in all contexts
5. Archive old version if significantly different

---

Last updated: 2025-01-28
