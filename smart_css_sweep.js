const fs = require('fs');
const path = require('path');
const tc = require('tinycolor2');

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
let totalModifications = 0;

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Pattern matching: " property: value;" avoiding nested blocks or empty spaces
  // It handles color, background, background-color, border, border-bottom etc.
  content = content.replace(/([a-z-]+)\s*:\s*([^;]+);/gi, (match, prop, value) => {
    
    // Ignore properties we shouldn't touch or if it already uses variables
    if (!['color', 'background-color', 'background', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right'].includes(prop.toLowerCase())) {
        return match;
    }
    if (value.includes('var(') || value.includes('transparent')) {
        return match;
    }

    // Specially handle linear-gradient to overwrite entirely if it contains light hexes
    if (prop === 'background' && value.includes('linear-gradient')) {
        if (value.includes('#ffffff') || value.includes('#f0f7ff') || value.includes('#fffdf0')) {
            // Override light gradients with pure container-bg in dark mode (fallback to gradient)
            return `${prop}: var(--container-bg, ${value.trim()});`;
        }
    }

    // Find generic hex or rgb/rgba codes inside the value String
    let newValue = value.replace(/(#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]+\))/gi, (colorStr) => {
        let color = tc(colorStr);
        if (!color.isValid()) return colorStr;
        
        let brightness = color.getBrightness();
        let hsl = color.toHsl();
        let isBlue = (hsl.h >= 200 && hsl.h <= 245 && hsl.s > 0.4);

        if (prop.toLowerCase() === 'color') {
            if (isBlue) {
                 return `var(--primary-color, ${colorStr})`;
            }
            if (brightness < 80) { // Very dark text
                 return `var(--text-color, ${colorStr})`;
            }
            if (brightness >= 80 && brightness < 150) { // Medium/muted grey
                 return `var(--text-muted, ${colorStr})`;
            }
        }
        
        if (prop.toLowerCase().includes('background')) {
            if (brightness >= 240) { // Very light backgrounds like #fff or #FBFCFD
                 return `var(--container-bg, ${colorStr})`;
            }
            if (brightness >= 220 && brightness < 240) { // Slightly darker light grays #F1F5F9
                 return `var(--container-highest-bg, ${colorStr})`;
            }
        }
        
        if (prop.toLowerCase().includes('border')) {
             if (brightness >= 200) { // Light borders like #B5D4FF
                 return `var(--outline-variant, ${colorStr})`;
            }
        }

        return colorStr; // Unchanged
    });

    return `${prop}: ${newValue};`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalModifications++;
    console.log(`Updated smart mapping: ${file}`);
  }
});

console.log(`\nSmart Migration complete. Updated ${totalModifications} files.`);
