export interface CustomRollTraitConfig {
  id: string; // 唯一的特质标识
  traitName: string; // 匹配原特质名
  tableName: string; // 滚表名称（以此为界分割文本）
  label: string; // 显示在选择框旁边的标题
  options: string[]; // 6 个 d6 备选项
}

export const CUSTOM_ROLL_TRAITS: Record<string, CustomRollTraitConfig> = {
  '星图': {
    id: 'class-trait-star-map',
    traitName: '星图',
    tableName: '星图形态',
    label: '已选星图形态',
    options: [
      '一幅布满星座图列的卷轴',
      '一块钻有细孔的石板',
      '一张斑点枭熊皮，标有凸痕记号',
      '一套黑檀木封皮地图集',
      '一块遇光会投射出星辰轨迹的水晶',
      '描绘星座排列的玻璃圆盘'
    ]
  },
  '命流之器': {
    id: 'class-trait-mercy-mask',
    traitName: '命流之器',
    tableName: '命流面具表',
    label: '已选面具外形',
    options: [
      '渡鸦',
      '黑白',
      '哭脸',
      '笑脸',
      '骷髅',
      '蝴蝶'
    ]
  },
  '妖冶嫺都': {
    id: 'class-trait-fey-gift',
    traitName: '妖冶嫺都',
    tableName: '精野之赐表',
    label: '已选精野之赐',
    options: [
      '在你进行长休或短休时，缥缈的蝴蝶在你周身振翅。',
      '每天黎明，新鲜的、当季的花朵将在你的头发中生长。',
      '你身上有淡淡的肉桂、薰衣草或肉豆蔻，或另一种令人舒适的药草或香料的香味。',
      '你的影子会在没人直视它时起舞。',
      '你的头发中长出纤细的触角或鹿角。',
      '每天黎明，你的肤色与发色都会变成适合当下季节的颜色。'
    ]
  },
  '时械法术': {
    id: 'class-trait-clockwork-manifestation',
    traitName: '时械法术',
    tableName: '秩序显迹表',
    label: '已选秩序显迹',
    options: [
      '幽灵般的虚幻齿轮在你身后旋转。',
      '时钟的指针出现在你的眼中。',
      '你的皮肤发出如黄铜般的金属光泽。',
      '你的体表浮动着方程式和几何图形。',
      '你的法器短暂地变化成小巧的机械装置。',
      '你和那些受到你法术影响的生物都会听到齿轮的滴答声或是钟表的响铃。'
    ]
  }
};

/**
 * 分割原始 Markdown 文本，提取出滚表，并将前后文分离。
 */
export function splitDescription(text: string, tableName: string) {
  const tableIndex = text.indexOf(tableName);
  if (tableIndex === -1) {
    return { prefix: text, table: '', suffix: '' };
  }

  const prefix = text.substring(0, tableIndex).trim();
  const afterTableText = text.substring(tableIndex);

  // 匹配连续的以 | 包裹的行组成的 Markdown 表格
  const tableRegex = /\|[^\n]+\|(\s*\r?\n\s*\|[^\n]+\|)+/;
  const match = tableRegex.exec(afterTableText);

  if (!match) {
    return { prefix, table: '', suffix: afterTableText.trim() };
  }

  const tableText = match[0];
  const tableStartInAfter = match.index;
  const tableEndInAfter = tableStartInAfter + tableText.length;

  const suffixText = afterTableText.substring(tableEndInAfter).trim();
  const tableSection = afterTableText.substring(0, tableEndInAfter);

  return {
    prefix,
    table: tableSection,
    suffix: suffixText
  };
}

/**
 * 在 review 或 character sheet 中使用的辅助函数
 * 自动检测描述文本中由于滚表产生的表格，替换为选定的样式文本。
 */
export function getCleanDescription(
  name: string,
  description: string,
  traitSelections: Record<string, string[]>
) {
  const config = CUSTOM_ROLL_TRAITS[name];
  if (!config) return description;

  const selectedValue = traitSelections[config.id]?.[0];
  const { prefix, suffix } = splitDescription(description, config.tableName);

  if (selectedValue) {
    // 带有优雅的高亮与换行，只显示前文+选出的样式
    const cleanValue = `\n\n**${config.label}：** ${selectedValue}\n\n`;
    return `${prefix}${cleanValue}${suffix}`.trim();
  } else {
    // 如果还没选，提示点击进行选择
    const promptValue = `\n\n**${config.label}：** *（尚未在职业特性步骤中选择，请在相应步骤生成此项目形态）*\n\n`;
    return `${prefix}${promptValue}${suffix}`.trim();
  }
}
