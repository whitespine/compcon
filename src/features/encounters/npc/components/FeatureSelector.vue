<template>
  <div>
    <cc-selector-table
      :items="availableFeatures"
      :headers="headers"
      no-filter
      item-type-fallback="NpcFeature"
      @equip="$emit('equip', $event)"
    >
      <div slot="extra-item" class="mt-2">
        <v-switch v-model="showAll" dense inset hide-details color="warning" class="mr-3">
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="showAll ? 'Showing all features' : 'Showing available features'"
          >
            <v-icon
              class="ml-n2"
              :color="showAll ? 'warning' : 'success'"
              v-html="showAll ? 'mdi-lock-open' : 'mdi-lock'"
            />
          </cc-tooltip>
        </v-switch>
        <v-switch v-model="showDupe" dense inset hide-details color="warning" class="mr-3 mt-n1">
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="showDupe ? 'Showing installed features' : 'Hiding installed features'"
          >
            <v-icon
              class="ml-n2"
              :color="showDupe ? 'warning' : 'success'"
              v-html="showDupe ? 'mdi-hexagon-multiple-outline' : 'mdi-hexagon-multiple'"
            />
          </cc-tooltip>
        </v-switch>
      </div>
    </cc-selector-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { NpcFeature, Npc } from 'compcon_data'
import { CCDSInterface } from '../../../../io/ccdata_store'

export default Vue.extend({
  name: 'npc-freature-selector',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: 'Name', align: 'left', value: 'Name' },
      { text: 'Type', align: 'left', value: 'FeatureType' },
      { text: 'Class', align: 'left', value: 'OriginClass' },
      { text: 'Set', align: 'left', value: 'OriginSet' },
      { text: '', align: 'center', value: 'Detail' },
    ],
    showAll: false,
    showDupe: false,
  }),
  computed: {
    availableFeatures(): NpcFeature[] {
      let tnpc = this.npc as Npc;
      let i = []
      if (this.showAll) i = this.features
      else {
        const templateFeatures = tnpc.Templates.flatMap(x => x.OptionalFeatures)
        i = templateFeatures.concat(tnpc.Class.OptionalFeatures)
      }
      if (!this.showDupe) i = i.filter(x => !tnpc.SelectedFeatures.some(y => y.ID === x.ID))
      else {
        const tempBaseFeats = tnpc.Templates.flatMap(x => x.BaseFeatures)
        i = i.concat(tnpc.Class.BaseFeatures).concat(tempBaseFeats)
      }
      return i
    },
    features(): NpcFeature[] {
      return getModule(CCDSInterface, this.$store).compendium.getItemCollection("NpcFeatures")
    }
  }
})
</script>
