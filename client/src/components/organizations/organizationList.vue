<template>
  <div class="organizationList">
    <h3 class="organizationList__title">Список организаций</h3>
    <button @click="showDialog" class="organizationList__create-btn">
      Создать организацию
    </button>

    <MyModalWindow v-model:show="dialogVisible">
      <OrganizationCreateForm
          @create="createOrganization"
          :cancel="cancelCreate"
      />
    </MyModalWindow>

    <div class="organizationList__items">

        <OrganizationItem
            v-for="organization in organizations"
            :organization="organization"
            :key="organization.id"
            @update="updateOrganization"
            @delete="deleteOrganization"
        />


    </div>
  </div>
</template>

<script>
import OrganizationItem from "@/components/organizations/organizationItem.vue";
import OrganizationCreateForm from "@/components/organizations/organizationCreateForm.vue";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";

export default {
  components: {MyModalWindow, OrganizationCreateForm, OrganizationItem},
  props: {
    organizations: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    createOrganization(organization) {
      this.$emit('create', organization);
      this.dialogVisible = false;
    },
    updateOrganization(updatedOrganization) {
      this.$emit('update', updatedOrganization);
    },
    deleteOrganization(id) {
      this.$emit('delete', id);
    },
    cancelCreate() {
      this.dialogVisible = false;
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