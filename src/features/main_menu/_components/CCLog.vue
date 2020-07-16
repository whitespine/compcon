<template>
  <div id="output-container">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-2">
        <!-- <v-divider vertical /> -->
        <div class="sidebar" />
        <div>
          <img src="../../../assets/ui/sb_l.png" />
        </div>
      </v-col>
      <v-col>
        <p
          id="completed"
          ref="completed"
          class="flavor-text subtle--text text--darken-1 py-0 my-0"
        ></p>
        <p id="output" ref="output" class="flavor-text subtle--text text--darken-1 py-0 my-0">
          <br />
          <br />
          <br />
        </p>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <div class="sidebar" />
        <div>
          <img class="ml-n2" src="../../../assets/ui/sb_r.png" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// Todo: See if there's actual bindings we can get
//@ts-ignore
import TypeIt from 'typeit'
import GmsStart from './startup_logs/gms'
import MsmcStart from './startup_logs/msmc'
import { HorusStart, HorusChat } from './startup_logs/horus'
import { getModule } from 'vuex-module-decorators'
import { UserProfileStore } from 'compcon_data'
import { CCDSInterface } from '../../../io/ccdata_store'

export default Vue.extend({
  name: 'cc-log',
  data: () => ({
    typer: {} as any, // It's a typeit instance
    text: [],
    lock: false,
  }),
  computed: {
    profile(): UserProfileStore {
      const store = getModule(CCDSInterface, this.$store)
      return store.user
    },
    output(): Element {
      return this.$refs.output as Element
    },
    completed(): Element {
      return this.$refs.completed as Element
    }
  },
  async mounted() {
    this.lock = true
    await Vue.nextTick()
    this.typer = new TypeIt(this.output, {
      speed: 2,
      nextStringDelay: 5,
      lifeLike: false,
      cursor: false,
      startDelete: false,
      beforeString: () => {
        this.output?.scrollIntoView({ block: 'end' })
      },
      afterString: () => {
        this.output?.scrollIntoView({ block: 'end' })
      },
      afterComplete: () => {
        if (this.profile.Theme === 'horus') {
          HorusChat(this.output)
        } else {
          this.lock = false
        }
      },
    })

    switch (this.profile.Theme) {
      case 'horus':
        // this.typer.go()
        HorusStart(this.typer)
        // HorusChat(this.typer)
        break
      case 'msmc':
        MsmcStart(this.typer)
      default:
        GmsStart(this.typer)
        break
    }
  },
  methods: {
    print(user: string, response: string) {
      if (this.lock) return
      this.lock = true

      this.typer.destroy()

      //collect written strings so TypeIt doesn't erase them
      if (this.completed.innerHTML) this.completed.innerHTML += '<br>'
      this.completed.innerHTML += this.output.innerHTML
      this.output.innerHTML = ''

      this.typer = new TypeIt(this.output, {
        speed: 32,
        lifeLike: true,
        nextStringDelay: 7,
        cursor: false,
        beforeString: () => {
          (this.output as any)?.scrollIntoView({ block: 'end' })
        },
        afterString: () => {
          (this.output as any)?.scrollIntoView({ block: 'end' })
        },
        afterComplete: () => {
          this.lock = false
        },
      })
        .type(`$ `)
        .type(`<span class="stark-text--text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 3, lifeLike: false })
        .break()
        .type('>')
        .type(
          `//[<span class="accent--text">COMP/CON</span>: <span class="stark--text">${response}</span>]`
        )
        .type(' ')
        .go()
    },
  },
})
</script>

<style scoped>
#output-container {
  position: absolute;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: calc(100vw - 665px);
  top: 0;
  right: 0;
  margin-right: 8px;
  z-index: 1;
}

.sidebar {
  align-self: stretch;
  display: inline-flex;
  height: inherit;
  min-height: 95%;
  max-height: 95%;
  max-width: 16px;
  width: 16px;
  background: url(../../../assets/ui/scale_1.png);
  vertical-align: text-bottom;
}
</style>
