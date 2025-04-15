<script>
import { defineComponent } from 'vue';
import NavBar from '@/components/NavBar.vue';

export default defineComponent({
  components: { NavBar },
});
</script>

<template>
  <div class="app">
    <NavBar />

    <router-view></router-view>
  </div>
</template>

<style scoped></style>
