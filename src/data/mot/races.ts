import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'triton',
    name: '梭螺鱼人',
    description: '梭螺鱼人是尊贵自豪的深海守护者。他们为剿灭深渊邪物而建立起水下堡垒。虽因长期与陆地隔绝而显得有些傲慢，但其内心极富正意、勇武无畏，是天生的海洋斗士。',
    abilityBonuses: [{ ability: 'STR', bonus: 1 }, { ability: 'CON', bonus: 1 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '原初语'],
    traits: [
      { name: '两栖', description: '你可以在空气和水中呼吸。并且你拥有30尺的游泳速度。' },
      { name: '控风操水', description: '可施放云雾术，3级造风术，5级水墙术。' },
      { name: '海之使者', description: '与水中野兽进行简单概念的沟通。' },
      { name: '深海守护者', description: '冷冻伤害抗性，忽视深水环境负面影响。' }
    ],
    spells: [
      { level: 1, spellId: 'fog-cloud' },
      { level: 3, spellId: 'gust-of-wind' },
      { level: 5, spellId: 'wall-of-water' }
    ],
    source: 'mot'
  }
];
