<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="features" no-filter>
      NPC Features
    </compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcFeature } from 'compcon_data'
import { CCDSInterface } from '../../../io/ccdata_store'

@Component({
  components: { CompendiumBrowser },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Feature', align: 'left', value: 'Name' },
    { text: 'Type', align: 'left', value: 'FeatureType' },
    { text: 'Class', align: 'left', value: 'OriginClass' },
    { text: 'Set', align: 'left', value: 'OriginSet' },
  ]

  private compendium = getModule(CCDSInterface, this.$store).compendium
  public get features(): NpcFeature[] {
    return this.compendium.getItemCollection("NpcFeatures");
  }
}
</script>
