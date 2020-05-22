import path from 'path'
import { promisify } from 'util'
import extlog from './ExtLog'
import { Capacitor } from '@capacitor/core'

const PLATFORM = Capacitor.platform
const isWeb = PLATFORM === 'web'

let fs: typeof import('fs')
let electron: typeof import('electron')
let userDataPath: string

let exists
let mkdir
let readdir
let unlink
let copyFile
let stat

if (PLATFORM == 'electron') {
  fs = require('fs')
  electron = require('electron')
  console.log(electron.remote.app)
  console.log(electron.remote.app.getPath('userData'))
  userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'data')

  exists = promisify(fs.exists)
  mkdir = promisify(fs.mkdir)
  readdir = promisify(fs.readdir)
  unlink = promisify(fs.unlink)
  copyFile = promisify(fs.copyFile)
  stat = promisify(fs.stat)
}

const webImageTypes = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.bmp']

declare interface IImageInfo {
  filename: string
  artist: string
  contact?: string
  site?: string
  notes?: string
}

enum ImageTag {
  Pilot = 'pilot',
  NPC = 'npc',
  Enemy = 'enemy',
  Frame = 'frame',
  Mech = 'mech',
  Map = 'map',
  Location = 'location',
  Object = 'object',
  Logo = 'logo',
  Misc = 'misc',
}

function getImageDir(subdir: ImageTag, defaults?: boolean): string {
  // images are grabbed from /static/img on web, datapath on electron
  const root = isWeb ? '/static' : userDataPath
  if (defaults && !isWeb) return path.join(root, 'img', subdir)
  return path.join(root, 'img', subdir)
}

function getImagePath(subdir: ImageTag, fileName: string, defaults?: boolean): string {
  return path.join(getImageDir(subdir, defaults), fileName)
}

async function getImagePaths(subdir: ImageTag, defaults?: boolean): Promise<string[]> {
  if (isWeb) return
  const imageDir = getImageDir(subdir, defaults)
  const dirExists = await exists(imageDir)
  if (!dirExists) {
    extlog(`${defaults ? 'default' : ''} image subdir ${subdir} doesn't exist, creating...`)
    await mkdir(imageDir)
  }
  const dir = await readdir(imageDir)
  return dir.filter(x => webImageTypes.includes(path.extname(x).toLowerCase())) || []
}

async function copyDefaults(origin: string): Promise<void> {
  if (isWeb) return
  const defaultDirPath = path.join(__dirname, 'static', 'img', origin)
  if (!(await exists(defaultDirPath))) return
  const defaults = await readdir(defaultDirPath)
  const destinationDir = path.join(userDataPath, 'img', origin)
  const destinationDirExists = await exists(destinationDir)
  if (!destinationDirExists) {
    extlog(`${origin} default folder does not exist in user folder. Creating...`)
    await mkdir(destinationDir)
  }
  await Promise.all(
    defaults.map(async defaultImg => {
      const imagePath = path.join(destinationDir, defaultImg)
      const defaultPath = path.join(defaultDirPath, defaultImg)
      if (!(await exists(defaultPath))) return
      if (
        !(await exists(imagePath)) ||
        (await stat(imagePath)).size !== (await stat(defaultPath)).size
      ) {
        extlog(`${origin} default ${defaultImg} does not exist in user folder. Copying...`)
        const originPath = path.join(defaultDirPath, defaultImg)
        const destinationPath = path.join(destinationDir, defaultImg)
        await copyFile(originPath, destinationPath)
      }
    })
  )
}

async function validateImageFolders(): Promise<void> {
  if (isWeb) return
  const subdirs = Object.keys(ImageTag).map(k => ImageTag[k as string])

  const imgPath = path.join(userDataPath, 'img')
  const imgPathExists = await exists(imgPath)
  if (!imgPathExists) {
    extlog(`img subfolder doesn't exist, creating...(${imgPath})`)
    await mkdir(imgPath)
  }
  const defaultPath = path.join(userDataPath, 'img', 'default')
  const defaultsExist = await exists(defaultPath)
  if (!defaultsExist) {
    extlog(`default subfolder doesn't exist, creating...`)
    await mkdir(defaultPath)
  }
  Promise.all(
    subdirs.map(async subdir => {
      await copyDefaults(subdir)
    })
  )
}

async function addImage(subdir: ImageTag, imagePath: string): Promise<void> {
  if (isWeb) return
  const imageDir = getImageDir(subdir)
  const imgFilename = path.parse(imagePath).base
  await copyFile(imagePath, path.join(imageDir, imgFilename))
}

async function removeImage(subdir: ImageTag, filename: string): Promise<void> {
  const p = path.join(getImageDir(subdir), filename)
  if (await exists(p)) {
    await unlink(p)
  } else {
    extlog(`unable to delete image: file missing at ${p}`)
    return
  }
}

export { getImagePath, validateImageFolders, getImagePaths, addImage, removeImage, ImageTag }
