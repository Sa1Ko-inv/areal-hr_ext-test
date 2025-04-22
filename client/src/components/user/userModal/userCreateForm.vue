<script setup>
import { ref } from 'vue';
import MyInput from '@/components/UI/MyInput.vue';
import MySelect from '@/components/UI/MySelect.vue';
import MyButton from '@/components/UI/MyButton.vue'; // Предполагается, что у вас есть такой компонент

defineProps({
  cancel: {
    type: Function,
    required: true,
  },
  error: {
    type: {},
    default: null,
  },
});

const emit = defineEmits(['create']);

// Варианты ролей для выпадающего списка
const roleOptions = [
  { value: 'admin', name: 'Администратор' },
  { value: 'hr_manager', name: 'HR менеджер' },
];

const user = ref({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  password: '',
  role: '', // Здесь будет храниться выбранное значение
});

const createUser = () => {
  emit('create', user.value);
  // Сброс формы
  user.value = {
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    password: '',
    role: '',
  };
};
</script>

<template>
  <form @submit.prevent="createUser">
    <h4>Создание пользователя</h4>
    <div class="form-group">
      <div v-if="error.last_name" class="error-message">{{ error.last_name }}</div>
      <MyInput
        size="medium"
        v-model="user.last_name"
        placeholder="Фамилия"
        type="text"

      />
      <div v-if="error.first_name" class="error-message">{{ error.first_name }}</div>
      <MyInput
        size="medium"
        v-model="user.first_name"
        placeholder="Имя"
        type="text"

      />
      <div v-if="error.middle_name" class="error-message">{{ error.middle_name }}</div>
      <MyInput
        size="medium"
        v-model="user.middle_name"
        placeholder="Отчество"
        type="text"
      />
      <div v-if="error.login" class="error-message">{{ error.login }}</div>
      <MyInput
        size="medium"
        v-model="user.login"
        placeholder="Логин"
        type="text"

      />
      <div v-if="error.password" class="error-message">{{ error.password }}</div>
      <MyInput
        size="medium"
        v-model="user.password"
        placeholder="Пароль"
        type="password"

      />
      <div v-if="error.role" class="error-message">{{ error.role }}</div>
      <MySelect
        v-model="user.role"
        :options="roleOptions"
        placeholder="Выберите роль"
      />
    </div>

    <div class="form-actions">
      <MyButton type="submit" modifier="create">Создать</MyButton>
      <MyButton type="button" modifier="cancel" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import "@/styles/base";
form {
  padding: 20px;
  padding-right: 50px;
}

h4 {
  color: $primary-color;
  margin-bottom: 20px;
  font-size: $font-size-title;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.error-message {
  color: $danger-color;
  margin-top: 5px;
  font-size: $font-size-text;
  font-weight: normal;
}
</style>