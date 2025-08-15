const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
};

console.log('Testing Cottage Tandoori Printer Helper...');
console.log(`Connecting to http://localhost:3001/health`);

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('Service Response:');
            console.log(JSON.stringify(response, null, 2));
            
            if (response.status === 'healthy') {
                console.log('✅ Service is running correctly!');
            } else {
                console.log('❌ Service health check failed');
            }
        } catch (error) {
            console.log('❌ Failed to parse response:', data);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ Connection failed:', error.message);
    console.log('Make sure the service is installed and running.');
});

req.end();