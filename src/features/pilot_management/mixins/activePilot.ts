import Vue from 'vue';

import { getModule } from 'vuex-module-decorators'
import { CCDataInterface } from '@/io/ccdata_store';

export default Vue.extend({
  computed: {
    pilot() {
      return getModule(CCDataInterface, this.$store).pilots.Pilots.find(
        p => p.ID === this.$route.params.pilotID
      )
    },
  },
}
)