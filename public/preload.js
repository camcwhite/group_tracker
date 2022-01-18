const { ipcRenderer } = require('electron')

// const store = new Store()

window.addEventListener('message', event => {
  if (event.data.type === 'quitApp') {
    ipcRenderer.send('quit')
  }
  // else if (event.data.type === 'store-set') {
  //   store.set(event.data.data.key, event.data.data.value)
  //   window.postMessage({
  //     type: 'store-fulfill-set', 
  //     data: { ok: true }
  //   })
  // }
  // else if (event.data.type === 'store-get') {
  //   console.log('getting...');
  //   window.postMessage({
  //     type: 'store-fulfill-get', 
  //     data: store.get(event.data.key)
  //   })
  // }
})
