<script setup>
import MyButton from '@/components/UI/MyButton.vue';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import UserEdit from '@/components/user/userModal/userEdit.vue';
import { ref } from 'vue';
import UserWatchHistory from '@/components/user/userModal/userWatchHistory.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['deleteUsers', 'user-update']);

// Объявляем переменные
const dialogVisibleEdit = ref(false);
const dialogVisibleHistory = ref(false);

// Функция для открытия модального окна редактирования
const showEditDialog = () => {
  dialogVisibleEdit.value = true;
};
// Функция для открытия модального окна истории
const showHistoryDialog = () => {
  dialogVisibleHistory.value = true;
};

// Функция закрытия модальный окон
const canselModal = () => {
  dialogVisibleEdit.value = false
  dialogVisibleHistory.value = false;
}
// Функция для получения названия роли
const getRoleName = (role) => {
  switch (role) {
    case 'admin':
      return 'Администратор';
    case 'hr_manager':
      return 'Кадровый менеджер';
    default:
      return role;
  }
};

// Функция удаления пользователя
const deleteUsers = async () => {
  if(confirm('Вы уверены, что хотите удалить пользователя?')) {
    emit('deleteUsers', props.user.id);
  }
}

//Функция обновления пользователя
const userUpdated = () => {
  emit('user-update');
}
</script>

<template>
  <div class="user-card">
    <div class="user-card__info">
      <div class="user-card__field">
        <span class="user-card__label">ФИО:</span>
        <span class="user-card__value">{{ user.last_name }} {{ user.first_name }} {{ user.middle_name }}</span>
      </div>
      <div class="user-card__field">
        <span class="user-card__label">Логин:</span>
        <span class="user-card__value">{{ user.login }}</span>
      </div>
      <div class="user-card__field">
        <span class="user-card__label">Роль:</span>
        <span class="user-card__value">{{ getRoleName(user.role) }}</span>
      </div>
    </div>
    <div class="user-card__divider"></div>
    <div class="user-card__actions">
      <MyButton @click="showEditDialog" modifier="edit">Редактировать</MyButton>
      <MyButton @click="showHistoryDialog" modifier="showHistory">История</MyButton>
      <MyButton @click="deleteUsers" modifier="delete">Удалить</MyButton>
    </div>

    <!--  Модальное окно для редактирования пользователя  -->
    <MyModalWindow v-model:show="dialogVisibleEdit">
      <UserEdit
      :user="user"
      @user-update="userUpdated"
      :cancel="canselModal"
      />
    </MyModalWindow>
    <!--  Модальное окно для истории пользователя  -->
    <MyModalWindow v-model:show="dialogVisibleHistory">
      <UserWatchHistory
      :userId="props.user.id"
      :cancel="canselModal"
      />
    </MyModalWindow>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  width: 1500px;
  margin: 15px auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid #eaeaea;

  &__info {
    flex: 1;
    padding-right: 16px;
    padding-left: 10px;
  }

  &__field {
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-weight: 600;
    //color: #666;
    min-width: 80px;
    margin-right: 12px;
    font-size: 16px;
  }

  &__value {
    //color: #333;
    font-size: 17px;
  }

  &__divider {
    height: 60px;
    width: 1px;
    background: #e0e0e0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 140px;

    button {
      width: 100%;
    }
  }
}
</style>