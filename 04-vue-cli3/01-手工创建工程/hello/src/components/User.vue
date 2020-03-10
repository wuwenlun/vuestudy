<template>
    <div>
        <p>我是user用户页</p>
        <p>用户ID是{{userId}}</p>
    </div>
</template>

<script>
    export default {
        name: "User",
        computed: {
            userId() {
                return this.$route.params.userId
            }
        }
    }
</script>

<style scoped>

</style>
