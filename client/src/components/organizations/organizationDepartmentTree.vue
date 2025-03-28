<template>
  <ul class="department-tree">
    <li v-for="department in props.departments" :key="department.id" class="department-item">
      <div class="department-header" @click="toggleChildren(department)">
        <span class="department-name">{{ department.name }}</span>
        <span v-if="hasChildren(department)" class="toggle-icon">
          {{ department.showChildren ? '▼' : '►' }}
        </span>
      </div>

      <OrganizationDepartmentTree
          v-if="department.showChildren && hasChildren(department)"
          :departments="department.children"
          class="department-children"
      />
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  departments: {
    type: Array,
    required: true,
    default: () => []
  }
});

const hasChildren = (department) => {
  return department.children && department.children.length > 0;
};

const toggleChildren = (department) => {
  if (hasChildren(department)) {
    department.showChildren = !department.showChildren;
  }
};
</script>

<style scoped>
.department-tree {
  list-style-type: none;
  padding-left: 20px;
}

.department-item {
  margin: 5px 0;
}

.department-header {
  cursor: pointer;
  padding: 8px 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.department-header:hover {
  background-color: #e9ecef;
}

.department-name {
  flex-grow: 1;
}

.toggle-icon {
  margin-left: 10px;
  font-size: 0.8em;
}

.department-children {
  margin-top: 5px;
}
</style>