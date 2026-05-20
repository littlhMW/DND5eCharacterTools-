const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (filePath.endsWith('ReviewStep.tsx')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content
    .replace(/rounded-3xl/g, 'rounded-lg')
    .replace(/rounded-2xl/g, 'rounded-md')
    // be careful with rounded-full, we might want to keep some circles like status dots! 
    // Let's only replace rounded-3xl and 2xl for now. The user said "圆角的程度不要那么大 (degree less)".
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src', 'components'));
