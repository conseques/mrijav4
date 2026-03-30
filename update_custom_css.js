const fs = require('fs');
const path = require('path');

const dir = './src/components';

function getCssFiles(dirPath, filesArray) {
  const files = fs.readdirSync(dirPath);
  filesArray = filesArray || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      filesArray = getCssFiles(dirPath + "/" + file, filesArray);
    } else {
      if (file.endsWith('.module.css') && file !== 'Header.module.css' && file !== 'Hero.module.css') {
        filesArray.push(path.join(dirPath, "/", file));
      }
    }
  });

  return filesArray;
}

const cssFiles = getCssFiles(dir);

// We need to match colors regardless of case.
const COLOR_MAP = [
  // Dark text / headers -> Light text in dark mode
  { regex: /color:\s*#12305A\s*;/gi, replace: 'color: var(--text-color, #12305A);' },
  { regex: /color:\s*#202020\s*;/gi, replace: 'color: var(--text-color, #202020);' },
  { regex: /color:\s*#1A1A1A\s*;/gi, replace: 'color: var(--text-color, #1A1A1A);' },
  { regex: /color:\s*#0F172A\s*;/gi, replace: 'color: var(--text-color, #0F172A);' },
  
  // Custom Blues text -> Primary colors
  { regex: /color:\s*#1362C4\s*;/gi, replace: 'color: var(--primary-color, #1362C4);' },
  { regex: /color:\s*#0057B8\s*;/gi, replace: 'color: var(--primary-color, #0057B8);' },
  { regex: /color:\s*#2563EB\s*;/gi, replace: 'color: var(--primary-color, #2563EB);' },

  // Muted/grey text
  { regex: /color:\s*#636363\s*;/gi, replace: 'color: var(--text-muted, #636363);' },
  { regex: /color:\s*#64748B\s*;/gi, replace: 'color: var(--text-muted, #64748B);' },
  { regex: /color:\s*#475569\s*;/gi, replace: 'color: var(--text-muted, #475569);' },
  { regex: /color:\s*#7B7C7E\s*;/gi, replace: 'color: var(--text-muted, #7B7C7E);' },

  // Off-white card backgrounds
  { regex: /background-color:\s*#FBFCFD\s*;/gi, replace: 'background-color: var(--container-highest-bg, #FBFCFD);' },
  { regex: /background:\s*#FBFCFD\s*;/gi, replace: 'background: var(--container-highest-bg, #FBFCFD);' },
  { regex: /background-color:\s*#F1F5F9\s*;/gi, replace: 'background-color: var(--container-bg, #F1F5F9);' },
  { regex: /background:\s*#F1F5F9\s*;/gi, replace: 'background: var(--container-bg, #F1F5F9);' },

  // Very light blue general backgrounds
  { regex: /background-color:\s*#F6FaFf\s*;/gi, replace: 'background-color: var(--bg-color, #F6FaFf);' },
  { regex: /background-color:\s*#E9F3FF\s*;/gi, replace: 'background-color: var(--bg-color, #E9F3FF);' },
  { regex: /background-color:\s*#F4F8FD\s*;/gi, replace: 'background-color: var(--bg-color, #F4F8FD);' },
  { regex: /background:\s*#F6FaFf\s*;/gi, replace: 'background: var(--bg-color, #F6FaFf);' },
  
  // Custom borders
  { regex: /border:(.*?)(#B5D4FF)\s*;/gi, replace: 'border:$1var(--outline-variant, #B5D4FF);' },
  { regex: /border-bottom:(.*?)(#B5D4FF)\s*;/gi, replace: 'border-bottom:$1var(--outline-variant, #B5D4FF);' }
];

let totalModifications = 0;

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  COLOR_MAP.forEach(mapping => {
    content = content.replace(mapping.regex, mapping.replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalModifications++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nMigration Phase 2 complete. Updated ${totalModifications} files.`);
