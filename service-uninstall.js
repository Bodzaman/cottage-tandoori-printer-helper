const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'Cottage Tandoori Printer Helper',
    script: path.join(__dirname, 'server.js')
});

// Listen for the "uninstall" event so we know when it's gone.
svc.on('uninstall', function() {
    console.log('Cottage Tandoori Printer Helper uninstalled successfully');
});

// Uninstall the service.
console.log('Uninstalling Cottage Tandoori Printer Helper...');
svc.uninstall();