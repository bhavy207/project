/**
 * DevPilot Universal One-Command Launcher
 * Automatically provisions environment and launches the full stack.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n============================================================');
console.log('🚀 DevPilot: Universal One-Command Launcher ($0 Budget)');
console.log('============================================================\n');

// 1. Ensure .env exists
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('⚙️  Creating .env from .env.example...');
  fs.copyFileSync(path.resolve(__dirname, '../.env.example'), envPath);
}

// 2. Run zero-cost compliance check
require('./check-env.js');

// 3. Check for Docker
let hasDocker = false;
try {
  execSync('docker --version', { stdio: 'ignore' });
  hasDocker = true;
} catch {
  hasDocker = false;
}

if (hasDocker) {
  console.log('🐳 Docker detected! Launching all services with Docker Compose...\n');
  console.log('Starting: PostgreSQL (pgvector), Redis, Mailpit, MinIO, Prometheus, Grafana, API, AI-Service, Web UI...\n');
  
  const dockerProc = spawn('docker', ['compose', 'up', '--build'], {
    stdio: 'inherit',
    shell: true,
  });

  dockerProc.on('error', (err) => {
    console.error('Docker compose launch failed:', err.message);
  });
} else {
  console.log('ℹ️  Docker is not running or not installed on this host.');
  console.log('⚡ Launching DevPilot in Local Mode with Process Isolation...\n');

  console.log('------------------------------------------------------------');
  console.log('🌐 Services Ready:');
  console.log('   - Web Dashboard:     http://localhost:3000');
  console.log('   - NestJS API:        http://localhost:4000');
  console.log('   - FastAPI AI Engine: http://localhost:8000');
  console.log('   - Mailpit UI:        http://localhost:8025 (in Docker mode)');
  console.log('   - Grafana Metrics:   http://localhost:3001 (in Docker mode)');
  console.log('------------------------------------------------------------\n');

  // Run the end-to-end verification and demonstration workflow
  require('./run-demo.js');
}
