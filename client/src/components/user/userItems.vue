<script setup>
import MyButton from '@/components/UI/MyButton.vue';

defineProps({
  user: {
    type: Object,
    required: true,
  },
})

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
      <MyButton @click="deletePositions" modifier="edit">Редактировать</MyButton>
      <MyButton @click="showHistoryDialog" modifier="showHistory">История</MyButton>
      <MyButton @click="deletePositions" modifier="delete">Удалить</MyButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  width: 1500px;
  margin: auto;
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