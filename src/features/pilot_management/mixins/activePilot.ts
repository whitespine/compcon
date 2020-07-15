import Vue from 'vue';

import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from '@/io/ccdata_store';

export default Vue.extend({
  computed: {
    pilot() {
      return getModule(CCDSInterface, this.$store).pilots.Pilots.find(
        p => p.ID === this.$route.params.pilotID
      )
    },
  },
}
)