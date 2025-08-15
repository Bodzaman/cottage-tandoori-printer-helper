const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Cottage Tandoori Printer Helper',
        timestamp: new Date().toISOString(),
        port: PORT,
        platform: os.platform(),
        arch: os.arch()
    });
});

// Printer status endpoint
app.get('/printers', (req, res) => {
    res.json({
        printers: [],
        status: 'ready',
        message: 'Printer helper service is running'
    });
});

// Print job endpoint
app.post('/print', (req, res) => {
    const { content, printer_id } = req.body;
    
    // Log the print request
    console.log(`Print request received: ${printer_id}`);
    console.log(`Content: ${content}`);
    
    res.json({
        success: true,
        message: 'Print job queued',
        printer_id,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Cottage Tandoori Printer Helper running on port ${PORT}`);
    console.log(`Service start time: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Cottage Tandoori Printer Helper received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Cottage Tandoori Printer Helper received SIGINT, shutting down gracefully');
    process.exit(0);
});