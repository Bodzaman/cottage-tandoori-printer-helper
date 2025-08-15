# Cottage Tandoori Printer Helper

🖨️ **Lightweight Node.js printer helper for Cottage Tandoori POS system**

A simple, double-clickable application that connects your Epson TM-T20III printer to the Cottage Tandoori restaurant management system. No complex setup required!

## 🚀 Quick Installation

### For Restaurant Staff (Simple)

1. **Download** the latest version for your system:
   - 🪟 **Windows**: `cottage-tandoori-printer-helper-win.exe` (~20MB)
   - 🍎 **macOS**: `cottage-tandoori-printer-helper-macos` (~20MB)  
   - 🐧 **Linux**: `cottage-tandoori-printer-helper-linux` (~20MB)

2. **Connect** your Epson TM-T20III printer via USB

3. **Run** the downloaded file:
   - Windows: Double-click the `.exe` file
   - macOS/Linux: Make executable and run from terminal

4. **Verify** - Open http://localhost:3001/health in your browser

✅ **That's it!** Your printer is now connected to the POS system.

## 📥 Download Links

**Latest Release**: [Download from GitHub Releases](https://github.com/Bodzaman/cottage-tandoori-printer-helper/releases/latest)

| Platform | File | Size | Notes |
|----------|------|------|--------|
| Windows 10/11 | `cottage-tandoori-printer-helper-win.exe` | ~20MB | Double-click to run |
| macOS 10.15+ | `cottage-tandoori-printer-helper-macos` | ~20MB | May need chmod +x |
| Linux Ubuntu/Debian | `cottage-tandoori-printer-helper-linux` | ~20MB | chmod +x required |

## 🔧 Supported Printers

- ✅ **Epson TM-T20III** (Primary)
- ✅ **Epson TM-T20II** 
- ✅ **Epson TM-T88V**
- ✅ **Most Epson TM-Series** thermal printers

**Connection Methods:**
- USB (Recommended)
- Serial/RS-232
- Auto-detection on startup

## 🖨️ What It Does

**Kitchen Tickets** 🧑‍🍳
- Prints orders grouped by course (Starters, Mains, etc.)
- Shows cooking instructions and spice levels
- Highlights special dietary requirements
- Auto-cuts paper between orders

**Customer Receipts** 🧾  
- Itemized bills with prices
- Order numbers and timestamps
- Professional formatting
- Branded headers

**Test Printing** 🧪
- Health check functionality
- Print queue monitoring
- Connection status

## 📊 Integration

The printer helper integrates seamlessly with:

- **POSII System** - Kitchen and customer printing
- **Online Orders** - Direct printing from website orders  
- **Voice Orders** - AI phone orders print automatically
- **Admin Dashboard** - Print status monitoring

**Real-time Features:**
- ⚡ Instant order printing
- 📍 Connection status monitoring  
- 🔄 Auto-reconnection on USB unplug/replug
- 📈 Print success/failure tracking

## 🛠️ Advanced Setup

### Windows Service Installation (Optional)

For restaurants that want the helper to start automatically with Windows:

```bash
# Download and extract files
# Open Command Prompt as Administrator
node install-service.js
```

**Benefits:**
- Starts automatically when computer boots
- Runs in background (no window)
- Automatic restart if crashes
- Windows service management integration

### Manual Setup (Developers)

```bash
# Clone repository
git clone https://github.com/Bodzaman/cottage-tandoori-printer-helper.git
cd cottage-tandoori-printer-helper

# Install dependencies
npm install

# Run development server
npm start

# Build executables
npm run build
```

## 🔍 Troubleshooting

### Printer Not Detected

1. **Check USB Connection**
   - Ensure printer is plugged in and powered on
   - Try a different USB port
   - Check if Windows detects the device

2. **Driver Issues**
   - Install official Epson drivers from Epson website
   - Restart the helper app after driver installation

3. **Restart Helper**
   - Close the application 
   - Unplug and replug the printer
   - Restart the application

### Print Jobs Not Working

1. **Check Printer Status**
   - Visit http://localhost:3001/status
   - Verify "connected": true

2. **Test Print**
   - Visit http://localhost:3001 (if we add web interface)
   - Or use curl: `curl -X POST http://localhost:3001/print/test`

3. **Paper Issues**
   - Check paper is loaded correctly
   - Ensure paper roll is not empty
   - Verify paper cover is closed

### Helper App Not Starting

1. **Port Conflicts**
   - Close other applications using port 3001
   - Or modify PORT environment variable

2. **Firewall Issues**
   - Allow the application through Windows Firewall
   - Add exception for port 3001

3. **Antivirus Issues**
   - Some antivirus may block unknown executables
   - Add exception for cottage-tandoori-printer-helper

## 📞 Support

**Need Help?**
- 💬 **Discord**: [Cottage Tandoori Support Community]
- 📧 **Email**: support@cottagetandoori.com  
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Bodzaman/cottage-tandoori-printer-helper/issues)

**Before contacting support:**
1. Check troubleshooting steps above
2. Note your operating system and printer model
3. Visit http://localhost:3001/health and share the result

## 🔄 Updates

The helper app **automatically checks for updates** when starting. New versions are released when:

- 🐛 Bug fixes
- 🆕 New printer models supported  
- ⚡ Performance improvements
- 🛡️ Security updates

**Update Process:**
1. Download latest version from GitHub releases
2. Close current helper app
3. Replace old executable with new one
4. Restart helper app

## ⚙️ Technical Details

**Built With:**
- Node.js 18+ (Runtime)
- Express.js (Web server)
- serialport (USB/Serial communication)
- ESC/POS (Printer command protocol)
- pkg (Executable packaging)

**System Requirements:**
- Windows 10/11, macOS 10.15+, or Linux
- USB port for printer connection
- ~50MB free disk space
- Internet connection (for updates)

**Ports Used:**
- `3001` - HTTP API server
- USB Serial port (auto-detected)

**Files Created:**
- No registry modifications
- No system file changes  
- Portable - can run from any folder

---

**Made with ❤️ for Cottage Tandoori Restaurant**

*This helper application is part of the complete Cottage Tandoori AI restaurant platform.*
