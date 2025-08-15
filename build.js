const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Cottage Tandoori Printer Helper...');

// Clean dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build for different platforms
    console.log('🏗️  Building executables...');

    // Windows
    console.log('🪟 Building for Windows...');
    execSync('pkg package.json --target node18-win-x64 --out-path dist/', { stdio: 'inherit' });

    // macOS
    console.log('🍎 Building for macOS...');
    execSync('pkg package.json --target node18-macos-x64 --out-path dist/', { stdio: 'inherit' });

    // Linux
    console.log('🐧 Building for Linux...');
    execSync('pkg package.json --target node18-linux-x64 --out-path dist/', { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');
    console.log('📁 Executables available in dist/ folder:');

    const files = fs.readdirSync(distDir);
    files.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   ${file} (${sizeInMB} MB)`);
    });

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
