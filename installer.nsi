# NSIS Script for Cottage Tandoori Printer Helper
# Professional Windows Service Auto-Startup Installer

!include "MUI2.nsh"
!include "ServiceLib.nsh"

# Installer Information
Name "Cottage Tandoori Printer Helper"
OutFile "CottageTandooriPrinterHelper-Setup.exe"
InstallDir "$PROGRAMFILES\Cottage Tandoori\Printer Helper"
RequestExecutionLevel admin

# Modern UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"

# Installer Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\CottageTandooriPrinterHelper.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Start Cottage Tandoori Printer Helper Service"
!insertmacro MUI_PAGE_FINISH

# Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

# Languages
!insertmacro MUI_LANGUAGE "English"

# Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "Cottage Tandoori Printer Helper"
VIAddVersionKey "CompanyName" "Cottage Tandoori Restaurant"
VIAddVersionKey "FileDescription" "Restaurant Printing Service"
VIAddVersionKey "FileVersion" "1.0.0.0"
VIAddVersionKey "ProductVersion" "1.0.0.0"
VIAddVersionKey "LegalCopyright" "© 2024 Cottage Tandoori Restaurant"

# Main Installer Section
Section "MainSection" SEC01
    SetOutPath "$INSTDIR"

    # Copy Node.js runtime and application files
    File "node.exe"
    File "server.js"
    File "service-install.js"
    File "service-uninstall.js"
    File "test-service.js"
    File "package.json"
    File /r "node_modules"

    # Create service executable wrapper
    FileOpen $0 "$INSTDIR\CottageTandooriPrinterHelper.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "cd /d \"$INSTDIR\"$\r$\n"
    FileWrite $0 "node server.js$\r$\n"
    FileClose $0

    # Install and start Windows Service
    DetailPrint "Installing Windows Service..."
    ExecWait '"$INSTDIR\node.exe" "$INSTDIR\service-install.js"' $0
    ${If} $0 != 0
        MessageBox MB_ICONEXCLAMATION "Service installation failed. Error code: $0"
    ${Else}
        DetailPrint "Service installed successfully"
    ${EndIf}

    # Create uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"

    # Add to Add/Remove Programs
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "DisplayName" "Cottage Tandoori Printer Helper"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "Publisher" "Cottage Tandoori Restaurant"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "DisplayVersion" "1.0.0"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "NoRepair" 1

    # Create Start Menu shortcuts
    CreateDirectory "$SMPROGRAMS\Cottage Tandoori"
    CreateShortcut "$SMPROGRAMS\Cottage Tandoori\Printer Helper.lnk" "$INSTDIR\CottageTandooriPrinterHelper.bat"
    CreateShortcut "$SMPROGRAMS\Cottage Tandoori\Test Service.lnk" "$INSTDIR\node.exe" "$INSTDIR\test-service.js"
    CreateShortcut "$SMPROGRAMS\Cottage Tandoori\Uninstall.lnk" "$INSTDIR\Uninstall.exe"

SectionEnd

# Uninstaller Section
Section "Uninstall"

    # Stop and uninstall Windows Service
    DetailPrint "Uninstalling Windows Service..."
    ExecWait '"$INSTDIR\node.exe" "$INSTDIR\service-uninstall.js"' $0
    Sleep 2000  # Wait for service to stop

    # Remove files
    Delete "$INSTDIR\*.*"
    RMDir /r "$INSTDIR\node_modules"
    RMDir "$INSTDIR"

    # Remove Start Menu shortcuts
    Delete "$SMPROGRAMS\Cottage Tandoori\*.*"
    RMDir "$SMPROGRAMS\Cottage Tandoori"

    # Remove registry entries
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper"

SectionEnd

# Installer Functions
Function .onInit
    # Check if already installed
    ReadRegStr $R0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CottageTandooriPrinterHelper" "UninstallString"
    StrCmp $R0 "" done

    MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
        "Cottage Tandoori Printer Helper is already installed. $\n$\nClick OK to remove the previous version or Cancel to cancel this upgrade." \
        IDOK uninst
    Abort

    uninst:
        ClearErrors
        ExecWait '$R0 /S _?=$INSTDIR'

        IfErrors no_remove_uninstaller done
        no_remove_uninstaller:

    done:
FunctionEnd