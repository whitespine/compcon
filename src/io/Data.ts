import { Capacitor } from '@capacitor/core'
import path from 'path'
import PromisifyFileReader from 'promisify-file-reader'

import ExtLog from './ExtLog'

const PLATFORM = Capacitor.platform
const platformNotSupportedMessage = `ERROR - PLATFORM NOT SUPPORTED: "${PLATFORM}" `

// variables used by electron
let fs: typeof import('fs')
let electron: typeof import('electron')
let userDataPath: string

if (PLATFORM == 'electron') {
  fs = require('fs')
  electron = require('electron')
  userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'data')
}

const ensureDataDir = function(): void {
  switch (PLATFORM) {
    case 'web':
      return
    case 'electron':
      const dataPathExists = fs.existsSync(userDataPath)
      if (!dataPathExists) {
        fs.mkdirSync(userDataPath)
        ExtLog(`Created user data directory at ${userDataPath}`)
      }
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const writeFile = function(name: string, data: string): void {
  switch (PLATFORM) {
    case 'web':
      localStorage.setItem(name, data)
      break
    case 'electron':
      fs.writeFileSync(path.resolve(userDataPath, name), data)
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const readFile = function(name: string): string {
  switch (PLATFORM) {
    case 'web':
      return localStorage.getItem(name)
    case 'electron':
      return fs.readFileSync(path.resolve(userDataPath, name), 'utf-8')
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const exists = function(name: string): boolean {
  switch (PLATFORM) {
    case 'web':
      return Boolean(localStorage.getItem(name))
    case 'electron':
      return fs.existsSync(path.resolve(userDataPath, name))
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const saveData = function<T>(fileName: string, data: T): void {
  return writeFile(fileName, JSON.stringify(data))
}

const loadData = function<T>(fileName: string): T[] {
  const fileExists =  exists(fileName)
  if (fileExists) {
    const dataText =  readFile(fileName)
    return (JSON.parse(dataText) || []) as T[]
  } else {
    return []
  }
}

const importData = async function<T>(file: File): Promise<T> {
  const text = await PromisifyFileReader.readAsText(file)
  return JSON.parse(text) as T
}

const dataPathMap = {
  web: 'localStorage',
  electron: userDataPath,
}

const USER_DATA_PATH = dataPathMap[PLATFORM]

export {
  ensureDataDir,
  writeFile,
  readFile,
  saveData,
  loadData,
  importData,
  exists,
  USER_DATA_PATH,
}
