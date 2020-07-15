<template>
  <sidebar-array-view
    title="PILOT SKILL TRIGGERS"
    :array="skills"
    icon="cci-accuracy"
    name-key="Trigger"
    description-key="Detail"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '../../../io/ccdata_store'
import { Skill } from 'compcon_data'

export default Vue.extend({
  name: 'skills',
  components: { SidebarArrayView },
  computed: {
    skills(): Skill[] {
      return getModule(CCDSInterface, this.$store).compendium.getItemCollection("Skills");
    }
  }
})
</script>
