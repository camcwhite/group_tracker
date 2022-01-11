const { app, BrowserWindow, ipcMain } = require('electron')

const { session } = require('electron')

require('@electron/remote/main').initialize()

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      // nodeIntegration: true,
      // contextIsolation: false,
      preload: `${__dirname}/preload.js`,
    },
  })
  win.maximize()
  win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self'"]
      }
    })
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

console.log('in main');
ipcMain.on('quit', () => app.quit());
