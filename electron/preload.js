const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Get settings
  getSettings: () => ipcRenderer.invoke('get-settings'),

  // save settings
  setSettings: settings => ipcRenderer.invoke('set-settings', settings),

  //Restart window (used to switch border mode)
  restartWindow: () => ipcRenderer.invoke('restart-window'),

  //Exit the application
  quitApp: () => ipcRenderer.invoke('quit-app')
})