/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { CCDataStore, PilotManagementStore, NpcStore, EncounterStore, MissionStore, CompendiumStore, UserProfileStore } from 'compcon_data'

// We take these in to mutate the store
export type StoreMutation = (v: CCDataStore) => void;

const MANIP_DATA = "ManipData";
const TOUCH_DATA = "TouchData";

@Module({
  name: 'nav',
})
export class CCDSInterface extends VuexModule { // Short for comp-con data store interface
  private _data!: CCDataStore;

  get Data(): CCDataStore {
    return this._data;
  }

  @Mutation
  initCCLayer(data_store: CCDataStore) {
    if(!this._data) {
      this._data = data_store;
    } else {
      throw new Error("Double init of CC data layer.");
    }
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
    return this._data.npc;
  }

  public get encounters(): EncounterStore {
    return this._data.encounter;
  }

  public get mission(): MissionStore {
    return this._data.mission;
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