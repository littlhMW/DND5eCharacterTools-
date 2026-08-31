import fs from 'fs';
import path from 'path';

function fixErlwAsiChoice() {
  const filePath = path.join(process.cwd(), 'src/data/erlw/races.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Handling
  content = content.replace(
    /abilityBonuses: \[\{ ability: 'WIS', bonus: 2 \}\],\n\s*traits: \[\n\s*\{ name: '野性直觉'/g,
    `abilityBonuses: [{ ability: 'WIS', bonus: 2 }],\n        traits: [\n          { name: '属性提升', description: '除了感知提升 2 点，另外一项你所选择的不同属性增加 1。', choices: [ { id: 'mark-of-handling-asi', name: '选择一项属性提升 (+1)', chooseNumber: 1, dynamic: 'asi' } ] },\n          { name: '野性直觉'`
  );

  // Making
  content = content.replace(
    /abilityBonuses: \[\{ ability: 'INT', bonus: 2 \}\],\n\s*traits: \[\n\s*\{ name: '工匠直觉'/g,
    `abilityBonuses: [{ ability: 'INT', bonus: 2 }],\n        traits: [\n          { name: '属性提升', description: '除了智力提升 2 点，另外一项你所选择的不同属性增加 1。', choices: [ { id: 'mark-of-making-asi', name: '选择一项属性提升 (+1)', chooseNumber: 1, dynamic: 'asi' } ] },\n          { name: '工匠直觉'`
  );

  // Passage
  content = content.replace(
    /abilityBonuses: \[\{ ability: 'DEX', bonus: 2 \}\],\n\s*traits: \[\n\s*\{ name: '邮差之速'/g,
    `abilityBonuses: [{ ability: 'DEX', bonus: 2 }],\n        traits: [\n          { name: '属性提升', description: '除了敏捷提升 2 点，另外一项你所选择的不同属性增加 1。', choices: [ { id: 'mark-of-passage-asi', name: '选择一项属性提升 (+1)', chooseNumber: 1, dynamic: 'asi' } ] },\n          { name: '邮差之速'`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}
fixErlwAsiChoice();
