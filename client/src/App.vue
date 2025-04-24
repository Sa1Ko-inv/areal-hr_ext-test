<script>
import { defineComponent } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { UserStore } from "@/store/UserStore.js";

export default defineComponent({
  components: { NavBar },
  data() {
    return {
      userStore: UserStore(),
    };
  },

});
</script>

<template>
  <div class="app">
    <div v-if="loading">
      <div class="spinner">Загрузка...</div>
    </div>
    <div v-else>
      <NavBar v-if="userStore.isAuth" />
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
@import "styles/base.scss";
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Или любая другая подходящая высота */
  font-size: 1.2em;}
</style>
