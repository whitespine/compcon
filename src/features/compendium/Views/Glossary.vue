<template>
  <sidebar-array-view
    title="GLOSSARY"
    :array="glossary"
    name-key="name"
    description-key="description"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import _ from 'lodash'
import { GlossaryItem, glossary } from 'compcon_data'

export default Vue.extend({
  name: 'glossary',
  components: { SidebarArrayView },
  data: () => ({
    glossary: [] as GlossaryItem[]
  }),
  created() {
    this.glossary = _.sortBy(glossary, [x => x.name])
  },
})
</script>
