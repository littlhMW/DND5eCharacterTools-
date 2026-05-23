import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  text: string;
  className?: string;
  truncateFirstParagraph?: boolean;
}

export function FormattedDescription({ text, className = "text-stone-600 text-xs leading-relaxed font-sans", truncateFirstParagraph = false }: Props) {
  let content = text;
  
  if (truncateFirstParagraph) {
    // Only take the first paragraph, stop before any markdown tables or new lines
    content = content.split(/\n\n|\|/)[0].trim();
  } else {
    // Some basic formatting cleanup for raw text missing line breaks, 
    // but mostly rely on standard markdown rendering.
    // If it's a huge block of text without newlines, add br after periods for readability
    if (!content.includes('\n') && content.length > 80 && !content.includes('|')) {
        content = content.replace(/。/g, '。\n\n');
        content = content.replace(/；/g, '；\n\n');
    }
  }

  return (
    <div className={className}>
      <Markdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({node, ...props}) => <a className="text-amber-600 hover:text-amber-700 underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-2 border rounded-md border-stone-200"><table className="w-full text-left border-collapse text-xs md:text-sm" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold" {...props} />,
          th: ({node, ...props}) => <th className="p-2 border-r border-stone-200 last:border-0" {...props} />,
          td: ({node, ...props}) => <td className="p-2 border-r border-stone-200 last:border-0 border-t border-stone-200" {...props} />,
          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
          li: ({node, ...props}) => <li {...props} />
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

