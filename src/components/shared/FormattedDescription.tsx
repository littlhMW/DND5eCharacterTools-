import React from 'react';

interface Props {
  text: string;
  className?: string;
}

export function FormattedDescription({ text, className = "text-stone-600 text-xs leading-relaxed font-sans" }: Props) {
  let htmlText = text;

  // 突出显示先决条件，强制独占一行
  htmlText = htmlText.replace(/(先决条件：.*?。)/g, '<span class="font-semibold text-amber-700 block mb-1.5">$1</span>');
  
  // 处理特性经常因为缺乏换行而拥挤的情况
  // 如果文本较长且没有任何换行，我们尝试按标点给部分句子换行
  if (!htmlText.includes('\n') && htmlText.length > 40) {
    // 替换句号后面的空格为换行，或者直接在句号后加换行
    htmlText = htmlText.replace(/。/g, '。<br/>');
    htmlText = htmlText.replace(/；/g, '；<br/>');
  }

  // 特殊替换：如果原本就有 \n，把它变成 <br/>
  htmlText = htmlText.replace(/\n\n/g, '<br/><br/>');
  htmlText = htmlText.replace(/\n/g, '<br/>');

  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: htmlText }} 
    />
  );
}
