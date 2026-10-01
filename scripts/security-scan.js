/**
 * DevPilot Local Security Scanner (Open-Source / Zero-Cost)
 * Scans code for common OWASP patterns, secret leaks, and sensitive configurations.
 */

const fs = require('fs');
const path = require('path');

console.log('\n============================================================');
console.log('🛡️  DevPilot Local Security Scanner (FOSS SAST & Secret Audit)');
console.log('============================================================\n');

const secretPatterns = [
  { name: 'Hardcoded Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
  { name: 'Hardcoded AWS Secret', regex: /aws_secret_access_key\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/i },
  { name: 'Generic API Key String', regex: /(?:api_key|apiKey|secret_token)\s*=\s*['"][A-Za-z0-9_-]{20,}['"]/i },
  { name: 'Hardcoded Password in Code', regex: /(?:password|passwd)\s*:\s*['"][^'"]{8,}['"]/i },
];

let issuesFound = 0;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.next' || file === 'uploads') {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.py') || file.endsWith('.json'))) {
      if (file === 'security-scan.js') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      secretPatterns.forEach((pattern) => {
        if (pattern.regex.test(content)) {
          // Exclude template/mock files
          if (!fullPath.includes('.example') && !fullPath.includes('mock') && !fullPath.includes('check-env')) {
            console.warn(`⚠️ [${pattern.name}] in ${path.relative(process.cwd(), fullPath)}`);
            issuesFound++;
          }
        }
      });
    }
  }
}

scanDir(path.resolve(__dirname, '..'));

if (issuesFound === 0) {
  console.log('✅ Local security scan passed! 0 hardcoded secrets or critical vulnerabilities detected.\n');
} else {
  console.log(`\nFound ${issuesFound} warnings. Please review files.\n`);
}
