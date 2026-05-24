import React, { useRef, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { races, getRaceByIdAndSource } from '../../data/races';
import { classes } from '../../data/classes';
import { backgrounds } from '../../data/backgrounds';
import { spells } from '../../data/spells';
import { ImageUploadWithCrop } from '../shared/ImageUploadWithCrop';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { Ability } from '../../types/dnd';
import { getProficiencies, getProficiencyBonus, SKILL_NAMES, SKILL_ABILITIES } from '../../utils/proficiencies';

export function ReviewStep() {
  const { state } = useCharacter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [fullBodyUrl, setFullBodyUrl] = useState<string | null>(null);

  const character = state.character;
  const race = getRaceByIdAndSource(character.raceId, character.raceSource);
  const subrace = race?.subraces?.find(sr => sr.id === character.subraceId);
  const dndClass = classes.find(c => c.id === character.classId);
  const subclass = dndClass?.subclasses?.find(sc => sc.id === character.subclassId);
  const bg = backgrounds.find(b => b.id === character.backgroundId);

  const { saves, skills, expertise } = getProficiencies(character, dndClass, race, subrace, bg);
  const profBonus = getProficiencyBonus(character.level);

  const exportAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${character.name || '无名英雄'}_角色卡.png`;
      link.click();
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const getSpellName = (id: string) => spells.find(s => s.id === id)?.name || id;

  const allAbilities = {
    STR: '力量', DEX: '敏捷', CON: '体质',
    INT: '智力', WIS: '感知', CHA: '魅力'
  };

  const getAbilityTotal = (ab: typeof allAbilities[keyof typeof allAbilities] | string) => {
    const base = character.baseAbilities[ab as keyof typeof allAbilities] || 10;
    const raceBonus = (race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0);
    const subraceBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
    return base + raceBonus + subraceBonus;
  };

  const conMod = Math.floor((getAbilityTotal('CON') - 10) / 2);
  const dexMod = Math.floor((getAbilityTotal('DEX') - 10) / 2);

  const hpPerLevelBonus = character.subraceId === 'hill-dwarf' ? 1 : 0;
  const hitDie = dndClass?.hitDie || 8;
  const averageHitDie = Math.ceil(hitDie / 2 + 0.5);
  const maxHp = dndClass ? (hitDie + conMod + hpPerLevelBonus) + (character.level - 1) * (averageHitDie + conMod + hpPerLevelBonus) : 0;
  
  let baseAc = 10 + dexMod;
  if (dndClass?.id === 'barbarian') {
    baseAc = 10 + dexMod + conMod;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 flex flex-col items-center">
      <div className="flex w-full justify-between items-end border-b border-stone-200 pb-3">
         <h2 className="text-3xl font-serif text-amber-600">最终检视与导出</h2>
         <button onClick={exportAsImage} className="flex gap-2 items-center px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition">
           <Download className="w-5 h-5" /> 导出角色卡图
         </button>
      </div>

      <div 
        ref={cardRef}
        className="w-full max-w-3xl bg-[#fdfaf6] border-2 border-stone-800 p-8 shadow-md text-stone-900 relative outline outline-offset-4 outline-2 outline-stone-300"
      >
         {/* Top Section */}
         <div className="flex gap-6 border-b-2 border-stone-800 pb-6 mb-6">
           {/* Avatar Area */}
           <div className="w-32 h-32 border-2 border-dashed border-stone-400 bg-white flex items-center justify-center relative overflow-hidden shrink-0 group">
             {portraitUrl ? (
               <>
                 <img src={portraitUrl} alt="Portrait" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <ImageUploadWithCrop onCropComplete={setPortraitUrl} label="更换头像" aspect={1} />
                 </div>
               </>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                  <ImageUploadWithCrop onCropComplete={setPortraitUrl} label="上传头像" aspect={1} />
               </div>
             )}
           </div>

           {/* Basic Info */}
           <div className="flex-1">
              <h1 className="text-4xl font-serif uppercase tracking-wider border-b border-stone-300 pb-2 mb-2">
                {character.name || '未命名角色'}
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-sans uppercase tracking-widest">
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">职业与等级</span>
                  <span className="font-bold">{dndClass?.name || '未知'} {subclass ? `- ${subclass.name}` : ''} {character.level} 级</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">背景</span>
                  <span className="font-bold">{bg?.name || '未知'}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">种族</span>
                  <span className="font-bold">{race?.name || '未知'} {subrace ? `- ${subrace.name}` : ''}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">阵营</span>
                  <span className="font-bold">{character.alignment || '未知'}</span>
                </div>
              </div>
           </div>
         </div>

         {/* Middle Section: 3-Column Layout */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           {/* Left Column: Proficiency & Abilities & Skills */}
           <div className="col-span-1 flex flex-col gap-4">
             {/* Proficiency Bonus */}
             <div className="flex items-center gap-3 bg-white border-2 border-stone-800 rounded-lg p-2">
               <div className="w-10 h-10 border-2 border-stone-400 rounded-full flex items-center justify-center font-serif text-lg font-bold">
                 +{profBonus}
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-stone-600">熟练加值</span>
             </div>

             {/* Saving Throws & Skills per Ability */}
             <div className="space-y-3">
               {Object.entries(allAbilities).map(([key, name]) => {
                 const score = getAbilityTotal(key);
                 const mod = Math.floor((score - 10) / 2);
                 const ab = key as Ability;
                 const isSaveProficient = saves.includes(ab);
                 const abilitySkills = Object.entries(SKILL_ABILITIES).filter(([, a]) => a === ab).map(([s]) => s);
                 
                 return (
                   <div key={key} className="flex gap-2 isolate">
                     {/* Ability Score Block (like official sheet, rounded rectangle) */}
                     <div className="w-16 flex-shrink-0 flex flex-col items-center border-2 border-stone-800 rounded-xl bg-white p-1 relative z-10">
                       <span className="text-[9px] font-bold text-stone-500 uppercase tracking-tighter mb-0.5">{name}</span>
                       <span className="text-2xl font-serif leading-none">{score}</span>
                       <div className="absolute -bottom-3 bg-white border-2 border-stone-800 rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                         {mod >= 0 ? `+${mod}` : mod}
                       </div>
                     </div>
                     
                     {/* Saves and Skills Block */}
                     <div className="flex-1 border-2 border-stone-800 rounded-lg bg-white p-2 text-[10px] font-sans flex flex-col justify-center gap-1 -ml-3 pl-4 z-0">
                       <div className={`flex items-center gap-1 ${isSaveProficient ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                         <span className="w-3 text-center text-[8px]">{isSaveProficient ? '●' : '○'}</span>
                         <span className="w-6 text-center">{mod + (isSaveProficient ? profBonus : 0) >= 0 ? '+' : ''}{mod + (isSaveProficient ? profBonus : 0)}</span>
                         <span className="flex-1">豁免</span>
                       </div>
                       {abilitySkills.map(skill => {
                         const isExpert = expertise.includes(skill);
                         const isProf = skills.includes(skill);
                         const bonus = mod + (isExpert ? profBonus * 2 : (isProf ? profBonus : 0));
                         const mark = isExpert ? '✸' : (isProf ? '●' : '○');
                         return (
                           <div key={skill} className={`flex items-center gap-1 ${isExpert || isProf ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                             <span className="w-3 text-center text-[8px]">{mark}</span>
                             <span className="w-6 text-center">{bonus >= 0 ? '+' : ''}{bonus}</span>
                             <span className="flex-1">{SKILL_NAMES[skill]}</span>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
             </div>
             
             {/* Passive Perception */}
             <div className="mt-2 flex items-center gap-3 bg-white border-2 border-stone-800 rounded-lg p-2">
               <div className="w-10 h-8 border-2 border-stone-400 rounded flex items-center justify-center font-serif text-lg font-bold">
                 {10 + Math.floor((getAbilityTotal('WIS') - 10) / 2) + (skills.includes('perception') ? profBonus : 0) + (expertise.includes('perception') ? profBonus : 0)}
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-stone-600">被动察觉</span>
             </div>
           </div>

           {/* Middle Column: Combat & HP */}
           <div className="col-span-1 flex flex-col gap-4">
             {/* AC, Init, Speed Box */}
             <div className="bg-white border-2 border-stone-800 p-2 rounded-xl flex gap-2">
               <div className="flex-1 flex flex-col items-center justify-center border-2 border-stone-300 rounded-lg p-2 relative outline outline-2 outline-stone-800/20 bg-[#fdfaf6]">
                 <span className="text-[10px] text-stone-500 absolute top-1 uppercase font-bold text-center leading-none">护甲等级</span>
                 <span className="text-3xl font-serif mt-3">{baseAc}</span>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center border-2 border-stone-300 rounded-lg p-2 bg-[#fdfaf6]">
                 <span className="text-[10px] text-stone-500 font-bold mb-1">先攻</span>
                 <span className="text-3xl font-serif">{dexMod >= 0 ? `+${dexMod}` : dexMod}</span>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center border-2 border-stone-300 rounded-lg p-2 bg-[#fdfaf6]">
                 <span className="text-[10px] text-stone-500 font-bold mb-1">速度</span>
                 <span className="text-3xl font-serif">30</span>
               </div>
             </div>

             {/* HP Block */}
             <div className="bg-white border-2 border-stone-800 p-3 rounded-xl flex flex-col">
               <div className="flex gap-2 text-xs text-stone-500 font-bold mb-2">
                 <span>生命值上限</span>
                 <span className="text-stone-700">{maxHp}</span>
               </div>
               <div className="flex-1 min-h-[4rem] text-center flex items-center justify-center text-stone-300 italic">
                 当前生命值
               </div>
             </div>
             
             <div className="bg-white border-2 border-stone-800 p-3 rounded-xl flex flex-col">
               <div className="text-xs text-stone-500 font-bold mb-2 uppercase">临时生命值</div>
               <div className="flex-1 min-h-[3rem]"></div>
             </div>

             {/* Hit Dice & Death Saves */}
             <div className="flex gap-4 h-24">
               <div className="flex-1 bg-white border-2 border-stone-800 p-2 rounded-xl flex flex-col relative">
                  <div className="text-[10px] text-stone-500 font-bold uppercase mb-1">总计: {character.level}d{hitDie}</div>
                  <div className="flex-1 flex items-center justify-center text-xl font-serif">
                    d{hitDie}
                  </div>
                  <div className="absolute bottom-1 w-full text-center text-[10px] text-stone-500 font-bold uppercase">生命骰</div>
               </div>
               <div className="flex-[1.5] bg-white border-2 border-stone-800 p-2 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="uppercase text-stone-500">豁免成功</span>
                    <div className="flex gap-1"><span className="w-3 h-3 rounded-full border border-stone-400"></span><span className="w-3 h-3 rounded-full border border-stone-400"></span><span className="w-3 h-3 rounded-full border border-stone-400"></span></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="uppercase text-stone-500">豁免失败</span>
                    <div className="flex gap-1"><span className="w-3 h-3 rounded-full border border-stone-400"></span><span className="w-3 h-3 rounded-full border border-stone-400"></span><span className="w-3 h-3 rounded-full border border-stone-400"></span></div>
                  </div>
                  <div className="text-center text-[10px] text-stone-500 font-bold uppercase mt-1">死亡豁免</div>
               </div>
             </div>
             
             {/* Attacks & Spellcasting Box */}
             <div className="flex-1 bg-white border-2 border-stone-800 p-3 rounded-xl min-h-[12rem] flex flex-col relative">
                <div className="grid grid-cols-3 gap-2 border-b border-stone-300 pb-1 mb-2 text-[10px] font-bold text-stone-500">
                  <div className="col-span-1">名称</div>
                  <div className="col-span-1 text-center">加值</div>
                  <div className="col-span-1 text-center">伤害/类型</div>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs h-6 bg-stone-50 rounded"></div>
                  <div className="grid grid-cols-3 gap-2 text-xs h-6 bg-stone-50 rounded"></div>
                  <div className="grid grid-cols-3 gap-2 text-xs h-6 bg-stone-50 rounded"></div>
                </div>
                <div className="mt-auto pt-4 text-center text-xs font-bold text-stone-400 uppercase tracking-widest">
                  攻击与施法
                </div>
             </div>
           </div>

           {/* Right Column: Traits, Full Body, Features */}
           <div className="col-span-1 flex flex-col gap-4">
              
              {/* Personality Characteristics */}
              <div className="bg-white border-2 border-stone-800 p-4 rounded-xl flex flex-col gap-3">
                 <div>
                   <p className="text-xs font-serif italic text-stone-700 leading-tight min-h-[2.5rem] bg-stone-50 p-1.5 rounded">{character.personality || ''}</p>
                   <span className="text-[10px] font-bold text-stone-400 block uppercase text-center mt-1">性格特质</span>
                 </div>
                 <div>
                   <p className="text-xs font-serif italic text-stone-700 leading-tight min-h-[2.5rem] bg-stone-50 p-1.5 rounded">{character.ideals || ''}</p>
                   <span className="text-[10px] font-bold text-stone-400 block uppercase text-center mt-1">理想</span>
                 </div>
                 <div>
                   <p className="text-xs font-serif italic text-stone-700 leading-tight min-h-[2.5rem] bg-stone-50 p-1.5 rounded">{character.bonds || ''}</p>
                   <span className="text-[10px] font-bold text-stone-400 block uppercase text-center mt-1">牵绊</span>
                 </div>
                 <div>
                   <p className="text-xs font-serif italic text-stone-700 leading-tight min-h-[2.5rem] bg-stone-50 p-1.5 rounded">{character.flaws || ''}</p>
                   <span className="text-[10px] font-bold text-stone-400 block uppercase text-center mt-1">缺点</span>
                 </div>
              </div>

              {/* Full Body Art Area */}
              <div className="w-full aspect-[3/4] border-2 border-stone-800 bg-white relative overflow-hidden group rounded-xl">
                 {fullBodyUrl ? (
                   <>
                     <img src={fullBodyUrl} alt="Full Body" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <ImageUploadWithCrop onCropComplete={setFullBodyUrl} label="更换全身立绘" aspect={3/4} />
                     </div>
                   </>
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center border-dashed border-2 m-2 border-stone-300 bg-stone-50 rounded-lg p-4 text-center">
                     <ImageUploadWithCrop onCropComplete={setFullBodyUrl} label="上传角色全图" aspect={3/4} />
                   </div>
                 )}
              </div>

              {/* Spells quick view */}
              {(character.knownSpells.length > 0 || character.preparedSpells.length > 0) && (
                <div className="bg-white border-2 border-stone-800 p-3 rounded-xl">
                   <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-sans text-[10px]">
                     {Array.from(new Set([...character.knownSpells, ...character.preparedSpells])).map((id) => (
                       <div key={id} className="flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                         <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0"></span>
                         <span className="text-stone-700 truncate">{getSpellName(id)}</span>
                       </div>
                     ))}
                   </div>
                   <div className="mt-2 pt-1 border-t border-stone-200 text-center text-xs font-bold text-stone-400 uppercase tracking-widest">
                      法术
                   </div>
                </div>
              )}
           </div>
         </div>
      </div>
    </div>
  );
}
