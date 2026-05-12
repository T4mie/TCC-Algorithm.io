const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

    openChildWindow: () => {
        ipcRenderer.send('open-child-window');
    }

});