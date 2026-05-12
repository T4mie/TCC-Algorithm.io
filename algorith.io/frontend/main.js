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

function createChildWindow() {

    if (childWindow) {
        childWindow.focus();
        return;
    }

    childWindow = new BrowserWindow({
        width: 600,
        height: 400,

        parent: win, // define como filha
    });

    childWindow.loadFile('frontend/index.html', {
        hash: '/codeview'
    });

    childWindow.on('closed', () => {
        childWindow = null;
    });
}

ipcMain.on('open-child-window', () => {

    createChildWindow();

});

app.whenReady().then(() => {
  createWindow()
})

