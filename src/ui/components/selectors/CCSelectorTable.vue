<template>
  <v-container fluid>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters align="center">
      <v-col>
        <slot />
      </v-col>
      <v-col cols="auto" class="ml-auto mr-5">
        <slot name="extra-item" />
      </v-col>
      <v-col cols="auto" class="mr-1">
        <v-btn-toggle v-model="profile.SelectorView" mandatory>
          <v-btn small icon value="split">
            <v-icon color="accent">mdi-view-split-vertical</v-icon>
          </v-btn>
          <v-btn small icon value="list">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="cards" disabled>
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col cols="3" class="ml-auto mr-5">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-icon="search"
          flat
          hide-actions
          single-line
          dense
          placeholder="Search"
          clearable
          persistent-hint
          :hint="`${fItems.length} Items`"
        />
      </v-col>
      <cc-filter-panel v-if="!noFilter" :item-type="itemTypeFallback" @set-filters="setFilters" />
    </v-row>
    <selector-table-view
      v-if="profile.SelectorView === 'list'"
      :headers="headers"
      :items="fItems"
      @equip="$emit('equip', $event)"
    />
    <selector-split-view
      v-else-if="profile.SelectorView === 'split'"
      :headers="headers"
      :items="fItems"
      @equip="$emit('equip', $event)"
    />
    <div v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SelectorTableView from './views/_SelectorTableView.vue'
import SelectorSplitView from './views/_SelectorSplitView.vue'
import { accentInclude, ItemFilter, UserProfileStore, CompendiumItem } from 'compcon_data'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '../../../io/ccdata_store'

export default Vue.extend({
  name: 'cc-selector-table',
  components: { SelectorTableView, SelectorSplitView },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    noFilter: {
      type: Boolean,
      required: false,
    },
    itemTypeFallback: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    search: '',
    filters: {} as any,
    itemType: '',
  }),
  computed: {
    profile(): UserProfileStore {
      const store = getModule(CCDSInterface, this.$store)
      return store.user
    },
    fItems() {
      // Filter the items
      let items = this.items as CompendiumItem[];

      if (this.search) {
        items = items.filter(x => accentInclude(x.Name, this.search))
      }

      if (Object.keys(this.filters).length) {
        items = ItemFilter.Filter(items, this.filters)
      }

      return items
    },
  },
  // created() { // Disable temporarily to see how it behaves
    // if (!this.itemType) this.itemType = this.itemTypeFallback
  // },
  methods: {
    setFilters(newFilter: any) {
      this.filters = newFilter
    },
  },
})
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
