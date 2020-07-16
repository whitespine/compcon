import { readFile, writeFile } from './Data'
// @ts-ignore
import PromisifyFileReader from 'promisify-file-reader'
import Extlog from './ExtLog'
import Startup, { PlatformPersistence } from './Startup'
import Vue from 'vue'
import { store } from '@/store'
import { FILE_KEYS } from 'compcon_data'



const files = Object.values(FILE_KEYS);


export async function exportV1Pilots(): Promise<string> {
  return (await readFile("pilots.json"))!
}

interface IBulkExport {
  filename: string
  data: string
}

export async function exportAll(): Promise<IBulkExport[]> {
  const promises = files.map(async file => {
    return {
      filename: file,
      data: await readFile(file)
    }
  });

  const res = await Promise.all(promises)
  return res.filter(b => b.data !== null) as IBulkExport[];
}

export async function importAll(file: string): Promise<void> {
  const text = await PromisifyFileReader.readAsText(file)
  const arr = JSON.parse(text)
  Extlog('Loading import data...')
  const promises = arr.map((o: IBulkExport) => writeFile(o.filename, o.data))
  await Promise.all(promises)
  Extlog('Import data loaded! Running startup...')
  Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion)
}

export async function clearAllData(): Promise<void> {
  Extlog('Erasing all COMP/CON data...')
  const promises = files.map(file => writeFile(file, ''))
  await Promise.all(promises)
  Extlog('All data erased! Running startup...')
  Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion)
}

