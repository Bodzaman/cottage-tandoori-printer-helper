const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'QSAI Printer Helper',
  description: 'QSAI Restaurant Printer Helper Service',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    },
    {
      name: "PORT",
      value: "3001"
    }
  ],
  wait: 2,
  grow: 0.5
});

// Listen for the "install" event
svc.on('install', function(){
  console.log('QSAI Printer Helper service installed successfully!');
  console.log('Starting service...');
  svc.start();
});

// Listen for the "start" event
svc.on('start', function(){
  console.log('QSAI Printer Helper service started successfully!');
  console.log('Service is now running on localhost:3001');
});

// Listen for the "stop" event
svc.on('stop', function(){
  console.log('QSAI Printer Helper service stopped.');
});

// Listen for the "uninstall" event
svc.on('uninstall', function(){
  console.log('QSAI Printer Helper service uninstalled.');
});

// Listen for the "error" event
svc.on('error', function(err){
  console.error('Service error:', err);
});

// Install the service
if (process.argv[2] === 'install') {
  console.log('Installing QSAI Printer Helper as Windows Service...');
  svc.install();
} else if (process.argv[2] === 'uninstall') {
  console.log('Uninstalling QSAI Printer Helper service...');
  svc.uninstall();
} else if (process.argv[2] === 'start') {
  console.log('Starting QSAI Printer Helper service...');
  svc.start();
} else if (process.argv[2] === 'stop') {
  console.log('Stopping QSAI Printer Helper service...');
  svc.stop();
} else {
  console.log('Usage:');
  console.log('  node service-manager.js install   - Install as Windows Service');
  console.log('  node service-manager.js uninstall - Remove Windows Service');
  console.log('  node service-manager.js start     - Start the service');
  console.log('  node service-manager.js stop      - Stop the service');
  console.log('');
  console.log('After installation, the service will start automatically on boot.');
}

module.exports = svc;
