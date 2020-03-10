<template>
    <div>
        <p>我是home首页</p>
        <router-link to="/home/news">新闻</router-link>
        <router-link to="/home/notices">通知</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped>

</style>
