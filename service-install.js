const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'PrinterHelperService',
    description: 'Windows Service to support printer helper operations and installer creation',
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
    console.log('PrinterHelperService installed successfully');
    console.log('Starting service...');
    svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', function() {
    console.log('PrinterHelperService started successfully');
    console.log('Service is now running on port 8085');
});

// Listen for the "stop" event and let us know when the
// process has actually stopped working.
svc.on('stop', function() {
    console.log('PrinterHelperService stopped');
});

// Listen for the "uninstall" event so we know when it's gone.
svc.on('uninstall', function() {
    console.log('PrinterHelperService uninstalled');
});

// Install the script as a service.
console.log('Installing PrinterHelperService...');
svc.install();