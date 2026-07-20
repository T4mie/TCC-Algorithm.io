const { contextBridge, ipcRenderer } = require('electron');

// A API exposta no preload define um contrato seguro entre renderer e main.
// Todos os métodos são protegidos por contextIsolation e não expõem o Node.js diretamente.
contextBridge.exposeInMainWorld('electronAPI', {

    // Abre a janela de visualização de código passando o tipo e o passo atual.
    openChildWindow: (type, currentStep = -1) => {
        ipcRenderer.send('open-child-window', { type, currentStep });
    },

    // Envia atualizações de passo do renderer principal para a janela filha.
    updateChildStep: (step) => {
        ipcRenderer.send('update-child-step', { step });
    },

    // Registra um callback para receber atualizações de passo na janela filha.
    onChildStep: (callback) => {
        ipcRenderer.on('child-step-updated', (event, payload) => {
            try {
                callback(payload);
            } catch (e) {
                // callback errors são capturados para não quebrar o renderer.
            }
        });
    },

    // Remove um callback previamente registrado para evitar múltiplas assinaturas.
    removeChildStep: (callback) => {
        ipcRenderer.removeListener('child-step-updated', callback);
    }

});