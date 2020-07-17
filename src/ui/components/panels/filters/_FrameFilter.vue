<template>
  <v-row justify-space-around class="mx-4">
    <v-col cols="4">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="mdi-factory"
        outlined
        label="From Manufacturer"
        :items="manufacturers"
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="typeFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-frame"
        chips
        deletable-chips
        outlined
        label="Role"
        :items="mechTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="mountFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-weapon"
        chips
        deletable-chips
        outlined
        label="Has Mount"
        :items="mountTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { MechType, MountType, Manufacturer } from  'compcon_data'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '../../../../io/ccdata_store'

type FilterOption = {text: string, value: string};
const nameSort = function(a: FilterOption, b: FilterOption) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: '',
    typeFilter: [] as MechType[],
    mountFilter: [] as MountType[],
  }),
  computed: {
    manufacturers(): FilterOption[] {
      return getModule(CCDSInterface, this.$store)
      .compendium
      .getItemCollection("Manufacturers")
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    mechTypes(): MechType[] {
      return [...Object.values(MechType)].sort()
    },
    mountTypes(): MountType[] {
      return [...Object.values(MountType)].sort() 
    },
  },
  methods: {
    clear() {
      this.sourceFilter = ''
      this.typeFilter = []
      this.mountFilter = []
    },
    updateFilters() {
      let fObj = {} as any
      if (this.sourceFilter) fObj.Source = [this.sourceFilter]
      if (this.typeFilter && this.typeFilter.length) fObj.Mechtype = this.typeFilter
      if (this.mountFilter && this.mountFilter.length) fObj.Mounts = this.mountFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
