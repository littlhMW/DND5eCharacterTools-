const fs = require('fs');

const path = 'src/data/classes.ts';
let code = fs.readFileSync(path, 'utf8');

const asiTrait = `{ level: 4, name: '属性值提升', description: '你的某个属性值增加2，或某两个属性值分别增加1。' },
      { level: 8, name: '属性值提升', description: '你的某个属性值增加2，或某两个属性值分别增加1。' },
      { level: 12, name: '属性值提升', description: '你的某个属性值增加2，或某两个属性值分别增加1。' },
      { level: 16, name: '属性值提升', description: '你的某个属性值增加2，或某两个属性值分别增加1。' },
      { level: 19, name: '属性值提升', description: '你的某个属性值增加2，或某两个属性值分别增加1。' },
      { level: 20, name: '巅峰能力', description: '你达到了职业的顶端，解锁了20级巅峰特性。' }`;

const extraAttackTrait = `,
      { level: 5, name: '额外攻击', description: '你在自己回合内执行攻击动作时，可以发动两次攻击而非一次。' }`;

// Find class blocks and replace the end of their traits array.
code = code.replace(/traits: \[(.*?)\](,\s*source: 'phb',\s*subclasses: \[)/gs, (match, innerTraits, suffix) => {
  let toAdd = asiTrait;
  if (innerTraits.includes('狂暴') || innerTraits.includes('战斗风格') || innerTraits.includes('武艺') || innerTraits.includes('神圣重击') || innerTraits.includes('宿敌')) {
    toAdd += extraAttackTrait;
  }
  return `traits: [${innerTraits}, ${toAdd}]${suffix}`;
});

fs.writeFileSync(path, code);
console.log('Modified classes.ts successfully.');
