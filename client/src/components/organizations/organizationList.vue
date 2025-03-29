<template>
  <div class="organizationList">
    <h2>Список организаций</h2>
    <div class="organizationList__items">
      <router-link
          v-for="organization in organizations"
          :key="organization.id"
          :to="`/organization/${organization.id}`"
          class="organization-item"
      >
        <div class="organization-info">
          <h3>{{ organization.name }}</h3>
          <p class="organization-comment">{{ organization.comment }}</p>
        </div>
      </router-link>
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

<style scoped>
.organizationList {
  padding: 20px;
}

.organizationList__items {
  margin-top: 20px;
}

.organization-item {
  display: block;
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 4px;
  text-decoration: none;
}

.organization-item:hover {
  background: #e9ecef;
}

.organization-info h3 {
  margin: 0 0 5px 0;
  color: #792ec9;
}

.organization-comment {
  margin: 0;
  color: #34393b;
  font-size: 0.9em;
}
</style>