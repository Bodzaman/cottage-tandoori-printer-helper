const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'Cottage Tandoori Printer Helper',
    description: 'Printer helper service for Cottage Tandoori POS system',
    script: path.join(__dirname, 'server.js'),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ],
    env: {
        name: "NODE_ENV",
        value: "production"
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
    console.log('✅ Cottage Tandoori Printer Helper service installed successfully!');
    console.log('🚀 Starting service...');
    svc.start();
});

svc.on('start', function() {
    console.log('🟢 Service started successfully!');
    console.log('📍 Printer Helper is now running on localhost:3001');
});

svc.on('alreadyinstalled', function() {
    console.log('ℹ️  Service is already installed');
    console.log('🔄 Restarting service...');
    svc.restart();
});

svc.on('error', function(err) {
    console.error('❌ Service error:', err);
});

// Install the service
console.log('🔧 Installing Cottage Tandoori Printer Helper as Windows service...');
svc.install();
