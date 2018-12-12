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

const W = 256
const H = 240

let nes = null
let screenImage = new ImageData(W, H)
let dataBuffer = new ArrayBuffer(screenImage.data.length)
let screenBuffer8 = new Uint8ClampedArray(dataBuffer)
let screenBuffer32 = new Uint32Array(dataBuffer)

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

let keyState = {
  up: 0,
  left: 0,
  right: 0,
  down: 0,
  select: 0,
  start: 0,
  a: 0,
  b: 0
}

export default {
  data () { return {} },

  mounted () {
    // 开始加载游戏
    const canvas = document.querySelector('#displayer')
    const ctx = canvas.getContext('2d')
    screenImage = ctx.getImageData(0, 0, W, H)
    nes = new NES({
      onFrame: function (frameBuffer) {
        for (let i = 0; i < W * H; i++) {
          screenBuffer32[i] = 0xff000000 | frameBuffer[i]
        }
        screenImage.data.set(screenBuffer8)
        ctx.putImageData(screenImage, 0, 0)
      },
      onAudioSample: function (left, right) {}
    })

    this.loadBinary('./忍者神龟格斗.nes', (res) => {
      nes.loadROM(res)
      setInterval(() => {
        Object.keys(keyTable).forEach(v => {
          const key = Controller['BUTTON_' + keyTable[v].toUpperCase()]
          if (keyState[keyTable[v]] === 1) {
            nes.buttonDown(1, key)
            console.log(keyState)
          } else {
            nes.buttonUp(1, key)
          }
        })
        nes.frame()
      }, 16)
    })

    document.onkeydown = this.onKeyDown
    document.onkeyup = this.onKeyUp
  },

  methods: {
    loadBinary (path, callback) {
      let req = new XMLHttpRequest()
      req.open('GET', path)
      req.overrideMimeType('text/plain; charset=x-user-defined')
      req.addEventListener('load', function () {
        if (req.status === 200) {
          callback(this.responseText)
        } else {
          callback(new Error(req.statusText))
        }
      })
      req.onerror = function () {
        callback(new Error(req.statusText))
      }
      req.send()
    },
    onKeyDown (e) {
      const key = e.key
      keyState[keyTable[key] || e.target.dataset.key] = 1
    },
    onKeyUp (e) {
      const key = e.key
      keyState[keyTable[key] || e.target.dataset.key] = 0
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
