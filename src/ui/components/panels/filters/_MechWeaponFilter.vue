<template>
  <v-row justify="space-around" dense class="mx-4">
    <v-col cols="4">
      <v-select
        v-model="sourceFilter"
        dense
        hide-details
        class="px-2"
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
        v-model="tagFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        deletable-chips
        small-chips
        outlined
        label="Tags"
        :items="tags"
        item-value="ID"
        multiple
        item-text="Name"
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="weaponTypeFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="cci-weapon"
        chips
        deletable-chips
        small-chips
        outlined
        label="Weapon Type"
        :items="weaponTypes"
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="weaponSizeFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="mdi-relative-scale"
        chips
        deletable-chips
        small-chips
        outlined
        label="Required Mount"
        :items="weaponSizes"
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="attackTypeFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="cci-range"
        chips
        deletable-chips
        outlined
        label="Attack Type"
        :items="attackTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="damageTypeFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="cci-kinetic"
        chips
        deletable-chips
        outlined
        label="Damage Type"
        :items="damageTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag, WeaponType, WeaponSize, RangeType, DamageType, Manufacturer } from  'compcon_data'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '@/io/ccdata_store'
import _ from 'lodash'

type FilterOption = {text: string, value: string};
const nameSort = function(a: FilterOption, b: FilterOption) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}



export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    weaponTypeFilter: [],
    weaponSizeFilter: [],
    attackTypeFilter: [],
    damageTypeFilter: [],
  }),
  computed: {
    manufacturers(): FilterOption[] {
      return getModule(CCDSInterface, this.$store)
      .compendium
      .getItemCollection("Manufacturers")
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    weaponTypes(): WeaponType[] {
      return [...Object.values(WeaponType)]
        .sort()
    },
    weaponSizes(): WeaponSize[] {
      return [...Object.values(WeaponSize)]
        .sort()
    },
    attackTypes(): RangeType[] {
      return [...Object.values(RangeType)]
        .sort()
    },
    damageTypes(): DamageType[] {
      return [...Object.values(DamageType)]
        .sort()
    },
    tags(): Tag[] {
      let all_tags = getModule(CCDSInterface, this.$store)
      .compendium.getItemCollection("MechWeapons")
      .flatMap(w => w.Tags)
      .filter(x => !x.FilterIgnore && !x.IsHidden);

      return _.uniqBy(all_tags, 'ID');
    },
  },
  methods: {
    clear() {
      this.sourceFilter = []
      this.tagFilter = []
      this.weaponTypeFilter = []
      this.weaponSizeFilter = []
      this.attackTypeFilter = []
      this.damageTypeFilter = []
    },
    updateFilters() {
      const fObj = {} as any
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter]
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter
      if (this.weaponTypeFilter && this.weaponTypeFilter.length) fObj.Type = [this.weaponTypeFilter]
      if (this.weaponSizeFilter && this.weaponSizeFilter.length) fObj.Size = [this.weaponSizeFilter]
      if (this.attackTypeFilter && this.attackTypeFilter.length)
        fObj.RangeType = this.attackTypeFilter
      if (this.damageTypeFilter && this.damageTypeFilter.length)
        fObj.DamageType = this.damageTypeFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
