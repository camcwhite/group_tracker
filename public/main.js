const { app, BrowserWindow, ipcMain, session, shell, dialog } = require('electron')
const Store = require('electron-store')

const fs = require('fs')
const path = require('path')
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

const dateOptions = {
  timeZone: 'US/Eastern',
  day: 'numeric',
  year: 'numeric',
  month: 'long',
}

const timeOptions = {
  timeZone: 'US/Eastern',
  hour: 'numeric',
  minute: '2-digit',
}

const getFormattedDate = (date) => {
  return date.toLocaleDateString('en-US', dateOptions);
}

const getFormattedTime = (date) => {
  return date.toLocaleTimeString('en-US', dateOptions);
}

ipcMain.on('savePDF', async (event, { title, mainText, groups, attendees }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
    title: 'Save PDF Report',
    defaultPath: path.join(app.getAppPath(), 'report.pdf'),
    filters: [{ name: 'PDF (.pdf)', extensions: ['pdf'] }]
  })
  if (!canceled) {
    const doc = new PDFDocument()
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.lineGap(4)
    const listOptions = {
      bulletRadius: 1.5,
      textIndent: 6,
    }

    doc.fontSize(14)
    doc.text(title, { align: 'center' })
    doc.moveDown()

    doc.fontSize(10)
    mainText.forEach(line => doc.text(line))
    doc.moveDown()
    doc.fontSize(14)
    doc.text('Groups', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10)
    doc.list(groups, listOptions)
    doc.moveDown()

    doc.fontSize(14)
    doc.text('Attendees', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10)
    doc.list(attendees, listOptions)

    doc.end()
    event.reply('save-done', { status: 'ok' })
  }
})

ipcMain.on('saveTXT', async (event, { title, mainText, groups, attendees }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
    title: 'Save TXT Report',
    defaultPath: path.join(app.getAppPath(), 'report.txt'),
    filters: [{ name: 'Text File (.txt, .text)', extensions: ['txt', 'text'] }]
  })
  if (!canceled) {
    let content = title + '\n' + mainText.join('\n') + '\n'
    content += '\nGroups:\n' + groups.map(([name, lines]) => `\t${name}\n${lines.map(line => `\t\t${line}`).join('\n')}`).join('\n') + '\n'
    content += '\nAttendees:\n' + attendees.map(line => `\t${line}`).join('\n')

    fs.writeFile(filePath, content, err => {
      if (err) {
        event.reply('save-done', { status: 'error', error: err })
      }
      else {
        event.reply('save-done', { status: 'ok' })
      }
    })
  }
})

ipcMain.on('saveCSV', async (event, lines) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
    title: 'Save CSV Data',
    defaultPath: path.join(app.getAppPath(), 'report.csv'),
    filters: [{ name: 'CSV File (.csv)', extensions: ['csv'] }]
  })
  if (!canceled) {
    let content = lines.join('\n')

    fs.writeFile(filePath, content, err => {
      if (err) {
        event.reply('save-done', { status: 'error', error: err })
      }
      else {
        event.reply('save-done', { status: 'ok' })
      }
    })
  }
})

ipcMain.on('upload-legacy-data', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: 'Upload Legacy Data File',
    defaultPath: app.getAppPath(),
    filters: [{ name: 'Legacy Data File (.json)', extensions: ['json'] }],
    buttonLabel: 'Upload',
    properties: ['openFile'],
  })
  if (!canceled && filePaths.length >= 1) {
    fs.readFile(filePaths[0], (err, data) => {
      if (err) {
        event.reply('upload-done', { status: 'error', error: err })
      }
      else {
        const upload_data = JSON.parse(data);
        event.reply('upload-done', { status: 'ok', data: upload_data, legacy: true })
      }
    })
  }
})

ipcMain.on('upload-data', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: 'Upload Data File',
    defaultPath: app.getAppPath(),
    filters: [{ name: 'Data File (.json)', extensions: ['json'] }],
    buttonLabel: 'Upload',
    properties: ['openFile'],
  })
  if (!canceled && filePaths.length >= 1) {
    fs.readFile(filePaths[0], (err, data) => {
      if (err) {
        event.reply('upload-done', { status: 'error', error: err })
      }
      else {
        const upload_data = JSON.parse(data);
        event.reply('upload-done', { status: 'ok', data: upload_data })
      }
    })
  }
})

ipcMain.on('export-data', async (event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
    title: 'Export Data File',
    defaultPath: app.getAppPath(),
    filters: [{ name: 'Data File (.json)', extensions: ['json'] }],
    buttonLabel: 'Save',
  })
  if (!canceled || filePaths.length < 1) {
    fs.writeFile(filePath, JSON.stringify(data), err => {
      if (err) {
        event.reply('export-done', { status: 'error', error: err })
      }
      else {
        event.reply('export-done', { status: 'ok' })
      }
    })
  }
})