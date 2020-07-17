<template>
  <sidebar-array-view
    title="PILOT BACKGROUNDS"
    :array="backgrounds"
    icon="cci-orbit"
    name-key="name"
    description-key="description"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { backgrounds } from 'compcon_data'

export default Vue.extend({
  name: 'backgrounds',
  components: { SidebarArrayView },
  data: () => ({
    backgrounds
  }),
})
</script>
