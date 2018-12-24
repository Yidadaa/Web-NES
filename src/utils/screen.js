/**
 * @file: 屏幕显示类
 * @author: Yidadaa
 */

export default class Screen {
  /**
   * 初始化
   * @param {Number} w 显示宽度
   * @param {Number} h 显示高度
   */
  constructor (w, h) {
    this.canvas = null
    this.ctx = null
    this.w = w
    this.h = h
    this.screenImage = new ImageData(w, h)
    this.dataBuffer = new ArrayBuffer(this.screenImage.data.length)
    this.screenBuffer8 = new Uint8ClampedArray(this.dataBuffer)
    this.screenBuffer32 = new Uint32Array(this.dataBuffer)
  }

  /**
   * 准备屏幕元素
   * @param {String} selector 要绘制的canvas选择器
   */
  bindScreen (selector) {
    this.canvas = document.querySelector(selector)
    this.ctx = this.canvas.getContext('2d')
  }

  /**
   * 将模拟器的帧数据输出到屏幕
   * @param {Unit8ArrayBuffer} frameBuffer 原始帧数据
   */
  onFrame (frameBuffer) {
    for (let i = 0; i < this.w * this.h; i++) {
      this.screenBuffer32[i] = 0xff000000 | frameBuffer[i]
    }
    this.screenImage.data.set(this.screenBuffer8)
    this.ctx.putImageData(this.screenImage, 0, 0)
  }
}
