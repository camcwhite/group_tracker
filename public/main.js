const { app, BrowserWindow, ipcMain, session, shell, dialog } = require('electron')
const Store = require('electron-store')

const fs = require('fs')
const PDFDocument = require('pdfkit')

Store.initRenderer()

require('@electron/remote/main').initialize()

let browserWindow;

function createWindow() {
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: `${__dirname}/preload.js`,
    },
  })
  browserWindow.maximize()
  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  });
  browserWindow.loadURL('http://localhost:3000')
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

ipcMain.on('quitApp', () => app.quit())

ipcMain.on('savePDF', async (_, args) => {
  const report = args[0];
  const doc = new PDFDocument()
  const {canceled, filePath} = await dialog.showSaveDialog(browserWindow, {
    title: 'Save PDF Report',
    defaultPath: app.getAppPath(),
  }) 
  if (!canceled) {
    const stream = fs.createWriteStream(filePath)  
    doc.pipe(stream)
    doc.text("Hello World", 100, 100)
    doc.end()
  }
})