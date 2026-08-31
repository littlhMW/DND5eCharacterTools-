import fs from 'fs';
import path from 'path';

function replaceHardcodes() {
  const rootDir = process.cwd();
  
  // Find files that need replacing
  const searchString = "race?.id === 'human' && subrace?.id === 'human-variant'";
  const searchString2 = "selectedRace?.id === 'human' && selectedSubrace?.id === 'human-variant'";
  const searchString3 = "race.id === 'human' && state.character.subraceId === 'human-variant'";

  const replaceStr = "subrace?.replaceBaseAsi";
  const replaceStr2 = "selectedSubrace?.replaceBaseAsi";
  const replaceStr3 = "subrace?.replaceBaseAsi"; // We already have subrace in OriginStep

  const files = [
    'src/utils/proficiencies.ts',
    'src/components/steps/AbilitiesStep.tsx',
    'src/components/steps/OriginStep.tsx',
    'src/components/steps/ReviewStep.tsx',
    'src/components/CharacterSheet.tsx',
    'src/components/CharacterSummary.tsx'
  ];

  for (const file of files) {
    const fullPath = path.join(rootDir, file);
    if (!fs.existsSync(fullPath)) continue;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (file.includes('OriginStep.tsx')) {
        content = content.replace(/race\.id === 'human' && state\.character\.subraceId === 'human-variant'/g, 'subrace?.replaceBaseAsi');
    }
    content = content.replace(/race\?\.id === 'human' && subrace\?\.id === 'human-variant'/g, 'subrace?.replaceBaseAsi');
    content = content.replace(/selectedRace\?\.id === 'human' && selectedSubrace\?\.id === 'human-variant'/g, 'selectedSubrace?.replaceBaseAsi');
    
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}
replaceHardcodes();
