import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './ui/style/_style.css'
import './assets/glyphs/glyphs.css'
import './ui/globals'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import { store } from './store'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify/lib'
import VueMousetrap from 'vue-mousetrap'
import lancerData from 'lancer-data'
// @ts-ignore
import VueResizeText from 'vue-resize-text'

import './registerServiceWorker'

import theme from './ui/theme'
import themes from '@/ui/style/themes'

import mixins from './mixins'

import externalLinkDirective from './mixins/externalLinkDirective'

import _ from 'lodash'
import Startup from '@/io/Startup'

import { Capacitor } from '@capacitor/core'

// @ts-ignore
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import { getModule } from 'vuex-module-decorators'
import { CCDSInterface } from './io/ccdata_store'

async function main() {
  Object.defineProperty(Vue.prototype, '$_', { value: _ })
  Object.defineProperty(Vue.prototype, '$platform', { value: Capacitor.platform })

  Vue.prototype.$appVersion = process.env.VERSION_STRING
  Vue.prototype.$lancerVersion = `${lancerData.info.version}`

  // Preload compcon data interaction layer
  let cc_store = await Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion)
  getModule(CCDSInterface, store).initCCLayer(cc_store);

  // Preload theme
  let activeTheme: any; // Its a vue theme object - doesn't really matter its type
  switch (cc_store.user.Theme) {
    case "gms":
      activeTheme =  themes.gms;
      break;
    case "horus":
      activeTheme = themes.horus;
      break;
    case "msmc":
      activeTheme = themes.msmc;
      break;
    default:
      activeTheme = themes.gms;
  }

  // Decide light/dark coloration
  theme.theme.dark = activeTheme.type === 'dark'
  theme.dark = activeTheme.type === 'dark'

  theme.theme.themes.dark = activeTheme.colors
  theme.theme.themes.light = activeTheme.colors

  // Init vue plugins/mixins/directives
  const vuetify = new Vuetify(theme)

  Vue.use(Vuetify)
  Vue.use(VueMousetrap)
  Vue.use(TiptapVuetifyPlugin, {
    vuetify,
    iconsGroup: 'md',
  })
  Vue.use(VueResizeText)

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  mixins.forEach(m => {
    Vue.mixin(m)
  })

  Vue.directive('extlink', externalLinkDirective)

  Vue.config.errorHandler = (error, vm) => {
    console.log(error);
    return Vue.prototype.$notifyError(error, vm)
  }
  window.onerror = error => Vue.prototype.$notifyError(error)

  // Finally, init vue
  new Vue({
    components: { App },
    vuetify,
    router,
    store,
    created() {},
    render: h => h(App),
  }).$mount('#app')

  // Setup store immediately after
  console.log(cc_store);
}

main()
