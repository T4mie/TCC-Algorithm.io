const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      contextIsolation: false, // simplificação pra teste
      nodeIntegration: true
    }
  })

  win.loadFile('frontend/index.html')
}

app.whenReady().then(() => {
  createWindow()
})