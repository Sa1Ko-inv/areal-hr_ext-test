<template>
  <div class="organizationList">
    <!--    <MyModalWindow-->
    <!--        :visible="dialogVisible"-->
    <!--        @close="cancelCreate"-->
    <!--    >-->
    <!--      <OrganizationCreateForm-->
    <!--          @create="createOrganization"-->
    <!--          @cancel="cancelCreate"-->
    <!--      />-->
    <!--    </MyModalWindow>-->

    <div class="organizationList__items">
      <div class="organization" v-for="organization in organizations">
        <div class=""><strong>Название:</strong> {{ organization.name }}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {

  props: {
    organizations: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>