import fs from 'fs';
import path from 'path';

const text = fs.readFileSync('/app/applet/task_backgrounds.txt', 'utf8');
const blocks = text.split('\n\n');

const updates: Record<string, string> = {};

for (const block of blocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) continue;
  let name = lines[0].split(' ')[0]; // e.g. 城市赏金猎人

  if (name.includes('（')) name = name.split('（')[0];
  
  let summary = '';
  for (const line of lines) {
    if (line.startsWith('概要：')) {
      summary = line.replace('概要：', '').trim();
      break;
    }
  }
  
  if (name && summary) {
    updates[name] = summary;
  }
}

console.log("Found updates for:", Object.keys(updates));

const dataDir = path.join('/app/applet/src/data');
const dirs = fs.readdirSync(dataDir);
let totalUpdated = 0;

for (const dir of dirs) {
  if (dir.includes('.')) continue; // skip files
  const p = path.join(dataDir, dir, 'backgrounds.ts');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    
    for (const [name, summary] of Object.entries(updates)) {
      const regex = new RegExp(`name:\\s*(['"])${name}(?:\\s*[^'"]*)?\\1,\\s*description:\\s*(['"\`])([\\s\\S]*?)\\2`, 'g');
      content = content.replace(regex, (match, p1, p2, p3) => {
        return `name: ${p1}${name}${p1},\n    description: '${summary.replace(/'/g, "\\'")}'`;
      });
    }
    
    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`Updated ${p}`);
      totalUpdated++;
    }
  }
}

console.log("Total files updated:", totalUpdated);
