<script>
import {defineComponent} from 'vue';
import NavBar from '@/components/NavBar.vue';
import {UserStore} from "@/store/UserStore.js";
import {check} from "@/http/userAPI.js";

export default defineComponent({
  components: {NavBar},
  data() {
    return {
      userStore: UserStore(),
      loading: true,
    };
  },
  methods: {
    async checkUser() {
      try {
        this.userStore.setIsLoading(true);
        const data = await check();
        this.userStore.setUser(data);
        this.userStore.setIsAuth(true);
        this.userStore.setRole(data.role);
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
      } finally {
        this.userStore.setIsLoading(false);
        this.loading = false;
      }
    },

  },
  mounted() {
    this.checkUser();
  }

});
</script>

<template>
  <div class="app">
    <div v-if="loading">
      <div class="spinner">Загрузка...</div>
    </div>
    <div v-else>
      <NavBar
        v-if="this.userStore.isAuth === true"
      />
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Или любая другая подходящая высота */
  font-size: 1.2em;}
</style>
