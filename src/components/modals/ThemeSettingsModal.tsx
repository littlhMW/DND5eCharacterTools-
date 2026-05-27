import React from 'react';

interface ThemeSettingsModalProps {
  open: boolean;
  onClose: () => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export function ThemeSettingsModal({ open, onClose, currentTheme, setCurrentTheme }: ThemeSettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            🎨 网页配色方案
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            选择您偏好的主题背景风格。该设置将保存在本地并自动应用。
          </p>
        </div>

        <div className="space-y-4 pb-2 pt-2 max-h-[60vh] overflow-y-auto pr-1">
          {(() => {
            const themesList = [
              { id: 'dndmanual', name: '📕 龙与地下城手册', group: '📚 规则书与通用排版', desc: '官方规则书经典配色：温润黄铜配深红，还原古朴优雅暗金色泽。' },
              { id: 'candlekeep', name: '🕯️ 烛堡：静谧繁花', group: '🌍 奇幻地志与世界风貌', desc: '修筑之家护眼配色：静谧森林绿搭配粉黄与柔桃粉卡面，温馨舒雅。' },
              { id: 'swordcoast', name: '⚓ 剑湾：蓝墨古卷', group: '🌍 奇幻地志与世界风貌', desc: '复古航海图纸风格：褪角焦黄底页与斑驳蓝墨水，尽显探索气息。' },
              { id: 'waterdeep', name: '🏰 深水城：蔚蓝金冕', group: '🌍 奇幻地志与世界风貌', desc: '皇家海湾奢华蓝金：深邃蔚蓝碧波搭配闪耀王政饰金，尊贵高雅。' },
              { id: 'shadowfell', name: '💀 堕影冥界：暗影无声', group: '🌍 奇幻地志与世界风貌', desc: '冷色静谧迷雾天幕：晨雾中灰底盘，搭配精致碑刻炭黑字与冷灰蓝。' },
              { id: 'feywild', name: '🌸 妖精荒野：幻境花海', group: '🌍 奇幻地志与世界风貌', desc: '春日荒野樱草霓幻：落樱暖粉与薰衣草紫相印，富有妖精秘法感。' },
              { id: 'astral', name: '🌌 星界星海：太虚天盘', group: '🌍 奇幻地志与世界风貌', desc: '星海太虚神秘蓝紫：深邃太虚墨蓝与紫荧恒星折光，璀璨且深邃。' },
              { id: 'icewind', name: '❄️ 冰风谷的孤木林', group: '🌍 奇幻地志与世界风貌', desc: '苔绿与冷蓝：骨白、冰蓝与坚韧苔绿交织的中性荒野色。' },
              { id: 'sigil', name: '⚙️ 环印城：石头与奥秘', group: '🌍 奇幻地志与世界风貌', desc: '多元宇宙的中心门扉：中性石灰配以奥法蓝紫与优雅金色。' },
              { id: 'baldursgate', name: '🌇 博德之门：暮色降临', group: '🌍 奇幻地志与世界风貌', desc: '黄昏的城市阴影：暮色蓝夜空、建筑暗棕与昏黄街灯的暗色交响。' },
              { id: 'neverwinter', name: '🛡️ 无冬城：冰雪与坚石', group: '🌍 奇幻地志与世界风貌', desc: '北地之珠：清冷暗蓝夜色下，映照出冰雪亮色与坚固岩石的暗调。' },
              { id: 'mistyvale', name: '🌲 迷雾谷地：森冷木棕', group: '🌍 奇幻地志与世界风貌', desc: '隐秘溪谷：浓重的木质暗棕与冰冷幽绿，构筑迷雾森林暗调。' },
 
              { id: 'parchment', name: '📜 人类：兼爱羊皮纸', group: '👥 种族血统与先民记忆', desc: '经典复古羊皮古卷：暖铜与深褐相映，字迹清晰且高度护眼。' },
              { id: 'highforest', name: '🏹 精灵：高深绿野', group: '👥 种族血统与先民记忆', desc: '瑞文戴尔温情河谷：圣洁白理石、林间嫩绿搭配晨曦金，清雅柔和。' },
              { id: 'dwarf', name: '⛏️ 矮人：巨石熔炉', group: '👥 种族血统与先民记忆', desc: '重金属与玄武岩层：暗炭钢铁底色，搭配熊熊熔炉金与坚固赤铜。' },
              { id: 'avernus', name: '🔥 提夫林：九域惩击', group: '👥 种族血统与先民记忆', desc: '深渊魔法邪曜九域：极夜黑紫底，点缀瑰丽血红与魅紫色魔法星辉。' },
              { id: 'gnome', name: '⚙️ 侏儒：日曜旅程', group: '👥 种族血统与先民记忆', desc: '机工古铜日曜旅行：古铜色与明朗日光金交织，灵动活泼。' },
              { id: 'dragonborn', name: '🪙 龙裔：火山岩浆', group: '👥 种族血统与先民记忆', desc: '火山岩层熔岩烈焰：焦红重土大底配合红龙吐息，威赫而浑厚。' },
              { id: 'underdark', name: '🔮 卓尔：荧光深邃', group: '👥 种族血统与先民记忆', desc: '幽暗绝地紫萤矿脉：极深曜石底屏，泛着高反差地牢夜行荧光。' },
              { id: 'golddragon', name: '🐉 金龙：崇高耀金', group: '👥 种族血统与先民记忆', desc: '正义与财富的耀光：纯正夺目的黄金色调，极致亮丽温暖。' },
              { id: 'halfling', name: '🥧 半身人：南瓜与清茶', group: '👥 种族血统与先民记忆', desc: '舒适惬意的农乡生活：田园茶绿搭配烘焙南瓜香橙，护眼舒适。' },
              { id: 'orc', name: '🪓 兽人：战狂绿血', group: '👥 种族血统与先民记忆', desc: '格乌什的怒火：灰绿坚忍的兽人肌体底色与狂暴鲜血红相撞。' },
              { id: 'underdark_shroom', name: '🍄 幽暗地域：迷幻巨蕈', group: '👥 种族血统与先民记忆', desc: '斑斓如荧光的蕈人林：中性紫灰底盘，搭配迷幻亮紫与宝石荧光。' },
 
              { id: 'fiveetools', name: '🔵 5etools 钴蓝排版', group: '🎁 跑团工具站联动彩蛋', desc: '跑团工具站怀旧排版：纯白底搭配标志性钴蓝标题，清爽洗练。' },
              { id: 'cocgreen', name: '🐙 Call of Cthulhu 邪神墨绿', group: '🎁 跑团工具站联动彩蛋', desc: '邪神复苏太古黑绿：深邃绿底和古卷纸金，缀以耀眼克眼荧光。' }
            ];

            const groups = themesList.reduce((acc, current) => {
              if (!acc[current.group]) {
                acc[current.group] = [];
              }
              acc[current.group].push(current);
              return acc;
            }, {} as Record<string, typeof themesList>);

            return Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName} className="space-y-2">
                <div className="text-xs font-bold font-sans text-stone-500 uppercase tracking-wider border-l-2 border-amber-500 pl-2 py-0.5 mt-4">
                  {groupName}
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {items.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentTheme(theme.id);
                        localStorage.setItem('dndTheme', theme.id);
                        document.documentElement.setAttribute('data-theme', theme.id);
                      }}
                      className={`w-full text-left p-3 rounded border transition-all cursor-pointer flex flex-col gap-1 ${
                        currentTheme === theme.id 
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm' 
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`font-semibold text-sm ${currentTheme === theme.id ? 'text-amber-800' : 'text-stone-800'}`}>
                          {theme.name}
                        </span>
                        {currentTheme === theme.id && <span className="text-amber-600">✓</span>}
                      </div>
                      <span className="text-[11px] text-stone-500">{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
