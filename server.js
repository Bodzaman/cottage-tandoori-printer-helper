/**
 * QSAI Epson Printer Helper v1.0.6
 * Double-clickable executable for Cottage Tandoori POS system
 * Supports Epson TM-T20III & TM-T88V thermal printers
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');
const usb = require('usb');
const ping = require('ping');

// Configuration
const PORT = process.env.PORT || 3001;
const SUPABASE_URL = 'https://wghxpyivvtmpgkluzjng.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaHhweWl2dnRtcGdrbHV6am5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczNDYzMzYsImV4cCI6MjAzMjkyMjMzNn0.Hm-8K2GwrP3t8SLBgHHO1d8xFJqfY8QNj7K3rFm_3tU';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Printer management
let discoveredPrinters = [];
let activePrinter = null;

/**
 * Auto-discover Epson printers
 */
function discoverPrinters() {
    console.log('Discovering Epson printers...');
    discoveredPrinters = [];
    
    try {
        const devices = usb.getDeviceList();
        
        devices.forEach((device, index) => {
            const vendorId = device.deviceDescriptor?.idVendor;
            const productId = device.deviceDescriptor?.idProduct;
            
            // Epson vendor ID is 0x04b8
            if (vendorId === 0x04b8) {
                const printerInfo = {
                    id: `epson_${index}`,
                    name: `Epson Printer (${productId?.toString(16) || 'unknown'})`,
                    vendorId: vendorId,
                    productId: productId,
                    type: 'USB',
                    status: 'ready'
                };
                
                discoveredPrinters.push(printerInfo);
                console.log('Found Epson printer:', printerInfo.name);
            }
        });
        
        if (discoveredPrinters.length === 0) {
            console.log('No Epson printers found. Check USB connections.');
        } else {
            // Auto-select first printer
            activePrinter = discoveredPrinters[0];
            console.log('Selected printer:', activePrinter.name);
        }
        
    } catch (error) {
        console.error('Error discovering printers:', error.message);
    }
}

// API Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'QSAI Epson Printer Helper',
        version: '1.0.6',
        printers: discoveredPrinters.length,
        active_printer: activePrinter?.name || 'none'
    });
});

app.get('/printers', (req, res) => {
    res.json({
        discovered: discoveredPrinters,
        active: activePrinter
    });
});

app.post('/discover', (req, res) => {
    discoverPrinters();
    res.json({
        success: true,
        discovered: discoveredPrinters.length,
        printers: discoveredPrinters
    });
});

// Start server
app.listen(PORT, () => {
    console.log('
');
    console.log('QSAI Epson Printer Helper v1.0.6');
    console.log('================================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Connected to Cottage Tandoori Supabase');
    console.log('
');
    
    // Auto-discover printers on startup
    setTimeout(() => {
        discoverPrinters();
    }, 2000);
    
    console.log('Printer helper ready for Cottage Tandoori POS');
    console.log('   Use Ctrl+C to stop');
    console.log('
');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('
Shutting down QSAI Printer Helper...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('
Shutting down QSAI Printer Helper...');
    process.exit(0);
});
