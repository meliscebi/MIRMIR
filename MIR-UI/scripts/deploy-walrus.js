#!/usr/bin/env node

/**
 * Walrus Sites Deployment Script
 * Automates the deployment of the Web3 Linktree to Walrus Sites
 * 
 * Usage: npm run deploy:walrus
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  log(`\n📦 ${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error: ${description} failed`, 'red');
    return false;
  }
}

async function deployWithRetry(command, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log(`\n📤 Deployment attempt ${attempt}/${maxRetries}...`, 'cyan');
      const output = execSync(command, { encoding: 'utf-8', timeout: 300000 }); // 5 minute timeout
      return output;
    } catch (error) {
      const errorMessage = error.message || '';
      
      if (attempt < maxRetries && (errorMessage.includes('504') || errorMessage.includes('timeout') || errorMessage.includes('ECONNRESET'))) {
        const waitTime = Math.pow(2, attempt - 1) * 5; // Exponential backoff: 5s, 10s, 20s
        log(`⏳ Attempt ${attempt} failed with temporary error. Waiting ${waitTime}s before retry...`, 'yellow');
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      } else {
        throw error;
      }
    }
  }
}

async function deployToWalrus() {
  log('\n🚀 Starting Walrus Sites Deployment\n', 'cyan');

  // Step 1: Check if Walrus CLI is installed
  log('Step 1: Checking Walrus CLI installation', 'yellow');
  try {
    execSync('walrus --version', { stdio: 'pipe' });
    log('✅ Walrus CLI is installed', 'green');
  } catch (error) {
    log('❌ Walrus CLI not found. Please install it first:', 'red');
    log('curl -fsSL https://install.walrus.site | sh', 'cyan');
    process.exit(1);
  }

  // Step 2: Build the application
  if (!executeCommand('npm run build', 'Building application')) {
    process.exit(1);
  }

  // Step 3: Check if dist directory exists
  const distPath = join(process.cwd(), 'dist');
  if (!existsSync(distPath)) {
    log('❌ Build directory (dist/) not found', 'red');
    process.exit(1);
  }

  // Step 4: Deploy to Walrus Sites with retry logic
  log('\nStep 4: Deploying to Walrus Sites', 'yellow');
  const deployCommand = 'site-builder --config ../walrus-site.yaml deploy ./dist --epochs 1';
  
  try {
    const output = await deployWithRetry(deployCommand, 3);
    log('✅ Deployment successful!', 'green');
    
    // Parse the output to extract the site URL or blob ID
    const urlMatch = output.match(/https?:\/\/[^\s]+/) || output.match(/[0-9a-f]{32,}/);
    if (urlMatch) {
      const siteUrl = urlMatch[0];
      log(`\n🌐 Your site is deployed: ${siteUrl}`, 'green');
      
      // Save the URL to a file for reference
      writeFileSync('DEPLOYED_URL.txt', siteUrl);
      log('📝 URL saved to DEPLOYED_URL.txt', 'cyan');
    }
    
    log('\n✨ Deployment complete!', 'green');
  } catch (error) {
    log('❌ Deployment failed after retries', 'red');
    console.error(error.message);
    log('\n💡 Troubleshooting tips:', 'yellow');
    log('1. Check your internet connection', 'cyan');
    log('2. Verify Walrus network status', 'cyan');
    log('3. Try again in a few moments', 'cyan');
    log('4. Run: site-builder --config ../walrus-site.yaml deploy ./dist --epochs 1', 'cyan');
    process.exit(1);
  }

  // Step 5: Display next steps
  log('\n📋 Next Steps:', 'yellow');
  log('1. Test your deployed site using the URL above', 'cyan');
  log('2. Bind a SuiNS domain to your Linktree NFT for custom URLs', 'cyan');
  log('3. Share your Linktree with the world! 🎉', 'cyan');
}

// Run the deployment
deployToWalrus().catch((error) => {
  log(`\n❌ Deployment script error: ${error.message}`, 'red');
  process.exit(1);
});
