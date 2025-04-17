<template>
  <div>
    <h1>Вход в систему</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="signIn">
      <input v-model="logined" placeholder="Введите ваш login" required />
      <input
        v-model="password"
        type="password"
        placeholder="Введите ваш пароль"
        required
      />
      <button type="submit">Войти</button>
      <button @click="Check" type="submit">проверка</button>
    </form>
  </div>
</template>

<script setup>
import { UserStore } from '@/store/UserStore.js';
import { login } from '@/http/userAPI.js';
import { ref } from 'vue';

// Обозначение переменных
const logined = ref('');
const password = ref('');
const userStore = UserStore();


const Check = () => {
  console.log(userStore.isAuth);
};

const signIn = async () => {
  try {
    const response = await login(logined.value, password.value);
    userStore.setUser(`${response.last_name} ${response.first_name} ${response.middle_name}`);
    userStore.setIsAuth(true);
    userStore.setRole(response.role);
    console.log('Пользователь:', userStore.user, 'Роль:', userStore.role, 'Авторизован:', userStore.isAuth);
  } catch (error) {
    this.error = 'Ошибка входа. Проверьте логин и пароль.';
    console.error('Ошибка входа:', error);
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
