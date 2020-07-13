import { Capacitor } from '@capacitor/core'
import path from 'path'
import { promisify } from 'util'
import PromisifyFileReader from 'promisify-file-reader'

import ExtLog from './ExtLog'

const PLATFORM = Capacitor.platform || "web"; // If electron cannot self identify, then we're kinda sunk. But it's probably web
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

const writeFile = async function(name: string, data: string): Promise<void> {
  switch (PLATFORM) {
    case 'web':
      localStorage.setItem(name, data)
      break
    case 'electron':
      await promisify(fs.writeFile)(path.resolve(userDataPath, name), data)
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const readFile = async function(name: string): Promise<string | null> {
  switch (PLATFORM) {
    case 'web':
      return localStorage.getItem(name)
    case 'electron':
      return await promisify(fs.readFile)(path.resolve(userDataPath, name), 'utf-8')
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const exists = async function(name: string): Promise<boolean> {
  switch (PLATFORM) {
    case 'web':
      return Boolean(localStorage.getItem(name))
    case 'electron':
      return await promisify(fs.exists)(path.resolve(userDataPath, name))
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const saveData = async function<T>(fileName: string, data: T): Promise<void> {
  return writeFile(fileName, JSON.stringify(data))
}

const loadData = async function<T>(fileName: string): Promise<T | null> {
  const fileExists = await exists(fileName)
  if (fileExists) {
    const dataText = await readFile(fileName)
    return (JSON.parse(dataText) as T) || null;
  } else {
    return null;
  }
}

const importData = async function<T>(file: File): Promise<T> {
  const text = await PromisifyFileReader.readAsText(file)
  return JSON.parse(text) as T
}

function dataPathMap(platform: string): string {
  if(platform === "web") {
    return "localStorage";
  } else {
    // We know this was set because it would have been in the other non-web code above
    return userDataPath!; 
  }
}

const USER_DATA_PATH = dataPathMap(PLATFORM);

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
