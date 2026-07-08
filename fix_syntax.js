const fs = require('fs');
const files = [
  'assets/js/admin-news.js',
  'assets/js/admin-landing.js',
  'assets/js/admin-ui.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Fix ?. ()
    code = code.replace(/window\.saveNewsPageStateToMemory\?\.\(\);/g, 'if (window.saveNewsPageStateToMemory) window.saveNewsPageStateToMemory();');
    code = code.replace(/window\.saveMainPageStateToMemory\?\.\(\);/g, 'if (window.saveMainPageStateToMemory) window.saveMainPageStateToMemory();');
    code = code.replace(/window\.saveEcpPageStateToMemory\?\.\(\);/g, 'if (window.saveEcpPageStateToMemory) window.saveEcpPageStateToMemory();');
    code = code.replace(/window\.saveConsultingPageStateToMemory\?\.\(\);/g, 'if (window.saveConsultingPageStateToMemory) window.saveConsultingPageStateToMemory();');
    
    // Fix moveItemUp array destructuring
    code = code.replace(/\[list\[i - 1\], list\[i\]\] = \[list\[i\], list\[i - 1\]\];/g, 'var temp = list[i - 1]; list[i - 1] = list[i]; list[i] = temp;');
    
    // Fix moveItemDown array destructuring
    code = code.replace(/\[list\[i \+ 1\], list\[i\]\] = \[list\[i\], list\[i \+ 1\]\];/g, 'var temp = list[i + 1]; list[i + 1] = list[i]; list[i] = temp;');

    fs.writeFileSync(file, code);
  }
});
console.log('Fixed optional chaining and destructuring.');
