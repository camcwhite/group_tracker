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

ipcMain.on('savePDF', async (_, { title, mainText, groups, attendees }) => {
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
  }
})

ipcMain.on('saveTXT', async (_, { title, mainText, groups, attendees }) => {
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
        console.error(err)
      }
    })
  }
})