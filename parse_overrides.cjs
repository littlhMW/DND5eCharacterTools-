const fs = require('fs');
const content = fs.readFileSync('参考文件/种族拓展包.txt', 'utf8');

const overrides = {};
let currentRace = null;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  if (line.match(/^([\u4e00-\u9fa5]+)\s*\((.+)\)\s*([a-zA-Z\s\(\)]+)$/)) {
    // Like "精灵 (雅灵) Elf(Eladrin)"
    currentRace = line.split(' ')[0].trim() + ' (' + line.match(/\((.+)\)/)[1] + ')';
    overrides[currentRace] = { traits: {} };
    continue;
  } else if (line.match(/^([\u4e00-\u9fa5]+)\s+([a-zA-Z\s\(\)-]+)$/) && !line.includes('.')) {
    // Like "阿斯莫 Aasimar"
    currentRace = line.split(' ')[0].trim();
    overrides[currentRace] = { traits: {} };
    continue;
  } else if (line.match(/^([\u4e00-\u9fa5]+)\s*$/) && !line.includes('.')) {
    currentRace = line.trim();
    if (!overrides[currentRace]) overrides[currentRace] = { traits: {} };
    continue;
  }
  
  if (currentRace) {
    const match = line.match(/^([\u4e00-\u9fa5]+)(?:\.\s*[a-zA-Z\s-]+|\.)(.*)/);
    if (match) {
      let traitName = match[1].trim();
      let desc = match[2].trim();
      
      // If it's something like "武器训练. xxx"
      overrides[currentRace].traits[traitName] = desc;
    }
  }
}

fs.writeFileSync('src/data/overrides.json', JSON.stringify(overrides, null, 2));
console.log('Overrides generated:', Object.keys(overrides).length, 'races processed.');
