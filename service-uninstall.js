const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'PrinterHelperService',
    script: path.join(__dirname, 'server.js')
});

// Listen for the "uninstall" event so we know when it's gone.
svc.on('uninstall', function() {
    console.log('PrinterHelperService uninstalled successfully');
});

// Uninstall the service.
console.log('Uninstalling PrinterHelperService...');
svc.uninstall();