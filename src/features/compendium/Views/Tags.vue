<template>
  <sidebar-array-view title="EQUIPMENT TAGS" :array="tags" icon="mdi-tag" />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import _ from 'lodash'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '../../../io/ccdata_store'

@Component({
  components: { SidebarArrayView },
})
export default class Tags extends Vue {
  private compendium = getModule(CCDSInterface, this.$store).compendium
  get tags() {
    return _.sortBy(
      this.compendium.getItemCollection("Tags").filter(x => !x.IsHidden),
      'Name'
    )
  }
}
</script>
