const fs = require('fs');
const files = ['assets/css/consulting.css', 'assets/css/obuchenie.css', 'assets/css/support.css', 'assets/css/ecp.css'];
files.forEach(f => {
  let css = fs.readFileSync(f, 'utf8');
  css = css.replace(/(\.hero-slide__arrows \.arrow-btn \{[\s\S]*?)(background:)/, '$1width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0; $2');
  fs.writeFileSync(f, css, 'utf8');
});
console.log('Fixed button shapes');
