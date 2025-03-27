<script>
import {POSITION_ROUTE, MAIN_ROUTE} from "@/utils/consts.js";

export default {
  data() {
    return {}
  },
  setup() {
    return {POSITION_ROUTE, MAIN_ROUTE}
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar__brand">
      <router-link :to='MAIN_ROUTE' class="navbar__home-link">На главную</router-link>
    </div>
    <div class="navbar__menu">
      <router-link :to='POSITION_ROUTE' class="navbar__link">Организации</router-link>
      <router-link :to='POSITION_ROUTE' class="navbar__link">Должности</router-link>
    </div>
    <router-link to="" class="navbar__link">Выход</router-link>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: white;
  border-bottom: 2px solid #792ec9;

  &__brand {
    display: flex;
    align-items: center;
  }

  &__home-link {
    color: #792ec9;
    font-weight: 600;
    text-decoration: none;
    font-size: 18px;
    transition: color 0.2s ease;

    &:hover {
      color: rgba(#792ec9, 0.7);
    }
  }

  &__menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 20px;

  }

  &__link {
    padding: 6px 16px;
    background-color: transparent;
    border: 1px solid #792ec9;
    color: #792ec9;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(#792ec9, 0.1);
    }
  }
}
</style>