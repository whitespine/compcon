import { Capacitor } from '@capacitor/core'

const PLATFORM = Capacitor.platform
const platformNotSupportedMessage = `ERROR - PLATFORM NOT SUPPORTED: "${PLATFORM}" `

let electron: typeof import('electron')
if (PLATFORM == 'electron') {
  electron = require('electron')
}

const saveFile = function(filename: string, data: BlobPart, label = 'Save') {
  switch (PLATFORM) {
    case 'web':
      const blob = new Blob([data])
      if (window.navigator.msSaveOrOpenBlob(blob)) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        const elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = filename
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
      }
      return
    case 'electron':
      const { dialog } = electron.remote
      dialog.showSaveDialog({
        defaultPath: filename,
        buttonLabel: label,
      })
      return
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

export { saveFile }
