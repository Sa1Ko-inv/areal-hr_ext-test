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
  emit('create', user);
  console.log(user)
  dialogCreateUser.value = false;
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
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="search-button clear-button"
      >
        ✕
      </button>
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
.search-container {
  position: relative;
  max-width: 1280px;
  margin-bottom: 20px;

  .search-button {
    position: absolute;
    right: -15px;
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