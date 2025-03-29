<template>
  <OrganizationList
  :organizations="organizations"
  />
</template>

<script>
import OrganizationList from "@/components/organizations/organizationList.vue";
import {fetchOrganizations} from "@/http/organizationAPI.js";

export default {
  components: {OrganizationList},
  data() {
    return {
      organizations: [],
    }
  },

  methods: {
    async getOrganizations() {
      try {
        const response = await fetchOrganizations();
        this.organizations = response.data;
        console.log(this.organizations);
      } catch (error) {
        console.error('Ошибка при получении организаций:', error);
      }
    },
  },
  mounted() {
    this.getOrganizations();
  },
}
</script>

<style lang="scss" scoped>

</style>