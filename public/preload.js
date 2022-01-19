const { ipcRenderer } = require('electron')

window.addEventListener('message', ({data}) => {
  ipcRenderer.send(data.type, data.data);
});

ipcRenderer.on('save-done', (data) => {
  console.log('save-done ...')
  window.postMessage({type: 'save-done', data: data})
})