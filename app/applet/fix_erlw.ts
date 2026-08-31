import fs from 'fs';
import path from 'path';

function fixErlw() {
  const filePath = path.join(process.cwd(), 'src/data/erlw/races.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Mark of Storm Half-Elf: Should replace base, add CHA+2, DEX+1
  content = content.replace(
    /name: '暴风龙纹半精灵',[\s\S]*?abilityBonuses: \[\{ ability: 'DEX', bonus: 1 \}\],/,
    `name: '暴风龙纹半精灵',\n        description: '暴风龙纹半精灵携带有控制气候与蔚蓝风暴力量的龙纹。他们抗性卓越，在波涛汹涌的海轮或空艇中能凭借超凡直觉驾驭风向，是用狂风神术御行万里的风雨之子。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'DEX', bonus: 1 }],`
  );

  // Mark of Detection Half-Elf: replace base, WIS+2, ANY+1
  content = content.replace(
    /name: '侦测龙纹半精灵',[\s\S]*?abilityBonuses: \[\{ ability: 'WIS', bonus: 2 \}\],/,
    `name: '侦测龙纹半精灵',\n        description: '侦测龙纹半精灵携带有看破迷雾与勘破隐秘力量的龙纹。他们天生具有敏锐的推理直觉，能一眼识破藏匿于暗影中的魔能，是帝国中最杰出的密探与调查大师。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],`
  );
  // Need to insert ASI traits for Mark of Detection later to traits array

  // Human / Half-Orc Marks
  // Finding (Half-Orc)
  content = content.replace(
    /name: '探索龙纹半兽人',[\s\S]*?abilityBonuses: \[\{ ability: 'WIS', bonus: 2 \}, \{ ability: 'CON', bonus: 1 \}\],/,
    `name: '探索龙纹半兽人',\n        description: '探索龙纹半兽人携带能洞察猎物踪迹、辨明世间方位的追踪之龙纹。他们继承了荒野之子的直觉感知，擅使猎人印记追踪百里，是寻龙点穴、追索逃犯的最强猎犬。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'CON', bonus: 1 }],`
  );

  // Human: Handling, Making, Sentinel, Passage
  content = content.replace(
    /name: '畜牧龙纹人类',[\s\S]*?abilityBonuses: \[\{ ability: 'WIS', bonus: 2 \}\],/,
    `name: '畜牧龙纹人类',\n        description: '畜牧龙纹人类拥有与野生野兽和巨型魔法生物进行心灵链接的特异龙纹。他们极易赢得生灵信任，可轻易驯化智力低下怪兽，是荒野畜牧和自然生态的坚固桥梁。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],`
  );
  content = content.replace(
    /name: '创造龙纹人类',[\s\S]*?abilityBonuses: \[\{ ability: 'INT', bonus: 2 \}\],/,
    `name: '创造龙纹人类',\n        description: '创造龙纹人类携带有操控万物结构、点石成金的制造之龙纹。他们是天生的工匠大师与附魔学者，能单手附魔兵刃，用修复术维持精密机关，是工业帝国的魔能枢纽。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'INT', bonus: 2 }],`
  );
  content = content.replace(
    /name: '守护龙纹人类',[\s\S]*?abilityBonuses: \[\{ ability: 'CON', bonus: 2 \}, \{ ability: 'WIS', bonus: 1 \}\],/,
    `name: '守护龙纹人类',\n        description: '守护龙纹人类携带着坚不可摧之叹息之墙的守卫龙纹。他们直觉感官极其锐利，关键时刻能挺身而出、替换替友承受重创，是用肉躯与护盾捍卫誓言的钢铁人墙。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],`
  );
  content = content.replace(
    /name: '通行龙纹人类',[\s\S]*?abilityBonuses: \[\{ ability: 'DEX', bonus: 2 \}\],/,
    `name: '通行龙纹人类',\n        description: '通行龙纹人类携带着能操纵空间折叠、运动无阻的移动之龙纹。他们移速如飞，能于战场上踏碎虚空，自如施展迷踪步，是冲锋陷阵、纵横无阻的战地信使。',\n        replaceBaseAsi: true,\n        abilityBonuses: [{ ability: 'DEX', bonus: 2 }],`
  );
  
  // Also finding human? Wait, Finding is only Half-Orc and Human. ERLW only has finding half-orc!

  fs.writeFileSync(filePath, content, 'utf8');
}
fixErlw();
