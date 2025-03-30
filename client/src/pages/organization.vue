<template>
  <OrganizationList
      :organizations="sortedOrganizations"
      @create="createOrganization"
      @update="updateOrganization"
      @delete="deleteOrganization"
  />
</template>

<script>
import OrganizationList from "@/components/organizations/organizationList.vue";
import {createOrganization, deleteOrganization, fetchOrganizations, updateOrganization} from "@/http/organizationAPI.js";

export default {
  components: {OrganizationList},
  data() {
    return {
      organizations: [],
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
        const response = await createOrganization(organization.name, organization.comment);
        this.organizations.push(response.data);
        this.getOrganizations();
      } catch (error) {
        console.error('Ошибка при создании организации:', error);
      }
    },
    async updateOrganization(updatedOrganization) {
      try {
        await updateOrganization(
            updatedOrganization.id,
            updatedOrganization.name,
            updatedOrganization.comment
        );
        this.getOrganizations();
      } catch (error) {
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