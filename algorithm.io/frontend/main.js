const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let childWindow;

// Cria a janela principal da aplicação Electron.
const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('frontend/index.html');
};

// Cria (ou reaproveita) a janela filha de visualização de código.
// Se a janela já existir, apenas a foca e envia o passo atual em vez de recriá-la.
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

// Handler IPC: recebe do renderer o pedido para abrir a janela de código
// (disparado pelo botão "Ver Código"), repassando o tipo de estrutura e o passo atual.
ipcMain.on('open-child-window', (event, payload) => {
  // payload esperado no formato { type, currentStep }
  const type = payload && payload.type ? payload.type : undefined;
  const currentStep = payload && typeof payload.currentStep !== 'undefined' ? payload.currentStep : -1;
  createChildWindow(type, currentStep);
});

// Handler IPC: encaminha atualizações de passo da janela principal para a
// janela filha (se estiver aberta), mantendo o CodeView sincronizado ao vivo.
ipcMain.on('update-child-step', (event, payload) => {
  if (!childWindow) return;
  try {
    childWindow.webContents.send('child-step-updated', payload);
  } catch (e) {
    console.warn('Failed to forward step update to child window', e);
  }
});

// Inicializa a janela principal assim que o Electron estiver pronto.
app.whenReady().then(() => {
  createWindow();
});
