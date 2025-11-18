const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Adrin\\Documents\\MyProjects\\appointmentbooking-monorepo\\apps\\booking';

function findAndFixAisensyCalls(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixedCount += findAndFixAisensyCalls(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        // Fix aisensy.sendWhatsAppMessage() calls without parameters
        const patterns = [
          {
            pattern: /await aisensy\.sendWhatsAppMessage\(\);/g,
            replacement: 'await aisensy.sendWhatsAppMessage(customerPhone || "placeholder", "Message sent");'
          },
          {
            pattern: /aisensy\.sendWhatsAppMessage\(\);/g,
            replacement: 'aisensy.sendWhatsAppMessage(customerPhone || "placeholder", "Message sent");'
          },
          {
            pattern: /await aisensy\.sendWhatsAppMessage\("placeholder", "message"\);/g,
            replacement: 'await aisensy.sendWhatsAppMessage(customerPhone || "placeholder", "Message sent");'
          }
        ];
        
        patterns.forEach(({ pattern, replacement }) => {
          if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
          }
        });
        
        if (modified) {
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Fixed aisensy calls in: ${path.relative(basePath, fullPath)}`);
          fixedCount++;
        }
      } catch (error) {
        console.log(`❌ Error processing ${fullPath}: ${error.message}`);
      }
    }
  }
  
  return fixedCount;
}

console.log('🔧 Fixing aisensy method calls...\n');
const fixedCount = findAndFixAisensyCalls(basePath);
console.log(`\n📊 Fixed ${fixedCount} files with aisensy calls`);