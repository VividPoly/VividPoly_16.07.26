import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewPath = path.join(__dirname, '../src/components/vividpoly/VividPolyView.tsx');
let s = fs.readFileSync(viewPath, 'utf8');

// Add key={i_*} to the first element after each .map((item, i_*) => (
s = s.replace(
  /\.map\(\([^,]+,\s*(i_\w+)\)\s*=>\s*\(\s*(?:<>\s*)?\n(\s*)<(\w+)(\s)/g,
  (match, idxVar, indent, tag, after) => {
    if (match.includes('key={')) return match;
    return match.replace(
      new RegExp(`<${tag}${after.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      `<${tag} key={${idxVar}}${after}`,
    );
  },
);

fs.writeFileSync(viewPath, s);
console.log('Added React keys to VividPolyView.tsx');
