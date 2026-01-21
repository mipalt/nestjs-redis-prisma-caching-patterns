import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const seederName = args[0];

if (!seederName) {
  console.log('[SEED] Running all seeders');
  execSync('tsx prisma/seeders/index.seeder.ts', { stdio: 'inherit' });
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'seeders', `${seederName}.ts`);

  if (!fs.existsSync(filePath)) {
    console.error(`[SEED] Seeder "${seederName}" not found`);
    process.exit(1);
  }

  try {
    console.log(`[SEED] Running seeder "${seederName}"`);
    execSync(`tsx ${filePath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[SEED] Failed to run seeder "${seederName}"`);
    process.exit(1);
  }
}
