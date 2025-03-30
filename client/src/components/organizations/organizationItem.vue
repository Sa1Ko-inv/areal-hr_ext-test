<template>
  <div class="organization">
    <div v-if="!isEditing">
      <router-link
          :to="`/organization/${organization.id}`"
          class="organization-link"
      >
        <div class="organization__info">
          <div class="organization__name"><strong>Организация:</strong> {{ organization.name }}</div>
          <div class="organization__comment" v-if="organization.comment"><strong>Комментарий:</strong> {{ organization.comment }}</div>
        </div>
      </router-link>

      <div class="organization__btn">
        <button @click="startEdit" class="organization__button organization__button--edit">
          Редактировать
        </button>
        <button @click="deleteOrganization" class="organization__button organization__button--delete">
          Удалить
        </button>
      </div>
    </div>

    <div class="organization__edit" v-else>
      <div class="organization__edit-top">
        <input v-model="editedName" type="text" class="organization__edit-input" placeholder="Название">
        <div class="organization__edit-buttons">
          <button @click="saveEdit" class="organization__button organization__button--save">Сохранить</button>
          <button @click="cancelEdit" class="organization__button organization__button--cancel">Отмена</button>
        </div>
      </div>
      <textarea v-model="editedComment" class="organization__edit-textarea" placeholder="Комментарий"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.organization.name,
      editedComment: this.organization.comment || ''
    }
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.editedName = this.organization.name;
      this.editedComment = this.organization.comment || '';
    },
    cancelEdit() {
      this.isEditing = false;
    },
    saveEdit() {
      this.$emit('update', {
        id: this.organization.id,
        name: this.editedName,
        comment: this.editedComment
      });
      this.isEditing = false;
    },
    deleteOrganization() {
      this.$emit('delete', this.organization.id);
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-link {
  text-decoration: none;
  color: inherit;
}
.organization {
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

  &__name, &__comment {
    padding: 5px 0;
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
    flex-direction: column;
    gap: 12px;
    width: 100%;

    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
    }

    &-buttons {
      display: flex;
      gap: 10px;
    }

    &-input {
      padding: 8px 12px;
      border: 1px solid #792ec9;
      border-radius: 4px;
      font-size: 16px;
      flex: 1;
      min-width: 200px;
    }

    &-textarea {
      width: 960px;
      padding: 8px 5px;
      border: 1px solid #792ec9;
      border-radius: 4px;
      font-size: 16px;
      min-height: 80px;
      resize: vertical;
    }
  }

  &__button {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;
    white-space: nowrap;

    &--edit {
      background-color: transparent;
      color: #792ec9;
      border-color: #792ec9;

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