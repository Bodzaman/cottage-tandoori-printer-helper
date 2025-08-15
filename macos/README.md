# macOS Installation Guide

## Cottage Tandoori Printer Helper - macOS Auto-Startup

This guide helps you install the Cottage Tandoori Printer Helper as a macOS LaunchDaemon service that starts automatically on system boot.

### Prerequisites

- **Node.js**: Install from [nodejs.org](https://nodejs.org/)
- **Administrator access**: Required for system service installation

### Quick Installation

1. **Download the installer script:**
   ```bash
   curl -O https://raw.githubusercontent.com/Bodzaman/cottage-tandoori-printer-helper/main/macos/install-macos.sh
   ```

2. **Make it executable:**
   ```bash
   chmod +x install-macos.sh
   ```

3. **Run the installer:**
   ```bash
   sudo ./install-macos.sh
   ```

4. **Verify installation:**
   ```bash
   curl http://localhost:3001/health
   ```

### What the installer does:

- ✅ Downloads printer helper files to `/usr/local/cottage-tandoori-printer-helper/`
- ✅ Installs Node.js dependencies
- ✅ Creates LaunchDaemon configuration
- ✅ Starts the service immediately
- ✅ Configures auto-startup on system boot

### Service Management

**Check service status:**
```bash
sudo launchctl list | grep cottage-tandoori
```

**Stop the service:**
```bash
sudo launchctl unload /Library/LaunchDaemons/com.cottage-tandoori.printer-helper.plist
```

**Start the service:**
```bash
sudo launchctl load /Library/LaunchDaemons/com.cottage-tandoori.printer-helper.plist
```

**View logs:**
```bash
tail -f /var/log/cottage-tandoori-printer-helper.log
tail -f /var/log/cottage-tandoori-printer-helper-error.log
```

### Uninstallation

To completely remove the service:

1. **Download uninstaller:**
   ```bash
   curl -O https://raw.githubusercontent.com/Bodzaman/cottage-tandoori-printer-helper/main/macos/uninstall-macos.sh
   chmod +x uninstall-macos.sh
   ```

2. **Run uninstaller:**
   ```bash
   sudo ./uninstall-macos.sh
   ```

### Troubleshooting

**Service not starting?**
- Check if Node.js is installed: `node --version`
- Check error logs: `tail /var/log/cottage-tandoori-printer-helper-error.log`
- Ensure port 3001 is available: `lsof -i :3001`

**Permission issues?**
- Make sure to run installation with `sudo`
- Check file permissions in `/usr/local/cottage-tandoori-printer-helper/`

**Need help?**
- Test the helper manually: `cd /usr/local/cottage-tandoori-printer-helper && node server.js`
- Check system logs: `tail /var/log/system.log | grep cottage-tandoori`

### Security Note

This installer creates a system service that runs with root privileges. Only install if you trust the source and have reviewed the code.
