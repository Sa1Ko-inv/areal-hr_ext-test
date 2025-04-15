<template>
  <div class="organization">
    <div v-if="!isEditing">
      <router-link
          :to="`/organization/${organization.id}`"
          class="organization-link"
      >
        <div class="organization__info">
          <div class="organization__name"><strong>Организация:</strong> {{ organization.name }}</div>
          <div class="organization__comment" v-if="organization.comment"><strong>Комментарий:</strong>
            {{ organization.comment }}
          </div>
        </div>
      </router-link>

      <div class="organization__btn">
        <MyButton modifier="edit" @click="startEdit" >
          Редактировать
        </MyButton>
        <MyButton modifier="showHistory" @click="showHistoryDialog" class="organization__button organization__button--edit">
          История
        </MyButton>
        <MyButton modifier="delete" @click="deleteOrganization" class="organization__button organization__button--delete">
          Удалить
        </MyButton>
      </div>
    </div>

    <div class="organization__edit" v-else>
      <div class="organization__edit-top">
        <MyInput v-model.number="editedName" type="text" placeholder="Название"/>
        <div class="organization__edit-buttons">
          <MyButton modifier="save" @click="saveEdit">Сохранить</MyButton>
          <MyButton modifier="cancel" @click="cancelEdit">Отмена</MyButton>
        </div>
      </div>
      <textarea v-model.number="editedComment" class="organization__edit-textarea" placeholder="Комментарий"></textarea>
      <div v-if="error" class="organization__error">
        {{ error }}
      </div>
    </div>
  </div>

  <!-- Модальное окно просмотра истории организации -->
  <MyModalWindow v-model:show="dialogVisibleHistory">
    <OrganizationWatchHistory
        :organization="organization"
        :cancel="cancelModal"
    />
  </MyModalWindow>

</template>

<script>
import OrganizationWatchHistory from "@/components/organizations/organizationModal/organizationWatchHistory.vue";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MyInput from "@/components/UI/MyInput.vue";

export default {
  components: {MyInput, MyButton, MyModalWindow, OrganizationWatchHistory},
  props: {
    organization: {
      type: Object,
      required: true
    },
    error: { // Добавляем проп для ошибки
      type: String,
      default: null
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.organization.name,
      editedComment: this.organization.comment || '',
      dialogVisibleHistory: false,
      dialogVisibleDelete: false
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
    },

    // просмотр историй
    showHistoryDialog() {
      this.dialogVisibleHistory = true;
    },
    showDeleteOrganization() {
      this.dialogVisibleDelete = true;
    },
    cancelModal() {
      this.dialogVisibleHistory = false;
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

  &__error {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 8px;
  }

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
}
</style>