import fs from 'fs';

let content = fs.readFileSync('src/data/races.ts', 'utf8');

// Dwarf
content = content.replace(
  /({ name: '矮人战斗训练', description: '你熟练于战斧、手斧、轻锤和战锤。' })/g,
  "$1"
);
// We will replace subraces and add fields.

content = content.replace(
  /name: '矮人',[\s\S]*?traits: \[[\s\S]*?\],[\s\S]*?spells: \[\],(?=\s*source: 'phb',\s*subraces)/g,
  match => match.replace("spells: [],", "spells: [],\n    weaponProficiencies: ['战斧', '手斧', '轻锤', '战锤'],")
);

content = content.replace(
  /name: '山地矮人',[\s\S]*?spells: \[\]/g,
  match => match.replace("spells: []", "spells: [], armorProficiencies: ['轻甲', '中甲']")
);

content = content.replace(
  /name: '高等精灵',[\s\S]*?spells: \[\{ level: 0, spellId: '自选法师戏法' \}\]/g,
  match => match.replace("spells: [{ level: 0, spellId: '自选法师戏法' }]", "spells: [{ level: 0, spellId: '自选法师戏法' }], weaponProficiencies: ['长剑', '短剑', '短弓', '长弓']")
);

content = content.replace(
  /name: '木精灵',[\s\S]*?spells: \[\]/g,
  match => match.replace("spells: []", "spells: [], weaponProficiencies: ['长剑', '短剑', '短弓', '长弓']")
);

content = content.replace(
  /name: '卓尔精灵',[\s\S]*?spells: \[/g,
  match => match.replace("spells: [", "weaponProficiencies: ['刺剑', '短剑', '手弩'],\n        spells: [")
);

const halfElfSkillsChoice = `choices: [
        {
          id: 'half-elf-skills',
          name: '选择两个技能',
          chooseNumber: 2,
          options: [
            { id: 'acrobatics', name: '特技' },
            { id: 'animalHandling', name: '驯兽' },
            { id: 'arcana', name: '奥秘' },
            { id: 'athletics', name: '运动' },
            { id: 'deception', name: '欺瞒' },
            { id: 'history', name: '历史' },
            { id: 'insight', name: '洞悉' },
            { id: 'intimidation', name: '威吓' },
            { id: 'investigation', name: '调查' },
            { id: 'medicine', name: '医药' },
            { id: 'nature', name: '自然' },
            { id: 'perception', name: '察觉' },
            { id: 'performance', name: '表演' },
            { id: 'persuasion', name: '说服' },
            { id: 'religion', name: '宗教' },
            { id: 'sleightOfHand', name: '巧手' },
            { id: 'stealth', name: '隐匿' },
            { id: 'survival', name: '生存' }
          ]
        }
      ]`;

content = content.replace(
  /{ name: '多才多艺', description: '你获得两个自选技能的熟练项。' }/g,
  `{ name: '多才多艺', description: '你获得两个自选技能的熟练项。', ${halfElfSkillsChoice} }`
);

const dwarfToolChoice = `choices: [
        {
          id: 'dwarf-tool',
          name: '选择一个工具',
          chooseNumber: 1,
          options: [
            { id: 'smithsTools', name: '铁匠工具' },
            { id: 'brewersSupplies', name: '酿酒工具' },
            { id: 'masonsTools', name: '泥瓦匠工具' }
          ]
        }
      ]`;

content = content.replace(
  /{ name: '工具熟练', description: '你熟练于下列其中一个你所选择的工匠工具：铁匠工具、酿酒工具或泥瓦匠工具。' }/g,
  `{ name: '工具熟练', description: '你熟练于下列其中一个你所选择的工匠工具：铁匠工具、酿酒工具或泥瓦匠工具。', ${dwarfToolChoice} }`
);

fs.writeFileSync('src/data/races.ts', content);
