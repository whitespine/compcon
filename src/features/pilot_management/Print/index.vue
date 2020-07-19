<template>
  <v-card
    tile
    flat
    light
    class="printable"
    style="width: 210mm; margin-left:auto; margin-right: auto;"
  >
    <div class="no-print" style="min-height: 48px!important" />
    <blank-pilot-print v-if="blank" />
    <pilot-print v-else-if="pilot" :pilot="pilot" />
    <div style="page-break-before: always;" />
    <blank-mech-print v-if="blank" />
    <mech-print v-else-if="mech" :mech="mech" />
    <print-footer />
    <div class="no-print" style="min-height: 60px!important" />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import BlankPilotPrint from './BlankPilotPrint.vue'
import PilotPrint from './PilotPrint.vue'
import BlankMechPrint from './BlankMechPrint.vue'
import MechPrint from './MechPrint.vue'
import PrintFooter from './PrintFooter.vue'
import { getModule } from 'vuex-module-decorators'
import { Pilot, Mech } from 'compcon_data'
import { CCDSInterface } from '../../../io/ccdata_store'

export default Vue.extend({
  name: 'combined-print',
  components: { BlankPilotPrint, PilotPrint, BlankMechPrint, MechPrint, PrintFooter },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    pilot: null as Pilot | null,
    mech: null as Mech | null,
    blank: false,
  }),
  computed: {
    blank(): boolean {
      if (this.pilotID === 'blank') {
        return true;
      }
      let pilot = getModule(CCDSInterface, this.$store).pilots.getPilot(this.pilotID) || null;
      if(!pilot) {
        return true;
      }
      return false;
    },
    pilot(): Pilot | null {
      return getModule(CCDSInterface, this.$store).pilots.getPilot(this.pilotID) || null;
    },
    mech(): Mech | null {
      if(this.pilot && this.mechID) {
        return this.pilot.Mechs.find(m => m.ID === this.mechID) || null;
      }
      return null;
    }
  }
})
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.printable {
  background-color: white !important;
}

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    max-height: 100%;
    max-width: 210mm !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white;
  }

  .printable {
    /* zoom: 75%; */
    margin: 0 !important;
    padding: 0 !important;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .caption {
    line-height: normal;
  }
  fieldset {
    padding: 0px;
    border-style: solid;
  }
}
</style>
