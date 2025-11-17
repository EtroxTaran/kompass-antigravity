#!/usr/bin/env node

/**
 * Post-build script to fix shared package import paths
 *
 * TypeScript compiles @kompass/shared path aliases to relative paths
 * pointing to src, but at runtime we need them to point to dist.
 * This script replaces those paths in the compiled JavaScript files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '../dist');

function fixPathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace relative paths pointing to packages/shared/src with dist paths
  // Pattern: require("../../../../../../packages/shared/src/types/enums")
  // Becomes: require("../../../../../../packages/shared/dist/types/enums/index")
  content = content.replace(
    /require\((["'])([^"']*packages\/shared\/src\/([^"']+))\1\)/g,
    (match, quote, fullPath, pathAfterSrc) => {
      // Replace src with dist
      const distPath = fullPath.replace(
        /packages\/shared\/src\//,
        'packages/shared/dist/'
      );
      // For directory imports (no file extension), append /index.js
      if (!pathAfterSrc.match(/\.(js|ts|json)$/)) {
        return `require(${quote}${distPath}/index.js${quote})`;
      }
      // For file imports, just replace src with dist
      return `require(${quote}${distPath}${quote})`;
    }
  );

  // Also replace paths pointing to packages/shared/dist (already fixed but using relative path)
  // Keep relative paths but ensure directory imports have /index appended
  // Pattern: require("../../../../../../packages/shared/dist/types/enums")
  // Becomes: require("../../../../../../packages/shared/dist/types/enums/index")
  // Don't match paths that already end with /index
  content = content.replace(
    /require\((["'])([^"']*packages\/shared\/dist\/([^"']+))\1\)/g,
    (match, quote, fullPath, pathAfterDist) => {
      // Skip if already ends with /index
      if (pathAfterDist.endsWith('/index') || fullPath.endsWith('/index')) {
        return match;
      }
      // For directory imports (no file extension), append /index.js
      if (!pathAfterDist.match(/\.(js|ts|json)$/)) {
        return `require(${quote}${fullPath}/index.js${quote})`;
      }
      // For file imports, keep as is
      return match;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed paths in: ${path.relative(distDir, filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') && !file.endsWith('.d.ts')) {
      fixPathsInFile(filePath);
    }
  }
}

if (fs.existsSync(distDir)) {
  console.log('Fixing shared package paths in compiled files...');
  walkDir(distDir);
  console.log('Done fixing paths.');
} else {
  console.warn(`Dist directory not found: ${distDir}`);
  process.exit(1);
}
