/**
 * Snap px values to a 4px grid in CSS/TSX source files.
 * Skips 1px/1.5px/2px strokes and sub-pixel letter-spacing.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.tmp-brief', '.tmp-content', '.tmp-docx', 'audit-screenshots']);
const TARGET_EXTS = new Set(['.css', '.tsx', '.ts']);

const PX_RE = /(-?\d+(?:\.\d+)?)px/g;

function snapPx(n) {
  const abs = Math.abs(n);
  if (abs === 1 || abs === 1.5 || abs === 2) return n;
  if (abs > 0 && abs < 1) return n;
  return Math.round(n / 4) * 4;
}

function collectFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name) || ent.name.startsWith('.tmp')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) collectFiles(full, out);
    else if (TARGET_EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function snapFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  const next = original.replace(PX_RE, (match, num) => {
    const n = parseFloat(num);
    const snapped = snapPx(n);
    if (snapped !== n) {
      changes += 1;
      const out = Number.isInteger(snapped) ? String(snapped) : String(snapped);
      return `${out}px`;
    }
    return match;
  });
  if (changes > 0) fs.writeFileSync(filePath, next);
  return changes;
}

let total = 0;
for (const filePath of collectFiles(path.join(ROOT, 'src'))) {
  const changes = snapFile(filePath);
  if (changes > 0) {
    console.log(`${path.relative(ROOT, filePath)}: ${changes}`);
    total += changes;
  }
}
console.log(`TOTAL: ${total}`);
