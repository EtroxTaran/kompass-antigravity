# KOMPASS Figma File Information

## ✅ Extracted Information

From the Figma URL: `https://www.figma.com/make/wprWI8BZqyyJoLfqCol9OC/KOMPASS-UI-Muster-Bibliothek?node-id=0-1&p=f&t=ZRNUuOjopLQIclQ5-0&fullscreen=1`

### File Details

- **File Key:** `wprWI8BZqyyJoLfqCol9OC`
- **File Name:** `KOMPASS-UI-Muster-Bibliothek`
- **Figma URL:** `https://www.figma.com/make/wprWI8BZqyyJoLfqCol9OC/KOMPASS-UI-Muster-Bibliothek`
- **Published URL:** `https://relink-thick-71342514.figma.site/`
- **Root Node ID:** `0-1`

### URL Structure

The Figma Make URL format is:

```
https://www.figma.com/make/{FILE_KEY}/{FILE_NAME}?node-id={NODE_ID}&...
```

Where:

- `FILE_KEY` = `wprWI8BZqyyJoLfqCol9OC`
- `FILE_NAME` = `KOMPASS-UI-Muster-Bibliothek`
- `NODE_ID` = `0-1` (root node)

## 📋 Still Needed

### 1. Figma Access Token (Required)

You still need to:

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Create a Personal Access Token
3. Set it as environment variable: `export FIGMA_ACCESS_TOKEN="your-token"`

### 2. Design Token Node IDs (Optional but Recommended)

To extract specific design tokens, you need to find node IDs for:

- **Color Tokens Node ID** - Frame containing color palette
- **Typography Tokens Node ID** - Frame containing font styles
- **Spacing Tokens Node ID** - Frame containing spacing scale
- **Component Node IDs** - Individual component frames (Button, Input, Card, etc.)

**How to find node IDs:**

1. Open the Figma file
2. Select the frame/element you want
3. Right-click → "Copy link to selection"
4. The node ID is in the URL parameter `node-id={NODE_ID}`

Or use the Figma API:

```bash
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/wprWI8BZqyyJoLfqCol9OC"
```

## 🚀 Ready to Use

Once you have the access token, you can immediately:

1. **Extract the entire file structure:**

   ```
   Extract file structure from Figma file wprWI8BZqyyJoLfqCol9OC
   ```

2. **Extract from root node:**

   ```
   Extract design tokens from Figma file wprWI8BZqyyJoLfqCol9OC, node 0-1
   ```

3. **List all pages/frames:**
   ```
   List all pages and frames in Figma file wprWI8BZqyyJoLfqCol9OC
   ```

## 📝 Quick Reference

**For MCP Usage:**

- File Key: `wprWI8BZqyyJoLfqCol9OC`
- Root Node: `0-1`
- Use these in Figma MCP commands

**For API Usage:**

```bash
# Get file structure
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/wprWI8BZqyyJoLfqCol9OC"

# Get specific node
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/wprWI8BZqyyJoLfqCol9OC/nodes?ids=0-1"
```

## Next Steps

1. ✅ File key extracted (done)
2. ⏳ Set FIGMA_ACCESS_TOKEN (manual)
3. ⏳ Extract design token node IDs (optional)
4. ⏳ Test Figma MCP connection
5. ⏳ Extract design tokens
