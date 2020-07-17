<template>
  <cc-major-btn
    icon="mdi-account-card-details"
    color="secondary"
    name="File Import"
    small
    @clicked="dialog = true"
  >
    <import-dialog
      v-model="dialog"
      :pilot="importPilot"
      :error="error"
      @cancel="cancelImport"
      @confirm="stageImport"
    >
      <v-file-input
        v-model="fileValue"
        accept="text/json"
        dark
        outlined
        autofocus
        placeholder="Select Pilot Data File"
        label="UND IDENT RECORD"
        prepend-icon="mdi-paperclip"
        @change="importFile"
      />
    </import-dialog>
    <v-dialog v-model="missingContentWarning">
      <v-card>
        <v-card-text class="text-center">
          <br />
          <p class="heading h3 accent--text">
            WARNING: The imported Pilot requires the following content packs that are not currently
            installed:
          </p>
          <p class="effect-text text-center" v-html="missingContent" />
          <p class="text--text">
            This Pilot cannot be imported until the missing content packs are installed and
            activated.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="reset">Abort Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </cc-major-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, IPilotData } from  'compcon_data'
import { importData } from '@/io/Data'
import { getModule } from 'vuex-module-decorators'
import ImportDialog from './ImportDialog.vue'
import { CCDSInterface } from '../../../../../io/ccdata_store'

export default Vue.extend({
  name: 'file-import',
  components: { ImportDialog },
  data: () => ({
    dialog: false,
    // fileValue is just used to clear the file input
    fileValue: null,
    importPilot: null as null | Pilot,
    error: null,
    missingContentWarning: false,
    missingContent: '',
  }),
  watch: {
    dialog(dialogOpen) {
      if (!dialogOpen) this.reset()
    },
  },
  methods: {
    reset() {
      this.fileValue = null
      this.importPilot = null
      this.error = null
      this.missingContentWarning = false
    },
    async importFile(file: File) {
      this.reset()
      if (!file) return
      try {
        const pilotData = await importData<IPilotData>(file)
        if (!pilotData.brews) pilotData.brews = []
        const installedPacks = getModule(CCDSInterface, this.$store).compendium.ContentPacks.map(
          x => `${x.Name} @ ${x.Version}`
        )
        const missingPacks = _.pullAll(pilotData.brews, installedPacks)
        if (missingPacks.length) {
          this.missingContent = missingPacks.join('<br />')
          this.missingContentWarning = true
        }
        this.importPilot = Pilot.Deserialize(pilotData)
        this.importPilot.SetBrewForce(pilotData.brews)
        this.importPilot.RenewID()
      } catch (e) {
        this.error = e.message
        return
      }
    },
    stageImport() {
      if (!this.importPilot) { return; }
      const installedPacks = getModule(CCDSInterface, this.$store).compendium.ContentPacks.map(x => x.Name)
      const missingPacks = this.$_.without(this.importPilot.Brews, installedPacks)
      if (!missingPacks.length) this.confirmImport()
      else {
        this.missingContent = missingPacks.join('<br />')
        this.missingContentWarning = true
      }
    },
    confirmImport() {
      if (!this.importPilot) { return; }
      this.importPilot.RenewID()
      getModule(CCDSInterface, this.$store).mut(s => s.pilots.addPilot(this.importPilot!));
      this.reset()
      this.dialog = false
      this.$emit('done')
    },
    cancelImport() {
      this.reset()
      this.dialog = false
    },
  },
})
</script>

<style scoped>
#panel {
  border: 5px double var(--v-panel-border-base) !important;
  border-radius: 2px !important;
}
</style>
