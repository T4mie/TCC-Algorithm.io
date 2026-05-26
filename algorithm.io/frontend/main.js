const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path');
let win;
let childWindow;
const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
    }
  })

  win.loadFile('frontend/index.html')
}

function createChildWindow(type, currentStep = -1) {
    if (childWindow) {
        if (childWindow.isMinimized()) {
            childWindow.restore();
        }
        
        childWindow.focus();
        
        childWindow.webContents.send('child-step-updated', { step: currentStep });
        
        return;
    }

    // Se a janela não existir, cria uma nova normalmente
    childWindow = new BrowserWindow({
        width: 600,
        height: 400,
        parent: win, // define como filha
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const hash = type ? `/codeview?type=${type}&step=${encodeURIComponent(currentStep)}` : `/codeview?step=${encodeURIComponent(currentStep)}`;

    childWindow.loadFile('frontend/index.html', {
        hash
    });

    childWindow.on('closed', () => {
        childWindow = null;
    });
}

ipcMain.on('open-child-window', (event, payload) => {

    // payload expected as { type, currentStep }
    const type = payload && payload.type ? payload.type : undefined;
    const currentStep = payload && typeof payload.currentStep !== 'undefined' ? payload.currentStep : -1;
    createChildWindow(type, currentStep);

});

// Forward live step updates from parent renderer to child window (if open)
ipcMain.on('update-child-step', (event, payload) => {
    if (!childWindow) return;
    try {
        childWindow.webContents.send('child-step-updated', payload);
    } catch (e) {
        console.warn('Failed to forward step update to child window', e);
    }
});

app.whenReady().then(() => {
  createWindow()
})

