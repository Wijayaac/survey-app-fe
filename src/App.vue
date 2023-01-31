<script>
import {mapState} from "vuex";
import Login from "./views/Login.vue";

export default {
  components: {Login},
  computed: {
    ...mapState(['user'])
  }
}
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
