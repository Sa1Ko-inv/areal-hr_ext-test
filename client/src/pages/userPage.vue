<template>
  <UserList
    :users="users"
    :createError="createError"
    @create="createUsers"
    @update="handleUserUpdate"
    @search="handleSearch"
    @delete="deletedUser"
  />

  <!--Пагинация-->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<script setup>

import { computed, onMounted, ref } from 'vue';
import { createUser, deleteUser, fetchUsers } from '@/http/userAPI.js';
import UserList from '@/components/user/userList.vue';
import MyPagination from '@/components/UI/MyPagination.vue';

// Задаем переменные
const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(7);
const totalItems = ref(0);
const createError = ref({last_name: null, first_name: null, middle_name: null, login: null, password: null, role: null});
const searchQuery = ref('');

// Функция для получения пользователей
const getUser = async () => {
  try {
    const response = await fetchUsers(currentPage.value, pageSize.value, searchQuery.value);
    users.value = response.data.rows;
    totalItems.value = response.data.count;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
  }
};
// Функция переноса на первую страницу при поиске
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1; // Сбрасываем на первую страницу при новом поиске
  getUser();
};

// Функция для создания пользователя
const createUsers = async (user, onSuccess) => {
  console.log(user);
  try {
    createError.value = {
      last_name: null,
      first_name: null,
      middle_name: null,
      login: null,
      password: null,
      role: null,
    };
    const response = await createUser(user.last_name, user.first_name, user.middle_name, user.login, user.password, user.role);
    console.log('Пользователь успешно создан:', response);
    users.value.push(response.data);
    getUser();

    onSuccess()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      error.response.data.errors.forEach(err => {
        if (err.field && Object.prototype.hasOwnProperty.call(createError.value, err.field)) {
          createError.value[err.field] = err.message;
        }
      })
    } else {
      createError.value = 'Произошла ошибка при создании пользователя';
    }
    console.error('Ошибка при создании пользователя:', error);
  }
}

const handleUserUpdate = () => {
  try {
    getUser();
  } catch (error) {
    console.error('Ошибка при обновлении пользователя', error);
  }
}

// Функция для удаления пользователя
const deletedUser = async (id) => {
  try {
    await deleteUser(id)
    users.value = users.value.filter((user) => user.id !== id);
    getUser()
    alert('Пользователь успешно удален');
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    alert('Ошибка при удалении пользователя');
  }
}

// Функция для отображения страниц
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

// Функция для переключения страниц
const changePage = (page) => {
  currentPage.value = page;
  getUser();
};

onMounted(getUser);


</script>

<style lang="scss" scoped>
</style>
