#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const usb = require('usb');

const app = express();
const PORT = process.env.PORT || 3001;

// Global printer connection
let printerPort = null;
let printerStatus = {
    connected: false,
    model: null,
    port: null,
    error: null,
    lastPrint: null
};

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

const ESCPOS = {
    INIT: ESC + '@',           // Initialize printer
    RESET: ESC + '@',          // Reset printer
    ALIGN_LEFT: ESC + 'a0',    // Left align
    ALIGN_CENTER: ESC + 'a1',  // Center align
    ALIGN_RIGHT: ESC + 'a2',   // Right align
    BOLD_ON: ESC + 'E1',       // Bold on
    BOLD_OFF: ESC + 'E0',      // Bold off
    UNDERLINE_ON: ESC + '-1',  // Underline on
    UNDERLINE_OFF: ESC + '-0', // Underline off
    SIZE_NORMAL: GS + '!0',    // Normal size
    SIZE_DOUBLE: GS + '!17',   // Double size
    CUT_PAPER: GS + 'V66',     // Cut paper
    FEED: '\n',               // Line feed
    DOUBLE_FEED: '\n\n'      // Double line feed
};

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Cottage Tandoori Printer Helper',
        version: '1.0.0',
        printer: printerStatus
    });
});

// Status endpoint for BodsDevelopmentPage
app.get('/status', (req, res) => {
    res.json({
        service: 'running',
        printer: printerStatus,
        timestamp: new Date().toISOString()
    });
});

// Auto-detect Epson printers
app.get('/discover', async (req, res) => {
    try {
        const printers = await discoverPrinters();
        res.json({ printers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Connect to specific printer
app.post('/connect/:port', async (req, res) => {
    try {
        await connectToPrinter(req.params.port);
        res.json({ success: true, status: printerStatus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Kitchen ticket printing
app.post('/print/kitchen', async (req, res) => {
    try {
        const ticket = generateKitchenTicket(req.body);
        await printTicket(ticket);
        res.json({ success: true, message: 'Kitchen ticket printed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Customer receipt printing
app.post('/print/customer', async (req, res) => {
    try {
        const receipt = generateCustomerReceipt(req.body);
        await printTicket(receipt);
        res.json({ success: true, message: 'Customer receipt printed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test print
app.post('/print/test', async (req, res) => {
    try {
        const testTicket = generateTestTicket();
        await printTicket(testTicket);
        res.json({ success: true, message: 'Test ticket printed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Print queue status
app.get('/queue', (req, res) => {
    res.json({
        pending: 0,
        completed: printerStatus.lastPrint ? 1 : 0,
        errors: printerStatus.error ? 1 : 0
    });
});

// Discover Epson printers via USB and Serial
async function discoverPrinters() {
    const printers = [];

    // Check USB devices
    try {
        const devices = usb.getDeviceList();
        devices.forEach(device => {
            // Epson vendor ID is 0x04b8
            if (device.deviceDescriptor.idVendor === 0x04b8) {
                printers.push({
                    id: `usb-${device.deviceDescriptor.idProduct}`,
                    name: 'Epson TM-Series',
                    type: 'usb',
                    vendor: 'Epson',
                    status: 'available'
                });
            }
        });
    } catch (error) {
        console.log('USB scan error:', error.message);
    }

    // Check Serial ports
    try {
        const ports = await SerialPort.list();
        ports.forEach(port => {
            if (port.manufacturer && port.manufacturer.toLowerCase().includes('epson')) {
                printers.push({
                    id: port.path,
                    name: port.friendlyName || 'Epson Serial Printer',
                    type: 'serial',
                    port: port.path,
                    status: 'available'
                });
            }
        });
    } catch (error) {
        console.log('Serial scan error:', error.message);
    }

    return printers;
}

// Connect to printer
async function connectToPrinter(portPath) {
    if (printerPort) {
        printerPort.close();
    }

    return new Promise((resolve, reject) => {
        printerPort = new SerialPort({
            path: portPath,
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1
        });

        printerPort.on('open', () => {
            printerStatus = {
                connected: true,
                model: 'Epson TM-T20III',
                port: portPath,
                error: null,
                lastPrint: null
            };
            console.log(`Connected to printer on ${portPath}`);
            resolve();
        });

        printerPort.on('error', (error) => {
            printerStatus = {
                connected: false,
                model: null,
                port: null,
                error: error.message,
                lastPrint: null
            };
            reject(error);
        });
    });
}

// Print ticket to connected printer
async function printTicket(ticketData) {
    if (!printerPort || !printerStatus.connected) {
        throw new Error('Printer not connected');
    }

    return new Promise((resolve, reject) => {
        printerPort.write(ticketData, (error) => {
            if (error) {
                printerStatus.error = error.message;
                reject(error);
            } else {
                printerStatus.lastPrint = new Date().toISOString();
                printerStatus.error = null;
                resolve();
            }
        });
    });
}

// Generate kitchen ticket (reusing our ESC/POS templates)
function generateKitchenTicket(orderData) {
    let ticket = ESCPOS.INIT;

    // Header
    ticket += ESCPOS.ALIGN_CENTER;
    ticket += ESCPOS.SIZE_DOUBLE;
    ticket += ESCPOS.BOLD_ON;
    ticket += 'COTTAGE TANDOORI\n';
    ticket += ESCPOS.BOLD_OFF;
    ticket += ESCPOS.SIZE_NORMAL;
    ticket += 'KITCHEN ORDER\n';
    ticket += ESCPOS.DOUBLE_FEED;

    // Order details
    ticket += ESCPOS.ALIGN_LEFT;
    ticket += ESCPOS.BOLD_ON;
    ticket += `Order #${orderData.orderNumber || 'UNKNOWN'}\n`;
    ticket += `${orderData.orderType || 'DINE-IN'} | Table ${orderData.tableNumber || 'N/A'}\n`;
    ticket += ESCPOS.BOLD_OFF;
    ticket += `${new Date().toLocaleString()}\n`;
    ticket += '----------------------------------------\n';

    // Menu items grouped by section
    const sections = {
        'STARTERS': [],
        'MAIN COURSE': [],
        'RICE & BREAD': [],
        'SIDES': [],
        'DESSERTS': [],
        'DRINKS': [],
        'OTHER': []
    };

    // Group items by section
    (orderData.items || []).forEach(item => {
        const section = item.section || 'OTHER';
        if (sections[section]) {
            sections[section].push(item);
        } else {
            sections['OTHER'].push(item);
        }
    });

    // Print each section
    Object.keys(sections).forEach(sectionName => {
        if (sections[sectionName].length > 0) {
            ticket += ESCPOS.BOLD_ON;
            ticket += `\n${sectionName}:\n`;
            ticket += ESCPOS.BOLD_OFF;

            sections[sectionName].forEach(item => {
                ticket += `${item.quantity}x ${item.name}\n`;

                // Add variant details
                if (item.variant) {
                    ticket += `   Variant: ${item.variant}\n`;
                }

                // Add modifiers
                if (item.modifiers && item.modifiers.length > 0) {
                    item.modifiers.forEach(mod => {
                        ticket += `   + ${mod.name}\n`;
                    });
                }

                // Add special instructions
                if (item.notes) {
                    ticket += ESCPOS.UNDERLINE_ON;
                    ticket += `   NOTE: ${item.notes}\n`;
                    ticket += ESCPOS.UNDERLINE_OFF;
                }

                ticket += '\n';
            });
        }
    });

    // Footer
    ticket += '----------------------------------------\n';
    if (orderData.specialInstructions) {
        ticket += ESCPOS.BOLD_ON;
        ticket += 'SPECIAL INSTRUCTIONS:\n';
        ticket += ESCPOS.BOLD_OFF;
        ticket += `${orderData.specialInstructions}\n`;
        ticket += ESCPOS.DOUBLE_FEED;
    }

    ticket += ESCPOS.FEED;
    ticket += ESCPOS.CUT_PAPER;

    return ticket;
}

// Generate customer receipt
function generateCustomerReceipt(orderData) {
    let receipt = ESCPOS.INIT;

    // Header
    receipt += ESCPOS.ALIGN_CENTER;
    receipt += ESCPOS.SIZE_DOUBLE;
    receipt += ESCPOS.BOLD_ON;
    receipt += 'COTTAGE TANDOORI\n';
    receipt += ESCPOS.BOLD_OFF;
    receipt += ESCPOS.SIZE_NORMAL;
    receipt += 'Customer Receipt\n';
    receipt += ESCPOS.DOUBLE_FEED;

    // Order details
    receipt += ESCPOS.ALIGN_LEFT;
    receipt += `Order #${orderData.orderNumber || 'UNKNOWN'}\n`;
    receipt += `${new Date().toLocaleString()}\n`;
    receipt += '----------------------------------------\n';

    // Items with prices
    let total = 0;
    (orderData.items || []).forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        receipt += `${item.quantity}x ${item.name}\n`;
        receipt += `    £${itemTotal.toFixed(2)}\n`;
        total += itemTotal;
    });

    receipt += '----------------------------------------\n';
    receipt += ESCPOS.BOLD_ON;
    receipt += `TOTAL: £${total.toFixed(2)}\n`;
    receipt += ESCPOS.BOLD_OFF;
    receipt += ESCPOS.DOUBLE_FEED;

    receipt += ESCPOS.ALIGN_CENTER;
    receipt += 'Thank you for your order!\n';
    receipt += ESCPOS.FEED;
    receipt += ESCPOS.CUT_PAPER;

    return receipt;
}

// Generate test ticket
function generateTestTicket() {
    let ticket = ESCPOS.INIT;

    ticket += ESCPOS.ALIGN_CENTER;
    ticket += ESCPOS.SIZE_DOUBLE;
    ticket += ESCPOS.BOLD_ON;
    ticket += 'COTTAGE TANDOORI\n';
    ticket += ESCPOS.BOLD_OFF;
    ticket += ESCPOS.SIZE_NORMAL;
    ticket += 'Printer Test\n';
    ticket += ESCPOS.DOUBLE_FEED;

    ticket += ESCPOS.ALIGN_LEFT;
    ticket += `Test Time: ${new Date().toLocaleString()}\n`;
    ticket += 'Printer Status: Connected\n';
    ticket += 'ESC/POS Commands: Working\n';
    ticket += ESCPOS.DOUBLE_FEED;

    ticket += ESCPOS.ALIGN_CENTER;
    ticket += 'Test successful!\n';
    ticket += ESCPOS.FEED;
    ticket += ESCPOS.CUT_PAPER;

    return ticket;
}

// Auto-discover and connect on startup
async function initializePrinter() {
    console.log('🔍 Searching for Epson printers...');
    try {
        const printers = await discoverPrinters();
        if (printers.length > 0) {
            console.log(`📍 Found ${printers.length} printer(s)`);
            // Try to connect to the first available printer
            const firstPrinter = printers[0];
            if (firstPrinter.type === 'serial' && firstPrinter.port) {
                await connectToPrinter(firstPrinter.port);
                console.log('✅ Auto-connected to printer');
            }
        } else {
            console.log('⚠️  No Epson printers found');
        }
    } catch (error) {
        console.log('❌ Printer initialization error:', error.message);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`🖨️  Cottage Tandoori Printer Helper running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 Status check: http://localhost:${PORT}/status`);

    // Initialize printer on startup
    initializePrinter();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down printer helper...');
    if (printerPort) {
        printerPort.close();
    }
    process.exit(0);
});
