/**
 * @file: 用户控制模块
 * @author: Yidadaa
 */
import { Controller } from 'jsnes'

export default class JoyController {
  constructor (keyTable) {
    this.keyTable = keyTable || {
      'w': 'up',
      'a': 'left',
      'd': 'right',
      's': 'down',
      'f': 'select',
      'h': 'start',
      'j': 'a',
      'k': 'b'
    }
  }

  /**
   * 更新按键表
   * @param {Object} keyTable 按键映射
   */
  updateKeyTable (keyTable) {
    this.keyTable = keyTable
  }

  /**
   * 编码按键
   * @param {String} key 转换前的按键名称
   */
  convertKey (key) {
    if (!key) return null
    return Controller['BUTTON_' + key.toUpperCase()]
  }
}
