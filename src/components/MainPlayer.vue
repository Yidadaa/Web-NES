<template>
  <div class="mobile-player" >
    <div class="left">
      <div class="direction-pad">
        <div class="line">
          <button class="pad-button" data-key="left" @touchstart="onKeyDown"
            @touchend="onKeyUp">A</button>
          <button class="pad-button" data-key="up" @touchstart="onKeyDown"
            @touchend="onKeyUp">W</button>
        </div>
        <div class="line">
          <button class="pad-button" data-key="down" @touchstart="onKeyDown"
            @touchend="onKeyUp">S</button>
          <button class="pad-button" data-key="right" @touchstart="onKeyDown"
            @touchend="onKeyUp">D</button>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="displayer-wrap">
        <canvas id="displayer" :width="width" :height="height"></canvas>
      </div>
      <div class="system-pad">
        <button class="pad-button" data-key="select" @touchstart="onKeyDown"
          @touchend="onKeyUp">select</button>
        <button class="pad-button" data-key="start" @touchstart="onKeyDown"
          @touchend="onKeyUp">start</button>
      </div>
    </div>
    <div class="right">
      <div class="action-pad">
        <div class="button-wrap">
          <button class="pad-button" data-key="b" @touchstart="onKeyDown"
            @touchend="onKeyUp">B</button>
        </div>
        <div class="button-wrap">
          <button class="pad-button" data-key="a" @touchstart="onKeyDown"
            @touchend="onKeyUp">A</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NES } from 'jsnes'
import MobileDetect from 'mobile-detect'

import { loadBinary } from '../utils/request'
import Screen from '../utils/screen'
import Speaker from '../utils/speaker'
import Controller from '../utils/controller'

const W = 256
const H = 240

const screen = new Screen(W, H)
const speaker = new Speaker()
const nes = new NES({
  onFrame: frameBuffer => screen.onFrame(frameBuffer),
  onAudioSample: (l, r) => speaker.writeSampleBuffer(l, r)
})
const controller = new Controller(null, nes)

export default {
  data () {
    return {
      width: W,
      height: H,
      isMobile: new MobileDetect(window.navigator.userAgent).mobile()
    }
  },

  mounted () {
    this.init()
    document.onkeydown = this.onKeyDown
    document.onkeyup = this.onKeyUp
    document.onkeypress = this.onKeypress
  },

  methods: {
    getKey (e) {
      let key = e.key
      key = controller.keyTable[key] || e.target.dataset.key
      key = controller.convertKey(key)
      return key
    },
    onKeyDown (e) {
      nes.buttonDown(1, this.getKey(e))
    },
    onKeyUp (e) {
      nes.buttonUp(1, this.getKey(e))
      window.navigator.vibrate(100)
    },
    async init () {
      // 配置显示环境
      screen.bindScreen('#displayer')
      const romData = await loadBinary('./马里奥.nes')
      // 加载rom
      nes.loadROM(romData)
      this.loop()
    },
    loop () {
      requestAnimationFrame(() => {
        nes.frame()
        this.loop()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mobile-player {
  height: 100vh;
  width: 100vw;

  color: #fff;
  background-color: #fff;
  display: flex;
  border: 1px solid #aaa;
  border-radius: 20px;
  box-shadow: 1.5vw 1.5vw 0 rgb(24, 57, 74);
  padding: 1.5vw;

  .active-animation {
    transition: box-shadow 0.1s ease;
    &:active {
      box-shadow: none;
    }
  }

  .pad-button {
    user-select: none;
    outline: none;
    font-size: 4vh;
  }

  .left {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(33, 33, 33);
    border-radius: 20px;
    position: relative;

    &:after {
      // Model
      content: 'NES-2000';
      font-weight: bold;
      font-size: 4vh;
      color: rgb(33, 33, 33);
      color: #505050;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 4vh;
      right: 4vw;
    }

    .direction-pad {
      transform: rotate(-45deg);
      border-radius: 4vw;
      background-color: #eee;
      padding: 0.5vw;
      .pad-button {
        margin: 0.5vw;
        border-radius: 100vw;
        background-color: rgb(73, 66, 62);
        color: rgb(73, 66, 62);
        border: 0;
        height: 7.5vw;
        width: 7.5vw;
        transform: rotate(45deg) scale(1);
        box-shadow: 0.8vh 0.8vh 0 rgb(138, 171, 210);
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
        font-weight: bold;

        .active-animation();
      }
    }
  }

  .center {
    width: 50%;
    .displayer-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;

      #displayer {
        width: 40vw;
        height: 37.5vw;
        background-color: #fff;
        border: rgb(33, 33, 33) 20px solid;
        border-top-color: rgb(46, 46, 46);
        border-bottom-color: rgb(46, 46, 46);
      }
    }
    .system-pad {
      height: 10vh;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;

      .pad-button {
        background-color: rgb(73, 66, 62);
        box-shadow: 0.8vh 0.8vh 0 rgb(138, 171, 210);
        border: 0;
        margin: 1.5vw;
        padding: 0.5vw 1.5vw;
        border-radius: 100vw;
        color: rgb(73, 66, 62);
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
        width: 10vw;
        text-align: center;
        transform: scale(1);
        .active-animation();
      }
    }
  }

  .right {
    width: 25%;
    background-color: rgb(33, 33, 33);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .action-pad {
      padding: 0.5vw;
      width: 50%;

      .button-wrap {
        border-radius: 100vw;
        background-color: #fff;
        margin-bottom: 2vh;
        height: 11vw;
        width: 11vw;
        display: flex;
        align-items: center;
        justify-content: center;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .pad-button {
        border: 0;
        background-color:rgb(163, 78, 71);
        color: rgb(163, 78, 71);
        font-weight: bold;
        text-shadow: 1px 1px rgb(105, 39, 33);
        box-shadow: 0.8vh 0.8vh 0 rgb(138, 171, 210);
        height: 9vw;
        width: 9vw;
        border-radius: 100vw;
        transform: scale(1);
        .active-animation();
      }
    }
  }
}
</style>
