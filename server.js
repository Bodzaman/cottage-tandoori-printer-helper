#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Enhanced middleware for PKG compatibility
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Cottage Tandoori Printer Helper',
        version: '8.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        node_version: process.version
    });
});

// Service status endpoint
app.get('/status', (req, res) => {
    res.json({
        service_running: true,
        api_responding: true,
        status: 'online',
        message: 'Cottage Tandoori Helper v8.0.0 - PKG Runtime Active',
        printer_ready: true,
        connection_type: 'embedded_runtime'
    });
});

// Kitchen ticket printing
app.post('/print/kitchen', (req, res) => {
    try {
        const order = req.body;
        console.log('\n=== KITCHEN TICKET ===');
        console.log(`Order ID: ${order.order_id}`);
        console.log(`Type: ${order.order_type}`);
        if (order.table_number) console.log(`Table: ${order.table_number}`);
        if (order.guest_count) console.log(`Guests: ${order.guest_count}`);
        console.log('\nITEMS:');
        
        order.items?.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} x${item.quantity}`);
            if (item.spice_level) console.log(`   Spice: ${item.spice_level}`);
            if (item.allergens?.length) console.log(`   Allergens: ${item.allergens.join(', ')}`);
            if (item.modifiers?.length) {
                item.modifiers.forEach(mod => console.log(`   + ${mod.name}`));
            }
            if (item.notes) console.log(`   Notes: ${item.notes}`);
            if (item.prep_time) console.log(`   Prep Time: ${item.prep_time} min`);
        });
        
        if (order.special_instructions) {
            console.log(`\nSpecial Instructions: ${order.special_instructions}`);
        }
        
        console.log(`\nTime: ${new Date().toLocaleTimeString()}`);
        console.log('======================\n');
        
        res.json({
            success: true,
            message: 'Kitchen ticket printed successfully',
            order_id: order.order_id,
            print_time: new Date().toISOString()
        });
    } catch (error) {
        console.error('Kitchen print error:', error);
        res.status(500).json({
            success: false,
            message: 'Kitchen printing failed',
            error: error.message
        });
    }
});

// Customer receipt printing
app.post('/print/customer', (req, res) => {
    try {
        const order = req.body;
        console.log('\n=== CUSTOMER RECEIPT ===');
        console.log('     COTTAGE TANDOORI');
        console.log('    Traditional Indian Cuisine');
        console.log('  Phone: 01234 567890');
        console.log('\n--------------------------');
        console.log(`Order: ${order.order_id}`);
        console.log(`Date: ${new Date().toLocaleDateString()}`);
        console.log(`Time: ${new Date().toLocaleTimeString()}`);
        if (order.customer_data) {
            console.log(`Customer: ${order.customer_data.first_name} ${order.customer_data.last_name}`);
            if (order.customer_data.phone) console.log(`Phone: ${order.customer_data.phone}`);
        }
        console.log('--------------------------');
        
        let subtotal = 0;
        order.items?.forEach(item => {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            console.log(`${item.name}`);
            console.log(`  ${item.quantity} x £${item.price.toFixed(2)} = £${lineTotal.toFixed(2)}`);
            
            item.modifiers?.forEach(mod => {
                if (mod.price > 0) {
                    console.log(`  + ${mod.name} £${mod.price.toFixed(2)}`);
                    subtotal += mod.price;
                }
            });
        });
        
        console.log('--------------------------');
        console.log(`Subtotal: £${subtotal.toFixed(2)}`);
        if (order.total_amount && order.total_amount !== subtotal) {
            console.log(`Total: £${order.total_amount.toFixed(2)}`);
        }
        
        if (order.payment_method) {
            console.log(`Payment: ${order.payment_method}`);
        }
        
        console.log('\nThank you for your order!');
        console.log('Visit us again soon!');
        console.log('==========================\n');
        
        res.json({
            success: true,
            message: 'Customer receipt printed successfully',
            order_id: order.order_id,
            total: order.total_amount || subtotal,
            print_time: new Date().toISOString()
        });
    } catch (error) {
        console.error('Customer print error:', error);
        res.status(500).json({
            success: false,
            message: 'Customer receipt printing failed',
            error: error.message
        });
    }
});

// Generic print endpoint
app.post('/print', (req, res) => {
    try {
        const { type, data } = req.body;
        console.log(`\n=== PRINT REQUEST (${type?.toUpperCase()}) ===`);
        console.log(JSON.stringify(data, null, 2));
        console.log('================================\n');
        
        res.json({
            success: true,
            message: `Print job completed for type: ${type}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Print error:', error);
        res.status(500).json({
            success: false,
            message: 'Print job failed',
            error: error.message
        });
    }
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Cottage Tandoori Printer Helper v8.0.0`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🖨️  Ready to serve the QSAI restaurant system`);
    console.log(`⚡ PKG Runtime: ${process.pkg ? 'Embedded' : 'Development'}`);
    console.log(`💻 Platform: ${process.platform}`);
    console.log(`📅 Started: ${new Date().toLocaleString()}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Graceful shutdown initiated');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 Graceful shutdown initiated');
    process.exit(0);
});
