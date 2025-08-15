#!/bin/bash

# QSAI Printer Helper - macOS Auto-Startup Installer
# This script installs the helper as a LaunchDaemon for automatic startup

set -e

echo "🍎 QSAI Printer Helper - macOS Auto-Startup Installer"
echo "================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ This installer must be run as root (use sudo)"
  echo "Usage: sudo ./install-macos-service.sh"
  exit 1
fi

# Copy executable to system location
echo "📁 Installing helper executable..."
cp qsai-printer-helper-macos /usr/local/bin/qsai-printer-helper
chmod +x /usr/local/bin/qsai-printer-helper
echo "✅ Executable installed to /usr/local/bin/qsai-printer-helper"

# Install LaunchDaemon plist
echo "⚙️  Installing LaunchDaemon configuration..."
cp com.qsai.printer.helper.plist /Library/LaunchDaemons/
chown root:wheel /Library/LaunchDaemons/com.qsai.printer.helper.plist
chmod 644 /Library/LaunchDaemons/com.qsai.printer.helper.plist
echo "✅ LaunchDaemon installed"

# Load and start the service
echo "🚀 Starting QSAI Printer Helper service..."
launchctl load /Library/LaunchDaemons/com.qsai.printer.helper.plist
launchctl start com.qsai.printer.helper

# Wait a moment for startup
sleep 3

# Check if service is running
echo "🔍 Checking service status..."
if launchctl list | grep -q "com.qsai.printer.helper"; then
    echo "✅ Service is running!"
    
    # Test the API
    echo "🧪 Testing API endpoint..."
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ API is responding on localhost:3001"
        echo ""
        echo "🎉 Installation completed successfully!"
        echo ""
        echo "The QSAI Printer Helper will now start automatically when the computer boots."
        echo "You can check logs at: /var/log/qsai-printer-helper.log"
        echo ""
        echo "To uninstall:"
        echo "  sudo launchctl unload /Library/LaunchDaemons/com.qsai.printer.helper.plist"
        echo "  sudo rm /Library/LaunchDaemons/com.qsai.printer.helper.plist"
        echo "  sudo rm /usr/local/bin/qsai-printer-helper"
    else
        echo "⚠️  Service started but API not responding yet. Check logs for details."
    fi
else
    echo "❌ Service failed to start. Check system logs for details."
    exit 1
fi
