# Figma Design System Integration

## Overview

This document describes how to extract design tokens, components, and styles from the KOMPASS Figma design file for use in development.

**Figma File:** [KOMPASS Design System](https://relink-thick-71342514.figma.site/)

## Prerequisites

### 1. Figma Access Token

You need a Figma Personal Access Token to use the Figma MCP server:

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to "Personal Access Tokens"
3. Click "Create new token"
4. Name it: `KOMPASS MCP Integration`
5. Copy the token
6. Set it as an environment variable:

```bash
# Add to ~/.bashrc or ~/.zshrc
export FIGMA_ACCESS_TOKEN="your-token-here"
```

### 2. Figma File Key

The Figma file key is extracted from the Figma file URL:

**Published File URL:** `https://relink-thick-71342514.figma.site/`

**To get the actual file key:**

1. Open the file in Figma
2. Copy the URL from the browser (format: `https://www.figma.com/file/{FILE_KEY}/...`)
3. Extract the `FILE_KEY` from the URL

**Current File Key:** `[TO BE EXTRACTED - see manual steps below]`

## MCP Configuration

Figma MCP is configured in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

## Design Token Extraction

### Node IDs for Design Tokens

Once you have access to the Figma file, identify the node IDs for:

1. **Color Tokens**
   - Primary colors
   - Semantic colors (success, warning, error, info)
   - Neutral scale
   - Background colors

2. **Typography**
   - Font families
   - Font sizes
   - Font weights
   - Line heights

3. **Spacing**
   - Spacing scale (4px base unit)
   - Padding/margin values

4. **Shadows**
   - Elevation system
   - Shadow values

5. **Border Radius**
   - Component border radius values

### How to Find Node IDs

1. Open the Figma file
2. Select the element you want to extract
3. In the right panel, look for the element's ID
4. Or use Figma's API: `https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={NODE_ID}`

## Design Token Mapping

### Expected Design Tokens (from `ui-ux/01-foundation/design-tokens.md`)

**Colors:**

- Primary: `#3b82f6` (blue-500)
- Success: `#10b981` (green-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)
- Neutral: Grayscale from `#ffffff` to `#0f172a`

**Typography:**

- Font: Inter or System UI
- H1: 32px / bold
- H2: 24px / semibold
- H3: 20px / semibold
- H4: 16px / semibold
- Body: 14px / regular
- Small: 12px / regular

**Spacing:**

- Base unit: 4px
- Scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px)

**Shadows:**

- sm: Subtle shadow for cards
- md: Moderate shadow for modals
- lg: Heavy shadow for dropdowns

**Border Radius:**

- sm: 4px (buttons, inputs)
- md: 8px (cards)
- lg: 12px (modals)
- full: 9999px (badges, avatars)

## Extraction Workflow

### Using Figma MCP

1. **Extract Design Tokens:**

   ```
   Extract color tokens from Figma file {FILE_KEY}, node {COLOR_NODE_ID}
   Extract typography tokens from Figma file {FILE_KEY}, node {TYPOGRAPHY_NODE_ID}
   Extract spacing tokens from Figma file {FILE_KEY}, node {SPACING_NODE_ID}
   ```

2. **Extract Component Styles:**

   ```
   Extract component styles for Button from Figma file {FILE_KEY}, node {BUTTON_NODE_ID}
   Extract component styles for Input from Figma file {FILE_KEY}, node {INPUT_NODE_ID}
   ```

3. **Map to shadcn/ui:**
   - Compare extracted tokens with shadcn/ui defaults
   - Update Tailwind config with custom tokens
   - Update CSS variables in `apps/frontend/src/styles/globals.css`

### Manual Extraction (if MCP unavailable)

1. Open Figma file
2. Select design token frames
3. Copy CSS variables from Figma's "Inspect" panel
4. Manually update Tailwind config

## Integration with Development

### Step 1: Extract Tokens

Use Figma MCP to extract design tokens:

```typescript
// Example: Extract colors
const colors = await figmaMCP.extractColors({
  fileKey: 'FILE_KEY',
  nodeId: 'COLOR_NODE_ID',
});
```

### Step 2: Update Tailwind Config

Map extracted tokens to Tailwind:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // From Figma
          foreground: '#ffffff',
        },
        // ... other colors from Figma
      },
    },
  },
};
```

### Step 3: Update CSS Variables

Update global CSS with Figma tokens:

```css
/* apps/frontend/src/styles/globals.css */
:root {
  --primary: 217 91% 60%; /* From Figma */
  --primary-foreground: 0 0% 100%;
  /* ... other variables */
}
```

### Step 4: Verify with shadcn/ui

Ensure extracted tokens work with shadcn/ui components:

```bash
# Test component rendering
pnpm --filter @kompass/frontend dev
```

## Component Extraction

### shadcn/ui Components

All UI components must use shadcn/ui. Extract component styles from Figma and map to shadcn/ui:

1. **Button:** Extract button variants (primary, secondary, ghost, destructive)
2. **Input:** Extract input styles (default, error, disabled)
3. **Card:** Extract card styles (default, elevated, outlined)
4. **Table:** Extract table styles (header, row, cell)
5. **Dialog:** Extract dialog styles (overlay, content, header)

### Mapping Process

1. Extract component styles from Figma
2. Compare with shadcn/ui defaults
3. Customize shadcn/ui components to match Figma
4. Update component files in `apps/frontend/src/components/ui/`

## Synchronization

### Design-to-Code Sync

When Figma designs are updated:

1. **Extract updated tokens** using Figma MCP
2. **Update Tailwind config** with new values
3. **Update CSS variables** in global styles
4. **Test components** to ensure consistency
5. **Update documentation** in `ui-ux/` directory

### Code-to-Design Sync

When code changes are made:

1. **Update Figma designs** using migration prompts in `ui-ux/00-updates/`
2. **Document changes** in `ui-ux/` directory
3. **Create migration prompt** for Figma Make

See `.cursor/rules/ui-ux-documentation-sync.mdc` for complete sync workflow.

## Troubleshooting

### MCP Not Working

1. **Check access token:**

   ```bash
   echo $FIGMA_ACCESS_TOKEN
   ```

2. **Verify file key:**
   - Ensure file key is correct
   - Check file permissions in Figma

3. **Test MCP connection:**
   ```bash
   npx -y @modelcontextprotocol/server-figma
   ```

### Token Extraction Issues

1. **Node ID not found:**
   - Verify node ID in Figma
   - Check file structure

2. **Access denied:**
   - Verify access token permissions
   - Check file sharing settings

## References

- [Figma MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/figma)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Design Tokens Documentation](../ui-ux/01-foundation/design-tokens.md)
- [UI/UX Documentation Sync Rule](../../.cursor/rules/ui-ux-documentation-sync.mdc)

## Next Steps

1. ✅ **Configure Figma MCP** (done)
2. ⏳ **Get Figma file key** (manual - see below)
3. ⏳ **Set FIGMA_ACCESS_TOKEN** (manual - see below)
4. ⏳ **Extract node IDs** (manual - see below)
5. ⏳ **Update this document with node IDs** (manual)
6. ⏳ **Extract design tokens** (using MCP)
7. ⏳ **Update Tailwind config** (using extracted tokens)
