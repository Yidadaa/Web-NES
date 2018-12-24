/**
 * @file: 音频输出
 * @author: Yidadaa
 */

export default class Speaker {
  constructor (bufferSize = 44100 / 5, sampleRate = 44100) {
    this.audioContext = new AudioContext()
    this.bufferSize = bufferSize
    this.leftBuffer = new Float32Array(bufferSize)
    this.rightBuffer = new Float32Array(bufferSize)
    this.bufferPtr = 0
    this.lastPtr = this.bufferPtr
    this.audioBuffer = this.audioContext.createBuffer(2, bufferSize, sampleRate)
  }

  /**
   * 缓冲音频数据
   * @param {Float} l 左声道数据
   * @param {Float} r 右声道数据
   */
  writeSampleBuffer (l, r) {
    this.leftBuffer[this.bufferPtr] = l
    this.rightBuffer[this.bufferPtr] = r
    this.bufferPtr++
    if (this.bufferPtr >= this.bufferSize) {
      this.playAudio()
    }
  }

  /**
   * 播放音频
   */
  playAudio () {
    let source = this.audioContext.createBufferSource()
    this.audioBuffer.copyToChannel(this.leftBuffer, 0, 0)
    this.audioBuffer.copyToChannel(this.rightBuffer, 1, 0)
    source.buffer = this.audioBuffer
    source.connect(this.audioContext.destination)
    source.start()
    this.bufferPtr = 0
  }
}
