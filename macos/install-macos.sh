#!/bin/bash

# Cottage Tandoori Printer Helper - macOS Installation Script
# This script installs the printer helper as a LaunchDaemon for auto-startup

set -e

echo "🍛 Cottage Tandoori Printer Helper - macOS Installation"
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    echo "Usage: sudo ./install-macos.sh"
    exit 1
fi

# Define paths
APP_DIR="/usr/local/cottage-tandoori-printer-helper"
PLIST_PATH="/Library/LaunchDaemons/com.cottage-tandoori.printer-helper.plist"
SERVICE_NAME="com.cottage-tandoori.printer-helper"

echo "📁 Creating application directory..."
mkdir -p "$APP_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found at: $(which node)"

# Download application files
echo "⬇️  Downloading application files..."
curl -L "https://raw.githubusercontent.com/Bodzaman/cottage-tandoori-printer-helper/main/server.js" -o "$APP_DIR/server.js"
curl -L "https://raw.githubusercontent.com/Bodzaman/cottage-tandoori-printer-helper/main/package.json" -o "$APP_DIR/package.json"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$APP_DIR"
npm install --production

# Create LaunchDaemon plist
echo "🔧 Creating LaunchDaemon configuration..."
cat > "$PLIST_PATH" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cottage-tandoori.printer-helper</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/usr/local/cottage-tandoori-printer-helper/server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/var/log/cottage-tandoori-printer-helper.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/cottage-tandoori-printer-helper-error.log</string>
    <key>WorkingDirectory</key>
    <string>/usr/local/cottage-tandoori-printer-helper</string>
</dict>
</plist>
EOF

# Set proper permissions
echo "🔐 Setting permissions..."
chown root:wheel "$PLIST_PATH"
chmod 644 "$PLIST_PATH"
chown -R root:wheel "$APP_DIR"

# Stop service if already running
if launchctl list | grep -q "$SERVICE_NAME"; then
    echo "🛑 Stopping existing service..."
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Load and start the service
echo "🚀 Starting Cottage Tandoori Printer Helper service..."
launchctl load "$PLIST_PATH"

# Wait a moment for service to start
sleep 3

# Check if service is running
if launchctl list | grep -q "$SERVICE_NAME"; then
    echo "✅ Service started successfully!"
    echo ""
    echo "🎉 Installation Complete!"
    echo "================================"
    echo "✅ Cottage Tandoori Printer Helper is now running"
    echo "✅ Service will auto-start on system boot"
    echo "✅ Access at: http://localhost:3001"
    echo ""
    echo "🔍 Test the service:"
    echo "   curl http://localhost:3001/health"
    echo ""
    echo "📝 View logs:"
    echo "   tail -f /var/log/cottage-tandoori-printer-helper.log"
    echo "   tail -f /var/log/cottage-tandoori-printer-helper-error.log"
else
    echo "❌ Failed to start service. Check logs:"
    echo "   tail /var/log/cottage-tandoori-printer-helper-error.log"
    exit 1
fi
