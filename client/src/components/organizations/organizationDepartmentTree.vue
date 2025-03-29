<template>
  <ul class="department-tree">
    <li v-for="department in departments" :key="department.id" class="department-item">
      <div class="department-header" @click="toggleChildren(department)">
        <span class="department-name"><strong>Название отдела:</strong>{{ department.name }}</span>
        <span><strong>Комментарий:</strong>{{department.comment}}</span>
      </div>


      <OrganizationDepartmentTree
          v-if="department.showChildren && hasChildren(department)"
          :departments="department.children"
          class="department-children"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'OrganizationDepartmentTree',
  props: {
    departments: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    hasChildren(department) {
      return department.children && department.children.length > 0;
    },
    toggleChildren(department) {
      if (this.hasChildren(department)) {
        department.showChildren = !department.showChildren;
      }
    }
  },
  mounted() {
    this.departments.forEach(department => {
      department.showChildren = false; // Initialize the showChildren property
    });
  }
}
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
  flex-direction: column;
  justify-content: space-between;
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