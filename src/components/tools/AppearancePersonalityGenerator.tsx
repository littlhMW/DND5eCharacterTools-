import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Copy, RefreshCw, User, ClipboardCheck, ArrowRight, ShieldAlert, VenetianMask, UserCheck, Dices } from 'lucide-react';
import { useCharacter } from '../../context/CharacterContext';
import { races } from '../../data/races';
import { isSourceEnabled } from '../../utils/expansionHelper';

// ===================== 全覆盖蒙面/神秘外观库（用于概率替代所有外观） =====================
export const PURE_MASKED_APPEARANCES = [
  "此人将自己全身上下包裹在厚重的灰黑色长袍与兜帽中，面部戴着一副毫无表情的金属面具，完全看不出原本的种族与样貌特征。",
  "此人穿着宽大的隐匿斗篷，头戴深色兜帽，脸上蒙着半透的厚面罩，仅有一双锐利的眼睛在阴影中闪烁，无法辨认其真实容貌。",
  "此人通体被漆黑的紧身披铠和宽大披风覆盖，脸部被神秘的魔法迷雾或缠绕的绷带完全遮挡，失去了所有的辨识特征。",
  "此人戴着一个造型诡异的全包围式木质面具，身披缝合了大量布条的破旧斗篷，将躯体与面容严严实实地掩藏起来。",
  "此人披着一件边缘严重磨损的深绿色大衣，佩戴着一副厚重的有色玻璃护目镜与高高拉起的围脖，只余一丝沉重的呼吸漏出。",

  // 普通（占大比例）
  "此人穿着一套接缝处满是锈迹的全身板甲，搭配一个带有窄缝视孔的全封闭式头盔，整个人如同一尊沉默的铁像。",
  "此人身披磨旧的亚麻斗篷，脸上缠着好几圈泛黄的布条，只露出两个小孔供眼睛视物，显得既朴素又谨慎。",
  "此人戴着圆顶铁盔和一副只留两条缝隙的皮革面罩，身罩一件宽大到能盖住所有装备的厚帆布罩衣。",
  "此人用一条破旧的羊毛围巾从鼻梁一直裹到脖颈，外加一顶压得很低的毡帽，几乎只露出一小截额头。",
  "此人穿着脏兮兮的链甲衫，兜帽拉得极低，脸上罩着一个用粗麻布缝制的简易头套，边缘全是线头。",
  "此人全身裹在一件褪色的厚袍里，双手插在袖管中，脸上只露出一双眯缝的眼睛，其余部分被袍领和兜帽遮挡得严严实实。",
  "此人披着一件沾满泥点的油布披风，头戴一顶边缘破损的宽檐帽，脸上蒙着一条脏兮兮的灰布面巾。",
  "此人穿着一套看不出年代的生锈半身甲，面部被一个简单的平板金属面具覆盖，面具上只有两个洞用于呼吸。",
  "此人身穿厚重皮衣，兜帽内侧缝了深色薄纱，放下来时正好遮住整张脸，只能隐约看到轮廓。",

  // 不普通（少量）
  "此人穿着一套由不同甲片拼凑的异国铠甲，头上戴着一个仿若鸟喙的长锥形金属头盔，完全不见面容。",
  "此人浑身上下被一层层褪色的仪式绷带缠绕，连头部也不例外，只在嘴部位置留了一条细缝，看起来像一具行走的木乃伊。",
  "此人披着用不知名兽皮缝制的大氅，面戴一副雕刻着抽象漩涡纹路的骨质面具，面具眼眶处镶嵌着两片深色水晶。",
  "此人身着全套哑光黑色板甲，头盔面罩上开有十字形气孔，且焊死无法打开，仿佛从不愿以真面目示人。",

  // 极少量有点魔法但能接受
  "此人穿着一件看似普通的锁子甲，头部被一层若有若无的半透明暗色光幕笼罩，光幕下只能看到模糊的轮廓，像是低级幻术的效果。",
  "此人戴着一顶全包覆式头盔，头盔表面刻满了细小的防护符文，符文偶尔会发出微弱的银光，但脸部特征完全不可见。"
];

// ===================== 共用外貌特征库（泛用，不受种族性别限制） =====================
import { getAvailableRaces } from '../../utils/raceHelper';

export const UNIVERSAL_APPEARANCE_FEATURES = [
  "总是戴着一副深色护目镜，遮住了大部分眉眼",
  "脸上蒙着一层薄薄的暗色面纱，只露出眼睛",
  "左眼呈现异色瞳，与右眼颜色截然不同",
  "额头上有一道明显的旧伤疤，斜贯眉骨",
  "右臂自肘以下换成了做工精良的机关义肢",
  "脖颈侧面纹着一小片不知名语言的黑色刺青",
  "左耳垂挂着一枚过于夸张的巨大金属环",
  "常年戴着连帽斗篷的兜帽，脸庞半隐在阴影里",
  "嘴唇左侧有一道细小的裂痕伤疤，说话时微微抽动",
  "鼻梁上架着一副精致的金丝眼镜，显得文质彬彬",
  "头顶有一撮与周围发色完全不同的异色挑染",
  "右手无名指上戴着一枚刻有古怪符文的青铜戒指，从不摘下",
  "左边嘴角有一颗显眼的黑痣",
  "后颈露出了一小片褪色的烙印疤痕",
  "耳朵尖端被整齐地削去了一小块，留下平滑的切面",
  "右眼上方有一道陈年刀疤",
  "嘴角常挂着一丝自信的笑意",
  "双手布满武器或乐器磨出的硬茧",
  "身上隐约带着森林泥土与雨后青草的气息",
  "额角天生一块星形浅色斑痕",
  "脖颈戴着一串兽牙制成的粗糙挂饰",
  "走路极轻极快，几乎没有声响",
  "左耳廓上挂着三枚刻有古符文的黄铜环",
  "腰带上系着装满草药和羽毛的鹿皮小包，走动时叮当作响",
  "手背至小臂浮现着随呼吸明灭的淡金色奥术纹路"
];

// ===================== 共用性格特质库（泛用） =====================
export const EXTRA_PERSON_TRAITS = [
  "意志坚韧，无论面临何种困境都极少抱怨",
  "对整洁有近乎偏执的要求，随身携带手帕",
  "热爱古典音乐，宿营时常取出旧乐器弹奏",
  "对古代遗迹和符文抱有浓厚的学术兴趣",
  "天生喜欢小动物，总会在篝火旁喂食路过的松鼠或田鼠",
  "对金钱精打细算，从不轻易赊账或借钱",
  "说话轻声细语，但言辞锋利一针见血",
  "极其守时，迟到会让他坐立不安",
  "对陌生人的善意抱有本能的不信任，但一旦接纳便极度忠诚",
  "极度厌恶潮湿和霉味，宁可露宿也不住发霉的房间",
  "危机中仍能保持冷静与清醒的判断",
  "天性开朗，乐于惩恶扬善、帮助无辜",
  "行事偏重逻辑与数据，略显古板",
  "平时沉默寡言，却会誓死守护认定的同伴",
  "对失落秘境与魔导遗物怀有强烈执念",
  "性格豪爽，最爱在酒馆高脚椅上讲夸张的冒险故事",
  "视荣誉与誓言高于生命，有诺必践",
  "心思细腻，擅长从细微动作看穿他人谎言"
];

// ===================== 共用性格怪癖库（泛用） =====================
export const EXTRA_QUIRKS = [
  "在紧张时下意识用指节敲击桌面或剑柄",
  "每到一个新城镇，必定去当地酒馆点一杯最贵的蜜酒",
  "无法容忍武器或法器上有灰尘，时常擦拭",
  "说话时声音会在高亢和低哑之间无规律切换",
  "哪怕在最安全的旅店，也会在门缝后塞几枚铜钉作为警铃",
  "喜欢收集旅途中遇到的形状奇特的石头",
  "思考难题时会无意识地揪自己的发梢",
  "总是最后一个入睡，确认营地安全后才合眼",
  "习惯把食物切成均匀的小块再食用",
  "与别人交谈时很少直视对方眼睛，视线总落在鼻梁或下巴",
  "紧张时会忍不住把指关节捏得咔咔响",
  "每天清晨必定花费半小时重新整理行囊，力求对称",
  "极度厌恶在泥泞潮湿的地面行走，否则会抱怨一整天",
  "口袋里总偷偷塞着几块融化了的太妃糖",
  "看见桌上物品不齐便会伸手去摆正",
  "喜欢给随身武器和药水瓶起搞笑的谐音名字",
  "聊日常话题也习惯把声音压得极大，像在传递军情",
  "在最安全的营地睡觉时，也习惯睁着一只眼睛保持戒备"
];

// ===================== 九宫格信念轴 =====================
export const LAW_CHAOS_AXIS: Record<string, { name: string; code: string; beliefs: string[]; manners: string[] }> = {
  "lawful": {
    name: "守序", code: "L",
    beliefs: [
      "视规则为行事最低底线",          // 中性
      "认为秩序是文明存续的根基",      // 中性
      "相信承诺与契约不可轻易违背",    // 中性
      "有时会因严守规章而显得冷酷",    // 偏坏
      "将律法凌驾于人情之上，缺乏变通", // 偏坏
      "甘愿用个人自由换取集体稳定",    // 偏好
      "以严明纪律保护弱小免受混乱侵害", // 偏好
      "崇拜等级制，视下级为可调配的工具", // 扭曲
      "认为维持秩序可以不惜一切代价"    // 扭曲
    ],
    manners: [
      "行止有度，坐卧安营井然有条",    // 中性
      "言辞精确，重视信诺与时间观念",  // 中性
      "习惯以高度自律带动身边同伴",    // 中性
      "对任何逾越程序的行为都心生反感", // 偏坏
      "习惯用冷硬规章评判他人情感",    // 偏坏
      "即便牺牲个人安逸也要履行誓言",  // 偏好
      "以自身为尺规，要求他人同样守纪", // 偏好
      "居高临下，视违令者为必须清除的杂质", // 扭曲
      "在秩序中寻求绝对掌控，不容半点忤逆" // 扭曲
    ]
  },
  "neutral": {
    name: "中立", code: "N",
    beliefs: [
      "在秩序与自由之间寻求动态平衡",  // 中性
      "凡事视情况而定，不盲从任一边",  // 中性
      "坚信个体判断力优于僵化教条",    // 中性
      "过于务实，有时显得摇摆不定",    // 偏坏
      "对各方冲突缺乏挺身而出的决心",  // 偏坏
      "以灵活手腕斡旋于不同势力之间",  // 偏好
      "重视客观规律，不轻易被道德捆绑", // 偏好
      "认为万般规则皆虚妄，唯有自利真实", // 扭曲
      "将中立当作隔岸观火的借口"       // 扭曲
    ],
    manners: [
      "从容变通，见机行事",           // 中性
      "对待契约合则共事，不合则好聚好散", // 中性
      "极少流露极端情绪，态度温和有距", // 中性
      "时常回避站队，给人以不可靠印象", // 偏坏
      "面对压迫时容易选择独善其身",    // 偏坏
      "能以最小的代价维系多方和平",    // 偏好
      "尊重他人抉择，不轻易施加干涉",  // 偏好
      "表面中庸，实则精于算计自身得失", // 扭曲
      "以平衡为名义，行消极逃避之实"   // 扭曲
    ]
  },
  "chaotic": {
    name: "混乱", code: "C",
    beliefs: [
      "崇尚内心直觉与个体自由",       // 中性
      "认为僵化律法只会扼杀创造与生机", // 中性
      "追求不受拘束的自我表达",       // 中性
      "过分抗拒约束，时常制造无序局面", // 偏坏
      "把反叛视为目的，而非改善的手段", // 偏坏
      "以灵动巧思打破不公的旧制度",    // 偏好
      "甘冒巨大风险去争取更自由的未来", // 偏好
      "视一切权威为必须摧毁的枷锁",    // 扭曲
      "享受混乱，甚至将其引向毁灭边缘"  // 扭曲
    ],
    manners: [
      "行为难以预测，充满即兴色彩",    // 中性
      "面对权威时总忍不住戏谑调侃",    // 中性
      "常凭直觉行事，不按计划出牌",    // 中性
      "容易打乱同伴的精心布局",        // 偏坏
      "对任何规训都本能地产生抵触",    // 偏坏
      "能用出其不意的方式解决僵局",    // 偏好
      "在腐朽体制下点燃反抗的星火",    // 偏好
      "为追求自由不惜撕裂已有秩序",    // 扭曲
      "在混乱中寻求快感，无视后续代价"  // 扭曲
    ]
  }
};

export const GOOD_EVIL_AXIS: Record<string, { name: string; code: string; beliefs: string[]; manners: string[] }> = {
  "good": {
    name: "善良", code: "G",
    beliefs: [
      "将扶助弱者视为不可推卸的责任",  // 中性
      "相信每个生命都拥有内在的尊严",  // 中性
      "愿为守护无辜而牺牲自身利益",    // 中性
      "有时会因过度仁慈而被利用",      // 偏坏
      "可能因不忍伤害敌人而陷团队于险境", // 偏坏
      "以宽恕与救赎而非惩罚作为目标",  // 偏好
      "在黑暗中成为点燃希望的那束光",  // 偏好
      "以拯救之名，行强制改造他人之实", // 扭曲
      "将自己视为审判善恶的唯一标尺"    // 扭曲
    ],
    manners: [
      "待人热忱，对弱者充满耐心与关怀", // 中性
      "常将有限的物资优先让给更困难的人", // 中性
      "面对暴行时流露坚定而无畏的神情", // 中性
      "因不愿伤人而迟迟不肯下重手",     // 偏坏
      "容易轻信他人的悔改，屡次被欺骗",  // 偏坏
      "以德报怨，试图唤醒对手心中的善",  // 偏好
      "即便孤立无援也绝不放弃受害者",    // 偏好
      "强加自己的道德观于他人之上",      // 扭曲
      "在极端善良中隐含不容置疑的傲慢"    // 扭曲
    ]
  },
  "neutral": {
    name: "中立", code: "N",
    beliefs: [
      "重视自然平衡与自身利害的持衡",  // 中性
      "认为极端善恶终将导致大网破碎",  // 中性
      "只愿保全自身与挚爱之人的安危",  // 中性
      "在他人危难时容易选择袖手旁观",  // 偏坏
      "为了自保可以无视道义上的瑕疵",  // 偏坏
      "以冷静算计避免无谓的牺牲与损耗", // 偏好
      "不为虚妄的荣光让同伴涉入险境",  // 偏好
      "将中立当作冷漠自私的挡箭牌",    // 扭曲
      "以平衡为名，放任邪恶悄然滋生"   // 扭曲
    ],
    manners: [
      "分配资源时冷静客观，不带情绪",  // 中性
      "对阵营之争保持距离，不轻易卷入", // 中性
      "决策时优先考量风险与回报",      // 中性
      "在盟友最需要声援时沉默以自保",  // 偏坏
      "常常回避道德抉择，交由他人定夺", // 偏坏
      "以最小的代价维持了多派系的和平", // 偏好
      "在乱世中为团队提供清醒的第三方视角", // 偏好
      "表面中立，实则暗中偏向于强者",  // 扭曲
      "利用各方矛盾谋取自身利益最大化"  // 扭曲
    ]
  },
  "evil": {
    name: "邪恶", code: "E",
    beliefs: [
      "信奉冷酷的适者生存法则",        // 中性
      "认为万物皆为可用的棋子或食粮",  // 中性
      "只在乎自身力量的累积与存续",    // 中性
      "以践踏他人尊严为乐，充满控制欲", // 偏坏
      "为了目的不惜背叛最亲密的同伴",  // 偏坏
      "在无序掠夺中展现出惊人的决断力", // 偏好
      "以恐怖手段迅速终结旷日持久的冲突", // 偏好
      "视自己为超越善恶的神，唯我独尊", // 扭曲
      "以痛苦为食，将他人绝望视为艺术品" // 扭曲
    ],
    manners: [
      "待人淡漠如冰，偶尔流露出狠辣玩味", // 中性
      "精于算计，从不做无利可图之事",     // 中性
      "习惯在暗处布局，不动声色地完成计划", // 中性
      "会以轻微折磨试探他人的底线",        // 偏坏
      "为了掌控局势，不惜下毒或设下圈套",  // 偏坏
      "在关键时刻能果断牺牲弃子以保全大局", // 偏好
      "以雷霆手段迅速铲除可能的威胁",      // 偏好
      "将周围所有人都视为终将被榨干的资源", // 扭曲
      "在强敌面前俯首，转身便将愤怒倾泻于弱者" // 扭曲
    ]
  }
};

// ===================== 种族外观映射（每项至少10条，平实、克制，兼顾多样性） =====================
export const RACES_MAPPING: Record<string, { skin: string[]; hair: string[]; eye: string[]; features: string[] }> = {
  "人类": {
    skin: [
      "古铜色的饱经风霜皮肤",
      "象牙白且略显清瘦的书卷气皮肤",
      "小麦色的健美肤色",
      "北地寒风磨砺出的红润苍白皮肤",
      "橄榄色且油亮的南方港口肤色",
      "黝黑粗粝的长期户外劳作肤色",
      "淡粉白带雀斑的少女般皮肤",
      "灰黄略带病容的贫困区肤色",
      "健康红润的乡村肤色",
      "晒成深棕色的旅者皮肤"
    ],
    hair: [
      "扎成利落马尾的暗红褐色直发",
      "凌乱的黑色短发，任由风沙吹拂",
      "一丝不苟的深金色齐耳短发",
      "浅棕色粗硬短发，额前碎发遮眼",
      "浓密的灰白卷发，束在脑后",
      "削得极短的淡金色寸头",
      "散落至肩的深褐色微卷发",
      "用布条随意绑起的亚麻色长发",
      "黑得发亮的中分长直发",
      "稻草黄色的蓬松短发"
    ],
    eye: [
      "一双阅历丰富的深褐色眼眸",
      "浅蓝色且充满求知欲的眼睛",
      "冷峻坚毅的钢灰色瞳孔",
      "精明锐利的暗绿色眼瞳",
      "温和宽厚的淡褐色眼睛",
      "近乎黑色的深邃眼眸",
      "灰蓝交杂的沧桑眼神",
      "琥珀色中带着一丝狡黠",
      "浅灰色且略显疲倦的眼眸",
      "墨绿色中透着沉稳的双眼"
    ],
    features: [
      "颧骨上有一两道陈年细疤，腰间挂着职业徽记",
      "神态干练，双手布满因长期劳作形成的老茧",
      "步幅均匀，举止高效，不带多余动作",
      "嘴角常挂一丝浅笑，似在衡量对面的人",
      "鼻梁微歪，像是曾被重击后愈合",
      "右眉尾端有一道极细的刀痕",
      "左前臂内侧有一片褪色的刺青",
      "身形偏瘦但骨架结实，行动敏捷",
      "额头宽阔，说话时眉毛总在轻轻抖动",
      "指甲修剪得极短，手指上总沾着洗不掉的墨渍或油污"
    ]
  },
  "精灵：高等精灵": {
    skin: [
      "透着淡金色泽的细腻白皙皮肤",
      "冷白如玉、隐隐透出蓝光的皮肤",
      "浅米色且毫无瑕疵的光洁皮肤",
      "淡粉白中带着一丝银灰的肤色",
      "仿若月长石般的浅灰色皮肤",
      "极淡的薰衣草色白皙皮肤",
      "温润的象牙白皮肤",
      "苍白到近乎透明的皮肤，可见细微血管",
      "带有珍珠光泽的浅金色皮肤",
      "淡蓝色调的冰雪般皮肤"
    ],
    hair: [
      "用古铜扣束起的金色长发",
      "纤细的银白色丝滑长发",
      "浅金色短发，整齐地向后梳拢",
      "淡铂金色及腰直发",
      "霜白色的波浪卷发，松散披肩",
      "深金色编成复杂发辫的长发",
      "银灰色齐耳短发，鬓角别至耳后",
      "淡琥珀色的中长发，用细绳束起",
      "白金色中掺杂着几缕淡粉色的长发",
      "浅灰褐色的柔顺长发"
    ],
    eye: [
      "深沉的紫晶色眼眸",
      "高傲的翠绿色瞳孔",
      "冰蓝色中流转着星光的眼睛",
      "浅金色如琥珀般明亮的眼睛",
      "银灰色且近乎金属质感的眼眸",
      "淡紫色的柔光眼瞳",
      "海蓝色中带着一缕灰雾的眼睛",
      "深绿色如夏叶般的眼睛",
      "极浅的蓝灰色眼眸，近乎透明",
      "铜金色中带着一丝暖意的瞳孔"
    ],
    features: [
      "长耳斜挑，举止矜持，带着天生的疏离感",
      "指节干净，说话声悠扬如弦乐",
      "走路几乎不发出声响，体态轻盈",
      "颌线锐利，侧脸轮廓如雕塑",
      "腕间总戴着一只细银镯，从不取下",
      "眼尾微微上挑，不经意间流露出高傲",
      "前额正中缀着一枚极小的月光石额饰",
      "左耳廓上有一排细小的金色耳环",
      "修长的手指上涂着淡淡的珠光指甲油",
      "颈后有一小片若隐若现的银色符文刺青"
    ]
  },
  "精灵：木精灵": {
    skin: [
      "淡野麦色的户外肤色",
      "微褐中透出橡木绿的皮肤",
      "浅棕色且晒得均匀的肤色",
      "橄榄色带一点绿调的皮肤",
      "榛子壳般的浅褐色皮肤",
      "奶油色中浮现些许雀斑的肤色",
      "浅茶色且质感坚韧的皮肤",
      "淡黄绿色仿若林间光影的皮肤",
      "古铜色偏暖的木精灵皮肤",
      "浅灰色基底上覆盖着细密绿色纹路的皮肤"
    ],
    hair: [
      "用藤枝挽起的深黑色长发",
      "金橙褐色的落叶色齐肩剪发",
      "松绿色的微卷短发",
      "深栗色编成松散辫子的长发",
      "墨绿色中夹杂几缕灰白的长发",
      "浅棕色短发，耳后各别一片枯叶",
      "赤褐色如树皮的粗硬长发",
      "黑褐色中挑染暗绿色的马尾",
      "淡亚麻色且被日光晒褪色的长发",
      "灰绿色蓬松短发，覆着细碎苔藓"
    ],
    eye: [
      "敏锐的亮绿色眼睛",
      "澄澈的琥珀色瞳孔",
      "深棕色如湿润泥土的眼眸",
      "暗绿色中带着金斑的双眼",
      "浅褐绿色且总在警觉扫视的眼睛",
      "杏仁色暖调的眼瞳",
      "墨绿色深处泛着微光的瞳孔",
      "灰绿色如蒙着晨雾的眼眸",
      "浅黄色如幼鹿般的眼睛",
      "橄榄绿且眼角微垂的温和眼眸"
    ],
    features: [
      "皮革护甲带着苔藓清香，走路如风掠过",
      "尖耳时而微颤，捕捉林中微弱声响",
      "双腿充满弹性，步伐无声且重心极稳",
      "双颊散布着几颗淡褐色雀斑",
      "手腕上戴着用藤蔓编织的简洁手环",
      "肩头常停着一只驯养的林雀或松鼠",
      "脚踝处绑着几根防蛇虫的草药束",
      "下颌有一道被树枝划伤的浅疤",
      "指甲留得稍长，便于攀爬树皮",
      "左脸颊上绘着三道褪色的战斗彩绘"
    ]
  },
  "精灵：卓尔 (黑暗精灵)": {
    skin: [
      "深灰如黑曜石的皮肤",
      "浅苍灰色的冷调皮肤",
      "暗紫褐色如陈年瘀痕的皮肤",
      "偏蓝的深灰色皮肤",
      "如湿煤炭般的暗黑色皮肤",
      "暗沉的棕灰色皮肤",
      "冷白色如骨瓷的皮肤",
      "深巧克力色带紫调的皮肤",
      "墨蓝色如午夜海面的皮肤",
      "灰白色中透出微弱紫晕的皮肤"
    ],
    hair: [
      "柔顺的纯白色长发",
      "银白色微卷及腰长发",
      "浅灰色如蛛丝般的短发",
      "漆黑如墨的直长发，与肤色形成对比",
      "深棕色的粗硬短发",
      "灰白挑染淡紫色的高马尾",
      "暗红褐色的编结长发",
      "近乎透明的浅金色短发",
      "霜白色中夹着几缕淡蓝的发丝",
      "炭黑色蓬松短发"
    ],
    eye: [
      "猩红色的聚光眼眸",
      "冷艳的紫水晶色瞳孔",
      "银灰色如镜面般的眼眸",
      "淡粉色且近乎无瞳的眼睛",
      "深褐色如普通地表精灵的眼睛",
      "暗金色如烛火的瞳孔",
      "灰蓝色中带一丝红光的眼眸",
      "纯黑色无光的大眼睛",
      "淡紫红色如宝石般的眼睛",
      "琥珀色暖调的罕见瞳色"
    ],
    features: [
      "长耳高挑，脖侧有蜘蛛教派的毒咒刺青",
      "身形纤巧，行走如影子般无声",
      "眼角微挑，带着天生的警觉与危险气息",
      "左手虎口处烙有一个模糊的家族徽印",
      "肩胛骨间纹着一只向下爬行的蜘蛛图腾",
      "后腰悬着一把细长的淬毒匕首",
      "嘴角有一颗极小的金属钉饰",
      "眉毛被剃得极细，用银粉描出高挑眉形",
      "锁骨下方有一枚熠熠生辉的幽暗石吊坠",
      "右耳廓上缘缺了一小块，似被利刃削过"
    ]
  },
  "矮人：丘陵矮人": {
    skin: [
      "红古铜色的健康户外皮肤",
      "面庞红润发亮的豪迈肤色",
      "浅棕色晒成小麦色的皮肤",
      "奶油色带粉红双颊的皮肤",
      "浅橄榄色且毛孔粗大的皮肤",
      "日晒充足的深褐色皮肤",
      "淡黄色如陈年羊皮纸的皮肤",
      "暗红色如熟透李子的肤色",
      "灰黄如田间土壤的皮肤",
      "浅褐色遍布雀斑的鼻子和脸颊"
    ],
    hair: [
      "金棕色编成粗辫子的大胡子",
      "铁锈暗红色的荆棘般粗硬短发和胡须",
      "浅灰色浓密胡须，末端用铜环束起",
      "焦糖色蓬松大胡子，遮住了半张脸",
      "深栗色长发编成两条对称发辫",
      "黑褐色短发，胡子却偏红棕色",
      "灰白色如老橡树皮的胡须和头发",
      "赤褐色的大胡子，嘴角处被酒渍染深",
      "淡金色稀疏胡须，但头发茂密",
      "橘红色卷曲胡须，极其惹眼"
    ],
    eye: [
      "爽朗红褐色的眼眸",
      "温和的小杏眼，常眯成缝",
      "深灰色如河底卵石的眼睛",
      "浅绿色带金斑的明亮瞳孔",
      "暗蓝色如暮色的眼眸",
      "淡褐色如麦酒的温暖眼睛",
      "榛子色中带一丝顽皮的眼睛",
      "墨绿色深嵌在浓眉下的眼眸",
      "灰绿色如苔藓覆盖岩石的眼睛",
      "浅金色如灯油的憨厚眼眸"
    ],
    features: [
      "身躯矮壮敦实，双足抓地极稳",
      "双手布满农耕和劈柴留下的厚茧",
      "笑声洪亮，浑身飘着麦酒和泥土的气味",
      "腰间总挂着一把雕工古朴的小斧头",
      "鼻头圆大，因常年饮酒呈现紫红色",
      "下巴短而宽，胡须几乎遮住了脖子",
      "左脸颊有一处被蜜蜂蜇过留下的肿块",
      "后腰皮带上系着一个小巧的草药袋",
      "前臂粗壮，布满被麦秆划伤的细痕",
      "耳垂上戴着一只朴素的铜环"
    ]
  },
  "矮人：山脉矮人": {
    skin: [
      "古铜铁锈色的锻炉皮肤",
      "灰白粗糙如花岗岩的皮肤",
      "暗灰色如矿脉岩壁的肤色",
      "深棕红色如冶炼金属的皮肤",
      "浅灰色遍布黑色矿尘斑点的皮肤",
      "苍白粗粝如石灰岩的皮肤",
      "棕褐色如旧皮革的坚韧皮肤",
      "暗橄榄色带金属光泽的皮肤",
      "灰绿色如铜锈的皮肤",
      "深灰色中透出暗红血色的皮肤"
    ],
    hair: [
      "编成对称双辫、锁扣用重铁铸就的大胡子",
      "头颅剃得光亮，但嘴角大丛铜色胡须",
      "黑铁色浓密胡须，末端被火花烧焦",
      "灰白色粗硬胡须，垂至胸前",
      "深棕色寸头，胡须却极为茂密",
      "红褐色胡须，辫成三股并用银环束紧",
      "黑灰色胡须中夹杂着几缕铁锈色",
      "浅灰色胡须，上唇部分被修剪得极短",
      "焦黑色如煤渣的短发和胡渣",
      "灰棕色如花岗岩纹理的胡须"
    ],
    eye: [
      "烁烁生光的灼黄色眼眸",
      "铁灰色永不妥协的眼睛",
      "深棕色如矿坑般的暗沉眼眸",
      "暗红色如炉火余烬的瞳孔",
      "浅灰色如打磨金属的眼睛",
      "墨绿色如孔雀石的锐利眼眸",
      "暗金色如黄铁矿的双眼",
      "银灰色如淬火钢刃的眼眸",
      "灰蓝色如幽暗矿灯的温和眼睛",
      "炭黑色深邃如矿洞的眼眸"
    ],
    features: [
      "双手布满锻锤和重斧留下的老茧",
      "浑身散发着矿井和熔炉的硬朗气息",
      "腰间别着沉甸甸的精钢扳手和短锤",
      "呼吸粗重有力，步伐沉重如锻锤落地",
      "额头上有一道被飞溅铁水烫伤的旧疤",
      "后颈肌肉高高隆起，如铁砧般坚硬",
      "右前臂内侧纹着氏族山峦图腾",
      "手指粗短，指甲缝里嵌着洗不掉的铁粉",
      "左边肩胛骨处有一片被高温灼伤的皱皮",
      "下巴方正，咬肌极其发达"
    ]
  },
  "矮人：杜尔加 (灰矮人)": {
    skin: [
      "惨白灰冷的铅黑色皮肤",
      "粗糙的黑灰色皮肉",
      "暗灰色如地底铅矿的皮肤",
      "灰白中泛着病态淡黄的皮肤",
      "深灰色如潮湿岩石的皮肤",
      "暗绿色如旧铜器的皮肤",
      "苍白如死灰的皮肤",
      "灰棕色如干涸泥浆的皮肤",
      "铁灰色如冷硬金属的皮肤",
      "暗紫色如淤伤的皮肤"
    ],
    hair: [
      "干枯硬如断铁的灰白狂胡",
      "头顶竖起的青灰色枯发，两鬓剃开",
      "黑灰色粗硬胡须，末梢焦白",
      "灰褐色稀疏胡须，挂满矿尘",
      "暗绿色如水垢的细碎短发",
      "灰白色胡须被硝酸烟气熏得发黄",
      "深灰色如铁丝般的寸头",
      "黑灰色大胡子中藏着一两条灰白辫子",
      "浅灰色如骨灰的头发和胡须",
      "铁锈色粗胡须，末端被割得参差不齐"
    ],
    eye: [
      "蒙着暗白薄膜的无神瞳孔",
      "澄金无色的怪异眼眸",
      "暗红色如燃烧煤块的眼睛",
      "灰白色如盲眼的瞳孔",
      "深绿色如毒沼的眼睛",
      "淡黄色如病狼的警戒眼眸",
      "黑褐色深陷在眉骨下的眼睛",
      "银灰色中透出极度多疑的眼睛",
      "浅褐色如干涸血渍的瞳孔",
      "灰蓝色如幽暗地域冰湖的眼眸"
    ],
    features: [
      "矮短沉重，下巴短突，獠齿微露",
      "双手因地表光线照射而轻微痉挛",
      "说话时喉间带有嘶哑的咳鸣",
      "浑身散发着采矿毒气和压抑的煞气",
      "右眼皮永远半垂着，像是睁不开",
      "左脸有一道被矿道塌方砸出的凹陷",
      "后颈烙印着一枚奴隶时期的编号",
      "手背上的汗毛被酸雾腐蚀得稀疏",
      "鼻梁歪向一侧，曾被重物打断",
      "走路的姿态永远是微微佝偻的防御姿势"
    ]
  },
  "半身人：轻足半身人": {
    skin: [
      "红润如熟苹果的健康肤色",
      "淡乳黄色且生机勃勃的皮肤",
      "浅桃色带细微绒毛的皮肤",
      "奶油色如鲜奶油的柔软皮肤",
      "小麦色晒得微红的户外皮肤",
      "粉白色带雀斑的双颊皮肤",
      "浅褐色如烤面包的皮肤",
      "淡金色如蜂蜜的皮肤",
      "淡粉红且极易晒伤的皮肤",
      "浅杏色如成熟杏子的肤色"
    ],
    hair: [
      "蓬松卷成螺蛳圈的淡金色短发",
      "浅栗色柔顺及颈的软发",
      "深棕色浓密如小狮子般的卷发",
      "赤褐色如秋叶的波浪短发",
      "沙金色如麦田的直短发",
      "灰白色如老绵羊毛的卷发",
      "黑褐色利落的齐耳短发",
      "淡红棕色编成小辫子的长发",
      "姜黄色如姜饼的卷曲短发",
      "浅亚麻色用花布条扎起的双马尾"
    ],
    eye: [
      "圆滚澄明的大黑圆眼睛",
      "暖褐色如溪底碎金的眼睛",
      "浅绿色如新生嫩叶的眼睛",
      "灰蓝色如雨后天空的明亮眼眸",
      "深棕色如浓咖啡的温暖眼睛",
      "淡灰色如晨雾的柔和眼眸",
      "栗色如烤栗子的可爱眼睛",
      "暗绿色如苔藓的圆眼睛",
      "琥珀色如蜜糖的亮眼",
      "淡紫色如薰衣草的罕见瞳色"
    ],
    features: [
      "行动极其灵动迅捷，能在大人腿间自如穿梭",
      "光着的宽脚背上覆着茶色茸毛，脚底厚茧不怕砂石",
      "总在把玩一枚亮晶晶的硬币或小石子",
      "脸蛋圆润，笑起来时双颊鼓起两个酒窝",
      "左边耳垂上别着一朵干花",
      "腰间的口袋总是鼓鼓囊囊，装满零食和小工具",
      "手指短而灵巧，擅长解绳结和开小锁",
      "走路时像一阵轻风，几乎不发出声音",
      "肩上常披着一条手工编织的彩条纹小毯",
      "前额有一小撮永远翘起的呆毛"
    ]
  },
  "半身人：壮健半身人": {
    skin: [
      "微红多肉的强健肤色",
      "暖褐色的面皮，透着油脂光泽",
      "淡棕色如粗陶的厚实皮肤",
      "浅古铜色如农田土壤的皮肤",
      "奶油色偏红的健壮肤色",
      "浅灰色如河泥的粗糙皮肤",
      "淡红褐色如砖块的皮肤",
      "暗橄榄色如咸肉的皮肤",
      "深小麦色如黑面包的皮肤",
      "灰黄如老旧帆布的皮肤"
    ],
    hair: [
      "浓厚微卷的深黄褐色硬发",
      "亚麻色扎在脑后的厚马尾",
      "棕红色如泥土的粗硬短发",
      "深褐色如树根的浓密卷发",
      "灰棕色如干草的齐肩长发",
      "黑灰色如铁丝的寸头",
      "浅棕色编成粗辫子的长发",
      "暗金色如熟麦的波浪短发",
      "赤褐色如旧皮革的粗硬胡须",
      "灰白色如霜打麦茬的短发"
    ],
    eye: [
      "赤诚无畏的黑色眼睛",
      "暖黄色温柔瞳孔",
      "深棕色如沃土的眼睛",
      "灰绿色如菜叶的眼睛",
      "暗蓝色如暮霭的沉稳眼眸",
      "浅褐色如坚果的眼睛",
      "墨绿色如深潭的眼睛",
      "淡灰色如石板的温和眼睛",
      "琥珀色如陈年蜜酒的眼睛",
      "暗红色如熟透浆果的罕见瞳色"
    ],
    features: [
      "骨架壮硕敦实，肢体更厚实有力",
      "双脚十分稳实，手掌指节因操劳留下红印",
      "随身背挂着分量极大的野餐餐盘和调味盒",
      "对各类毒物和疾病有着惊人的抵抗力",
      "右臂上有一道被野猪獠牙划伤的长疤",
      "下巴方正，总带着一抹淡定的微笑",
      "腰间挂着一个小巧的磨刀石袋",
      "后颈的皮肤被太阳晒得黝黑粗糙",
      "胸膛宽阔，呼吸深沉而均匀",
      "走路时重心极低，像一座移动的小山丘"
    ]
  },
  "龙裔": {
    skin: [
      "厚实的红色龙鳞，透着熔岩热气",
      "苍蓝色雷电重鳞",
      "亮金色斑驳的鳞皮",
      "黑曜石色坚厚龙皮",
      "青铜色如古钟的鳞片",
      "银白色如镜面反光的鳞甲",
      "翠绿色如密林深处的鳞皮",
      "紫铜色暗光流转的鳞片",
      "铁灰色如阴云密布的鳞甲",
      "乳白色如象牙的骨质鳞片"
    ],
    hair: [
      "后颈沿脊椎滑下的几对骨质硬棘",
      "颅顶耸立的红晶骨角，形如王冠",
      "对称的刀削状逆鳞突起，没有毛发",
      "从额头延伸至后脑的一排骨板",
      "下颌两侧各有一根向后弯曲的短角",
      "头顶两根粗壮的黑色弯角",
      "鼻梁上方生着一枚细长的角质尖刺",
      "双颊覆盖着细小的鳞片，后脑有冠状膜",
      "颅后垂着几缕由角质构成的细长触须",
      "光滑的头部，无角无毛，仅鳞片排列成纹"
    ],
    eye: [
      "炽热的澄黄金龙眼",
      "幽暗流转闪电碎屑的亮蓝眸子",
      "琥珀暗金龙睛",
      "深红色如岩浆的竖瞳",
      "冰白色如极地寒光的眼睛",
      "翠绿色如翡翠的爬虫类瞳孔",
      "橙黄色如琥珀的温和眼眸",
      "银灰色如金属球体的眼睛",
      "紫黑色如深渊的竖瞳",
      "灰绿色如沼泽雾气的眼睛"
    ],
    features: [
      "粗厚龙嘴边偶有火花或寒雾般的吐息残屑",
      "双掌龙爪宽大，指甲被打磨成利刃",
      "背脊直立如神柱，尾骨虽退化仍显威严",
      "鳞片边缘带有古铜色的老旧挫口",
      "胸前有一片颜色略浅的逆鳞，是为弱点",
      "双肩隆起两块额外的骨板，如肩甲",
      "尾部末端生有一排细小的骨刺",
      "行走时脚爪与地面摩擦发出沙沙声",
      "双眼正上方各有一道凸起的眉脊",
      "喉部鳞片微微颤动，酝酿着下一次吐息"
    ]
  },
  "提夫林": {
    skin: [
      "浅朱红色的华美皮肤",
      "淡紫罗兰色的静谧皮肤",
      "冷艳的高冷石灰色皮肤",
      "深红色如干涸血渍的皮肤",
      "暗蓝色如暮光的皮肤",
      "深紫色如茄皮的皮肤",
      "灰白色如骨灰的皮肤",
      "深灰色如烟熏的皮肤",
      "淡粉色如肉蔻的皮肤",
      "暗绿色如旧铜锈的皮肤"
    ],
    hair: [
      "亮黑色顺直及腮长发",
      "黑曜石光泽的艳红色刺发",
      "星界流银般的银白色丝滑长发",
      "深酒红色的波浪卷发",
      "暗紫色如墨水的短发",
      "灰白色如枯骨的凌乱长发",
      "暗蓝色挑染银色的马尾",
      "深棕色如咖啡的直发",
      "火焰橙红色的蓬松短发",
      "漆黑如夜的长发，末端渐变成暗红"
    ],
    eye: [
      "纯金色的异界之瞳",
      "漆黑无光如乌曜石的眼球",
      "红宝石色的狡黠双眼",
      "银白色如月光的眼眸",
      "深紫色如紫水晶的瞳孔",
      "琥珀色如野兽的眼睛",
      "冰蓝色如极地寒冰的眼眸",
      "全黑巩膜中浮着一圈金环的诡异眼睛",
      "深绿色如毒液的竖瞳",
      "灰白色如盲眼的瞳孔"
    ],
    features: [
      "前额向后弯曲盘绕的漆黑巨角，散发淡淡硫磺气息",
      "一条灵便的魔鬼尾巴，尾梢呈骨针状",
      "手指接触金属会激起微弱静电火花",
      "头顶的角上缠绕着几圈细银链",
      "脚踝处生有一对退化的副蹄",
      "舌尖分叉，说话时偶尔露出尖端",
      "背部肩胛骨处有两道微凸的翼骨痕迹",
      "指甲天生漆黑且坚硬，无需打磨",
      "左角根部缺了一小块，像是被钝器砸断后愈合",
      "尾巴尖端的骨针上穿着一枚细小的铜铃"
    ]
  },
  "半兽人": {
    skin: [
      "深铁灰色的强韧粗糙皮肤",
      "暗黄绿色的兽血青灰肤色",
      "灰褐古铜的结实皮肤",
      "暗绿色如沼泽苔藓的皮肤",
      "灰白色如兽骨的皮肤",
      "深棕色如树皮的粗糙皮肤",
      "暗灰色如阴云密布的皮肤",
      "淡橄榄色如旧军装的皮肤",
      "黑灰色如火山岩的皮肤",
      "浅灰色如大象皮的厚实皮肤"
    ],
    hair: [
      "漆黑蓬乱的碎短发，用油脂抹固",
      "用野麻绳束起的粗硬小马尾",
      "剃得锃亮的光头，纹着部落战痕",
      "深棕色如熊毛的浓密长发",
      "灰黑色粗硬寸头",
      "暗红色如干涸血渍的短发",
      "黑褐色编成多条细辫的长发",
      "灰白色如老狼毛的凌乱发丝",
      "棕灰色如岩石纹理的中长发",
      "深绿色如苔藓的罕见发色"
    ],
    eye: [
      "布满血丝的死灰绿瞳仁",
      "深沉坚韧的铜黄小眼睛",
      "冷血的淡浅黄色野兽眼神",
      "暗红色如余烬的眼睛",
      "灰色如暴风云的眼眸",
      "深棕色如泥沼的眼睛",
      "暗金色如鹰隼的瞳孔",
      "灰绿色如狼眼的警觉眼眸",
      "黑色如无尽深渊的眼睛",
      "浅蓝色如冰原的罕见瞳色"
    ],
    features: [
      "嘴唇微翘，下颚探出两颗粗大獠牙",
      "宽阔的肩颈上横陈着几道旧刀疤",
      "骨架开张极大，透着原始的压迫感",
      "下颌左侧有一道被撕咬过的锯齿形伤痕",
      "左耳被削去一半，剩下的耳廓参差不齐",
      "前臂粗壮，手背青筋暴起",
      "鼻梁扁平，像是被多次击打后愈合",
      "上臂外侧烙着一个部落的野猪图腾",
      "呼吸声粗重如风箱，尤其入睡后",
      "后背遍布旧日鞭笞留下的交错疤痕"
    ]
  },
  "斑猫人": {
    skin: [
      "布满深黑斑块的亮橙金色毛皮",
      "霜雪般浅灰斑条的厚毛皮",
      "纯黑如缎面的光滑毛皮",
      "深棕色如豹纹的短毛皮",
      "灰白如兔毛的柔软毛皮",
      "淡金色如沙漠狐的短毛皮",
      "黑灰相间如大理石纹的毛皮",
      "橘黄如虎斑的条纹毛皮",
      "银色如月光的长毛皮",
      "棕红色如狐狸的蓬松毛皮"
    ],
    hair: [
      "后颈蓬散的黑灰色鬃毛",
      "头顶垂下两条扎着鸟羽和木珠的浅褐色发辫",
      "双耳边缘飘拂的银白色碎须",
      "眉心一撮深色的菱形短毛",
      "脸颊两侧长着几根细长的白色触须",
      "从头顶延伸至后背的一条深色鬃毛带",
      "额前长着一小片与毛色不同的异色斑纹",
      "耳朵尖端生有几根极长的黑色飞毛",
      "腮边胡须编成了精巧的细辫",
      "整个头部均匀覆盖短毛，无人类头发"
    ],
    eye: [
      "幽金光的硕大琥珀眸",
      "翠绿色的猫科竖瞳眼睛",
      "海宝蓝色的好奇大眼球",
      "金绿色的明亮圆眼",
      "橙黄色如火焰的瞳孔",
      "灰蓝色如冰湖的圆眼",
      "深紫色如宝石的罕见瞳色",
      "浅棕色如茶晶的温和眼睛",
      "银灰色如月下的猫眼",
      "异色瞳：一蓝一绿"
    ],
    features: [
      "头顶一对灵敏的三角绒毛兽耳",
      "身后一根修长的豹斑尾巴，随动作轻摇",
      "十指前端收缩着弯曲的利爪，行走无声",
      "嘴角的须一抖一抖，总在把玩小物件",
      "耳尖内侧各有一小撮深色簇毛",
      "尾巴末端有一圈白色环纹",
      "肩胛骨间的皮毛呈现反向生长的旋涡",
      "脚掌肉垫厚实，踩在碎石上也无妨",
      "鼻子湿润，时不时无意识地嗅探空气",
      "牙尖微露，尤其四颗犬齿比人类更长更锐"
    ]
  },
  "阿斯莫": {
    skin: [
      "隐现金箔光芒的乳金色皮肤",
      "散发微弱荧光的白皙美玉之躯",
      "珍珠般温润的肤色",
      "淡金色如晨曦的皮肤",
      "象牙白且毫无瑕疵的皮肤",
      "浅古铜色如神像的皮肤",
      "银白色如月光的冷调皮肤",
      "淡粉色如贝壳珠光的皮肤",
      "浅灰色如鸽羽的柔和皮肤",
      "暗金色如古老圣像的皮肤"
    ],
    hair: [
      "灿烂如晨曦的金色长发",
      "纯净不染一尘的白色直雪发",
      "柔亮红粉紫色的晚霞长发",
      "银灰色如星光的微卷长发",
      "深金色如圣杯的长发",
      "浅棕色如鸽翼的柔顺短发",
      "淡金色中挑染纯白的长发",
      "铂金色如天使羽翼的波浪发",
      "灰白色如云朵的蓬松卷发",
      "黑色如墨却泛着蓝光的罕见发色"
    ],
    eye: [
      "星炽的纯银瞳眸",
      "充满宽厚仁爱的泪光白眼睛",
      "隐现白烁雷芒的黄金瞳",
      "淡金色如圣光的温和眼眸",
      "冰蓝色如晴空的澄澈眼睛",
      "银灰色如月下的宁静眼睛",
      "深棕色如大地的包容眼眸",
      "浅绿色如新叶的生机眼睛",
      "紫晶色如神眷的罕见瞳色",
      "全白无瞳孔的先知般眼睛"
    ],
    features: [
      "背部有隐形的天界虚影之翼肌腱线",
      "额头正中带有散发花蜜清香的圣眷烙记",
      "发丝会在面对邪恶时微微无风飘拂",
      "双肩锁骨处各有一颗极小的淡金色胎记",
      "嗓音带着一种悠远的回响，仿佛来自远方",
      "左前臂内侧自然浮现出若隐若现的天界文字",
      "行走时足尖几乎不沾尘，如踏云端",
      "腕间绕着一根用自己发丝编织的细手环",
      "耳后皮肤隐约透出浅金色的血管纹路",
      "眼泪在光线下会折射出微弱的虹彩"
    ]
  }
};


// ===================== 组件主体 =====================
const cleanRoot = (name: string): string => {
  if (!name) return "";
  return name
    .replace(/\s*[\(\uff08].*?[\)\uff09]\s*/g, '') // 去除括号内容如 (黑暗精灵) 或 （变体）
    .replace(/(精灵|矮人|半身人|侏儒|血脉|变体|血统|裔|人|亚种)/g, '')
    .trim();
};

export const getBestRaceAssetsKey = (raceName: string, subraceName?: string): string => {
  const keys = Object.keys(RACES_MAPPING);

  // 1. 尝试完全匹配
  const fullName = subraceName ? `${raceName}：${subraceName}` : raceName;
  if (RACES_MAPPING[fullName]) {
    return fullName;
  }

  // 2. 如果提供了子种族，寻找具有相同子种族特质根词的条目
  if (subraceName) {
    const queryRoot = cleanRoot(subraceName);
    if (queryRoot) {
      // 优先在同名母种族的子分类中找
      const sameFamilyKeys = keys.filter(k => k.startsWith(`${raceName}：`));
      const exactSubMatchInFamily = sameFamilyKeys.find(k => {
        const [, mappedSub] = k.split('：');
        return cleanRoot(mappedSub) === queryRoot;
      });
      if (exactSubMatchInFamily) return exactSubMatchInFamily;

      // 如果同名母种族中没找到，在所有子种族里找（可能母种族名字有细微差异）
      const exactSubMatchGlobal = keys.find(k => {
        if (!k.includes('：')) return false;
        const [, mappedSub] = k.split('：');
        return cleanRoot(mappedSub) === queryRoot;
      });
      if (exactSubMatchGlobal) return exactSubMatchGlobal;
    }
  }

  // 3. 匹配主种族
  // 3.1 查找有没有直接命名的主种族库条目（例如 "龙裔"、"提夫林"、"人类"、"半兽人"、"阿斯莫"、"斑猫人" 等）
  const cleanRaceName = cleanRoot(raceName);
  const mainRaceMatch = keys.find(k => {
    if (k.includes('：')) return false;
    return k === raceName || cleanRoot(k) === cleanRaceName;
  });
  if (mainRaceMatch) return mainRaceMatch;

  // 3.2 查找符合该主种族前缀的任何第一个条目（如 "精灵：高等精灵" 作为 "精灵" 的退步备选）
  const familyMatch = keys.find(k => k.startsWith(`${raceName}：`));
  if (familyMatch) return familyMatch;

  // 3.3 模糊主种族搜索，包含根词的主种族
  const fuzzyFamilyMatch = keys.find(k => k.includes('：') && cleanRoot(k.split('：')[0]) === cleanRaceName);
  if (fuzzyFamilyMatch) return fuzzyFamilyMatch;

  // 4. 终极兜底：如果没有匹配的主种族，使用通用库 "人类"
  return "人类";
};

export const getRaceAssets = (raceName: string, subraceName?: string) => {
  const bestKey = getBestRaceAssetsKey(raceName, subraceName);
  return RACES_MAPPING[bestKey] || RACES_MAPPING["人类"];
};

export function generateCoreAppearanceAndPersonality({
  raceName,
  subraceName,
  lawChaos,
  goodEvil,
  gender,
}: {
  raceName: string;
  subraceName?: string;
  lawChaos: 'lawful' | 'neutral' | 'chaotic';
  goodEvil: 'good' | 'neutral' | 'evil';
  gender: 'male' | 'female' | 'none';
}) {
  const raceAssets = getRaceAssets(raceName, subraceName);
  
  const randSkin = raceAssets.skin[Math.floor(Math.random() * raceAssets.skin.length)];
  const randHair = raceAssets.hair[Math.floor(Math.random() * raceAssets.hair.length)];
  const randEye = raceAssets.eye[Math.floor(Math.random() * raceAssets.eye.length)];
  const randFeature = raceAssets.features[Math.floor(Math.random() * raceAssets.features.length)];
  
  const hasUniFeature = Math.random() < 0.35; // 35% chance to have a unique specific feature
  let uniFeatures = '';
  if (hasUniFeature) {
    const numUniFeatures = Math.random() < 0.4 ? 2 : 1;
    const shuffledUni = [...UNIVERSAL_APPEARANCE_FEATURES].sort(() => Math.random() - 0.5);
    uniFeatures = shuffledUni.slice(0, numUniFeatures).join('；') + '。';
  }

  const isPureMasked = Math.random() < 0.08; // 8% chance to be completely masked
  
  const pWord = gender === 'male' ? '他' : (gender === 'female' ? '她' : '其');
  let appearance = '';
  if (isPureMasked) {
    appearance = PURE_MASKED_APPEARANCES[Math.floor(Math.random() * PURE_MASKED_APPEARANCES.length)];
  } else {
    appearance = `${pWord}拥有${randSkin}，${randHair}，${randEye}。${pWord}${randFeature}。${uniFeatures}`;
  }

  const lcObj = LAW_CHAOS_AXIS[lawChaos];
  const geObj = GOOD_EVIL_AXIS[goodEvil];
  
  const randLawChaosBelief = lcObj.beliefs[Math.floor(Math.random() * lcObj.beliefs.length)];
  const randGoodEvilBelief = geObj.beliefs[Math.floor(Math.random() * geObj.beliefs.length)];
  const randLawChaosManner = lcObj.manners[Math.floor(Math.random() * lcObj.manners.length)];
  const randGoodEvilManner = geObj.manners[Math.floor(Math.random() * geObj.manners.length)];
  let traitStr = '';
  if (Math.random() < 0.4) {
    const randExtraTrait = EXTRA_PERSON_TRAITS[Math.floor(Math.random() * EXTRA_PERSON_TRAITS.length)];
    traitStr = `此外，同伴们常能察觉，${pWord}${randExtraTrait}。`;
  }

  let quirkStr = '';
  if (Math.random() < 0.4) {
    const randExtraQuirk = EXTRA_QUIRKS[Math.floor(Math.random() * EXTRA_QUIRKS.length)];
    quirkStr = `私下里，${pWord}也有一些小癖好，比如${randExtraQuirk}。`;
  }

  const combinedBelief = `${randLawChaosBelief}，同时${randGoodEvilBelief}`;
  const combinedManner = `${randLawChaosManner}，且${randGoodEvilManner}`;

  let combinedName = `${lcObj.name}${geObj.name}`;
  if (lawChaos === 'neutral') combinedName = `中立${geObj.name}`;
  if (goodEvil === 'neutral') combinedName = `${lcObj.name}中立`;
  if (lawChaos === 'neutral' && goodEvil === 'neutral') combinedName = '绝对中立';

  const personalityPart = `${pWord}表现出显著的「${combinedName}」倾向。日常作派倾向于${combinedManner}。${traitStr}`;
  
  const beliefPart = `${combinedBelief}。${quirkStr}`;
  
  const mergedPersonality = `${personalityPart}\n${beliefPart}`;

  return {
    appearance,
    personality: mergedPersonality,
    personalityPart,
    beliefPart,
  };
}

export function AppearancePersonalityGenerator({ onClose }: { onClose: () => void }) {
  const { state: charState, dispatch: charDispatch } = useCharacter();
  const [selectedRace, setSelectedRace] = useState<string>('人类');
  const [lawChaos, setLawChaos] = useState<string>('lawful');
  const [goodEvil, setGoodEvil] = useState<string>('good');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'none'>('male');
  const [generatedAppearance, setGeneratedAppearance] = useState<string>('');
  const [generatedPersonality, setGeneratedPersonality] = useState<string>('');
  const [generatedBackstory, setGeneratedBackstory] = useState<string>('');
  const [justApplied, setJustApplied] = useState<boolean>(false);
  const [copiedApp, setCopiedApp] = useState<boolean>(false);
  const [copiedPers, setCopiedPers] = useState<boolean>(false);
  const skipNextEffectRef = useRef<boolean>(false);

  // 1. 根据已开启的扩展自动提取可用的种族和子种族
  const activeRaceOptions = useMemo(() => {
    const list: Array<{ value: string; label: string; raceName: string; subraceName?: string }> = [];
    
    const availableRaces = getAvailableRaces(charState.character.raceSource ? { [charState.character.raceId]: charState.character.raceSource } : {});
    
    availableRaces.forEach((r) => {
      const enabledSubraces = r.subraces || [];
      
      if (enabledSubraces.length > 0) {
        enabledSubraces.forEach((sr) => {
          const val = `${r.name}：${sr.name}`;
          list.push({
            value: val,
            label: val,
            raceName: r.name,
            subraceName: sr.name
          });
        });
        
        // 同时提供主种族选项作为备选
        list.push({
          value: r.name,
          label: r.name,
          raceName: r.name,
          subraceName: undefined
        });
      } else {
        list.push({
          value: r.name,
          label: r.name,
          raceName: r.name,
          subraceName: undefined
        });
      }
    });

    // 移除重复项
    const uniqueList: typeof list = [];
    const seen = new Set<string>();
    for (const opt of list) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value);
        uniqueList.push(opt);
      }
    }
    
    // 中文排序，人类始终保持在最前
    return uniqueList.sort((a, b) => {
      if (a.value === '人类') return -1;
      if (b.value === '人类') return 1;
      return a.value.localeCompare(b.value, 'zh-CN');
    });
  }, []);

  // 2. 种族-子种族自适应特征库提取逻辑：专门编写的子种族用子种族库，其他用种族库，没有种族库的种族采用物理通用库
  const getRaceAssets = (selection: string) => {
    if (selection.includes('：')) {
      const [raceName, subraceName] = selection.split('：');
      const bestKey = getBestRaceAssetsKey(raceName, subraceName);
      return RACES_MAPPING[bestKey];
    } else {
      const bestKey = getBestRaceAssetsKey(selection);
      return RACES_MAPPING[bestKey];
    }
  };

  useEffect(() => {
    if (charState?.character) {
      const raceId = charState.character.raceId;
      const subraceId = charState.character.subraceId;
      
      const matchRace = races.find(r => r.id === raceId);
      if (matchRace) {
        if (subraceId && matchRace.subraces) {
          const matchSubrace = matchRace.subraces.find(sr => sr.id === subraceId);
          if (matchSubrace) {
            const expectedVal = `${matchRace.name}：${matchSubrace.name}`;
            setSelectedRace(expectedVal);
          } else {
            setSelectedRace(matchRace.name);
          }
        } else {
          setSelectedRace(matchRace.name);
        }
      }

      const alignStr = charState.character.alignment || "";
      if (alignStr.includes('L') || alignStr.includes('守序')) setLawChaos('lawful');
      else if (alignStr.includes('C') || alignStr.includes('混乱')) setLawChaos('chaotic');
      else setLawChaos('neutral');
      if (alignStr.includes('G') || alignStr.includes('善良')) setGoodEvil('good');
      else if (alignStr.includes('E') || alignStr.includes('邪恶')) setGoodEvil('evil');
      else setGoodEvil('neutral');
    }
  }, [charState?.character?.raceId, charState?.character?.subraceId, charState?.character?.alignment]);

  const getAlignmentLabel = () => {
    if (lawChaos === 'neutral' && goodEvil === 'neutral') return '绝对中立 (N)';
    const lcObj = LAW_CHAOS_AXIS[lawChaos];
    const geObj = GOOD_EVIL_AXIS[goodEvil];
    let combinedName = `${lcObj.name}${geObj.name}`;
    if (lawChaos === 'neutral') combinedName = `中立${geObj.name}`;
    if (goodEvil === 'neutral') combinedName = `${lcObj.name}中立`;
    return `${combinedName} (${lcObj.code}${geObj.code})`;
  };

  const handleGenerate = (
    raceOverride?: string,
    lcOverride?: 'lawful' | 'neutral' | 'chaotic',
    geOverride?: 'good' | 'neutral' | 'evil',
    genderOverride?: 'male' | 'female' | 'none'
  ) => {
    const res = generateCoreAppearanceAndPersonality({
      raceName: raceOverride !== undefined ? raceOverride : selectedRace,
      lawChaos: (lcOverride !== undefined ? lcOverride : lawChaos) as any,
      goodEvil: (geOverride !== undefined ? geOverride : goodEvil) as any,
      gender: genderOverride !== undefined ? genderOverride : selectedGender,
    });

    setGeneratedAppearance(res.appearance);
    setGeneratedPersonality(res.personality);
    setJustApplied(false);
  };

  const handleFullRandomGenerate = () => {
    if (activeRaceOptions.length === 0) return;
    const randomOpt = activeRaceOptions[Math.floor(Math.random() * activeRaceOptions.length)];
    const randomRace = randomOpt.value;
    
    const lcKeys = ['lawful', 'neutral', 'chaotic'];
    const randomLc = lcKeys[Math.floor(Math.random() * lcKeys.length)] as 'lawful' | 'neutral' | 'chaotic';
    
    const geKeys = ['good', 'neutral', 'evil'];
    const randomGe = geKeys[Math.floor(Math.random() * geKeys.length)] as 'good' | 'neutral' | 'evil';

    const genders: Array<'male' | 'female' | 'none'> = ['male', 'female', 'none'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];

    // 1. Generate text immediately with the new randomized parameters
    const res = generateCoreAppearanceAndPersonality({
      raceName: randomRace,
      lawChaos: randomLc,
      goodEvil: randomGe,
      gender: randomGender,
    });

    setGeneratedAppearance(res.appearance);
    setGeneratedPersonality(res.personality);
    setJustApplied(false);

    // 2. Decide if states actually changed. If they changed, set skipNextEffectRef = true
    const changed = randomRace !== selectedRace || randomLc !== lawChaos || randomGe !== goodEvil || randomGender !== selectedGender;
    if (changed) {
      skipNextEffectRef.current = true;
    }

    // 3. Update dropdown states
    setSelectedRace(randomRace);
    setLawChaos(randomLc);
    setGoodEvil(randomGe);
    setSelectedGender(randomGender);
  };

  useEffect(() => {
    if (skipNextEffectRef.current) {
      skipNextEffectRef.current = false;
      return;
    }
    handleGenerate();
  }, [selectedRace, lawChaos, goodEvil, selectedGender]);

  const handleApplyToSheet = () => {
    if (!generatedAppearance || !generatedPersonality) return;
    charDispatch({
      type: 'UPDATE_BASIC_INFO',
      payload: {
        appearance: generatedAppearance,
        personality: generatedPersonality
      }
    });
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 4400);
  };

  const copyToClipboard = (text: string, type: 'app' | 'pers') => {
    navigator.clipboard.writeText(text);
    if (type === 'app') { setCopiedApp(true); setTimeout(() => setCopiedApp(false), 2000); }
    else { setCopiedPers(true); setTimeout(() => setCopiedPers(false), 2000); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-xl max-w-2xl w-full shadow-2xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none">✕</button>

        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
              <VenetianMask size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-600 leading-none">🎭 外观与性格生成器</h2>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">生成独特的外貌与心智特质。</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-105">
          <div className="md:col-span-1">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">🧬 种族/亚种</label>
            <select value={selectedRace} onChange={(e) => setSelectedRace(e.target.value)} className="w-full text-xs font-semibold bg-white border border-stone-200 rounded p-2 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer">
              {activeRaceOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">⚖️ 秩序/混乱</label>
            <select value={lawChaos} onChange={(e) => setLawChaos(e.target.value)} className="w-full text-xs font-semibold bg-white border border-stone-200 rounded p-2 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer">
              <option value="lawful">守序 (L)</option>
              <option value="neutral">中立 (N)</option>
              <option value="chaotic">混乱 (C)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">❤️ 善良/邪恶</label>
            <select value={goodEvil} onChange={(e) => setGoodEvil(e.target.value)} className="w-full text-xs font-semibold bg-white border border-stone-200 rounded p-2 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer">
              <option value="good">善良 (G)</option>
              <option value="neutral">中立 (N)</option>
              <option value="evil">邪恶 (E)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">👤 特征</label>
            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value as any)} className="w-full text-xs font-semibold bg-white border border-stone-200 rounded p-2 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer">
              <option value="male">男性 (他)</option>
              <option value="female">女性 (她)</option>
              <option value="none">无性别/不详 (其)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleGenerate()} 
            title="重新生成（基于当前已选种族与阵营等配置）" 
            className="w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-all cursor-pointer border border-stone-200/55 flex items-center justify-center active:scale-95"
          >
            <RefreshCw size={15} />
          </button>
          
          <button 
            onClick={handleFullRandomGenerate} 
            title="真随机生成（完全随机选择种族、阵营与性别特征，一键生成）" 
            className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-all cursor-pointer border border-indigo-200/55 flex items-center justify-center active:scale-95"
          >
            <Dices size={15} />
          </button>

          <button 
            onClick={handleApplyToSheet} 
            title="应用这些特征到当前正在编辑的角色卡" 
            className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all cursor-pointer border-none flex items-center justify-center active:scale-95 ml-auto"
          >
            <UserCheck size={15} />
          </button>
        </div>

        {justApplied && (
          <div className="bg-amber-500/10 border-l-4 border-l-amber-600 border border-amber-500/30 text-stone-900 dark:text-amber-100 text-xs px-4 py-3 rounded shadow-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1.5 duration-150 leading-relaxed">
            <span className="text-amber-600 text-[14px] select-none leading-none mt-0.5">✨</span>
            <div className="flex-1 font-sans font-medium">
              🎲 已套用成功！外貌描写已填入角色外观区，完整的性格、信条与小癖好已融入您的「性格特质」中！
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-1">
          <div className="border border-stone-200 rounded-xl bg-amber-50/10 p-5 relative">
            <div className="flex justify-between items-start mb-2 border-b border-stone-100 pb-1.5">
              <span className="text-xs font-black font-serif text-amber-900 flex items-center gap-1"><span>🧬</span> {selectedRace} 外貌描述</span>
              <button onClick={() => copyToClipboard(generatedAppearance, 'app')} className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-all cursor-pointer border-none bg-transparent">
                {copiedApp ? <span className="text-[10px] text-teal-600 font-sans font-bold">已复制!</span> : <Copy size={13} />}
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">{generatedAppearance || "正在生成..."}</p>
          </div>
          <div className="border border-stone-200 rounded-xl bg-amber-50/10 p-5 relative">
            <div className="flex justify-between items-start mb-2 border-b border-stone-100 pb-1.5">
              <span className="text-xs font-black font-serif text-amber-900 flex items-center gap-1"><span>⚖️</span> 性格特质、信条与习惯</span>
              <button onClick={() => copyToClipboard(generatedPersonality, 'pers')} className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-all cursor-pointer border-none bg-transparent">
                {copiedPers ? <span className="text-[10px] text-teal-600 font-sans font-bold">已复制!</span> : <Copy size={13} />}
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">{generatedPersonality || "正在生成..."}</p>
          </div>
        </div>
        <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-[10px] text-stone-405 font-sans leading-normal">
          <span>beta 测试版本</span>
          <span>Version 2.0</span>
        </div>
      </div>
    </div>
  );
}