const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), '.next', 'server', 'app');
const scriptPath = path.join(process.cwd(), 'public', 'dashboard-console-capture.js');

function injectScript(htmlPath) {
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  if (html.includes('dashboard-console-capture.js')) {
    console.log(`Script already injected in ${htmlPath}`);
    return;
  }
  
  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  html = html.replace('</head>', `${scriptTag}</head>`);
  
  fs.writeFileSync(htmlPath, html);
  console.log(`Injected console capture script into ${htmlPath}`);
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.html')) {
      injectScript(filePath);
    }
  });
}

console.log('Injecting console capture script...');
walkDir(outputDir);
console.log('Done!');