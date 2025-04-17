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
      loading: false,
    };
  },
  methods: {
    async checkUser() {
      try {
        const data = await check();
        this.userStore.setUser(data);
        this.userStore.setIsAuth(true);
        this.userStore.setRole(data.role);
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.checkUser();
  }

});
</script>

<template>
  <div class="app">
    <NavBar />

    <router-view></router-view>
  </div>
</template>

<style scoped></style>
