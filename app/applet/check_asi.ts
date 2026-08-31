import fs from 'fs';
import path from 'path';

function check() {
  const dataPath = path.join(process.cwd(), 'src/data');
  const dirs = fs.readdirSync(dataPath).filter(d => fs.statSync(path.join(dataPath, d)).isDirectory());
  for (const mod of dirs) {
    const file = path.join(dataPath, mod, 'races.ts');
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    // Basic heuristics to find name and abilityBonuses
    let currentName = '';
    const lines = content.split('\n');
    for (const line of lines) {
      const matchName = line.match(/^\s*name:\s*['"](.*?)['"],/);
      if (matchName) {
        currentName = matchName[1];
      }
      const matchBonus = line.match(/^\s*abilityBonuses:\s*(.*?),?$/);
      if (matchBonus) {
        if (!matchBonus[1].includes('[]')) {
          console.log(`[${mod}] ${currentName}: ${matchBonus[1]}`);
        }
      }
    }
  }
}
check();
