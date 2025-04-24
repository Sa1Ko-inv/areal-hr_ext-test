<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Авторизация</h1>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
      <form @submit.prevent="signIn" class="auth-form">
        <div class="input-group">
          <MyInput
            v-model="logined"
            placeholder="Введите ваш login"
            required
          />
        </div>

        <div class="input-group">
          <MyInput
            v-model="password"
            type="password"
            placeholder="Введите ваш пароль"
            required
          />
        </div>
        <MyButton modifier="save" type="submit">Войти</MyButton>
      </form>
    </div>

  </div>
</template>

<script setup>
import { UserStore } from '@/store/UserStore.js';
import { login } from '@/http/userAPI.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

// Обозначение переменных
const logined = ref('');
const password = ref('');
const userStore = UserStore();
const router = useRouter();
const loginError = ref(null);

const signIn = async () => {
  try {
    loginError.value = null;
    const response = await login(logined.value, password.value);
    userStore.setUser(`${response.last_name} ${response.first_name} ${response.middle_name}`);
    userStore.setIsAuth(true);
    userStore.setRole(response.role);
    await router.push('/');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      loginError.value = error.response.data.errors[0].message;
      console.error('Ошибка при авторизации', error);
    } else if (error.response.data.message) {
      loginError.value = error.response.data.message;
    }

    console.error('Ошибка входа:', error);
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-card {
  background: $background-color-light;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 40px;
  width: 600px;
  max-width: 600px;
  transition: all 0.3s ease;
}

.auth-title {
  color: $primary-color;
  text-align: center;
  margin-bottom: 30px;
  font-size: $font-size-title;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  max-width: 575px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-message {
  text-align: center;
  margin-bottom: 15px;
}

</style>
