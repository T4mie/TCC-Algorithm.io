const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

    openChildWindow: (type) => {
        ipcRenderer.send('open-child-window', type);
    }

});