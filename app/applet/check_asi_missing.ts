import fs from 'fs';
import path from 'path';

function check() {
  const dataPath = path.join(process.cwd(), 'src/data');
  const dirs = fs.readdirSync(dataPath).filter(d => fs.statSync(path.join(dataPath, d)).isDirectory());
  for (const mod of dirs) {
    const file = path.join(dataPath, mod, 'races.ts');
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    
    // Evaluate or approximate the check
    const raceBlocks = content.split(/id:\s*['"]/);
    for (const block of raceBlocks) {
      const matchName = block.match(/name:\s*['"](.*?)['"]/);
      if (!matchName) continue;
      const name = matchName[1];
      
      const hasEmptyBonus = block.includes('abilityBonuses: []');
      const hasAsiChoice = block.includes('dynamic: \'asi\'') || block.includes('dynamic: "asi"');
      
      if (hasEmptyBonus && !hasAsiChoice && !name.includes('本相') && !name.includes('变体')) {
          if (name !== '精灵' && name !== '半身人' && name !== '侏儒' && name !== '矮人') {
            console.log(`[${mod}] ${name} has NO ability bonuses and NO asi choice!`);
          }
      }
    }
  }
}
check();
