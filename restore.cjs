const fs = require('fs');
let c = fs.readFileSync('src/data/classes.ts', 'utf8');

// 1. Fix the cleric area
const idx1 = c.indexOf("摧毁不死 (CR 3)");
const idx2 = c.indexOf("{ level: 1, spellId: 'bless', alwaysPrepared: true },");

if (idx1 > -1 && idx2 > -1 && idx2 > idx1) {
  const replacement = `摧毁不死 (CR 3)', description: '从14级开始，当一个挑战等级为3或更低的不死生物在对抗你驱散不死能力的豁免检定中失败，该生物将立即被摧毁。', level: 14 },
      { name: '属性值提升', description: '当你在此职业升至16级时，你可以增加一项自选属性值2点，或着你可以增加二项自选属性值各1点。如同平常一样，你不能通过这个能力将一个属性值提升至超过20。如果你的DM允许使用专长的话，你也可以改为获得一个专长。', level: 16 },
      { name: '摧毁不死 (CR 4)', description: '从17级开始，当一个挑战等级为4或更低的不死生物在对抗你驱散不死能力的豁免检定中失败，该生物将立即被摧毁。', level: 17 },
      { name: '神圣领域能力', description: '在17级时，你获得一个由你神圣领域所赋予的能力。', level: 17 },
      { name: '引导神力 (3/休息)', description: '从18级开始，你可以在休息之间使用引导神力三次。', level: 18 },
      { name: '属性值提升', description: '当你在此职业升至19级时，你可以增加一项自选属性值2点，或着你可以增加二项自选属性值各1点。如同平常一样，你不能通过这个能力将一个属性值提升至超过20。如果你的DM允许使用专长的话，你也可以改为获得一个专长。', level: 19 },
      { name: '神力干预强化', description: '在20级时，你呼求干预的动作将自动成功，不再需要掷骰。', level: 20 }
    ],
    spellcasting: {
      type: 'prepared',
      ability: 'WIS',
      cantripsKnown: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
      spellSlots: [
        [2,0,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,0],
        [4,2,0,0,0,0,0,0,0],
        [4,3,0,0,0,0,0,0,0],
        [4,3,2,0,0,0,0,0,0],
        [4,3,3,0,0,0,0,0,0],
        [4,3,3,1,0,0,0,0,0],
        [4,3,3,2,0,0,0,0,0],
        [4,3,3,3,1,0,0,0,0],
        [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0],
        [4,3,3,3,2,1,0,0,0],
        [4,3,3,3,2,1,1,0,0],
        [4,3,3,3,2,1,1,0,0],
        [4,3,3,3,2,1,1,1,0],
        [4,3,3,3,2,1,1,1,0],
        [4,3,3,3,2,1,1,1,1],
        [4,3,3,3,3,1,1,1,1],
        [4,3,3,3,3,2,1,1,1],
        [4,3,3,3,3,2,2,1,1]
      ],
      spellList: 'cleric'
    },
    subclassAvailableAtLevel: 1,
    subclasses: [
      {
        id: 'life-domain',
        name: '生命领域',
        description: '生命领域专注于精力充沛的正能量—构成宇宙的其中一种基本力量—维持所有生命的延续。几乎所有非邪恶的神祇都可以宣称其在这个领域中具有影响力。',
        traits: [
          { name: '额外熟练', description: '你获得重甲的熟练。', level: 1 },
          { name: '生命门徒', description: '你的治疗法术变得更加有效。每当你使用一个1环或更高环的法术以回复一个生物的生命值时，该生物额外回复等同于2 + 该法术环阶的生命值。', level: 1 },
          { name: '引导神力：维系生命', description: '你可以使用你的引导神力以治疗严重的伤势。以一个动作，你展现你的圣徽并唤起可以回复等同于你牧师等级五倍生命值的治疗能量。选择任何距离你30尺内的生物，并将这些生命值分配给它们回复。这个能力无法让一个生物回复到超过它生命值最大值的一半。你不能对不死生物或构装体使用此能力。', level: 2 },
          { name: '祝圣医者', description: '你施放于他人的治疗法术也将治疗你自己。当你施放一个1环或更高环的法术以回复除了你以外一个生物的生命值时，你将回复等同于2 + 该法术环阶的生命值。', level: 6 },
          { name: '神圣打击', description: '你获得将神圣能量注入你武器打击的能力。在你的每个回合一次，当你使用一次武器攻击命中一个生物时，你可以使该攻击对目标造成额外的1d8光耀伤害。当你升至14级时，这个额外伤害增加至2d8。', level: 8 },
          { name: '极效治疗', description: '当你需要骰一颗或以上的骰子以决定使用法术回复的生命值时，你改为使用每颗骰子的最大值。举例来说，当你要回复一个生物2d6点生命值时，你改为直接回复它12点生命值。', level: 17 }
        ],
        spells: [
          `;
  const originalMiddle = c.substring(idx1, idx2);
  c = c.slice(0, idx1) + replacement + c.slice(idx2);
}

// 2. Fix the Fighter battle master area
const idx3 = c.indexOf("        description: '战斗大师是将战斗视为学术一般的人。对他们来说，战斗就是一门学术。战斗大师范型包含了一些在战斗以外的专业，像是武器锻造和书法等等。',\n          },");
const idx4 = c.indexOf("        traits: [\n          { name: '战争学徒', description: '你获得一种你所选的工匠工具的熟练。', level: 3 },", idx3 > -1 ? idx3 : 0);

if (idx3 > -1 && idx4 > -1) {
  const replacement2 = `        description: '战斗大师是将战斗视为学术一般的人。对他们来说，战斗就是一门学术。战斗大师范型包含了一些在战斗以外的专业，像是武器锻造和书法等等。',\n`;
  c = c.slice(0, idx3) + replacement2 + c.slice(idx4);
} else {
  // If we can't find it exactly because of hidden characters, use simple splice
  const marker = "战斗大师范型包含了一些在战斗以外的专业，像是武器锻造和书法等等。',";
  const startIdx = c.indexOf(marker) + marker.length;
  const endIdx = c.indexOf("traits: [\n          { name: '战争学徒'", startIdx);
  if (startIdx > -1 && endIdx > -1) {
    c = c.slice(0, startIdx) + "\n        " + c.slice(endIdx);
  }
}

fs.writeFileSync('src/data/classes.ts', c);
