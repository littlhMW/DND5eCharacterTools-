import React from 'react';

const directItems = ['组件包', '材料包', '法器', '奥术法器', '圣徽', '德鲁伊法器', '巨斧', '长剑', '短剑', '刺剑', '匕首', '手弩', '短弓', '长弓', '轻弩', '战斧', '手斧', '轻锤', '战锤', '硬头锤', '标枪', '投石索', '飞镖', '皮甲', '镶嵌皮甲', '链甲衫', '鳞甲', '胸甲', '半身甲', '环甲', '链甲', '板条甲', '板甲', '布甲', '法杖', '长棍', '鲁特琴'];
const kits = ['探索者套装', '学者套装', '祭司套装', '地城探险家套装', '表演家套装', '外交家套装', '盗贼工具'];
const categories = ['简易武器', '军用武器', '简易近战武器', '军用近战武器', '轻甲', '中甲', '重甲', '盾牌', '任意一把简易武器', '任意一把军用近战武器', '任何一把简易武器', '任何一把其他乐器'];

interface Props {
  text: string;
}

export function EquipmentText({ text }: Props) {
  const allKeywords = [...directItems, ...kits, ...categories].sort((a, b) => b.length - a.length);
  // Join by | after escaping any special regex chars if necessary (they are Chinese characters so it's fine)
  const regex = new RegExp(`(${allKeywords.join('|')})`, 'g');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (directItems.includes(part) || kits.includes(part)) {
          return <a key={i} href={`https://5e.dickytwister.org/items.html#${part}_phb`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-700 underline underline-offset-2 decoration-amber-300 decoration-dotted font-medium">{part}</a>;
        } else if (categories.includes(part)) {
          return <a key={i} href={`https://5e.dickytwister.org/items.html`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-700 underline underline-offset-2 decoration-amber-300 decoration-dotted font-medium">{part}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
