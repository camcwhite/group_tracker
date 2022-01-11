const { ipcRenderer } = require('electron')

window.addEventListener('message', event => {
  if (event.data === 'quitApp') {
    ipcRenderer.send('quit')
  }
})
