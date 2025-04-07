<template>
  <div class="organizationList">
    <h3 class="organizationList__title">Список организаций</h3>
    <button @click="showOrganizationCreate" class="organizationList__create-btn">
      Создать организацию
    </button>
    <button style="margin-left: 10px" @click="showOrganizationDeleteHistory" class="organizationList__create-btn">
      Посмотреть удаленные организации
    </button>
    <div class="organizationList__items">

      <OrganizationItem
          v-for="organization in organizations"
          :organization="organization"
          :key="organization.id"
          :error="updateError?.id === organization.id ? updateError.message : null"
          @update="updateOrganization"
          @delete="deleteOrganization"
      />


    </div>
  </div>
  <!--Модальное окно для создания новой организации-->
  <MyModalWindow v-model:show="dialogCreateOrganization">
    <OrganizationCreateForm
        @create="createOrganization"
        :cancel="cancelModal"
        :error="createError"
    />
  </MyModalWindow>

  <!--Модальное окно для просмотра удаленных организаций-->
  <MyModalWindow v-model:show="dialogHistoryDeleteOrganization">
    <OrganizationDeleteHistory
        :cancel="cancelModal"
    />
  </MyModalWindow>
</template>

<script>
import OrganizationItem from "@/components/organizations/organizationItem.vue";
import OrganizationCreateForm from "@/components/organizations/organizationCreateForm.vue";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import OrganizationDeleteHistory from "@/components/organizations/organizationModal/organizationDeleteHistory.vue";

export default {
  components: {OrganizationDeleteHistory, MyModalWindow, OrganizationCreateForm, OrganizationItem},
  props: {
    organizations: {
      type: Array,
      required: true
    },
    createError: {
      type: String,
      default: null
    },
    updateError: { // Добавляем проп для ошибки обновления
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogCreateOrganization: false,
      dialogHistoryDeleteOrganization: false,
    }
  },
  methods: {
    // Методы для открытия модальных окон
    showOrganizationCreate() {
      this.dialogCreateOrganization = true;
    },
    showOrganizationDeleteHistory() {
      this.dialogHistoryDeleteOrganization = true;
    },
    // Метод создания новой организации
    createOrganization(organization) {
      this.$emit('create', organization);
      this.dialogCreateOrganization = false;
    },
    updateOrganization(updatedOrganization) {
      this.$emit('update', updatedOrganization);
    },
    deleteOrganization(id) {
      this.$emit('delete', id);
    },
    cancelModal() {
      this.dialogCreateOrganization = false;
      this.dialogHistoryDeleteOrganization = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.organizationList {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  &__title {
    color: #792ec9;
    margin-bottom: 20px;
  }

  &__create-btn {
    padding: 8px 16px;
    background-color: #792ec9;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #792ec9
    }
  }

  &__items {
    margin-top: 20px;
  }
}
</style>