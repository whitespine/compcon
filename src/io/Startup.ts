// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import { getModule } from 'vuex-module-decorators'
import { ensureDataDir } from './Data'
import { PersistentStore, set_logger, setup_store, CCDataStore, set_is_web, setup_image_shim } from "compcon_data";
import { addImage, getImagePath, getImagePaths, removeImage, validateImageFolders } from './ImageManagement';
import { Capacitor } from '@capacitor/core';
import { saveData, loadData } from './Data';
import ExtLog from './ExtLog';


export default async function(): Promise<void> {
  // Make sure data files can be accessed
  ensureDataDir()
  validateImageFolders()

  // Define what context we'll be working in
  const PLATFORM = Capacitor.platform
  const isWeb = PLATFORM === 'web'

  // Setup compcon logger beforehand so we can see if things break
  set_logger((...data) => ExtLog(data.join("")));



  // Tell CC data the platform. TODO: This is dumb - we should instead give it a more robust image resolution shim instead of having CC data figure it out. CC data should not care
  set_is_web(isWeb);

  // Actually set the hooks. TODO: Same as above - this is wacky
  setup_image_shim( {
      addImage: addImage,
      getImagePath: getImagePath,
      getImagePaths: getImagePaths,
      removeImage: removeImage,
      validateImageFolders: validateImageFolders
  });

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