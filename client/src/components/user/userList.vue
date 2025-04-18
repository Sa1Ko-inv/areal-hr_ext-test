<script setup>
import MyButton from '@/components/UI/MyButton.vue';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import UserCreateForm from '@/components/user/userModal/userCreateForm.vue';
import { ref } from 'vue';
import UserDeleteHistory from '@/components/user/userModal/userDeleteHistory.vue';
import UserItems from '@/components/user/userItems.vue';

defineProps({
  users: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['create', 'update', 'delete']);
// Открытие модального окна создания пользователя
const dialogCreateUser = ref(false);
const dialogDeleteUser = ref(false);
const showCreateUser = () => {
  dialogCreateUser.value = true;
};
const showDeleteUser = () => {
  dialogDeleteUser.value = true;
};
// Закрытие модального окна
const closeModal = () => {
  dialogCreateUser.value = false;
  dialogDeleteUser.value = false;
};

// Создание пользователя
const createUser = (user) => {
  emit('create', user);
  console.log(user)
  dialogCreateUser.value = false;
};

const userUpdate = () => {
  emit('update');
}
</script>

<template>
  <div class="userList">
    <h3>Список пользователей</h3>
    <div class="button--primary">
    <MyButton modifier="create" @click="showCreateUser">Создать пользователя</MyButton>

    <MyButton modifier="showHistory" @click="showDeleteUser">Просмотр удаленных пользователей</MyButton>
    </div>

    <div class="userList__items">
      <UserItems
      v-for="user in users"
      :user="user"
      :key="user.id"
      @user-update="userUpdate"
      />
    </div>
  </div>

  <!-- Модальное окно создания пользователя -->
  <MyModalWindow v-model:show="dialogCreateUser">
    <UserCreateForm
    @create="createUser"
    :cancel="closeModal"
    />
  </MyModalWindow>
  <!-- Модальное окно просмотра удаленных пользователей -->
  <MyModalWindow v-model:show="dialogDeleteUser">
    <UserDeleteHistory />
  </MyModalWindow>

</template>

<style scoped lang="scss">
.userList {
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
}

h3 {
  margin-bottom: 20px;
}
.button--primary {
  margin-bottom: 15px;
}
</style>