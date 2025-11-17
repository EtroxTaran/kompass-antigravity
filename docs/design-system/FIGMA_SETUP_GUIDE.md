# Figma MCP Setup Guide - Quick Start

## ✅ What's Been Done Automatically

1. **Figma MCP Configured** in `.cursor/mcp.json`
2. **Documentation Created** in `docs/design-system/figma-integration.md`
3. **MCP Tool Rules Updated** in `.cursor/rules/mcp-tool-usage-ui-integration.mdc`

## 📋 What You Need to Do Manually

### Step 1: Get Figma Access Token (Required)

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll to "Personal Access Tokens" section
3. Click "Create new token"
4. Name it: `KOMPASS MCP Integration`
5. Copy the generated token
6. Set it as an environment variable:

```bash
# Add to ~/.bashrc or ~/.zshrc (Linux/Mac)
export FIGMA_ACCESS_TOKEN="your-token-here"

# Or add to ~/.zshrc (if using zsh)
echo 'export FIGMA_ACCESS_TOKEN="your-token-here"' >> ~/.zshrc

# Reload your shell
source ~/.zshrc

# Verify it's set
echo $FIGMA_ACCESS_TOKEN
```

**For Windows (PowerShell):**

```powershell
# Set environment variable
$env:FIGMA_ACCESS_TOKEN = "your-token-here"

# Or set permanently
[System.Environment]::SetEnvironmentVariable('FIGMA_ACCESS_TOKEN', 'your-token-here', 'User')
```

### Step 2: Get Figma File Key (✅ COMPLETED)

**File Key:** `wprWI8BZqyyJoLfqCol9OC`  
**File Name:** `KOMPASS-UI-Muster-Bibliothek`  
**Figma URL:** `https://www.figma.com/make/wprWI8BZqyyJoLfqCol9OC/KOMPASS-UI-Muster-Bibliothek`

The file key has been extracted from the Figma URL and documented in `docs/design-system/figma-integration.md`.

### Step 3: Find Design Token Node IDs (Optional but Recommended)

To extract specific design tokens, you need the node IDs from Figma:

1. **Open the Figma file**
2. **Navigate to your design tokens page/frame**
3. **Select a token frame** (e.g., "Colors", "Typography", "Spacing")
4. **Get the node ID:**
   - Right-click → "Copy link to selection"
   - Or use Figma's API: The node ID is in the URL or can be found via the Figma API
5. **Document the node IDs** in `docs/design-system/figma-integration.md`

**Example node IDs to find:**

- Color tokens node ID
- Typography tokens node ID
- Spacing tokens node ID
- Component library node IDs (Button, Input, Card, etc.)

### Step 4: Test Figma MCP Connection

After setting up the access token:

1. **Restart Cursor** (to load new MCP configuration)
2. **Test the connection** by asking Cursor AI:
   ```
   Extract color tokens from the KOMPASS Figma file
   ```
3. **Verify it works** - Cursor should be able to access Figma

### Step 5: Extract Design Tokens (After Setup)

Once MCP is working, you can extract tokens:

1. **Extract colors:**

   ```
   Extract color tokens from Figma file {FILE_KEY}
   ```

2. **Extract typography:**

   ```
   Extract typography tokens from Figma file {FILE_KEY}
   ```

3. **Extract component styles:**
   ```
   Extract Button component styles from Figma file {FILE_KEY}
   ```

## 🔍 How to Find Node IDs in Figma

### Method 1: Using Figma's Inspect Panel

1. Select the frame/element in Figma
2. Look at the right panel → "Inspect" tab
3. The node ID might be visible in the URL or properties

### Method 2: Using Figma API

1. Get your file key (from Step 2)
2. Use Figma API to list all nodes:
   ```bash
   curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
     "https://api.figma.com/v1/files/{FILE_KEY}"
   ```
3. Find the node ID in the response JSON

### Method 3: Using Browser DevTools

1. Open Figma in browser
2. Open DevTools (F12)
3. Select an element
4. Look for node IDs in the network requests or DOM

## 📝 Quick Reference

**Figma File:** https://relink-thick-71342514.figma.site/  
**Documentation:** `docs/design-system/figma-integration.md`  
**MCP Config:** `.cursor/mcp.json`  
**Tool Rules:** `.cursor/rules/mcp-tool-usage-ui-integration.mdc`

## ✅ Verification Checklist

After completing manual steps:

- [ ] FIGMA_ACCESS_TOKEN environment variable set
- [ ] Figma file key extracted and documented
- [ ] Node IDs found and documented (optional)
- [ ] Cursor restarted to load MCP config
- [ ] Figma MCP connection tested
- [ ] Design tokens can be extracted

## 🆘 Troubleshooting

### "Figma MCP not found"

- Restart Cursor after configuring MCP
- Check that `FIGMA_ACCESS_TOKEN` is set correctly

### "Access denied" or "401 Unauthorized"

- Verify your access token is valid
- Check token hasn't expired
- Ensure file is accessible with your token

### "File not found"

- Verify file key is correct
- Check file permissions in Figma
- Ensure file hasn't been moved/deleted

## Next Steps

After setup is complete:

1. Extract design tokens from Figma
2. Update Tailwind config with extracted tokens
3. Update CSS variables in `apps/frontend/src/styles/globals.css`
4. Verify components match Figma designs
5. Document any discrepancies

See `docs/design-system/figma-integration.md` for detailed workflow.
