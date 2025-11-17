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
  
  // Replace paths pointing to packages/shared/src with packages/shared/dist
  content = content.replace(
    /packages\/shared\/src\//g,
    'packages/shared/dist/'
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

