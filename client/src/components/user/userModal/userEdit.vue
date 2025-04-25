<template>
  <form @submit.prevent="saveUser">
    <h2>Редактирование пользователя</h2>
    <div v-if="updateError" class="error-message">
      {{updateError.message}}
    </div>
    <div class="">
      <div class="form-group">
        <label for="">Фамилия</label>
        <MyInput v-model="editUser.last_name" />
      </div>
      <div class="form-group">
        <label for="">Имя</label>
        <MyInput v-model="editUser.first_name" />
      </div>
      <div class="form-group">
        <label for="">Отчество</label>
        <MyInput v-model="editUser.middle_name" />
      </div>
      <div class="form-group">
        <label for="">Логин</label>
        <MyInput v-model="editUser.login" />
      </div>
      <div class="form-group">
        <label for="">Пароль</label>
        <MyInput v-model="editUser.password" />
      </div>
      <div class="form-group">
        <label for="">Роль</label>
        <MySelect
          v-model="editUser.role"
          :options="roleOptions"
          placeholder="Сменить роль..."
        />
      </div>
    </div>
    <div class="form-action">
      <MyButton type="submit" modifier="save">Сохранить</MyButton>
      <MyButton modifier="cancel" @click="props.cancel" type="button" >Отмена</MyButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { updateUser } from '@/http/userAPI.js';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MySelect from '@/components/UI/MySelect.vue';

const props = defineProps({
  cancel: {
    type: Function,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['user-update']);
const editUser = ref({
  id: props.user ? props.user.id : null,
  first_name: props.user ? props.user.first_name : null, //Имя
  last_name: props.user ? props.user.last_name : null, // Фамилия
  middle_name: props.user ? props.user.middle_name : null, // Отчество
  login: props.user ? props.user.login : null,
  password: '',
  role: props.user ? props.user.role : null,
});
const updateError = ref(null)
// Варианты ролей для выпадающего списка
const roleOptions = [
  { value: 'admin', name: 'Администратор' },
  { value: 'hr_manager', name: 'HR менеджер' },
];


const saveUser = async () => {
  try {
    updateError.value = null;

    const userData = {};

    // Сравниваем каждое поле, кроме пароля
    for (const key in editUser.value) {
      if (key === 'password') {
        // Отправляем пароль только если он был изменён (не пустой)
        if (editUser.value.password && editUser.value.password !== props.user.password) {
          userData.password = editUser.value.password;
        }
      } else if (editUser.value[key] !== props.user[key]) {
        userData[key] = editUser.value[key];
      }
    }

    const userId = props.user.id;
    await updateUser(userId, userData);
    emit('user-update');
    props.cancel()
  } catch (error) {
    if(error.response && error.response.data && error.response.data.errors) {
      updateError.value = {
        id: props.user.id,
        message: error.response.data.errors[0].message,
      };
    } else {
      updateError.value = {
        id: props.user.id,
        message: 'Произошла ошибка при обновлении пользователя',
      };
    }
    console.error('Ошибка при обновлении сотрудника', error);
  }
};
</script>

<style lang="scss" scoped>
form {
  max-width: 100%;
  margin: 0 auto;
  padding: 32px 56px 32px 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    color: #792ec9;
    margin-bottom: 24px;
    font-size: 24px;
    text-align: center;
  }
}

.error-message {
  padding: 12px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #792ec9;
    font-weight: 500;
    font-size: 15px;
  }
}

.form-action {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}
</style>