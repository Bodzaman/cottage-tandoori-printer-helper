@echo off
REM QSAI Printer Helper - Windows Auto-Startup Installer
REM This script installs the helper as a Windows Service

echo.
echo 🪟 QSAI Printer Helper - Windows Auto-Startup Installer
echo ======================================================
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ❌ This installer must be run as Administrator
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Install node-windows if not present
echo 📦 Installing node-windows dependency...
npm install -g node-windows
if %errorLevel% neq 0 (
    echo ❌ Failed to install node-windows
    pause
    exit /b 1
)

REM Install the service
echo ⚙️  Installing QSAI Printer Helper as Windows Service...
node service-manager.js install
if %errorLevel% == 0 (
    echo ✅ Service installed successfully!
    echo.
    echo The QSAI Printer Helper will now start automatically when Windows boots.
    echo.
    echo Service Management:
    echo   Start:   sc start "QSAI Printer Helper"
    echo   Stop:    sc stop "QSAI Printer Helper"
    echo   Status:  sc query "QSAI Printer Helper"
    echo.
    echo To uninstall:
    echo   node service-manager.js uninstall
    echo.
    echo 🎉 Installation completed!
) else (
    echo ❌ Failed to install service
    pause
    exit /b 1
)

pause
