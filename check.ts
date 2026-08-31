import { backgrounds } from './src/data/backgrounds.js';
const counts: Record<string, number> = {};
const dupes: string[] = [];
for (const bg of backgrounds) {
  if (counts[bg.id]) {
    counts[bg.id]++;
    if (!dupes.includes(bg.id)) dupes.push(bg.id);
  } else {
    counts[bg.id] = 1;
  }
}
console.log("Duplicates: ", dupes);
