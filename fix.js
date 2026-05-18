const fs = require('fs');
let c = fs.readFileSync('src/data/classes.ts', 'utf8');
const regex = /战斗大师范型包含了一些在战斗以外的专业，像是武器锻造和书法等等。',[\s\S]*?traits:/;
c = c.replace(regex, "战斗大师范型包含了一些在战斗以外的专业，像是武器锻造和书法等等。',\n        traits:");
fs.writeFileSync('src/data/classes.ts', c);
