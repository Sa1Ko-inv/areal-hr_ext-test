<template v-if="userStore.isAdmin()">
  <UserList
    :users="users"
    @create="createUsers"
    @update="handleUserUpdate"
    @search="handleSearch"
    @delete="deletedUser"
  />

  <!--Пагинация-->
  <div class="pagination" v-if="totalPages > 1">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="pagination-button"
    >
      Предыдущая
    </button>

    <span class="pagination-info"
    >Страница {{ currentPage }} из {{ totalPages }}</span
    >

    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="pagination-button"
    >
      Следующая
    </button>
  </div>
</template>

<script setup>

import { computed, onMounted, ref } from 'vue';
import { createUser, deleteUser, fetchUsers } from '@/http/userAPI.js';
import UserList from '@/components/user/userList.vue';
import { UserStore } from '@/store/UserStore.js';

// Задаем переменные
const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(3);
const totalItems = ref(0);
const createError = ref(null);
const searchQuery = ref('');
const userStore = UserStore()

// Функция для получения пользователей
const getUser = async () => {
  try {
    const response = await fetchUsers(currentPage.value, pageSize.value, searchQuery.value);
    console.log(response);
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
const createUsers = async (user) => {
  console.log(user);
  try {
    createError.value = null;
    const response = await createUser(user.last_name, user.first_name, user.middle_name, user.login, user.password, user.role);
    console.log('Пользователь успешно создан:', response);
    users.value.push(response.data);
    getUser();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      createError.value = error.response.data.errors[0].message;
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
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
}
</style>
