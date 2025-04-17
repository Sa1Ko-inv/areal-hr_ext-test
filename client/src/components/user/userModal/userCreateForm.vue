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
      <MyInput
        size="medium"
        v-model="user.last_name"
        placeholder="Фамилия"
        type="text"
        required
      />
      <MyInput
        size="medium"
        v-model="user.first_name"
        placeholder="Имя"
        type="text"
        required
      />
      <MyInput
        size="medium"
        v-model="user.middle_name"
        placeholder="Отчество"
        type="text"
      />
      <MyInput
        size="medium"
        v-model="user.login"
        placeholder="Логин"
        type="text"
        required
      />
      <MyInput
        size="medium"
        v-model="user.password"
        placeholder="Пароль"
        type="password"
        required
      />

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
form {
  padding: 20px;
  padding-right: 50px;
}
h4 {
  color: #792ec9;
  margin-bottom: 20px;
  font-size: 1.5rem;
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
</style>