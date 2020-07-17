/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { CCDataStore, PilotManagementStore, NpcStore, EncounterStore, MissionStore, CompendiumStore, UserProfileStore, PersistentStore, setup_store } from 'compcon_data'
import { saveData, loadData } from './Data';

// We take these in to mutate the store
export type StoreMutation = (v: CCDataStore) => void;

const MANIP_DATA = "ManipData";
const TOUCH_DATA = "TouchData";

class PlatformPersistence extends PersistentStore {
    // Tracks touched files. Useful for export
    public used_keys: Set<string> = new Set();

    private to_fname(name: string) {
        // return name + ".json";
        return name;
    }

    async set_item(key: string, val: any): Promise<void> {
        key = this.to_fname(key);
        this.used_keys.add(key);
        await saveData(key, val);
    }

    async get_item(key: string): Promise<any> {
        key = this.to_fname(key);
        this.used_keys.add(key);
        let val = await loadData(key);
        return val
    }
}

@Module({
  name: 'nav',
})
export class CCDSInterface extends VuexModule { // Short for comp-con data store interface
  private _data: CCDataStore = (() => {
    let store = new CCDataStore(new PlatformPersistence());
    setup_store(store);
    return store;
  })();

  // Getter access
  get Data(): CCDataStore {
    return this._data;
  }
  
  @Mutation
  private [MANIP_DATA](mut: StoreMutation) {
    mut(this._data);
  }

  /// Trigger vue mutation
  @Mutation
  private [TOUCH_DATA]() {
    let x = this._data;
    this._data = x || null; // no-op
  }

  @Action
  public mut(payload: StoreMutation): void {
    this.context.commit(MANIP_DATA, payload);
  }


  // Call this to propagate any changes made outside of the normal mutation process (e.g. model changes). Try to avoid honestly
  @Action
  public refreshStore(): void {
    this.context.commit(TOUCH_DATA);
  }

  // Quick access getters/mutators
  public get pilots(): PilotManagementStore {
    return this._data.pilots;
  }

  public get npcs(): NpcStore {
    return this._data.npcs;
  }

  public get encounters(): EncounterStore {
    return this._data.encounters;
  }

  public get missions(): MissionStore {
    return this._data.missions;
  }

  public get compendium(): CompendiumStore {
    return this._data.compendium;
  }

  public get user(): UserProfileStore {
    return this._data.user;
  }

  // public Errors: IErrorReport[] = []

  /*
  @Mutation
  public [LOG_ERROR](error: IErrorReport) {
    this.Errors = [error, ...this.Errors]
  }

  @Action({ commit: LOG_ERROR })
  public logError(error: IErrorReport) {
    return error
  }
  */
}
