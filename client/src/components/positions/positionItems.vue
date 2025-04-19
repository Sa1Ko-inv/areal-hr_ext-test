<template>
  <div class="position">
    <div class="position__info" v-if="!isEditing">
      <div class="position__name">
        <strong>Должность:</strong> {{ position.name }}
      </div>
    </div>
    <div class="position__edit" v-else>
      <div class="position__edit-container">
        <MyInput
          v-model="editedName"
          type="text"
          size="medium"
          placeholder="Введите название должности"
          :error="!!error"
          class="position__edit-input"
        />
        <div v-if="error" class="position__error">
          {{ error }}
        </div>
      </div>

      <div class="position__actions">
        <MyButton @click="saveEdit" modifier="save">Сохранить</MyButton>
        <MyButton @click="cancelEdit" modifier="cancel">Отмена</MyButton>
      </div>
    </div>
    <div class="position__btn" v-if="!isEditing">
      <MyButton @click="startEdit" modifier="edit">Редактировать</MyButton>
      <MyButton @click="showHistoryDialog" modifier="showHistory">История</MyButton>
      <MyButton @click="deletePositions" modifier="delete">Удалить</MyButton>
    </div>
  </div>

  <!-- Модальное окно просмотра истории должности -->
  <MyModalWindow v-model:show="dialogVisibleHistory">
    <PositionWatchHistory :position="position" :close="canselModal" />
  </MyModalWindow>
</template>

<script>
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import PositionWatchHistory from '@/components/positions/positionModal/positionWatchHistory.vue';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton, MyInput, PositionWatchHistory, MyModalWindow },
  props: {
    position: {
      type: Object,
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isEditing: false,
      editedName: this.position.name,
      dialogVisibleHistory: false,
    };
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.editedName = this.position.name;
      this.errors = []; // Сбрасываем ошибки при начале редактирования
    },
    cancelEdit() {
      this.isEditing = false;
      this.errors = []; // Сбрасываем ошибки при отмене
    },
    saveEdit() {
      this.errors = []; // Сбрасываем ошибки перед сохранением
      this.$emit('update', {
        id: this.position.id,
        name: this.editedName,
      });
      this.isEditing = false;
    },
    deletePositions() {
      if (confirm('Вы уверены, что хотите удалить эту должность?')) {
        this.$emit('delete', this.position.id);
      }
    },

    // Методы истории
    showHistoryDialog() {
      this.dialogVisibleHistory = true;
    },
    // Закрытие модальных окон
    canselModal() {
      this.dialogVisibleHistory = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
.position {
  border: 2px solid $primary-color;
  border-radius: $border-radius;
  padding: 12px 16px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 500;
  background-color: rgba(#792ec9, 0.03);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: $box-shadow;
  }

  &__info {
    flex: 1;
  }

  &__edit {
    display: flex;
    align-items: center;
    gap: 35px;
    flex: 1;

    &-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
  }

  &__error {
    color: $danger-color;
    font-size: $font-size-text;
    margin-top: 8px;
  }
}
</style>
