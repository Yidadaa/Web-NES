<template>
  <div id="app">
    <MainPlayer />
    <div class="tip">请旋转屏幕</div>
  </div>
</template>

<script>
import MainPlayer from './components/MainPlayer'
import MobileDetect from 'mobile-detect'

function requestFullScreen (element) {
  const requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen
  if (requestMethod) {
    requestMethod.call(element)
  } else {
    alert('您的浏览器太旧了，请升级浏览器后再试')
  }
}

export default {
  name: 'app',
  components: {
    MainPlayer
  },

  mounted () {
    const md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
      document.onclick = () => {
        requestFullScreen(document.querySelector('#app'))
      }
    }
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin: auto;

  width: 800px;
  height: 450px;
}

@media screen and (orientation: landscape) {
  .tip {
    display: none;
  }
}

@media screen and (orientation: portrait) {
  .tip {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: black;
    color: #fff;
    font-size: 30px;
    margin: 0;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
