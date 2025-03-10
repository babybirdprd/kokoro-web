// build-windows.js
// Using CommonJS syntax to avoid TypeScript errors
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Delete build directory if it exists
const buildDir = path.join(process.cwd(), 'build');
if (fs.existsSync(buildDir)) {
    console.log('Removing build directory...');
    fs.rmSync(buildDir, { recursive: true, force: true });
}

// Run openapigen script
console.log('Running openapigen...');
execSync('node ./scripts/generate-openapi.mjs', { stdio: 'inherit' });

// Run vite build
console.log('Running vite build...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 