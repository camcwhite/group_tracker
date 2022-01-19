const { ipcRenderer } = require('electron')

window.addEventListener('message', ({data}) => {
  ipcRenderer.send(data.type, data.data);
});