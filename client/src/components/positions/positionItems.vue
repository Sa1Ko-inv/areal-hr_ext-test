<template>
  <div class="position">
    <div class="position__info" v-if="!isEditing">
      <div class="position__name"><strong>Должность:</strong> {{ position.name }}</div>
    </div>
    <div class="position__edit" v-else>
      <div class="position__edit-container">
        <input
            v-model="editedName"
            type="text"
            class="position__edit-input"
        >
        <div v-if="error" class="position__error">
          {{ error }}
        </div>
      </div>

      <button @click="saveEdit" class="position__button position__button--save">Сохранить</button>
      <button @click="cancelEdit" class="position__button position__button--cancel">Отмена</button>
    </div>
    <div class="position__btn" v-if="!isEditing">
      <button @click="startEdit" class="position__button position__button--edit">
        Редактировать
      </button>
      <button @click="deletePositions" class="position__button position__button--delete">
        Удалить
      </button>
      <button @click="showHistoryDialog" class="position__button position__button--edit">
        История
      </button>
    </div>
  </div>

<!-- Модальное окно просмотра истории должности -->
  <MyModalWindow v-model:show="dialogVisibleHistory">
    <PositionWathHistory
    :position="position"
    :close="canselModal"
    />
  </MyModalWindow>
</template>

<script>
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import PositionWathHistory from "@/components/positions/positionModal/positionWathHistory.vue";

export default {
  components: {PositionWathHistory, MyModalWindow},
  props: {
    position: {
      type: Object,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.position.name,
      dialogVisibleHistory: false,
    }
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
        name: this.editedName
      });
      this.isEditing = false;
    },
    deletePositions() {
      if (confirm('Вы уверены, что хотите удалить эту должность?')) {
        this.$emit('delete', this.position.id);
      }
    },

  //   Методы истории
  //   Открытие модального окна истории
    showHistoryDialog() {
      this.dialogVisibleHistory = true;
    },
    showDeleteHistory() {
      this.dialogVisibleDeletePosition = true;
    },
  // Закрытие модальных окон
    canselModal() {
      this.dialogVisibleHistory = false;
    },

  },
}
</script>

<style lang="scss" scoped>
.position {
  border: 2px solid #792ec9;
  border-radius: 8px;
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
    box-shadow: 0 2px 8px rgba(#792ec9, 0.2);
  }

  &__info {
    flex: 1;
  }
  &__error {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 8px;
  }
  &__name {
    strong {
      color: #792ec9;
    }
  }

  &__btn {
    display: flex;
    gap: 10px;
  }

  &__edit {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    flex: 1;

    &-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    &-input {
      padding: 6px 12px;
      border: 1px solid #792ec9;
      border-radius: 4px;
      font-size: 16px;

      &.input-error {
        border-color: #d32f2f;
      }
    }
  }

  &__button {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #792ec9;

    &--edit {
      background-color: transparent;
      color: #792ec9;

      &:hover {
        background-color: rgba(#792ec9, 0.1);
      }
    }

    &--delete {
      background-color: transparent;
      color: #d32f2f;
      border-color: #d32f2f;

      &:hover {
        background-color: rgba(#d32f2f, 0.1);
      }
    }

    &--save {
      background-color: transparent;
      color: #792ec9;
      border-color: #792ec9;

      &:hover {
        background-color: rgba(#792ec9, 0.1);
      }
    }

    &--cancel {
      background-color: transparent;
      color: #d32f2f;
      border-color: #d32f2f;

      &:hover {
        background-color: rgba(#d32f2f, 0.1);
      }
    }
  }
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
}

.general-error {
  background-color: #ffebee;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border-left: 3px solid #d32f2f;
  width: 100%;
}
</style>
