const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'Cottage Tandoori Printer Helper',
    description: 'Auto-startup service for restaurant printing system',
    script: path.join(__dirname, 'server.js'),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ],
    //, workingDirectory: '...'
    //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
    console.log('Cottage Tandoori Printer Helper installed successfully');
    console.log('Starting service...');
    svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', function() {
    console.log('Cottage Tandoori Printer Helper started successfully');
    console.log('Service is now running on port 3001');
});

// Listen for the "stop" event and let us know when the
// process has actually stopped working.
svc.on('stop', function() {
    console.log('Cottage Tandoori Printer Helper stopped');
});

// Listen for the "uninstall" event so we know when it's gone.
svc.on('uninstall', function() {
    console.log('Cottage Tandoori Printer Helper uninstalled');
});

// Install the script as a service.
console.log('Installing Cottage Tandoori Printer Helper...');
svc.install();