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

<!--<template>
  <OrganizationDepartments
      v-if="organization"
      :organization="organization"
  />
</template>

<script>
import OrganizationDepartments from '@/components/organizations/organizationDepartments.vue';
import { fetchOrganizationWithDepartments } from '@/http/organizationAPI';

export default {
  components: { OrganizationDepartments },
  data() {
    return {
      organization: null
    }
  },
  async created() {
    const orgId = this.$route.params.id;
    try {
      this.organization = await fetchOrganizationWithDepartments(orgId);
    } catch (error) {
      console.error('Ошибка загрузки организации:', error);
    }
  }
}
</script>-->