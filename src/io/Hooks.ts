import {hooks, Pilot} from "compcon_data";
import Vue from 'vue';
import { addImage, getImagePath, getImagePaths, removeImage, validateImageFolders } from './ImageManagement';
import { store } from '@/store';
import { UserProfile } from './User';
import { Capacitor } from '@capacitor/core';


export function setup_hooks() {
    // Gives the data package access to browser/ui hooks, where necessary
    const PLATFORM = Capacitor.platform
    const isWeb = PLATFORM === 'web'

    // These are easy
    hooks.set_is_web(isWeb);
    hooks.setup_vue_shim(Vue.set);

    // These are medium
    hooks.setup_image_shim( {
        addImage: addImage,
        getImagePath: getImagePath,
        getImagePaths: getImagePaths,
        removeImage: removeImage,
        validateImageFolders: validateImageFolders
    });
    hooks.setup_store_shim(new MyStoreShim());
}

class MyStoreShim implements hooks.StoreShim {
    addPilot(newPilot: Pilot) {
      store.dispatch('addPilot', newPilot)
    }
    
    getItemCollection(category: string) {
        return store.getters.getItemCollection(category);
    }

    getUserProfile(): UserProfile {
        return store.getters.getUserProfile;
    }

    get getVersion(): string {
        return store.getters.getVersion;
    }

    instantiate(category: string, data: any) {
        return store.getters.instantiate(category, data);
    }

    referenceByID(category: string, id: string) {
        return store.getters.referenceByID(category, id);
    }

    saveEncounterData() {
        store.dispatch('encounter/saveEncounterData')
    }

    saveMissionData() {
        store.dispatch('mission/saveMissionData')
    }

    saveActiveMissionData() {
        store.dispatch('mission/saveActiveMissionData')
    }

    saveNpcData() {
        store.dispatch('npc/saveNpcData')
    }

    save() {
        store.dispatch('saveData')
    }
}
