import _ from 'lodash'
import { tracert } from '@/io/Generators'

function motd(): string {
  return _.sample(require('./horus_chat/motd.txt').split('\n'))
}

const HorusStart = typer => {
  const nfo = require('./horus_chat/nfo.txt')

  typer
    .type('<br>')
    .type('COMPANION/CONCIERGE UNIT INITIALIZING')
    .break()
    .type('GMS COMP/CON Unit Mk XI Rev 11.4.1c')
    .break()
    .type('5017.3.12 General Massive Systems // Please Operate Responsibly')
    .break()
    .type('loading h0r_os v3.6c_CLEAN (FINAL) phoubia distro')
    .break()
    .type('working ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .pause(250)
    .options({ speed: 0, lifeLike: false })
    .type(`<pre class="ibm-text">${nfo}</pre>`)
    .break()
    .options({ speed: 3, lifeLike: false })
    .pause(250)
    .type('>// run ./uscompcon_data/autoconnect.sh')
    .break()
    .type(`Connecting to 1489.2551.1461.1880.4851.03`)
    .break()
    .type(`rt//CC/LOCALNET 0ns`)
    .break()
    .type(tracert(1)[0])
    .break()
    .type(tracert(1)[0])
    .break()
    .type(tracert(1)[0])
    .break()
    .type(tracert(1)[0])
    .break()
    .type(tracert(1)[0])
    .break()
    .type(tracert(1)[0])
    .break()
    .type('rt//INC OVERRIDE>')
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .break()
    .pause(350)
    .type('connection established//ENCRYPT HATHOR-ALEPH')
    .break()
    .pause(250)
    .type('------------------------------------------------------------')
    .break()
    .type("welcome to dogfriend_68's pound")
    .break()
    .type('MOTD:')
    .break()
    .type(motd())
    .break()
    .type('------------------------------------------------------------')
    .pause(550)
    .go()
}

const banTypes = [
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'PERMABANNED',
  'MUTED FOR 500KSEC',
  'MUTED FOR 800KSEC',
]

function formatChat(input: string[]): string {
  return `<span class="accent--text">${input[0]}: </span><span>${input[1]}</span>`
}

function formatMod(input: string[]): string {
  return `<span class="red--text">${input[0]}: </span><span>${input[1]}</span>`
}

function formatAdmin(input: string): string {
  return `<span class="info--text"><b>[ADMIN] dogfriend_68: </b>${input}</span>`
}

function formatBan(input: string[]): string {
  return `<span class="warning--text">// USER: ${input[0]} ${_.sample(banTypes)} | REASON: ${
    input[1]
  } --ADMIN //</span>`
}

function randomNoRepeat(arr) {
  var copy = arr.slice(0);
  return function () {
    if (copy.length < 1) { copy = arr.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

const HorusChat = output => {
  const chat = require('./horus_chat/chat.txt').split('\n')
  const mods = require('./horus_chat/mods.txt').split('\n')
  const admin = require('./horus_chat/admin.txt').split('\n')
  const bans = require('./horus_chat/bans.txt').split('\n')

  const allLines = []

  chat.forEach(l => {
    allLines.push(formatChat(l.split(/,(.+)/)))
  })

  mods.forEach(l => {
    allLines.push(formatMod(l.split(/,(.+)/)))
  })

  admin.forEach(l => {
    allLines.push(formatAdmin(l))
  })

  bans.forEach(l => {
    allLines.push(formatBan(l.split(/,(.+)/)))
  })

  const sel = randomNoRepeat(allLines);

  function callback(): void {
    output.innerHTML += `<br>${sel()}`
    output.scrollIntoView({ block: 'end' })
  }

  function loop(): void {
    const rand = _.random(10, 2500)
    setTimeout(function() {
      callback()
      loop()
    }, rand)
  }

  loop()
}

export { HorusStart, HorusChat }
