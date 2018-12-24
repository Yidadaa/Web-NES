<template>
  <div id="player" >
    <canvas id="displayer" width="256" height="240"></canvas>
    <div class="direction-pad">
      <div class="line">
        <button class="pad-button" data-key="up" @touchstart="onKeyDown"
          @touchend="onKeyUp">W</button>
      </div>
      <div class="line">
        <button class="pad-button" data-key="left" @touchstart="onKeyDown"
          @touchend="onKeyUp">A</button>
        <button class="pad-button" data-key="right" @touchstart="onKeyDown"
          @touchend="onKeyUp">S</button>
      </div>
      <div class="line">
        <button class="pad-button" data-key="down" @touchstart="onKeyDown"
          @touchend="onKeyUp">D</button>
      </div>
      <div class="line">
        <button class="pad-button" data-key="select" @touchstart="onKeyDown"
          @touchend="onKeyUp">select</button>
        <button class="pad-button" data-key="start" @touchstart="onKeyDown"
          @touchend="onKeyUp">start</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Controller, NES } from 'jsnes'
import { loadBinary } from '../utils/request'
import Screen from '../utils/screen'
import Speaker from '../utils/speaker'

const W = 256
const H = 240
const fps = 60
const sampleRate = 44100
const bufferLen = sampleRate / 7

const audioContext = new AudioContext()

let left = []
let right = []
let myBuffer = audioContext.createBuffer(2, bufferLen, sampleRate)
const source = audioContext.createBufferSource()

const screen = new Screen(W, H)
const speaker = new Speaker({})
const nes = new NES({
  onFrame: frameBuffer => screen.onFrame(frameBuffer),
  onAudioSample: (l, r) => {
    left.push(l)
    right.push(r)
  }
})

const keyTable = {
  'w': 'up',
  'a': 'left',
  'd': 'right',
  's': 'down',
  'f': 'select',
  'h': 'start',
  'j': 'a',
  'k': 'b'
}

export default {
  data () { return {} },

  mounted () {
    this.init()
    document.onkeydown = this.onKeyDown
    document.onkeyup = this.onKeyUp
    document.onkeypress = this.onKeypress
  },

  methods: {
    onKeyDown (e) {
      let key = e.key
      key = keyTable[key] || e.target.dataset.key
      const ckey = Controller['BUTTON_' + key.toUpperCase()]
      nes.buttonDown(1, ckey)
    },
    onKeyUp (e) {
      let key = e.key
      key = keyTable[key] || e.target.dataset.key
      const ckey = Controller['BUTTON_' + key.toUpperCase()]
      nes.buttonUp(1, ckey)
    },
    async init () {
      // 配置显示环境
      screen.bindScreen('#displayer')
      const romData = await loadBinary('./马里奥兄弟.nes')
      // 加载rom
      nes.loadROM(romData)
      speaker.start()
      this.loop()
    },
    loop () {
      requestAnimationFrame(() => {
        nes.frame()
        if (left.length >= bufferLen - 1000) {
          if (source.buffer) {
            source.buffer.copyToChannel(new Float32Array(left), 0, 0)
            source.buffer.copyToChannel(new Float32Array(right), 1, 0)
          } else {
            myBuffer.copyToChannel(new Float32Array(left), 0, 0)
            myBuffer.copyToChannel(new Float32Array(right), 1, 0)
            source.buffer = myBuffer
            source.connect(audioContext.destination)
            source.start()
          }
          left = []
          right = []
        }
        this.loop()
      })
    }
  }
}
</script>

<style lang="less" scoped>
#player {
  height: 100%;
  width: 100%;

  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  #displayer {
    width: 256px;
    height: 240px;
    background-color: #fff;
  }

  .direction-pad {
    position: absolute;
    left: 20px;
    top: 40%;
    width: 100px;
    border: 1px solid #fff;
  }
}
</style>
