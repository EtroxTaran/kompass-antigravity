#!/usr/bin/env node

/**
 * Wrapper script for NestJS watch mode that fixes shared package paths after compilation
 * This runs as a Node.js script to ensure it works with pnpm --filter
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get backend directory - script is in apps/backend/scripts/
// When run via pnpm --filter, __dirname will be apps/backend/scripts
const scriptDir = __dirname;
const backendDir = path.resolve(scriptDir, '..');
const distDir = path.join(backendDir, 'dist');

console.log('Backend directory:', backendDir);
console.log('Dist directory:', distDir);

// Function to fix paths in dist
function fixPaths() {
  if (!fs.existsSync(distDir)) {
    return;
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Replace paths pointing to packages/shared/src with packages/shared/dist
        content = content.replace(
          /packages\/shared\/src\//g,
          'packages/shared/dist/'
        );

        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    }
  }

  walkDir(distDir);
}

// Start NestJS in watch mode
const nest = spawn('pnpm', ['nest', 'start', '--watch'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
});

// Fix paths periodically
const interval = setInterval(() => {
  fixPaths();
}, 3000); // Every 3 seconds

// Cleanup on exit
nest.on('exit', () => {
  clearInterval(interval);
  process.exit(0);
});

process.on('SIGTERM', () => {
  clearInterval(interval);
  nest.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  clearInterval(interval);
  nest.kill();
  process.exit(0);
});
