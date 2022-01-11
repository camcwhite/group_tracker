const { getBrowserWindow } = require('@electron/remote')

window.quitApp = () => getBrowserWindow().quit()
