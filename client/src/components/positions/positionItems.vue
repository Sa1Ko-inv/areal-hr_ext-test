<template>
  <div class="position">
    <div class="position__info" v-if="!isEditing">
      <div class="position__name"><strong>Должность:</strong> {{ position.name }}</div>
    </div>

    <div class="position__edit" v-else>
      <input v-model="editedName" type="text" class="position__edit-input">
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
      editedName: this.position.name
    }
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.editedName = this.position.name;
    },
    cancelEdit() {
      this.isEditing = false;
    },
    saveEdit() {
      this.$emit('update', { id: this.position.id, name: this.editedName });
      this.isEditing = false;
    },
    deletePositions() {
      this.$emit('delete', this.position.id);
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
    gap: 8px;
    align-items: center;

    &-input {
      padding: 6px 12px;
      border: 1px solid #792ec9;
      border-radius: 4px;
      font-size: 16px;
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
</style>