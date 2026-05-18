import React, { useRef, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { races } from '../../data/races';
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
  const race = races.find(r => r.id === character.raceId);
  const subrace = race?.subraces?.find(sr => sr.id === character.subraceId);
  const dndClass = classes.find(c => c.id === character.classId);
  const subclass = dndClass?.subclasses.find(sc => sc.id === character.subclassId);
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
    const raceBonus = race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
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
                  <span className="text-stone-500 text-xs block mb-0.5">职业与等级 CLASS & LEVEL</span>
                  <span className="font-bold">{dndClass?.name || '未知'} {subclass ? `- ${subclass.name}` : ''} {character.level} 级</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">背景 BACKGROUND</span>
                  <span className="font-bold">{bg?.name || '未知'}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">种族 RACE</span>
                  <span className="font-bold">{race?.name || '未知'} {subrace ? `- ${subrace.name}` : ''}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block mb-0.5">阵营 ALIGNMENT</span>
                  <span className="font-bold">{character.alignment || '未知'}</span>
                </div>
              </div>
           </div>
         </div>

         {/* Middle Section: Abilities, Characteristics, Spells */}
         <div className="grid grid-cols-3 gap-8">
           {/* Left Col: Abilities & Basic Stats */}
           <div className="col-span-1 space-y-6">
              <div className="flex gap-4">
                <div className="border-2 border-stone-800 rounded-lg p-2 bg-white flex-1 text-center font-bold">
                  <div className="text-[10px] text-stone-500 uppercase">HP</div>
                  <div className="text-xl font-serif text-amber-700">{dndClass ? maxHp : '--'}</div>
                </div>
                <div className="border-2 border-stone-800 rounded-lg p-2 bg-white flex-1 text-center font-bold">
                  <div className="text-[10px] text-stone-500 uppercase">AC</div>
                  <div className="text-xl font-serif text-stone-700">{baseAc}</div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(allAbilities).map(([key, name]) => {
                  const score = getAbilityTotal(key);
                  const mod = Math.floor((score - 10) / 2);
                  const ab = key as Ability;
                  const isSaveProficient = saves.includes(ab);
                  const abilitySkills = Object.entries(SKILL_ABILITIES).filter(([, a]) => a === ab).map(([s]) => s);
                  return (
                    <div key={key} className="flex flex-col border-2 border-stone-800 rounded-lg p-2 bg-white relative pb-3">
                      <div className="flex flex-col items-center mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">{name} {key}</span>
                        <span className="text-3xl font-serif">{score}</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-stone-100 border-2 border-stone-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">
                        {mod >= 0 ? `+${mod}` : mod}
                      </div>
                      <div className="text-[10px] font-sans border-t-2 border-stone-100/50 pt-2 flex flex-col gap-1 w-full px-1 z-10 relative bg-white">
                        <div className={`flex items-center gap-1 ${isSaveProficient ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>
                          <span className="w-3 text-center">{isSaveProficient ? '•' : '○'}</span>
                          <span className="flex-1">豁免</span>
                          <span>{(mod + (isSaveProficient ? profBonus : 0)) >= 0 ? '+' : ''}{mod + (isSaveProficient ? profBonus : 0)}</span>
                        </div>
                        {abilitySkills.map(skill => {
                          const isExpert = expertise.includes(skill);
                          const isProf = skills.includes(skill);
                          const bonus = mod + (isExpert ? profBonus * 2 : (isProf ? profBonus : 0));
                          const mark = isExpert ? '☆' : (isProf ? '•' : '○');
                          return (
                            <div key={skill} className={`flex items-center gap-1 ${isExpert ? 'text-amber-700 font-bold' : isProf ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                              <span className="w-3 text-center">{mark}</span>
                              <span className="flex-1">{SKILL_NAMES[skill]}</span>
                              <span>{bonus >= 0 ? '+' : ''}{bonus}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Body Art Area */}
              <div className="w-full h-80 border-2 border-stone-800 bg-white relative overflow-hidden group rounded-xl">
                 {fullBodyUrl ? (
                   <>
                     <img src={fullBodyUrl} alt="Full Body" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <ImageUploadWithCrop onCropComplete={setFullBodyUrl} label="更换全身立绘" aspect={3/4} />
                     </div>
                   </>
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center border-dashed border-2 m-2 border-stone-400 bg-stone-50 rounded-lg">
                     <ImageUploadWithCrop onCropComplete={setFullBodyUrl} label="点击此处上传全身立绘 (可选)" aspect={3/4} />
                   </div>
                 )}
              </div>
           </div>

           {/* Right 2 Cols: Details & Spells */}
           <div className="col-span-2 space-y-6">
              <div className="border-2 border-stone-800 rounded-xl p-4 bg-white space-y-4">
                 <h4 className="font-serif font-bold text-stone-800 border-b border-stone-200 pb-1 mb-2 uppercase tracking-wider">角色特征 CHARACTERISTICS</h4>
                 <div className="space-y-3">
                   <div>
                     <span className="text-[10px] font-bold text-stone-400 block uppercase">性格特质 Personality</span>
                     <p className="text-sm font-serif italic text-stone-700">{character.personality || '————'}</p>
                   </div>
                   <div>
                     <span className="text-[10px] font-bold text-stone-400 block uppercase">理想 Ideals</span>
                     <p className="text-sm font-serif italic text-stone-700">{character.ideals || '————'}</p>
                   </div>
                   <div>
                     <span className="text-[10px] font-bold text-stone-400 block uppercase">牵绊 Bonds</span>
                     <p className="text-sm font-serif italic text-stone-700">{character.bonds || '————'}</p>
                   </div>
                   <div>
                     <span className="text-[10px] font-bold text-stone-400 block uppercase">缺点 Flaws</span>
                     <p className="text-sm font-serif italic text-stone-700">{character.flaws || '————'}</p>
                   </div>
                 </div>
              </div>

              {(character.knownSpells.length > 0 || character.preparedSpells.length > 0) && (
                <div className="border-2 border-stone-800 rounded-xl p-4 bg-white text-sm">
                   <h4 className="font-serif font-bold text-stone-800 border-b border-stone-200 pb-1 mb-2 uppercase tracking-wider">法术 SPELLS</h4>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-sans text-xs">
                     {Array.from(new Set([...character.knownSpells, ...character.preparedSpells])).map((id) => (
                       <div key={id} className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></span>
                         <span className="text-stone-700 truncate">{getSpellName(id)}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
           </div>
         </div>
      </div>
    </div>
  );
}
