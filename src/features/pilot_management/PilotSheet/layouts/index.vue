<template>
  <div>
    <tabbed-layout v-if="profile.PilotSheetView === 'tabbed'" :page="tab" :pilot="pilot" />
    <classic-layout v-else-if="profile.PilotSheetView === 'classic'" :page="tab" :pilot="pilot" />
    <pilot-nav :pilot="pilot" :selected="tab" @set-layout="profile.PilotSheetView = $event" />
  </div>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { Pilot, UserProfileStore } from 'compcon_data'
import TabbedLayout from './Tabbed.vue'
import ClassicLayout from './Classic.vue'
import PilotNav from '../components/PilotNav.vue'

import Vue from 'vue'
import { CCDSInterface } from '../../../../io/ccdata_store'
export default Vue.extend({
  name: 'pilot-sheet-content',
  components: { PilotNav, TabbedLayout, ClassicLayout },
  props: {
    tab: {
      type: String,
      required: true,
    },
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    page: 2,
  }),
  computed: {
    pilot(): Pilot {
      return getModule(CCDSInterface, this.$store).pilots.findByID(this.pilotID);
    },
    profile(): UserProfileStore {
      return getModule(CCDSInterface, this.$store).user
    },
  },
  watch: {
    tab() {
      this.page = this.tab
    },
    layout() {
      this.page = 0
    },
  },
})
</script>
