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

function createChildWindow(type) {

    if (childWindow) {
        childWindow.focus();
        return;
    }

    childWindow = new BrowserWindow({
        width: 600,
        height: 400,

        parent: win, // define como filha
    });

    const hash = type ? `/codeview?type=${type}` : '/codeview';

    childWindow.loadFile('frontend/index.html', {
        hash
    });

    childWindow.on('closed', () => {
        childWindow = null;
    });
}

ipcMain.on('open-child-window', (event, type) => {

    // support an optional type (e.g. 'vector' or 'sll') to pre-select behavior in the child
    createChildWindow(type);

});

app.whenReady().then(() => {
  createWindow()
})

