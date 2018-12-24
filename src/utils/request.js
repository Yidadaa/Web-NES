/**
 * @file: 一些有用的工具
 * @author: Yidadaa
 */

/**
 * 加载rom文件
 * @param {String} path rom文件所在路径
 */
export function loadBinary (path) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', path)
    req.overrideMimeType('text/plain; charset=x-user-defined')
    req.addEventListener('load', function () {
      if (req.status === 200) {
        resolve(this.responseText)
      } else {
        reject(new Error(req.statusText))
      }
    })
    req.onerror = function () {
      reject(new Error(req.statusText))
    }
    req.send()
  })
}
