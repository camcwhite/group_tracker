const { getCurrentWindow } = require('@electron/remote')
const { app } = require('electron')
const { ipcRenderer } = require('electron')
console.log('preloading');

window.addEventListener('message', event => {
  if (event.data === 'quitApp') {
    ipcRenderer.send('quit')
  }
})
