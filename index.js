const { app, BrowserWindow } = require('electron');
const path = require('path');

// Global references to prevent garbage collection
let mainWindow;
let splashWindow;

// Create splash screen
function createSplashScreen() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 450,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'src/pages/splash.html'));

  // Close splash screen after 5 seconds and open main window
  setTimeout(() => {
    splashWindow.close();
    createWindow();
  }, 5000);
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/pages/mainpage.html'));

  // Show window when content has loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// App ready event
app.whenReady().then(() => {
  createSplashScreen();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
