<template>
  <div id="app">
    <MainPlayer />
  </div>
</template>

<script>
import MainPlayer from './components/MainPlayer'

export default {
  name: 'app',
  components: {
    MainPlayer
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: black;
  margin: auto;

  width: 800px;
  height: 450px;
}
</style>
