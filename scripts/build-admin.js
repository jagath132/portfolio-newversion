import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Building admin dashboard...');
execSync('npx vite build --config vite.admin.config.ts', { stdio: 'inherit', cwd: rootDir });

const distAdmin = path.join(rootDir, 'dist-admin');
const dist = path.join(rootDir, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

fs.cpSync(distAdmin, dist, { recursive: true });

const adminHtmlInDistAdmin = path.join(distAdmin, 'admin', 'index.html');
const topHtmlInDistAdmin = path.join(distAdmin, 'index.html');
if (fs.existsSync(adminHtmlInDistAdmin)) {
  fs.copyFileSync(adminHtmlInDistAdmin, topHtmlInDistAdmin);
}

const adminHtmlInDist = path.join(dist, 'admin', 'index.html');
const topHtmlInDist = path.join(dist, 'index.html');
if (fs.existsSync(adminHtmlInDist)) {
  fs.copyFileSync(adminHtmlInDist, topHtmlInDist);
}

console.log('Admin build completed successfully! Output directories dist/ and dist-admin/ ready.');
