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
            :class="{ 'input-error': getFieldError('name') }"
        >
        <!-- Отображение ошибки для поля name -->
        <div v-if="getFieldError('name')" class="error-message">
          {{ getFieldError('name') }}
        </div>
      </div>

      <!-- Отображение общих ошибок -->
      <div v-for="(error, index) in generalErrors" :key="index" class="error-message general-error">
        {{ error.message }}
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.position.name,
      errors: [] // Массив ошибок
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
      }, (errors) => {
        if (errors && errors.length > 0) {
          this.errors = errors;
        } else {
          this.isEditing = false;
        }
      });
    },
    deletePositions() {
      if (confirm('Вы уверены, что хотите удалить эту должность?')) {
        this.$emit('delete', this.position.id);
      }
    }
  },
  computed: {
    // Получаем ошибку для конкретного поля
    getFieldError() {
      return (fieldName) => {
        const error = this.errors.find(err => err.field === fieldName);
        return error ? error.message : null;
      };
    },

    // Получаем общие ошибки (не привязанные к полям)
    generalErrors() {
      return this.errors.filter(err => err.field === 'Общая ошибка' || err.field === 'general');
    }
  }
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
