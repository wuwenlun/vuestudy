<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-link :to="'/user/'+userId">用户</router-link>
    <router-link :to="{path:'/profile',query:{name:'吴文伦'}}">档案</router-link>
    <router-view></router-view>
    <hello-div>

    </hello-div>
    <cell>
        <span>hello vue!</span>
        <span>hello world!</span>
    </cell>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import HelloDiv from './test/testslot'
import {cell} from 'vant';

export default {
  name: 'app',
  components: {
    HelloWorld,
    HelloDiv,
    cell
  },
  data() {
    return {
      userId:"zhangsan"
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
