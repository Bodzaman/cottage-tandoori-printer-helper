const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Global state for printer management
let connectedPrinter = null;
let lastPrintTime = null;
let printJobs = [];
let simulatedPrinters = [
    { id: 'usb_epson_tm_t88vi', name: 'Epson TM-T88VI (USB)', type: 'USB', status: 'ready' },
    { id: 'network_epson_tm_t20', name: 'Epson TM-T20 (Network)', type: 'Network', status: 'ready' },
    { id: 'bluetooth_star_tsp143', name: 'Star TSP143 (Bluetooth)', type: 'Bluetooth', status: 'ready' }
];

// Helper function to generate job IDs
function generateJobId() {
    return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 1. Enhanced Health Check (Required by POS)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Cottage Tandoori Printer Helper',
        port: PORT,
        printer: {
            connected: connectedPrinter !== null,
            activeConnection: connectedPrinter ? connectedPrinter.name : null,
            lastPrint: lastPrintTime
        },
        endpoints: 11,
        version: '6.1.0'
    });
});

// 2. Basic Print Endpoint (Required by POS)
app.post('/print', (req, res) => {
    try {
        const { content, type = 'test' } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Simulate printing
        console.log(`📄 PRINT REQUEST [${type}]:`, content);
        lastPrintTime = new Date().toISOString();

        const jobId = generateJobId();
        printJobs.push({
            id: jobId,
            content,
            type,
            timestamp: lastPrintTime,
            status: 'completed'
        });

        res.json({
            success: true,
            message: `Print job completed successfully`,
            job_id: jobId,
            printer: connectedPrinter ? connectedPrinter.name : 'Default Printer'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Print failed: ${error.message}`
        });
    }
});

// 3. Receipt Print Endpoint (Required by POS)
app.post('/print-receipt', (req, res) => {
    try {
        const receiptData = req.body;

        if (!receiptData) {
            return res.status(400).json({
                success: false,
                message: 'Receipt data is required'
            });
        }

        // Format receipt for printing
        const receiptContent = formatReceipt(receiptData);
        console.log(`🧾 RECEIPT PRINT:`, receiptContent);

        lastPrintTime = new Date().toISOString();
        const jobId = generateJobId();

        printJobs.push({
            id: jobId,
            content: receiptContent,
            type: 'receipt',
            timestamp: lastPrintTime,
            status: 'completed',
            receiptData
        });

        res.json({
            success: true,
            message: 'Receipt printed successfully',
            job_id: jobId,
            printer: connectedPrinter ? connectedPrinter.name : 'Default Printer'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Receipt print failed: ${error.message}`
        });
    }
});

// 4. List Printers Endpoint (Required by POS)
app.get('/printers', (req, res) => {
    res.json({
        printers: simulatedPrinters,
        count: simulatedPrinters.length,
        connected: connectedPrinter
    });
});

// 5. General Printer Discovery (Required by POS)
app.get('/discover-printers', (req, res) => {
    setTimeout(() => {
        res.json({
            success: true,
            printers_found: simulatedPrinters.length,
            printers: simulatedPrinters
        });
    }, 1000); // Simulate discovery time
});

// 6. USB Printer Discovery (Required by POS)
app.get('/discover-usb-printers', (req, res) => {
    const usbPrinters = simulatedPrinters.filter(p => p.type === 'USB');
    setTimeout(() => {
        res.json({
            success: true,
            usb_printers_found: usbPrinters.length,
            usb_printers: usbPrinters
        });
    }, 1500);
});

// 7. Network Printer Discovery (Required by POS) 
app.get('/discover-network-printers', (req, res) => {
    const networkPrinters = simulatedPrinters.filter(p => p.type === 'Network');
    setTimeout(() => {
        res.json({
            success: true,
            network_printers_found: networkPrinters.length,
            network_printers: networkPrinters
        });
    }, 3000); // 30s timeout in real implementation
});

// 8. Bluetooth Printer Discovery (Required by POS)
app.get('/discover-bluetooth-printers', (req, res) => {
    const bluetoothPrinters = simulatedPrinters.filter(p => p.type === 'Bluetooth');
    setTimeout(() => {
        res.json({
            success: true,
            bluetooth_printers_found: bluetoothPrinters.length,
            bluetooth_printers: bluetoothPrinters
        });
    }, 2000); // 20s timeout in real implementation
});

// 9. Universal Printer Discovery (Required by POS)
app.get('/discover-all-printers', (req, res) => {
    setTimeout(() => {
        res.json({
            success: true,
            all_printers_found: simulatedPrinters.length,
            all_printers: simulatedPrinters,
            breakdown: {
                usb: simulatedPrinters.filter(p => p.type === 'USB').length,
                network: simulatedPrinters.filter(p => p.type === 'Network').length,
                bluetooth: simulatedPrinters.filter(p => p.type === 'Bluetooth').length
            }
        });
    }, 4500); // 45s timeout in real implementation
});

// 10. Connect to Printer (Required by POS)
app.post('/connect-printer', (req, res) => {
    try {
        const { printer_id } = req.body;

        if (!printer_id) {
            return res.status(400).json({
                success: false,
                message: 'printer_id is required'
            });
        }

        const printer = simulatedPrinters.find(p => p.id === printer_id);
        if (!printer) {
            return res.status(404).json({
                success: false,
                message: 'Printer not found'
            });
        }

        connectedPrinter = printer;
        console.log(`🔗 CONNECTED TO PRINTER: ${printer.name}`);

        res.json({
            success: true,
            message: `Successfully connected to ${printer.name}`,
            printer: connectedPrinter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Connection failed: ${error.message}`
        });
    }
});

// 11. Connect USB Printer (Required by POS)
app.post('/connect-usb-printer', (req, res) => {
    try {
        const { printer_name } = req.body;

        if (!printer_name) {
            return res.status(400).json({
                success: false,
                message: 'printer_name is required'
            });
        }

        const printer = simulatedPrinters.find(p => 
            p.name.toLowerCase().includes(printer_name.toLowerCase()) && p.type === 'USB'
        );

        if (!printer) {
            return res.status(404).json({
                success: false,
                message: 'USB printer not found'
            });
        }

        connectedPrinter = printer;
        console.log(`🔗 CONNECTED TO USB PRINTER: ${printer.name}`);

        res.json({
            success: true,
            message: `Successfully connected to USB printer ${printer.name}`,
            printer: connectedPrinter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `USB connection failed: ${error.message}`
        });
    }
});

// Helper function to format receipts
function formatReceipt(data) {
    let receipt = '';
    receipt += '================================\n';
    receipt += '    COTTAGE TANDOORI RESTAURANT\n';
    receipt += '================================\n';

    if (data.header) {
        receipt += `Order #: ${data.header.order_number || 'N/A'}\n`;
        receipt += `Table: ${data.table_number || 'N/A'}\n`;
        receipt += `Date: ${new Date().toLocaleString()}\n`;
        receipt += '--------------------------------\n';
    }

    if (data.items && Array.isArray(data.items)) {
        data.items.forEach(item => {
            receipt += `${item.name || 'Item'}\n`;
            receipt += `  ${item.quantity || 1}x £${item.price || '0.00'}\n`;
        });
        receipt += '--------------------------------\n';
    }

    if (data.totals) {
        receipt += `Subtotal: £${data.totals.subtotal || '0.00'}\n`;
        receipt += `Tax: £${data.totals.tax || '0.00'}\n`;
        receipt += `Total: £${data.totals.total || '0.00'}\n`;
    }

    receipt += '================================\n';
    receipt += 'Thank you for your visit!\n';
    receipt += '================================\n';

    return receipt;
}

// Additional endpoint for debugging
app.get('/status', (req, res) => {
    res.json({
        server: 'running',
        printer_connected: connectedPrinter !== null,
        total_print_jobs: printJobs.length,
        available_printers: simulatedPrinters.length,
        last_activity: lastPrintTime
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🖨️ Cottage Tandoori Printer Helper running on http://localhost:${PORT}`);
    console.log(`📡 All 11 endpoints available for POS integration`);
    console.log(`🔗 CORS enabled for web app integration`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
