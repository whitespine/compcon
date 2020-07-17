<template>
  <v-container fluid>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters align="center">
      <v-col cols="auto">
        <h1 v-resize-text="{ maxFontSize: '42pt' }" class="ml-n2 heading accent--text"><slot /></h1>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto" class="ml-auto mr-2">
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
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="3" class="ml-auto mr-5">
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
      <cc-filter-panel
        v-if="$vuetify.breakpoint.mdAndUp && !noFilter"
        :item-type="itemType"
        @set-filters="setFilters"
      />
    </v-row>
    <compendium-mobile-view v-if="!$vuetify.breakpoint.mdAndUp" :items="fItems" />
    <div v-else>
      <compendium-table-view
        v-if="profile.SelectorView === 'list'"
        :items="fItems"
        :headers="headers"
      />
      <compendium-split-view v-else-if="profile.SelectorView === 'split'" :items="fItems" />
    </div>
  </v-container>
</template>



<script lang="ts">
import Vue from 'vue'
import { ItemFilter, UserProfileStore, CompendiumItem, ItemFilterParam } from 'compcon_data'
import { accentInclude } from 'compcon_data'
import CompendiumMobileView from './views/CompendiumMobileView.vue'
import CompendiumSplitView from './views/CompendiumSplitView.vue'
import CompendiumTableView from './views/CompendiumTableView.vue'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '../../../io/ccdata_store'

// TODO: This entire damn file
// @ts-nocheck


export default Vue.extend({
  name: 'compendium-browser',
  components: { CompendiumMobileView, CompendiumTableView, CompendiumSplitView },
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
  },
  data: () => ({
    search: '',
    filters: {} as ItemFilterParam,
    itemType: '',
  }),
  computed: {
    profile(): UserProfileStore {
      const store = getModule(CCDSInterface, this.$store)
      return store.user
    },
    fItems() {
      let i = this.items as CompendiumItem[]

      if (this.search) i = i.filter(x => accentInclude(x.Name, this.search))

      if (Object.keys(this.filters).length) {
        i = ItemFilter.Filter(i, this.filters)
      }

      return i
    },
  },
  created() {
    this.itemType = (this.items as CompendiumItem[])[0].ItemType
  },
  methods: {
    setFilters(newFilter: ItemFilterParam) {
      this.filters = newFilter
    },
  },
})
</script>
