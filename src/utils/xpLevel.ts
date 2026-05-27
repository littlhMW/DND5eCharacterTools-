export interface XPLevelMilestone {
  level: number;
  xpRequired: number;
  profBonus: number;
}

export const XP_LEVEL_TABLE: XPLevelMilestone[] = [
  { level: 1, xpRequired: 0, profBonus: 2 },
  { level: 2, xpRequired: 300, profBonus: 2 },
  { level: 3, xpRequired: 900, profBonus: 2 },
  { level: 4, xpRequired: 2700, profBonus: 2 },
  { level: 5, xpRequired: 6500, profBonus: 3 },
  { level: 6, xpRequired: 14000, profBonus: 3 },
  { level: 7, xpRequired: 23000, profBonus: 3 },
  { level: 8, xpRequired: 34000, profBonus: 3 },
  { level: 9, xpRequired: 48000, profBonus: 4 },
  { level: 10, xpRequired: 64000, profBonus: 4 },
  { level: 11, xpRequired: 85000, profBonus: 4 },
  { level: 12, xpRequired: 100000, profBonus: 4 },
  { level: 13, xpRequired: 120000, profBonus: 5 },
  { level: 14, xpRequired: 140000, profBonus: 5 },
  { level: 15, xpRequired: 165000, profBonus: 5 },
  { level: 16, xpRequired: 195000, profBonus: 5 },
  { level: 17, xpRequired: 225000, profBonus: 6 },
  { level: 18, xpRequired: 265000, profBonus: 6 },
  { level: 19, xpRequired: 305000, profBonus: 6 },
  { level: 20, xpRequired: 355000, profBonus: 6 }
];

export function getLevelFromXp(xp: number): number {
  if (xp < 0 || isNaN(xp)) return 1;
  let targetLevel = 1;
  for (const milestone of XP_LEVEL_TABLE) {
    if (xp >= milestone.xpRequired) {
      targetLevel = milestone.level;
    } else {
      break;
    }
  }
  return targetLevel;
}

export function getXpRequiredForLevel(level: number): number {
  const milestone = XP_LEVEL_TABLE.find(m => m.level === level);
  return milestone ? milestone.xpRequired : 0;
}

export interface TierInfo {
  tier: string;
  levelRange: string;
  description: string;
}

export function getTierOfPlay(level: number): TierInfo {
  if (level <= 4) {
    return {
      tier: '第一阶层',
      levelRange: '1-4级',
      description: '在第一阶层(1-4级)，角色们只能算是新手冒险者。他们还在学习那些使他们成为其职业成员的职业能力，其中也包括一些在他们升级时会影响其职业能力的重要选择（像是法师的奥法学派、或战士的武术范型）。他们所面对的威胁相对较小，通常是对付那些对当地农场或村庄造成影响的危害。'
    };
  } else if (level <= 10) {
    return {
      tier: '第二阶层',
      levelRange: '5-10级',
      description: '在第二阶层(5-10级)，角色们逐渐崭露头角。许多施法者在这个阶层将开始能够使用3环法术，像是火球术和闪电束，在魔法力量上跨越了一道标志性的门槛。在这个阶层，许多使用武器的职业也获得了在一轮中进行多次攻击的能力。这些角色逐渐变得举足轻重，并面对那些威胁城市或王国的危险。'
    };
  } else if (level <= 16) {
    return {
      tier: '第三阶层',
      levelRange: '11-16级',
      description: '在第三阶层(11-16级)，角色们达到了使他们远超寻常大众的境界，甚至让他们在众冒险者中也显得鹤立鸡群。在11级，许多施法者将能够施展6环法术，其中一些甚至能创造出过去玩家角色们无法达成的效果。其他角色则能够进行更多次的攻击、或在攻击时做出更令人惊艳的行为。这些强大的冒险者们将对抗那威胁着整片区域乃至整个大陆的危险。'
    };
  } else {
    return {
      tier: '第四阶层',
      levelRange: '17-20级',
      description: '在第四阶层(17-20级)，角色们升华至其职业能力的巅峰，成为了自成一派的英雄（或反派）典范。他们的冒险活动将影响整个世界的命运，或甚至整个多元宇宙的秩序平衡。'
    };
  }
}
