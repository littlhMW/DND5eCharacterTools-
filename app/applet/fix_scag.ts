import fs from 'fs';
import path from 'path';

const file = path.join('/app/applet/src/data/scag/backgrounds.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /skillProficiencies:\s*\['deception', 'insight', 'persuasion', 'stealth'\],[\s]*toolProficiencies:\s*\["一种赌具", "一种乐器", "盗贼工具"\],/,
  `skillProficiencies: [],
    toolProficiencies: [],
    choices: [
      {
        id: 'urban-bounty-hunter-skills',
        name: '技能熟练 (任选二)',
        chooseNumber: 2,
        options: [
          { id: 'deception', name: '欺瞒', description: '魅力' },
          { id: 'insight', name: '洞悉', description: '感知' },
          { id: 'persuasion', name: '说服', description: '魅力' },
          { id: 'stealth', name: '隐匿', description: '敏捷' }
        ]
      },
      {
        id: 'urban-bounty-hunter-tools',
        name: '工具熟练 (任选二)',
        chooseNumber: 2,
        options: [
          { id: 'gaming-set', name: '一种赌具', description: '工具' },
          { id: 'musical-instrument', name: '一种乐器', description: '工具' },
          { id: 'thieves-tools', name: '盗贼工具', description: '工具' }
        ]
      }
    ],`
);

content = content.replace(
  /name:\s*"继承者",\s*description:[^,]+,[\s]*skillProficiencies:\s*\['survival', 'arcana', 'history', 'religion'\],[\s]*toolProficiencies:\s*\["一种赌具", "一种乐器"\],/,
  `name: "继承者",
    description: "从下表中选择或随机决定一个你所继承的遗产。和你的DM一起讨论并决定其细节：你的继承物为什么如此重要，它的来龙去脉又是什么？你可能会希望让DM在游戏中创造这些细节，让你得以如同你的角色在游戏过程中一步步知道更多关于你继承物的事情。",
    skillProficiencies: ['survival'],
    toolProficiencies: [],
    choices: [
      {
        id: 'inheritor-skills',
        name: '技能熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'arcana', name: '奥秘', description: '智力' },
          { id: 'history', name: '历史', description: '智力' },
          { id: 'religion', name: '宗教', description: '智力' }
        ]
      },
      {
        id: 'inheritor-tools',
        name: '工具熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'gaming-set', name: '一种赌具', description: '工具' },
          { id: 'musical-instrument', name: '一种乐器', description: '工具' }
        ]
      }
    ],`
);

content = content.replace(
  /name:\s*"教团骑士",\s*description:[^,]+,[\s]*skillProficiencies:\s*\['persuasion', 'arcana', 'history', 'nature', 'religion'\],[\s]*toolProficiencies:\s*\["一种赌具", "一种乐器"\],/,
  `name: "教团骑士",
    description: "你能得到来自你的骑士团成员、和那些对骑士团目标有着共感的人们的庇护和援助。",
    skillProficiencies: ['persuasion'],
    toolProficiencies: [],
    choices: [
      {
        id: 'knight-order-skills',
        name: '技能熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'arcana', name: '奥秘', description: '智力' },
          { id: 'history', name: '历史', description: '智力' },
          { id: 'nature', name: '自然', description: '智力' },
          { id: 'religion', name: '宗教', description: '智力' }
        ]
      },
      {
        id: 'knight-order-tools',
        name: '工具熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'gaming-set', name: '一种赌具', description: '工具' },
          { id: 'musical-instrument', name: '一种乐器', description: '工具' }
        ]
      }
    ],`
);

content = content.replace(
  /name:\s*"派系特工",\s*description:[^,]+,[\s]*skillProficiencies:\s*\['insight'\],\s*\/\/ TODO.*?\n\s*toolProficiencies:\s*\[\],/,
  `name: "派系特工",
    description: "你可以接触那些秘密联系网中的支持者和探员来为你的冒险提供协助。",
    skillProficiencies: ['insight'],
    toolProficiencies: [],
    choices: [
      {
        id: 'faction-agent-skills',
        name: '技能熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'arcana', name: '奥秘', description: '智力' },
          { id: 'history', name: '历史', description: '智力' },
          { id: 'nature', name: '自然', description: '智力' },
          { id: 'religion', name: '宗教', description: '智力' },
          { id: 'animal-handling', name: '驯兽', description: '感知' },
          { id: 'medicine', name: '医药', description: '感知' },
          { id: 'perception', name: '察觉', description: '感知' },
          { id: 'survival', name: '生存', description: '感知' },
          { id: 'deception', name: '欺瞒', description: '魅力' },
          { id: 'intimidation', name: '威吓', description: '魅力' },
          { id: 'performance', name: '表演', description: '魅力' },
          { id: 'persuasion', name: '说服', description: '魅力' }
        ]
      }
    ],`
);

content = content.replace(
  /name:\s*"修院学士",\s*description:[^,]+,[\s]*skillProficiencies:\s*\['history', 'arcana', 'nature', 'religion'\],/,
  `name: "修院学士",
    description: "你能免费且轻易地使用图书馆中大部分的内容。",
    skillProficiencies: ['history'],
    choices: [
      {
        id: 'cloistered-scholar-skills',
        name: '技能熟练 (任选一)',
        chooseNumber: 1,
        options: [
          { id: 'arcana', name: '奥秘', description: '智力' },
          { id: 'nature', name: '自然', description: '智力' },
          { id: 'religion', name: '宗教', description: '智力' }
        ]
      }
    ],`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed SCAG backgrounds');
