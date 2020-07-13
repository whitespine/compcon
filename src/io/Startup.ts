// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import { getModule } from 'vuex-module-decorators'
import { ensureDataDir } from './Data'
import { CCDataInterface } from './ccdata_store'
import {hooks, PersistentStore } from "compcon_data";
import { addImage, getImagePath, getImagePaths, removeImage, validateImageFolders } from './ImageManagement';
import { Capacitor } from '@capacitor/core';
import { saveData, loadData } from './Data';
import ExtLog from './ExtLog';


export default async function(lancerVer: string, ccVer: string): Promise<hooks.StoreInterfaces.Store> {
  // Make sure data files can be accessed
  ensureDataDir()
  validateImageFolders()

  // Define what context we'll be working in
  const PLATFORM = Capacitor.platform
  const isWeb = PLATFORM === 'web'

  // Setup logger beforehand so we can see if things break
  hooks.set_logger((...data) => ExtLog(data.join("")));

  // Create a store before doing anything else
  const pers = new PlatformPersistence();
  const cc_store = new hooks.StoreInterfaces.Store(pers);
  hooks.setup_store_shim(cc_store); // We must do this prior to doing load_all, otherwise any CC-data internal hooks calls will break. This will fail very noisily
  await cc_store.load_all();

  // Tell the store versions
  cc_store.setVersions(lancerVer, ccVer); 

  // Tell CC data the platform. TODO: This is dumb as hell - we should instead give it a more robust image resolution shim instead of having CC data figure it out. CC data should not care
  hooks.set_is_web(isWeb);

  // Actually set the hooks
  hooks.setup_image_shim( {
      addImage: addImage,
      getImagePath: getImagePath,
      getImagePaths: getImagePaths,
      removeImage: removeImage,
      validateImageFolders: validateImageFolders
  });

  return cc_store;

  // const pilotStore = getModule(PilotManagementStore, store)
  // pilotStore.loadPilots()

  // const npcStore = getModule(NpcStore, store)
  // npcStore.loadNpcs()

  // const encounterStore = getModule(EncounterStore, store)
  // encounterStore.loadEncounters()

  // const missionStore = getModule(MissionStore, store)
  // missionStore.loadMissions()
  // missionStore.loadActiveMissions()

  // TODO: In browser, save active pilot & mech IDs, reconstitute them here
  // TODO: Move GM toolkit data loading here
}


// Provide compcon data layer bindings for storing/loading data
export class PlatformPersistence extends PersistentStore {
    // Tracks touched files. Useful for export
    public used_keys: Set<string> = new Set();

    private to_fname(name: string) {
        return name + ".json";
    }

    async set_item(key: string, val: any): Promise<void> {
        key = this.to_fname(key);
        this.used_keys.add(key);
        await saveData(key, val);
    }

    async get_item(key: string): Promise<any> {
        key = this.to_fname(key);
        this.used_keys.add(key);
        return loadData(key);
    }
}