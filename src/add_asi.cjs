const fs = require('fs');

const raw = fs.readFileSync('src/data/classes.ts', 'utf8');

// extracting JSON part
const prefixRegex = /^.*?export const classes(?:[^=]*)=\s*/s;
const match = raw.match(prefixRegex);
if (!match) {
  console.error("Could not find classes export");
  process.exit(1);
}
const prefix = match[0];
const jsonStr = raw.substring(prefix.length).replace(/;\s*$/, '');

let classesData = JSON.parse(jsonStr);

classesData.forEach(cls => {
  cls.traits.forEach(t => {
    if (t.name === '属性值提升') {
      t.choices = [
        {
          id: `${cls.id}-asi-${t.level}`,
          name: `选择提升属性或专长`,
          chooseNumber: 1, 
          dynamic: 'asi'
        }
      ];
    }
  });
});

const output = raw.substring(0, prefix.length) + JSON.stringify(classesData, null, 2) + ';\n';
fs.writeFileSync('src/data/classes.ts', output);
