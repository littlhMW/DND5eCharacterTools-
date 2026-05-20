import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  type: 'race' | 'class' | 'background' | 'spell' | 'rule' | 'feat';
  name: string;
  subId?: string;
  source: string;
  label?: string;
}

export function DictyTwisterLink({ type, name, subId, source, label }: Props) {
  let url = '';
  const base = 'https://5e.dickytwister.org';
  const encodedName = encodeURIComponent(name);

  if (type === 'rule') {
    url = `${base}/${name}`;
  } else if (type === 'race') {
    url = `${base}/races.html#${name}_${source}`;
  } else if (type === 'class') {
    if (subId) {
      url = `${base}/classes.html#${name}_${source},state:sub-${subId}-${source}=b1`;
    } else {
      url = `${base}/classes.html#${name}_${source}`;
    }
  } else if (type === 'background') {
    url = `${base}/backgrounds.html#${name}_${source}`;
  } else if (type === 'spell') {
    url = `${base}/spells.html#${name}_${source}`;
  } else if (type === 'feat') {
    url = `${base}/feats.html#${name}_${source}`;
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-700 border border-stone-200 hover:border-amber-400 text-stone-500 transition-all ml-3 shadow-sm hover:shadow ${label ? 'px-2 py-1 text-xs' : 'p-1.5'}`}
      title="在 5etools 上查看"
    >
      <BookOpen size={16} />
      {label && <span className="ml-1 font-sans">{label}</span>}
    </a>
  );
}
