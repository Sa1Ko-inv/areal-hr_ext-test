<template>
  <OrganizationList
      :organizations="sortedOrganizations"
      :createError="createError"
      :updateError="updateError"
      @create="createOrganization"
      @update="updateOrganization"
      @delete="deleteOrganization"
  />
</template>

<script>
import OrganizationList from "@/components/organizations/organizationList.vue";
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization
} from "@/http/organizationAPI.js";

export default {
  components: {OrganizationList},
  data() {
    return {
      organizations: [],
      createError: null,
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingOrganizationId: null // Для отслеживания какой организации показывать ошибку
    }
  },
  computed: {
    sortedOrganizations() {
      return [...this.organizations].sort((a, b) => a.id - b.id);
    }
  },
  methods: {
    async getOrganizations() {
      try {
        const response = await fetchOrganizations();
        this.organizations = response.data;
      } catch (error) {
        console.error('Ошибка при получении организаций:', error);
      }
    },
    async createOrganization(organization) {
      try {
        this.createError = null; // Сбрасываем ошибку перед запросом
        const response = await createOrganization(organization.name, organization.comment);
        this.organizations.push(response.data);
        this.getOrganizations();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.createError = error.response.data.errors[0].message; // Сохраняем сообщение об ошибке
          console.error('Ошибка при создании организации:', error);
        } else {
          this.createError = 'Произошла ошибка при создании организации';
        }
        console.error('Ошибка при создании организации:', error);
      }
    },
    async updateOrganization(updatedOrganization) {
      console.log('Updating organization with data:', updatedOrganization);
      try {
        this.updateError = null; // Сбрасываем ошибку
        this.updatingOrganizationId = updatedOrganization.id; // Запоминаем ID организации
        await updateOrganization(
            updatedOrganization.id,
            updatedOrganization.name,
            updatedOrganization.comment
        );
        this.getOrganizations();
        this.updatingOrganizationId = null; // Сбрасываем после успеха
      } catch (error) {
        console.log('Full error object:', error);
        console.log('Error response data:', error.response?.data);
        if (error.response && error.response.data && error.response.data.errors) {
          this.updateError = {
            id: updatedOrganization.id,
            message: error.response.data.errors[0].message
          };
        } else {
          this.updateError = {
            id: updatedOrganization.id,
            message: 'Произошла ошибка при обновлении организации'
          };
        }
        console.error('Ошибка при обновлении организации:', error);
      }
    },

    async deleteOrganization(id) {
      try {
        await deleteOrganization(id);
        this.organizations = this.organizations.filter(org => org.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении организации:', error);
      }
    }
  },
  mounted() {
    this.getOrganizations();
  }
}
</script>