import React, { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw, User, Compass, HeartHandshake, Sparkles, Shuffle, UserPlus, Network, LayoutList, Axe, Music, HeartPulse, Leaf, Sword, HandMetal, Shield, Target, Flame, Eye, BookOpen, Wand2, Scissors } from 'lucide-react';
import { generateRandomName, generateMotif } from '../../utils/nameGenerator';
import { generatePartyNameWithRules } from '../../utils/partyNameGenerator';
import { races } from '../../data/races';
import { classes } from '../../data/classes';
import { isSourceEnabled } from '../../utils/expansionHelper';
import { useCharacter } from '../../context/CharacterContext';
import { getAIConfig, generatePartyBiography } from '../../utils/aiHelper';
import { FormattedDescription } from '../shared/FormattedDescription';
import { 
  UNIVERSAL_APPEARANCE_FEATURES, 
  EXTRA_PERSON_TRAITS, 
  EXTRA_QUIRKS, 
  LAW_CHAOS_AXIS, 
  GOOD_EVIL_AXIS, 
  RACES_MAPPING 
} from './AppearancePersonalityGenerator';

interface PartyMember {
  id: string;
  name: string;
  race: string;
  className: string;
  alignment: string;
  gender: 'male' | 'female' | 'none';
  age: number;
  stats: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
  appearance: {
    hairColor: string;
    eyeColor: string;
    skinColor: string;
    feature: string;
  };
  personality: {
    trait: string;
    quirk: string;
  };
  selfPositioning: string;
  isCaptain?: boolean;
}

interface Relationship {
  fromId: string;
  toId: string;
  type: string;
  description: string;
}

interface Party {
  name: string;
  accronym: string;
  motif: string;
  origin: string; // 队伍起因：怎么产生的
  goal: string;   // 目的
  members: PartyMember[];
  relationships: Relationship[];
}

const ALIGNMENTS = ["守序善良 (LG)", "中立善良 (NG)", "混乱善良 (CG)", "守序中立 (LN)", "绝对中立 (N)", "混乱中立 (CN)", "守序邪恶 (LE)", "中立邪恶 (NE)", "混乱邪恶 (CE)"];

// Gender Options
const GENDERS: Array<'male' | 'female' | 'none'> = ['male', 'female', 'none'];

// Team origins
const ORIGINS = [
  "在一次意外事件中，几个在场的人不约而同地挺身而出，事后便结伴同行。",
  "原本各自为战，却因追寻同一个目标在某条路上相遇，决定搭伙。",
  "一场突如其来的灾害将幸存者们逼到了一处，从此彼此依靠。",
  "某次旅途中，一场暴风雪把几个陌生人困在了同一间破屋，围着火堆约定同行。",
  "被同一份雇佣任务招募，任务结束后却发现彼此合作远胜单干。",
  "在逃避某种追捕时，几个人撞进了同一片密林，被迫建立信任。",
  "一次遗迹探索中，不同来路的人马遭遇塌方，仅存的幸存者结成了新的团体。",
  "在酒馆里因为一瓶劣酒起了争执，打完后却莫名其妙地坐在一起喝到了天亮，从此成了搭档。",
  "所有人都记得那晚，酒馆外暴雨如注，一个受伤的信使撞开门，把所有人卷入同一场风波。",
  "几个人在完全不同的人生节点，收到了内容相同的神秘信件，指引他们相遇。",
  "梦境中反复出现的同一个符号，引导他们在现实里找到彼此。",
  "一本古老的手札被几个人先后发现，书页边缘写满了对方的名字。",
  "各自携带的信物在靠近彼此时同时发出微光，将他们牵往一处。",
  "一道极其罕见的星象变化，让几位命定之人在同一时刻抬头望天，随后相遇。",
  "在一次对某个远古装置的意外触碰后，分散各地的灵魂被拉到同一地点。",
  "祖辈留下的盟约在百年后依旧通过血脉共振被唤醒，将后代们重新联结。",
  "一场无法解释的次元交叠席卷世界，几个幸存者发现只有彼此能够看见对方。"
];

// Team quest goals
const GOALS = [
  "在乱世中结伴求生，仅此而已。",
  "想一起走一段路，看看能闯出什么名堂。",
  "为了偿还一笔共同的债务，不得不联手。",
  "只是想保护各自珍视的人，而单干已经不够。",
  "寻找失踪的亲人，线索指向同一个方向。",
  "探索一处未被标注的古老废墟，各怀目的却路径相同。",
  "追查一种在各地悄然蔓延的诡异疫病源头。",
  "设法阻止一场悬在头顶的战争，哪怕希望渺茫。",
  "打破某个长久禁锢着这片土地的、不为人知的诅咒。",
  "抢在多方势力之前找到失落已久的那件遗物。",
  "修复一处正在缓慢崩塌的世界边界裂隙。",
  "共同照顾一个无法被任何单一个体保护的特殊之人。",
  "终结一个不断在梦境中纠缠所有人的存在。",
  "完成一段被刻在血脉里的古老誓言，尽管无人完全理解其含义。",
  "见证一个传说中每百年只开启一次的奇迹。",
  "送还一件本不属于此世的物品，把它放回它该去的地方。",
  "阻止一个尚未诞生的未来，因为所有人都已见过那个未来的残骸。",
  "让世界记起一个被所有人遗忘的名字，否则一切将开始消散。"
];

// Team relative connection styles
const RELATION_TYPES = [
  { type: "爱慕", A: ["对方的身影总牵动着自己的目光。", "心底藏着未曾说出口的情意。", "只要对方在场，世界便仿佛更明亮。", "对方的每一个细微表情都看在眼里、记在心头。", "和别人说话时视线总是不自觉地飘向对方那边。"], B: ["哪怕身处险境也甘之如饴。", "任何一点微小的关心都会被反复回味。", "始终将对方的安危置于自己之上。", "光是并肩站在一起就觉得心里踏实。", "愿意用漫长的时间去等一个不确定的可能。"] },
  { type: "憎恨", A: ["一看到对方便觉胸中翻涌压抑。", "对方的存在本身就是一种折磨。", "无法释怀那场被背叛的过去。", "恨不得所有关于对方的记忆都能被抹去。", "对方的笑声听起来格外刺耳。"], B: ["日夜盼望着亲手终结这份恩怨。", "哪怕自损八百也要让对方付出代价。", "任何和解的念头都被怒火烧成灰烬。", "绝不接受与对方踏上同一条归途。", "就算时间流逝也无法冲淡分毫。"] },
  { type: "信赖", A: ["认定对方是可以交付后背之人。", "无论发生什么都不会怀疑其忠诚。", "在迷惑时首先会寻求对方的判断。", "愿意把最重要的事托付给对方去做。", "对方的一句保证就能让悬着的心放下来。"], B: ["从不检查对方递来的食物与消息。", "甚至愿意将性命托付于一项草率的承诺。", "哪怕所有人反对也坚信对方是对的。", "听完对方的建议便不再犹豫。", "就算证据全都指向相反的方向也不愿怀疑。"] },
  { type: "猜忌", A: ["总觉得对方在隐瞒什么。", "对方的微笑背后似乎藏着另一张脸。", "每个无意间的举动都被视为试探。", "对方越是热情就越觉得不对劲。", "从来不敢在对方面前真正放松警惕。"], B: ["总是下意识地核实对方说过的话。", "不敢在对方视线所及之处露出破绽。", "哪怕最普通的善意也令人生疑。", "反复盘算对方接近自己的动机。", "总想在对方身上找出什么蛛丝马迹。"] },
  { type: "崇拜", A: ["视对方为无法企及的高峰。", "对对方的一言一行都深信不疑。", "觉得对方身上有着自己永远缺乏的东西。", "每次看对方出手都忍不住心生折服。", "仿佛只要跟着对方走就一定能抵达更好的地方。"], B: ["默默模仿对方的举止与习惯。", "为了博得一句肯定愿意付出一切。", "将对方的信念当作自己的信仰。", "不敢靠近太过却忍不住远远地望。", "哪怕只是被对方顺便提起，都会记上一整天。"] },
  { type: "蔑视", A: ["认为对方浅薄得可笑。", "看对方的眼神始终带着一丝不以为然。", "连与对方多说一句话都觉得浪费时间。", "从不把对方的话放在心上半分。", "对方的存在感在眼里一天比一天薄弱。"], B: ["在任何场合都不屑于考虑对方的建议。", "公开将对方的努力视为徒劳。", "甚至懒得掩饰脸上的轻蔑。", "听对方说话时总忍不住叹气。", "从未想过对方有朝一日能让人改观。"] },
  { type: "亲近", A: ["和对方在一起时总是最放松。", "无需言语便能读懂彼此的情绪。", "相处起来仿佛呼吸般自然。", "有好吃的会下意识留对方一份。", "遇到什么事第一个就想告诉对方。"], B: ["累了总会第一个想到对方的所在。", "沉默也不觉尴尬反而安心。", "总是下意识地把对方喜欢的东西留到最后。", "一起走路时会不自觉地放慢脚步等对方。", "很久不见就会觉得少了点什么。"] },
  { type: "疏远", A: ["已经很久没有私下交谈过了。", "似乎再也找不到共同的话题。", "彼此之间隔着一层看不见的薄冰。", "以前的笑闹好像已经是很久远的事。", "从某个节点之后一切就慢慢变了。"], B: ["刻意避开对方出没的地方。", "偶然碰面也只是点头而过。", "曾经的热络已被时间漂洗得模糊。", "连对方的近况都要从别人口中听说。", "想开口却不知道该从何说起。"] },
  { type: "利用", A: ["清楚地知道对方身上的可用之处。", "把对方的付出视为理所当然。", "每次合作心里都打着自己的算盘。", "表面上客气周到实则称斤论两。", "只看重对方能为自己带来什么。"], B: ["只在需要时才主动联络对方。", "从不透露真实的意图。", "一旦对方失去价值便会毫不犹豫地抛弃。", "用完就丢从不觉得亏欠。", "从未把对方当真正的同伴看待。"] },
  { type: "守护", A: ["把保护对方当作自己存在的意义。", "哪怕牺牲自己也在所不惜。", "对方受到的每一次伤害都如同割在自己身上。", "只要看到对方安好就觉得一切都值得。", "总是挡在前面不想让对方沾到一点风浪。"], B: ["永远站在对方与危险之间。", "为了对方敢与世界为敌。", "对方可能永远不知道有人曾悄悄挡下过多少次暗箭。", "连对方不经意提起的害怕的东西都会提前去扫清。", "付出从来不求对方知道。"] },
  { type: "竞争", A: ["总想证明自己比对方更强。", "对方的每一个成就都被视为挑战。", "暗中较量早已成为习惯。", "每次和对方并肩战斗都在心里比试。", "见对方跑在前头就忍不住要追。"], B: ["哪怕在同一阵营也要分个高下。", "输了之后彻夜难眠反复复盘。", "但若外人贬低对方又会忍不住出言维护。", "其实心里很清楚对方是自己最看重的对手。", "没有对方就没有现在这个更好的自己。"] },
  { type: "嫉妒", A: ["对方拥有的一切都让自己感到刺痛。", "不明白为何命运如此不公。", "每当看到对方被称赞内心便一阵酸涩。", "暗想凭什么对方能如此幸运。", "偶尔会幻想对方失去那些东西的样子。"], B: ["曾在深夜幻想过取代对方的位置。", "极力掩饰心底那团阴暗的火焰。", "有时甚至希望对方遭遇一点挫败。", "但真看到对方摔倒了又觉得自己卑鄙。", "在厌恶这样的自己与无法停止的比较之间来回摇摆。"] },
  { type: "默契", A: ["战斗中只需要一个眼神就能配合无间。", "从未事先约定却总能在关键时刻想到一块。", "旁人常以为他们有读心术。", "一个人的话说到一半另一个就能接下去。", "对方刚抬手自己就知道要递什么。"], B: ["一句话只说前半对方便能接出后半。", "在混乱的战况中也能准确找到对方的位置。", "已经不需要商量行动就是最好的交流。", "沉默也不会被误解为冷淡。", "两个人之间有一种近乎自然的同步。"] },
  { type: "误解", A: ["一直以为对方对自己怀有敌意。", "把对方的好意当成了别有所图。", "某个关键事实始终被错误地理解着。", "其实从一开始就猜错了方向。", "两个人都在等对方先解释。"], B: ["每次试图解释反而让误会更深。", "双方都坚信自己看到的是真相。", "从未想过彼此可能都只看到了片面。", "一个无心的举动被当成蓄意的伤害。", "越是想澄清就越被当成掩饰。"] },
  { type: "暖意", A: ["对方曾经在自己最冷的夜里递来一碗热汤。", "那件小事被记了很久很久。", "对方可能不记得却改变了自己的一整天。", "在最孤单的时候是对方无意间陪了自己一程。", "一句话就能驱散淤积了很久的阴霾。"], B: ["每次想起来都让胸口泛起一阵温热的涌动。", "从来没当面谢过却一直想找机会还那份情。", "对方的一个小举动就让自己记到现在。", "也许对方永远不会知道那份善意有多重。", "总觉得这人世里有对方的存在就还不算太坏。"] },
  { type: "挂念", A: ["只要对方稍微离开视线就忍不住猜测是否平安。", "对方晚回来一刻便开始胡思乱想。", "路过对方常去的地方会下意识寻找那个身影。", "天凉了第一个念头是对方有没有添衣服。", "对方的事总是排在自己心事的头几位。"], B: ["就算很久没见也只是更想知道对方过得好不好。", "把对方送的小东西一直带在身边。", "哪怕对方毫不知情这份牵挂也从没断过。", "偶尔深夜醒来会想对方此刻在何方。", "不敢打扰却放不下。"] },
  { type: "牺牲", A: ["曾经为了对方的生机放弃了自己最想要的东西。", "那份选择从未后悔哪怕重来也会再做一次。", "没有声张也没有告诉任何人。", "对方到今天都不知道自己失去了什么。"], B: ["在谁都没察觉的情况下独自扛下了那一次代价。", "不能说也不愿说。", "只是希望对方不用面对那片阴影。", "如果再来一次还是会做同样的选择。"] },
  { type: "追随", A: ["从某一天起就觉得跟着对方准没错。", "不是盲从而是打心底认可对方的方向。", "对方走到哪里自己就愿意跟到哪里。", "不一定因为信仰什么只是信这个人。"], B: ["哪怕没有承诺也始终站在对方那一边。", "对方要去的远方自己也想去看看。", "不是依附而是心甘情愿。", "从来没说过但一直把自己当成对方的同路人。"] },
  { type: "欢笑", A: ["和对方一起时总能笑出最轻松的声音。", "光是看到对方憋笑的表情自己就忍不住先破功。", "很多年以后最先想起的还是两个人笑得直不起腰的画面。", "对方的存在让所有苦难都变得能够消化。", "哪怕只是对视一眼也能同时笑出声来。"], B: ["在最糟糕的日子里硬是被对方逗到忘记烦恼。", "那些一起犯蠢的回忆反而成了最珍贵的东西。", "和对方在一起时自己像换了个人似的开朗。", "从来不需要刻意找话题快乐总是自己就来了。"] },
  { type: "理解", A: ["对方是少数几个不需要费力解释自己的人。", "有些事说不清楚但对方就是能懂。", "自己的沉默在对方那里从来不会被当成冷漠。", "只消一个表情对方就知道今天是什么心情。"], B: ["哪怕自己都说不明白对方却能替自己说出来。", "那种被读懂的感觉像是终于松了一口气。", "在所有人误解自己的时候只有对方说了一句我明白。", "不是安慰而是真正知道自己在想什么。", "这样的理解一生也遇不到几次。"] }
];

function getRandomAge(raceName: string): number {
  const name = raceName || "";
  if (name.includes("精灵") && !name.includes("半精灵")) {
    return Math.floor(Math.random() * 250) + 70; // 70-320岁之间
  }
  if (name.includes("半精灵") || name.includes("天界") || name.includes("阿斯莫") || name.includes("提夫林")) {
    return Math.floor(Math.random() * 90) + 18; // 18-108岁之间
  }
  if (name.includes("矮人")) {
    return Math.floor(Math.random() * 150) + 45; // 45-195岁之间
  }
  if (name.includes("侏儒") || name.includes("半身人")) {
    return Math.floor(Math.random() * 180) + 22; // 22-202岁之间
  }
  if (name.includes("半兽人") || name.includes("龙裔")) {
    return Math.floor(Math.random() * 40) + 14; // 14-54岁之间
  }
  return Math.floor(Math.random() * 45) + 18; // 18-63岁之间
}

function generateMember(raceList: any[], classList: any[]): PartyMember {
  const race = raceList[Math.floor(Math.random() * raceList.length)];
  const cls = classList[Math.floor(Math.random() * classList.length)];
  
  // Decide gender - male (男), female (女), none (无)
  const randGender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  
  // For name generation, if none, we fall back to a random choice between male and female
  const isMaleName = randGender === 'male' ? true : (randGender === 'female' ? false : Math.random() > 0.5);
  const name = generateRandomName(race.id, isMaleName);
  
  const alignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];
  
  // Choose subrace if available, and decide displayName
  let displayName = race.name;
  if (race.subraces && race.subraces.length > 0) {
    const validSubraces = race.subraces.filter((sr: any) => isSourceEnabled(sr.source || race.source || 'phb', 'races'));
    const subracesToChoose = validSubraces.length > 0 ? validSubraces : race.subraces;
    const selectedSubrace = subracesToChoose[Math.floor(Math.random() * subracesToChoose.length)];
    if (selectedSubrace.name.includes("本相")) {
      displayName = race.name;
    } else {
      displayName = selectedSubrace.name;
    }
  }

  const age = getRandomAge(displayName);
  
  // Helper to match displayName to RACES_MAPPING keys
  const matchRaceToMappingKey = (dName: string, baseName: string): string => {
    const keys = Object.keys(RACES_MAPPING);
    let match = keys.find(k => k === dName);
    if (match) return match;
    match = keys.find(k => k.includes(dName));
    if (match) return match;
    match = keys.find(k => k.includes(baseName));
    if (match) return match;
    return "人类";
  };

  const mappingKey = matchRaceToMappingKey(displayName, race.name);
  const raceAssets = RACES_MAPPING[mappingKey] || RACES_MAPPING["人类"];

  const skinColor = raceAssets.skin[Math.floor(Math.random() * raceAssets.skin.length)];
  const hairColor = raceAssets.hair[Math.floor(Math.random() * raceAssets.hair.length)];
  const eyeColor = raceAssets.eye[Math.floor(Math.random() * raceAssets.eye.length)];
  const baseFeature = raceAssets.features[Math.floor(Math.random() * raceAssets.features.length)];
  const randUniFeature = UNIVERSAL_APPEARANCE_FEATURES[Math.floor(Math.random() * UNIVERSAL_APPEARANCE_FEATURES.length)];
  const feature = `${baseFeature}，同时${randUniFeature}`;

  // Parse alignment
  let lawChaos: 'lawful' | 'neutral' | 'chaotic' = 'neutral';
  let goodEvil: 'good' | 'neutral' | 'evil' = 'neutral';
  
  if (alignment.includes('守序') || alignment.includes('LG') || alignment.includes('LN') || alignment.includes('LE')) {
    lawChaos = 'lawful';
  } else if (alignment.includes('混乱') || alignment.includes('CG') || alignment.includes('CN') || alignment.includes('CE')) {
    lawChaos = 'chaotic';
  }
  
  if (alignment.includes('善良') || alignment.includes('LG') || alignment.includes('NG') || alignment.includes('CG')) {
    goodEvil = 'good';
  } else if (alignment.includes('邪恶') || alignment.includes('LE') || alignment.includes('NE') || alignment.includes('CE')) {
    goodEvil = 'evil';
  }

  const lcObj = LAW_CHAOS_AXIS[lawChaos];
  const geObj = GOOD_EVIL_AXIS[goodEvil];
  
  const randExtraTrait = EXTRA_PERSON_TRAITS[Math.floor(Math.random() * EXTRA_PERSON_TRAITS.length)];
  const randExtraQuirk = EXTRA_QUIRKS[Math.floor(Math.random() * EXTRA_QUIRKS.length)];
  const randLawChaosBelief = lcObj.beliefs[Math.floor(Math.random() * lcObj.beliefs.length)];
  const randGoodEvilBelief = geObj.beliefs[Math.floor(Math.random() * geObj.beliefs.length)];
  const randLawChaosManner = lcObj.manners[Math.floor(Math.random() * lcObj.manners.length)];
  const randGoodEvilManner = geObj.manners[Math.floor(Math.random() * geObj.manners.length)];
  
  const combinedBelief = `${randLawChaosBelief}，同时${randGoodEvilBelief}`;
  const combinedManner = `${randLawChaosManner}，且${randGoodEvilManner}`;

  const trait = `的核心信条为：${combinedBelief}。日常作派是${combinedManner}。此外，${randExtraTrait}`;
  const quirk = `私下也有一些行为习惯：${randExtraQuirk}`;

  // Stats standard array randomized
  const std = [15, 14, 13, 12, 10, 8].sort(() => Math.random() - 0.5);
  
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `mbr-${Math.random().toString(36).substring(2, 9)}`,
    name,
    race: displayName,
    className: cls.name,
    gender: randGender,
    age,
    alignment,
    appearance: {
      hairColor,
      eyeColor,
      skinColor,
      feature
    },
    personality: {
      trait,
      quirk
    },
    selfPositioning: "",
    stats: { str: std[0], dex: std[1], con: std[2], int: std[3], wis: std[4], cha: std[5] }
  };
}

function generateRelationshipsForMembers(members: PartyMember[]): Relationship[] {
  const result: Relationship[] = [];
  const count = members.length;
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const t = RELATION_TYPES[Math.floor(Math.random() * RELATION_TYPES.length)];
      const descA = t.A[Math.floor(Math.random() * t.A.length)];
      const descB = t.B[Math.floor(Math.random() * t.B.length)];
      result.push({
        fromId: members[i].id,
        toId: members[j].id,
        type: t.type,
        description: `${descA}${descB}`
      });
    }
  }
  return result;
}

function getClassIcon(className: string, props: any = { size: 32, strokeWidth: 1.5 }) {
  if (className.includes('野蛮人') || className.includes('Barbarian')) return <Axe {...props} />;
  if (className.includes('诗人') || className.includes('Bard')) return <Music {...props} />;
  if (className.includes('牧师') || className.includes('Cleric')) return <HeartPulse {...props} />;
  if (className.includes('德鲁伊') || className.includes('Druid')) return <Leaf {...props} />;
  if (className.includes('战士') || className.includes('Fighter')) return <Sword {...props} />;
  if (className.includes('武僧') || className.includes('Monk')) return <HandMetal {...props} />;
  if (className.includes('圣武士') || className.includes('Paladin')) return <Shield {...props} />;
  if (className.includes('游侠') || className.includes('Ranger')) return <Target {...props} />;
  if (className.includes('游荡者') || className.includes('Rogue')) return <Scissors {...props} />;
  if (className.includes('术士') || className.includes('Sorcerer')) return <Flame {...props} />;
  if (className.includes('邪术师') || className.includes('Warlock')) return <Eye {...props} />;
  if (className.includes('法师') || className.includes('Wizard')) return <BookOpen {...props} />;
  return <Wand2 {...props} />;
}

const getClassColor = (className: string) => {
  if (className.includes('野蛮人') || className.includes('Barbarian')) return '#b91c1c';
  if (className.includes('诗人') || className.includes('Bard')) return '#db2777';
  if (className.includes('牧师') || className.includes('Cleric')) return '#2563eb';
  if (className.includes('德鲁伊') || className.includes('Druid')) return '#059669';
  if (className.includes('战士') || className.includes('Fighter')) return '#b45309';
  if (className.includes('武僧') || className.includes('Monk')) return '#06b6d4';
  if (className.includes('圣武士') || className.includes('Paladin')) return '#d97706';
  if (className.includes('游侠') || className.includes('Ranger')) return '#15803d';
  if (className.includes('游荡者') || className.includes('Rogue')) return '#1f2937';
  if (className.includes('术士') || className.includes('Sorcerer')) return '#dc2626';
  if (className.includes('邪术师') || className.includes('Warlock')) return '#7c3aed';
  if (className.includes('法师') || className.includes('Wizard')) return '#4f46e5';
  return '#57534e';
};

const getRelColor = (type: string) => {
  const map: Record<string, string> = {
    "爱慕": "#db2777", // deep pink/rose
    "憎恨": "#dc2626", // severe pure crimson red
    "信赖": "#059669", // safe bright emerald green
    "猜忌": "#b45309", // dark gold/amber/mustard
    "崇拜": "#d97706", // devotive golden-yellow
    "蔑视": "#64748b", // slate gray
    "亲近": "#f43f5e", // sweet rose red
    "疏远": "#78716c", // cool stone gray
    "利用": "#0d9488", // calculated dark cyan
    "守护": "#10b981", // protect active green
    "竞争": "#ea580c", // intense flame orange
    "嫉妒": "#84cc16", // lime green
    "默契": "#4f46e5", // deep royal indigo
    "误解": "#7c2d12", // brownish/maroon-red
    "暖意": "#fb7185", // radiant warm pastel rose
    "挂念": "#2563eb", // thoughtful deep sky blue
    "牺牲": "#be123c", // burgundy crimson
    "追随": "#8b5cf6", // spiritual violet purple
    "欢笑": "#eab308", // joyful beaming yellow
    "理解": "#06b6d4"  // bright cyan intellect
  };
  return map[type] || "#78716c";
};

interface PartyGeneratorProps {
  onClose: () => void;
  onSaveCharacter?: () => void;
}

export function PartyGenerator({ onClose, onSaveCharacter }: PartyGeneratorProps) {
  const { dispatch: charDispatch } = useCharacter();
  const [party, setParty] = useState<Party | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'chronicle' | 'members' | 'relations'>('profile');
  // Selected member ID for relationship viewer
  const [selectedObserverId, setSelectedObserverId] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isGraphView, setIsGraphView] = useState<boolean>(false);

  // AI Party Biography States
  const [partyBiography, setPartyBiography] = useState<string | null>(null);
  const [isGeneratingBiography, setIsGeneratingBiography] = useState<boolean>(false);
  const [biographyError, setBiographyError] = useState<string | null>(null);
  const [aiConfig, setAiConfig] = useState(() => getAIConfig());

  // Reload AI config on mount/activeTab change if needed
  useEffect(() => {
    setAiConfig(getAIConfig());
  }, [activeTab]);

  useEffect(() => {
    if (!party) {
      generateNewParty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCharacterObject = (m: PartyMember, currentParty: Party) => {
    const pWord = m.gender === 'male' ? '他' : (m.gender === 'female' ? '她' : '其');
    
    // Extract and format appearance beautifully
    const assembledAppearance = `${pWord}拥有${m.appearance.skinColor}，留着一头${m.appearance.hairColor}，拥有${m.appearance.eyeColor}。在平时行动中，${pWord}${m.appearance.feature}。`;

    // Extracted personality traits merged into backstory
    const assembledBackstory = `【冒险传记 生平背景故事】\n(出身自战友小队「${currentParty?.name || '旅团'}」)\n\n【个人心智与性格特质】\n${pWord}${m.personality.trait}。此外，${pWord}${m.personality.quirk}。\n\n【在佣兵小队中的缘起起源】\n${currentParty?.origin || ''}\n\n【小队共同追寻的目标与悬赏】\n${currentParty?.goal || ''}`;

    // Attempt to match race and class to auto-configure builder options
    const matchedRace = races.find(r => r.name === m.race || (r.subraces && r.subraces.some(sr => sr.name === m.race)));
    const matchedSubrace = matchedRace?.subraces?.find(sr => sr.name === m.race);
    const matchedCls = classes.find(c => c.name === m.className);

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `mbr-${Math.random().toString(36).substring(2, 9)}`,
      name: m.name,
      alignment: m.alignment,
      deity: '',
      age: m.age.toString(),
      appearance: assembledAppearance,
      specialty: '',
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: assembledBackstory,
      level: 3, // Group tier is standard 3
      raceId: matchedRace ? matchedRace.id : 'human',
      subraceId: matchedSubrace ? matchedSubrace.id : undefined,
      raceSource: matchedRace ? (matchedRace.source || 'phb') : 'phb',
      classId: matchedCls ? matchedCls.id : 'fighter',
      backgroundId: 'soldier', // Default soldier background for mercenaries
      baseAbilities: { 
        STR: m.stats.str, 
        DEX: m.stats.dex, 
        CON: m.stats.con, 
        INT: m.stats.int, 
        WIS: m.stats.wis, 
        CHA: m.stats.cha 
      },
      skillSelections: [] as string[],
      languageSelections: [] as string[],
      equipmentSelections: [] as string[],
      traitSelections: {} as Record<string, string[]>,
      knownSpells: [] as string[],
      preparedSpells: [] as string[],
      customSpells: [] as any[]
    };
  };

  const saveMemberToArchive = (m: PartyMember) => {
    if (!party) return;
    try {
      const newChar = createCharacterObject(m, party);
      const saved = localStorage.getItem('dndChars');
      let currentList = [];
      if (saved) {
        currentList = JSON.parse(saved);
      }
      const updatedList = [newChar, ...currentList];
      localStorage.setItem('dndChars', JSON.stringify(updatedList));

      // Trigger callback if provided
      if (onSaveCharacter) {
        onSaveCharacter();
      }

      setSuccessToast(`🎲 保存成功！3级队员「${m.name}」（${m.race} / ${m.className}）已安全存入您的已保存角色档案，在主页下方即可直接预设、加载或自定义微调！`);
      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
    } catch (e) {
      console.error('Failed to save generated party member directly to localStorage archive', e);
    }
  };

  const saveAllToArchive = () => {
    if (!party) return;
    try {
      const newChars = party.members.map(m => createCharacterObject(m, party));
      const saved = localStorage.getItem('dndChars');
      let currentList = [];
      if (saved) {
        currentList = JSON.parse(saved);
      }
      const updatedList = [...newChars, ...currentList];
      localStorage.setItem('dndChars', JSON.stringify(updatedList));

      if (onSaveCharacter) {
        onSaveCharacter();
      }

      setSuccessToast(`🎲 保存成功！「${party.name}」全队4名成员已安全存入您的已保存角色档案！`);
      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
    } catch (e) {
      console.error('Failed to save party members directly to localStorage archive', e);
    }
  };

  const generateNewParty = () => {
    setPartyBiography(null);
    setBiographyError(null);
    setIsGeneratingBiography(false);

    // Generate filtered arrays prioritizing enabled expansions/alternatives
    const enabledRaces = races.map(r => {
      const validAlts = r.alternatives?.filter(alt => isSourceEnabled(alt.source || 'phb', 'races'));
      if (validAlts && validAlts.length > 0) {
        const alt = validAlts[Math.floor(Math.random() * validAlts.length)];
        return { ...alt, subraces: r.subraces };
      }
      if (isSourceEnabled(r.source || 'phb', 'races')) return r;
      return null;
    }).filter(Boolean);

    const enabledClasses = classes.filter(c => isSourceEnabled(c.source || 'phb', 'classes'));

    // Fallbacks if lists become empty due to all expansions disabled
    const availableRaces = enabledRaces.length > 0 ? enabledRaces : races.filter(r => r.source === 'phb' || r.id === 'human');
    const availableClasses = enabledClasses.length > 0 ? enabledClasses : classes.filter(c => c.source === 'phb' || c.id === 'fighter');

    const pName = generatePartyNameWithRules();
    let acronym = "TEAM";
    if (pName.length >= 2) {
      acronym = pName.split('').map(char => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode((charCode % 26) + 65);
      }).slice(0, 4).join('');
    }

    const members: PartyMember[] = [];
    for (let i = 0; i < 4; i++) {
      members.push(generateMember(availableRaces, availableClasses));
    }

    const ALIGNMENT_POSITIONINGS: Record<string, { leader: string[], member: string[] }> = {
      "LG": { leader: ["绝对核心", "战术指挥", "精神支柱", "纪律的化身"], member: ["道德指南针", "承伤铁壁", "秩序维护者", "沉默的后盾"] },
      "NG": { leader: ["温和的领导者", "信赖的纽带", "平易近人的队长"], member: ["团队润滑剂", "后勤与支援", "和事佬", "无私的奉献者"] },
      "CG": { leader: ["冲锋队魂", "感性的带领者", "破釜沉舟的发起人"], member: ["奇兵与突击手", "气氛活跃者", "不羁的自由战士", "打破常规的奇才"] },
      "LN": { leader: ["冷酷的规划师", "契约的守护者", "铁腕战术家"], member: ["无情的执行人", "后勤物控", "冷眼旁观的计数者", "规则的死忠"] },
      "N": { leader: ["中庸的掌舵人", "利益平衡者", "务实的带头人"], member: ["拿钱办事的打工仔", "静止的观测者", "补漏的万金油", "不偏不倚的旁观客"] },
      "CN": { leader: ["混乱中枢", "不可预料的暴风眼", "疯狂赌徒"], member: ["绝对的游侠", "随性的爆发者", "只顾自己的野马", "不稳定因素"] },
      "LE": { leader: ["铁腕暴君", "黑暗大脑", "冷血独裁者"], member: ["高效率处刑人", "幕后黑手的爪牙", "无情的利刃", "精密咬合的齿轮"] },
      "NE": { leader: ["自私的自封者", "阴暗面的支配人"], member: ["随时抽身的雇佣兵", "唯利是图的算计者", "冷漠的收割者", "毒蛇般的伏击者"] },
      "CE": { leader: ["恐惧的散播者", "疯群之首", "灾魇之主"], member: ["嗜血的狂战", "纯粹的破坏狂", "随时失控的炸弹", "带来混乱的恶兽"] }
    };

    function getAlignKey(a: string) {
      if (a.includes("LG") || a.includes("守序善良")) return "LG";
      if (a.includes("NG") || a.includes("中立善良")) return "NG";
      if (a.includes("CG") || a.includes("混乱善良")) return "CG";
      if (a.includes("LN") || a.includes("守序中立")) return "LN";
      if (a.includes("N") && !a.includes("L") && !a.includes("C") && a.includes("绝对中立")) return "N";
      if (a.includes("N") && a.includes("绝对")) return "N";
      if (a.includes("CN") || a.includes("混乱中立")) return "CN";
      if (a.includes("LE") || a.includes("守序邪恶")) return "LE";
      if (a.includes("NE") || a.includes("中立邪恶")) return "NE";
      if (a.includes("CE") || a.includes("混乱邪恶")) return "CE";
      return "N";
    }

    const leaderIndex = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
        const alignKey = getAlignKey(members[i].alignment);
        const pool = ALIGNMENT_POSITIONINGS[alignKey] || ALIGNMENT_POSITIONINGS["N"];
        if (i === leaderIndex) {
            members[i].selfPositioning = pool.leader[Math.floor(Math.random() * pool.leader.length)];
            members[i].isCaptain = true;
        } else {
            members[i].selfPositioning = pool.member[Math.floor(Math.random() * pool.member.length)];
            members[i].isCaptain = false;
        }
    }

    const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
    const goal = GOALS[Math.floor(Math.random() * GOALS.length)];
    const relationships = generateRelationshipsForMembers(members);

    setParty({
      name: pName,
      accronym: acronym,
      motif: generateMotif(),
      origin,
      goal,
      members,
      relationships
    });
    // Preset the default selected member for relation visualizer
    if (members.length > 0) {
      setSelectedObserverId(members[0].id);
    }
  };

  const handleGenerateBiography = async () => {
    if (!party) return;
    setIsGeneratingBiography(true);
    setBiographyError(null);
    try {
      const bio = await generatePartyBiography(party);
      setPartyBiography(bio);
    } catch (err: any) {
      setBiographyError(err.message || '书写小队故事失败');
    } finally {
      setIsGeneratingBiography(false);
    }
  };

  const shuffleRelationshipsOnly = () => {
    if (!party) return;
    const newRels = generateRelationshipsForMembers(party.members);
    setParty({
      ...party,
      relationships: newRels
    });
  };

  const getPronoun = (gender: 'male' | 'female' | 'none') => {
    if (gender === 'male') return '他';
    if (gender === 'female') return '她';
    return '该人';
  };

  const getGenderText = (gender: 'male' | 'female' | 'none') => {
    if (gender === 'male') return '男';
    if (gender === 'female') return '女';
    return '无性别';
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-xl max-w-4xl w-full shadow-2xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-600 leading-none">
                🧭 随机冒险队伍与关系网生成器
              </h2>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans">
                根据您<b>当前启用的扩充书版本</b>，一键组建充满故事与交叉爱恨的大陆佣兵团。
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={generateNewParty}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded shadow-sm transition-all cursor-pointer border-none flex items-center gap-2 active:scale-95 font-serif font-bold"
            >
              <RefreshCw size={14} className="animate-spin-once" />
              创建冒险者小队
            </button>
            <button
              onClick={saveAllToArchive}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-medium text-xs rounded shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              title="将四名小队成员全部保存为角色卡档案"
            >
              <UserPlus size={14} />
              保存全队
            </button>
          </div>

          {party && (
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border-none transition-all ${
                  activeTab === 'profile' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-550 hover:text-stone-800 bg-transparent'
                }`}
              >
                📜 小队设定
              </button>
              {aiConfig.partyBioEnabled && (
                <button
                  onClick={() => setActiveTab('chronicle')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border-none transition-all flex items-center gap-1 ${
                    activeTab === 'chronicle' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-550 hover:text-stone-800 bg-transparent'
                  }`}
                >
                  ✨ 小队故事
                </button>
              )}
              <button
                onClick={() => setActiveTab('members')}
                className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border-none transition-all ${
                  activeTab === 'members' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-550 hover:text-stone-800 bg-transparent'
                }`}
              >
                👥 队员背景 ({party.members.length})
              </button>
              <button
                onClick={() => setActiveTab('relations')}
                className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border-none transition-all flex items-center gap-1.5 ${
                  activeTab === 'relations' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-550 hover:text-stone-800 bg-transparent'
                }`}
              >
                🔗 关系网
                <span className="inline-block w-4 h-4 bg-amber-100 text-amber-800 text-[9px] rounded-full text-center leading-4 font-bold">New</span>
              </button>
            </div>
          )}
        </div>

        {successToast && (
          <div className="bg-amber-500/10 border-l-4 border-l-amber-600 border border-amber-500/30 text-stone-900 dark:text-amber-100 text-xs px-4 py-3 rounded shadow-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1.5 duration-150 leading-relaxed">
            <span className="text-amber-600 text-[14px] select-none leading-none mt-0.5">✨</span>
            <div className="flex-1 font-sans font-medium">{successToast}</div>
          </div>
        )}

        {party ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* TAB 1: PARTY PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-3.5 animate-in fade-in duration-205">
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-[0.06] text-stone-900 pointer-events-none">
                    <Compass size={120} />
                  </div>
                  <div className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded w-fit mb-2">
                    Team {party.accronym}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    「{party.name}」
                  </h3>
                  <div className="mt-3.5 space-y-3 text-xs font-sans leading-relaxed text-stone-700">
                    <div>
                      <span className="font-bold text-stone-900 block mb-1">🛡️ 队伍团章 & 信守特征:</span>
                      <p className="bg-white/80 border border-stone-200/50 p-2.5 rounded-lg text-stone-605">
                        {party.motif}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block mb-1">⚔️ 小队是如何纠集产生的:</span>
                      <p className="bg-white/80 border border-stone-200/50 p-2.5 rounded-lg text-stone-605">
                        {party.origin}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block mb-1">👑 终极探寻目标/行会悬赏:</span>
                      <p className="bg-white/80 border border-stone-200/50 p-2.5 rounded-lg text-stone-605">
                        {party.goal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Micro preview of members on main page */}
                <div className="grid grid-cols-4 gap-2">
                  {party.members.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveTab('members');
                      }}
                      className="text-left p-2.5 border border-stone-200 hover:border-amber-400 bg-white rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      <div className="text-[10px] text-stone-400 font-bold">成员 {idx + 1}</div>
                      <div className="font-bold text-stone-800 text-xs mt-0.5 flex w-full items-center gap-1.5" title={m.name}>
                        <span className="truncate">{m.name}</span>
                        {m.isCaptain && <span className="bg-amber-100 text-amber-800 shrink-0 text-[9px] px-1.5 py-0.5 rounded shadow-sm border border-amber-200">👑 队长</span>}
                      </div>
                      <div className="text-[9px] text-stone-500 mt-1 truncate">{m.race} · {m.className}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CHRONICLE (ADVENTURE PARTY BIOGRAPHY) */}
            {activeTab === 'chronicle' && (
              <div className="space-y-4 animate-in fade-in duration-205">
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-[0.04] text-stone-900 pointer-events-none">
                    <Sparkles size={120} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-150 pb-3 mb-4">
                    <div>
                      <h3 className="font-serif font-black text-lg text-stone-900 flex items-center gap-1.5">
                        ✨ 团队传奇编年史小传
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-normal">
                        根据当前分配的 4 名角色的外观、性格异癖以及错综复杂的关系网，由 AI 为本小队谱写的史诗物语。
                      </p>
                    </div>

                    {!partyBiography && (
                      <button
                        onClick={handleGenerateBiography}
                        disabled={isGeneratingBiography}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5 self-end"
                      >
                        {isGeneratingBiography ? (
                          <>
                            <RefreshCw className="animate-spin" size={13} />
                            正在谱写中...
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            生成小传
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isGeneratingBiography && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs animate-bounce">✍️</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-serif font-bold text-stone-850">正在梳理诸子百态与人情羁绊...</p>
                        <p className="text-[11.5px] text-stone-450">AI 正在根据 4 人的种族、职业、性情与爱恨情仇撰写专属纪实，请稍候。</p>
                      </div>
                    </div>
                  )}

                  {biographyError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-stone-800 text-xs flex flex-col gap-2">
                      <span className="font-bold flex items-center gap-1 text-rose-700">⚠️ 书写小传时遇到了错误</span>
                      <p>{biographyError}</p>
                      <button
                        onClick={handleGenerateBiography}
                        className="mt-1 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-805 font-bold font-serif rounded border-none w-fit cursor-pointer self-start transition-colors"
                      >
                        重新尝试
                      </button>
                    </div>
                  )}

                  {!isGeneratingBiography && !biographyError && partyBiography && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="bg-amber-50/20 border border-amber-200/50 p-4 rounded-lg">
                        <FormattedDescription text={partyBiography} className="text-stone-750 text-xs md:text-sm leading-relaxed" />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-stone-400 italic">
                          * 觉得不满意？点击右侧按钮，让 AI 重新撰写一篇全新的编年史。
                        </span>
                        <button
                          onClick={handleGenerateBiography}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded transition flex items-center gap-1.5"
                        >
                          <RefreshCw size={12} />
                          重新生成小传
                        </button>
                      </div>
                    </div>
                  )}

                  {!isGeneratingBiography && !biographyError && !partyBiography && (
                    <div className="py-20 flex flex-col items-center justify-center text-stone-400 text-center select-none border border-dashed border-stone-200 rounded-lg bg-stone-50/50">
                      <Sparkles size={36} className="text-stone-300 mb-2.5" />
                      <p className="text-xs font-serif font-bold text-stone-600">小传尚未生成</p>
                      <p className="text-[10.5px] text-stone-450 max-w-sm mt-1 leading-normal">
                        已经准备好了小队名称、主题、每名成员的信息和关系链。点按下方『即刻谱写小传』，让 AI 为此团队量身定制一本文笔朴实动人的传说故事。
                      </p>
                      <button
                        onClick={handleGenerateBiography}
                        className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        即刻谱写小传
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DETAILED MEMBER PROFILES */}
            {activeTab === 'members' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in duration-205">
                {party.members.map((m, idx) => (
                  <div key={m.id} className="border border-stone-200 bg-white rounded-xl p-4 hover:border-amber-400 transition-all shadow-sm flex flex-col justify-between gap-3 relative">
                    <div>
                      {/* Compact absolute top-right recruit button */}
                      <button
                        onClick={() => saveMemberToArchive(m)}
                        title="招募伙伴：将外观、属性与背景故事直接保存至角色卡名册"
                        className="absolute top-4 right-4 w-7 h-7 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 border border-amber-250 hover:border-amber-400 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm"
                      >
                        <UserPlus size={13} />
                      </button>

                      <div className="flex justify-between items-start border-b border-stone-100 pb-2 mb-2 pr-8">
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center flex-wrap gap-2">
                            <span className="w-5 h-5 rounded-full bg-stone-100 inline-flex flex-shrink-0 items-center justify-center text-xs text-stone-600 font-sans font-semibold">{idx + 1}</span>
                            <span>{m.name}</span>
                            {m.isCaptain && <span className="bg-amber-100 font-sans text-amber-800 text-[9px] px-1.5 py-0.5 rounded shadow-sm border border-amber-200 mt-0.5 truncate">👑 队长</span>}
                          </h4>
                          <div className="text-[10px] text-amber-800 font-semibold mt-0.5 flex items-center gap-1.5 font-sans">
                            <span>{m.race}</span>
                            <span>·</span>
                            <span>{m.className}</span>
                            <span>·</span>
                            <span>{m.alignment}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 font-sans text-[10px]">
                          <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm font-semibold tracking-wider">
                            {getGenderText(m.gender)}
                          </span>
                          <span className="text-stone-400 font-bold">{m.age} 岁</span>
                        </div>
                      </div>

                      {/* STATS ARRAY BAR */}
                      <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-mono font-semibold mb-3">
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">力量</span>
                          <span className="text-stone-800 text-xs">{m.stats.str}</span>
                        </div>
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">敏捷</span>
                          <span className="text-stone-800 text-xs">{m.stats.dex}</span>
                        </div>
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">体质</span>
                          <span className="text-stone-800 text-xs">{m.stats.con}</span>
                        </div>
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">智力</span>
                          <span className="text-stone-800 text-xs">{m.stats.int}</span>
                        </div>
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">感知</span>
                          <span className="text-stone-800 text-xs">{m.stats.wis}</span>
                        </div>
                        <div className="bg-stone-50 py-1 rounded">
                          <span className="text-stone-400 block text-[8px] transform scale-90">魅力</span>
                          <span className="text-stone-800 text-xs">{m.stats.cha}</span>
                        </div>
                      </div>

                      {/* ASSEMBLED DESCRIPTION */}
                      <div className="p-3 bg-stone-50/70 border border-stone-200/40 rounded-lg text-[11px] text-stone-650 leading-relaxed font-sans space-y-2">
                        <p>
                          {getPronoun(m.gender)}拥有{m.appearance.skinColor}，留着一头{m.appearance.hairColor}，拥有{m.appearance.eyeColor}。在平时行动中，{getPronoun(m.gender)}{m.appearance.feature}。
                        </p>
                        <p className="border-t border-stone-200/50 pt-2 text-stone-600 italic">
                          💡 <b>人设定论与怪癖：</b>{getPronoun(m.gender)}{m.personality.trait}。此外，{getPronoun(m.gender)}{m.personality.quirk}。
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: RELATIONSHIPS INTERACTIVE TOY */}
            {activeTab === 'relations' && (
              <div className="space-y-4 animate-in fade-in duration-205 font-sans">
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="text-amber-700 shrink-0" size={16} />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-950 font-serif">关系网</h4>
                      <p className="text-[10px] text-amber-700/80 leading-normal mt-0.5">随机生成队员互动的双向视角，支持一键重写。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsGraphView(!isGraphView)}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium text-[11px] rounded transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      {isGraphView ? <LayoutList size={12} /> : <Network size={12} />}
                      {isGraphView ? '列表视图' : '网状连线'}
                    </button>
                    <button
                      onClick={shuffleRelationshipsOnly}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] rounded transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Shuffle size={12} /> 重新生成
                    </button>
                  </div>
                </div>

                {isGraphView ? (
                  <div className="flex flex-col items-center justify-center py-8 bg-stone-50/50 rounded-xl border border-stone-200">
                    <svg width="100%" height="auto" viewBox="0 0 760 560" className="w-full max-w-[760px] drop-shadow-sm font-sans">
                      <defs>
                        {[
                          '#db2777', '#dc2626', '#059669', '#b45309', '#d97706',
                          '#64748b', '#f43f5e', '#78716c', '#0d9488', '#10b981',
                          '#ea580c', '#84cc16', '#4f46e5', '#7c2d12', '#fb7185',
                          '#2563eb', '#be123c', '#8b5cf6', '#eab308', '#06b6d4'
                        ].map(c => (
                          <marker key={c} id={`arrow-${c.replace('#', '')}`} markerWidth="6" markerHeight="4" refX="5.5" refY="2" orient="auto">
                            <polygon points="0 0, 6 2, 0 4" fill={c} />
                          </marker>
                        ))}
                      </defs>
                      {party.relationships.map((rel) => {
                        const fromIdx = party.members.findIndex(m => m.id === rel.fromId);
                        const toIdx = party.members.findIndex(m => m.id === rel.toId);
                        if (fromIdx === -1 || toIdx === -1) return null;
                        
                        const getPos = (idx: number) => {
                          switch(idx) {
                            case 0: return { x: 100, y: 95 }; // Top Left
                            case 1: return { x: 660, y: 95 }; // Top Right
                            case 2: return { x: 660, y: 465 }; // Bottom Right
                            case 3: return { x: 100, y: 465 }; // Bottom Left
                            default: return { x: 380, y: 280 };
                          }
                        };
                        const { x: x1, y: y1 } = getPos(fromIdx);
                        const { x: x2, y: y2 } = getPos(toIdx);
                        
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        // normal
                        const nx = dx / dist;
                        const ny = dy / dist;
                        // perp
                        const px = -ny;
                        const py = nx;
                        
                        // Shift the parallel lines slightly to their right side so they don't overlap
                        const offset = 16;
                        const sx = x1 + px * offset;
                        const sy = y1 + py * offset;
                        const ex = x2 + px * offset;
                        const ey = y2 + py * offset;
                        
                        const rEdge = 68;
                        const startX = sx + nx * rEdge;
                        const startY = sy + ny * rEdge;
                        const endX = ex - nx * rEdge;
                        const endY = ey - ny * rEdge;
                        
                        // Shift relation text closer to the arrow's starting node (e.g., at 28% of the way)
                        const ratio = 0.28;
                        const tx = startX * (1 - ratio) + endX * ratio;
                        const ty = startY * (1 - ratio) + endY * ratio;
                        
                        const color = getRelColor(rel.type);
                        const isVertical = Math.abs(dx) < 20;

                        if (isVertical) {
                          return (
                            <g key={`${rel.fromId}-${rel.toId}`}>
                              <line
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke={color}
                                strokeWidth="2.5"
                                markerEnd={`url(#arrow-${color.replace('#', '')})`}
                                opacity="0.85"
                              />
                              <g transform={`translate(${tx}, ${ty})`}>
                                 <rect x="-14" y="-24" width="28" height="48" fill="white" rx="5" stroke={color} strokeWidth="1.5" opacity="0.95" className="shadow-sm" />
                                 <text x="0" y="-6" fontSize="13" fill={color} textAnchor="middle" className="font-extrabold font-serif tracking-tight">{rel.type[0]}</text>
                                 <text x="0" y="12" fontSize="13" fill={color} textAnchor="middle" className="font-extrabold font-serif tracking-tight">{rel.type[1]}</text>
                              </g>
                            </g>
                          );
                        }

                        let textAngle = Math.atan2(dy, dx) * 180 / Math.PI;
                        if (textAngle > 90 || textAngle < -90) {
                           textAngle += 180;
                        }

                        return (
                          <g key={`${rel.fromId}-${rel.toId}`}>
                            <line
                              x1={startX}
                              y1={startY}
                              x2={endX}
                              y2={endY}
                              stroke={color}
                              strokeWidth="2.5"
                              markerEnd={`url(#arrow-${color.replace('#', '')})`}
                              opacity="0.85"
                            />
                            <g transform={`translate(${tx}, ${ty}) rotate(${textAngle})`}>
                               <rect x="-35" y="-12" width="70" height="24" fill="white" rx="6" stroke={color} strokeWidth="1.5" opacity="0.95" className="shadow-sm" />
                               <text x="0" y="3.5" fontSize="13" fill={color} textAnchor="middle" className="font-extrabold font-serif tracking-tight">{rel.type}</text>
                            </g>
                          </g>
                        );
                      })}
                      {party.members.map((m, i) => {
                        const getPos = (idx: number) => {
                          switch(idx) {
                            case 0: return { x: 100, y: 95 }; // Top Left
                            case 1: return { x: 660, y: 95 }; // Top Right
                            case 2: return { x: 660, y: 465 }; // Bottom Right
                            case 3: return { x: 100, y: 465 }; // Bottom Left
                            default: return { x: 380, y: 280 };
                          }
                        };
                        const { x, y } = getPos(i);
                        const classColor = getClassColor(m.className);

                        return (
                          <g key={m.id}>
                            <circle cx={x} cy={y} r="62" fill="white" stroke={classColor} strokeWidth="3.5" className="drop-shadow-md" />
                            
                            <circle cx={x - 45} cy={y - 45} r="15" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="2" />
                            <text x={x - 45} y={y - 41} fontSize="12" fill="#57534e" textAnchor="middle" className="font-bold font-sans">{String.fromCharCode(65 + i)}</text>

                            {m.isCaptain && (
                              <g transform={`translate(${x + 45}, ${y - 45})`}>
                                <circle cx="0" cy="0" r="15" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
                                <text x="0" y="4" fontSize="12" textAnchor="middle">👑</text>
                              </g>
                            )}

                            <g transform={`translate(${x - 20}, ${y - 32})`}>
                              {getClassIcon(m.className, { size: 40, strokeWidth: 1.8, color: classColor })}
                            </g>
                            
                            <text x={x} y={y + 22} fontSize="14" fill="#1c1917" textAnchor="middle" className="font-bold font-serif tracking-wider uppercase">
                              {m.name.split(' ')[0]}
                            </text>
                            <text x={x} y={y + 38} fontSize="10.5" fill="#78716c" textAnchor="middle" className="font-semibold tracking-widest uppercase">
                              {m.className}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Column: Observer Choice */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider mb-1">
                        👉 第一人称观察者 / 谁的看法
                      </span>
                      {party.members.map((m) => {
                        const isSelected = selectedObserverId === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedObserverId(m.id)}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                              isSelected
                                ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold font-serif">{m.name} {m.isCaptain && '👑'}</div>
                              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-stone-505 font-semibold'}`}>
                                {m.race} · {m.className}
                              </div>
                            </div>
                            {isSelected && <Sparkles size={11} className="text-amber-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Perspectives of the selected member on others */}
                    <div className="md:col-span-8 space-y-3">
                      <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider mb-1">
                        💭 {party.members.find(m => m.id === selectedObserverId)?.name} 对大家的心底评价
                      </span>

                      {/* Self Positioning - Fixed at Top */}
                      {(() => {
                        const observer = party.members.find(m => m.id === selectedObserverId);
                        if (!observer) return null;
                        return (
                          <div className="p-4 border border-stone-200 bg-stone-50/40 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start gap-2 mb-2 border-b border-stone-100 pb-2">
                              <div>
                                <h5 className="font-bold text-xs text-stone-900">目前自我定位</h5>
                              </div>
                            </div>
                            <p className="text-xs text-stone-605 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-100">
                              <span className="font-bold text-amber-800">「 {observer.selfPositioning} 」</span>
                              <span className="text-stone-500 ml-1">—— 这便是{observer.name}当下为自己树立的立场。</span>
                            </p>
                          </div>
                        );
                      })()}

                      <div className="space-y-3.5">
                        {party.members.map((m) => {
                          // Skip self
                          if (m.id === selectedObserverId) {
                            return null;
                          }

                          // Find relationship details from observer to this member
                          const rel = party.relationships.find(
                            r => r.fromId === selectedObserverId && r.toId === m.id
                          );

                          // Find back relationship (how they view the observer)
                          const revRel = party.relationships.find(
                            r => r.fromId === m.id && r.toId === selectedObserverId
                          );

                          return (
                            <div key={m.id} className="border border-stone-200/90 bg-white rounded-xl p-4 hover:border-stone-300 transition-all shadow-sm">
                              <div className="flex justify-between items-start gap-2 mb-2 border-b border-stone-100 pb-2">
                                <div>
                                  <span className="text-[10px] text-stone-400">对伙伴：</span>
                                  <h5 className="font-bold text-xs text-stone-900 mt-0.5">{m.name} {m.isCaptain && '👑'} 的看法</h5>
                                </div>
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded cursor-default">
                                  🏷️ {rel?.type || "伙伴"}
                                </span>
                              </div>
                              <p className="text-xs text-stone-605 leading-relaxed bg-stone-50/50 p-2.5 rounded-lg border border-stone-100 italic">
                                “{rel?.description || "相伴前行的靠谱盟友。"}”
                              </p>

                              {/* Short bidirectional indicator */}
                              {revRel && (
                                <div className="mt-3 pt-2.5 border-t border-stone-105 flex items-center justify-between text-[11px] text-stone-400 font-sans">
                                  <span>↩️ 对方（{m.name}）对其的看法是：</span>
                                  <span className="font-semibold text-stone-550 italic border-b border-stone-200">{revRel.type}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-50/50 border border-dashed border-stone-200 rounded-xl text-stone-400 text-sm flex flex-col items-center justify-center gap-3">
            <Users size={40} className="text-stone-300" />
            <div>
              <p className="font-semibold text-stone-600">在此处点击召集你的冒险家！</p>
              <p className="text-xs text-stone-400 mt-1">系统将自动随机搭配出性格、生平、姓名和纠葛人际完备的4人旅团</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
