// Simple wrapper for Render deployment
// This ensures Render can find the entry point even if it ignores render.yaml
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist', 'server.js');
if (!fs.existsSync(distPath)) {
    console.log('dist/server.js not found. Running build...');
    try {
        // Run the build process
        execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error.message);
        process.exit(1);
    }
}

// Verify the file exists after build
if (!fs.existsSync(distPath)) {
    console.error('ERROR: dist/server.js still not found after build attempt.');
    process.exit(1);
}

require('./dist/server.js');
