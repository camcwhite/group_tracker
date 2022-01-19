const { ipcRenderer } = require('electron')

window.addEventListener('message', ({data}) => {
  ipcRenderer.send(data.type, data.data);
});

const sendReply = (type, data) => window.postMessage({type, ...data})

ipcRenderer.on('save-done', (_, data) => {
  sendReply('save-done', data)
})

ipcRenderer.on('upload-done', (_, data) => {
  sendReply('upload-done', data)
})

ipcRenderer.on('export-done', (_, data) => {
  sendReply('export-done', data)
})