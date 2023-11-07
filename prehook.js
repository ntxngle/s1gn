const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
  toMain: (args) => {
    ipcRenderer.invoke('toMain', args)
  }
});