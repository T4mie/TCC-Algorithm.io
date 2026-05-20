const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

    // now accepts optional currentStep to open the child with a preselected step
    openChildWindow: (type, currentStep = -1) => {
        ipcRenderer.send('open-child-window', { type, currentStep });
    }

    ,

    // send live step updates from parent renderer to main (which will forward to child)
    updateChildStep: (step) => {
        ipcRenderer.send('update-child-step', { step });
    },

    // register a callback to receive step updates in the child renderer
    onChildStep: (callback) => {
        ipcRenderer.on('child-step-updated', (event, payload) => {
            try {
                callback(payload);
            } catch (e) {
                // swallow errors from callback
            }
        });
    }

});