const { ipcRenderer } = require('electron')

window.addEventListener('message', ({data}) => {
  ipcRenderer.send(data.type, data.data);
});

ipcRenderer.on('save-done', (_, data) => {
  window.postMessage({type: 'save-done', ...data})
})