<template>
  <div id="player" >
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
            @touchend="onKeyUp">D</button>
          <button class="pad-button" data-key="right" @touchstart="onKeyDown"
            @touchend="onKeyUp">S</button>
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
        <button class="pad-button" data-key="b" @touchstart="onKeyDown"
          @touchend="onKeyUp">B</button>
        <button class="pad-button" data-key="a" @touchstart="onKeyDown"
          @touchend="onKeyUp">A</button>
      </div>
    </div>
  </div>
</template>

<script>
import { NES } from 'jsnes'
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
      height: H
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
#player {
  height: 100%;
  width: 100%;

  color: #fff;
  background-color: #fff;
  display: flex;
  border: 1px solid #aaa;
  border-radius: 20px;
  box-shadow: 10px 10px 0 rgb(24, 57, 74);
  padding: 10px;

  .active-animation {
    &:active {
      transform: scale(0.9);
      box-shadow: 0;
    }
  }

  .pad-button {
    user-select: none;
    outline: none;
  }

  .left {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(33, 33, 33);
    border-radius: 20px;

    .direction-pad {
      height: 150px;
      transform: rotate(-45deg);
      border-radius: 32px;
      background-color: #eee;
      padding: 5px;
      .pad-button {
        margin: 5px;
        border-radius: 50px;
        background-color: rgb(73, 66, 62);
        color: rgb(73, 66, 62);
        border: 0;
        height: 60px;
        width: 60px;
        transform: rotate(45deg) scale(1);
        box-shadow: 2px 1px 0 #666;
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

      #displayer {
        width: 256px * 1.3;
        height: 240px * 1.3;
        background-color: #fff;
        border: rgb(33, 33, 33) 20px solid;
      }
    }
    .system-pad {
      display: flex;
      justify-content: center;
      margin-top: 10px;

      .pad-button {
        background-color: rgb(73, 66, 62);
        box-shadow: 4px 4px 0 rgb(138, 171, 210);
        border: 0;
        margin: 10px;
        padding: 5px 10px;
        border-radius: 20px;
        color: rgb(73, 66, 62);
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
        width: 100px;
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
      // height: 100px;
      padding: 5px;
      width: 50%;
      // transform: rotate(-45deg);

      .pad-button {
        background-color:rgb(163, 78, 71);
        color: rgb(163, 78, 71);
        font-weight: bold;
        text-shadow: 1px 1px rgb(105, 39, 33);
        box-shadow: 2px 1px 0 rgb(105, 39, 33);
        border: 8px solid #fff;
        height: 80px;
        width: 70px;
        border-radius: 50px;
        margin-bottom: 20px;
        // transform: rotate(45deg) scale(1);
        transform: scale(1);
        width: 100%;
        .active-animation();
      }
    }
  }
}
</style>
