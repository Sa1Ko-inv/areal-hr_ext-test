<script setup>
import MyButton from '@/components/UI/MyButton.vue';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import UserCreateForm from '@/components/user/userModal/userCreateForm.vue';
import { ref } from 'vue';
import UserDeleteHistory from '@/components/user/userModal/userDeleteHistory.vue';
import UserItems from '@/components/user/userItems.vue';
import MyInput from '@/components/UI/MyInput.vue';

defineProps({
  users: {
    type: Array,
    required: true,
  },
  createError: {
    type: {},
    default: null,
  },
});
const emit = defineEmits(['create', 'update', 'delete', 'search']);
// Переменные
const dialogCreateUser = ref(false);
const dialogDeleteUser = ref(false);
const searchQuery = ref('');
const searchTimeout = ref(null);

// Открытие модального окна создания пользователя
const showCreateUser = () => {
  dialogCreateUser.value = true;
};
// Открытие модального окна удаленных пользователей
const showDeleteUser = () => {
  dialogDeleteUser.value = true;
};
// Закрытие модальных окон
const closeModal = () => {
  dialogCreateUser.value = false;
  dialogDeleteUser.value = false;
};

// Создание пользователя
const createUser = (user) => {
  emit('create', {user, onSuccess: () => {
  dialogCreateUser.value = false;
    }});
};
// Обновление пользователя
const userUpdate = () => {
  emit('update');
}

// Переключение порядка сортировки
const debounceSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    performSearch();
  }, 600)
}
// Выполнения поиска при нажатии кнопки или Enter
const performSearch = () => {
  emit('search', searchQuery.value.trim());
}
// Очистка поискового запроса
const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '')
}
// Функция удаления пользователя
const deleteUser = async (id) => {
    emit('delete', id);
}
</script>

<template>
  <div class="userList">
    <h3>Список пользователей</h3>
    <div class="button--primary">
    <MyButton modifier="create" @click="showCreateUser">Создать пользователя</MyButton>

    <MyButton modifier="showHistory" @click="showDeleteUser">Просмотр удаленных пользователей</MyButton>
    </div>

    <div class="search-container">
      <MyInput
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по ФИО..."
        class="search-input"
        @input="debounceSearch"
      />
      <MyButton
        v-if="searchQuery"
        @click="clearSearch"
        class="search-button clear-button"
      >
        ✕
      </MyButton>
    </div>

    <div class="userList__items">
      <UserItems
      v-for="user in users"
      :user="user"
      :key="user.id"
      @user-update="userUpdate"
      @deleteUsers="deleteUser"
      />
    </div>
  </div>

  <!-- Модальное окно создания пользователя -->
  <MyModalWindow v-model:show="dialogCreateUser">
    <UserCreateForm
    :error="createError"
    @create="createUser"
    :cancel="closeModal"
    />
  </MyModalWindow>
  <!-- Модальное окно просмотра удаленных пользователей -->
  <MyModalWindow v-model:show="dialogDeleteUser">
    <UserDeleteHistory
    :cancel="closeModal"
    />
  </MyModalWindow>

</template>

<style scoped lang="scss">
@use "@/styles/base" as *;
.userList {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}

h3 {
  color: $primary-color;
  margin-bottom: 20px;
  font-size: $font-size-title;
}
.button--primary {
  margin-bottom: 15px;
}
.search-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;

  .search-button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: #666;

    &:hover {
      color: #333;
    }

    &.clear-button {
      font-size: 1.2rem;
      line-height: 1;
    }
  }
}
</style>