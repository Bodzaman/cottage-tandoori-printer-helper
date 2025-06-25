const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Cottage Tandoori Printer Helper',
        version: '1.0.0'
    });
});

app.get('/discover', (req, res) => {
    res.json({
        printers: [{
            id: 'epson-tm-t20',
            name: 'Epson TM-T20II',
            type: 'network',
            ip: '192.168.1.100',
            port: 9100,
            status: 'connected'
        }]
    });
});

app.post('/test-print/:printerId', (req, res) => {
    console.log('Test print:', req.params.printerId);
    res.json({ success: true, message: 'Test print sent' });
});

app.listen(PORT, () => {
    console.log(`Printer Helper running on port ${PORT}`);
});
