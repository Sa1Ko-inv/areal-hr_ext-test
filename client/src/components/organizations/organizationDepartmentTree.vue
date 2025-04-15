<template>
  <ul class="department-tree">
    <li v-for="department in departments" :key="department.id" class="department-item">
      <div class="department-header" @click="toggleChildren(department)">
        <span class="department-name"><strong>Название отдела:</strong>{{ department.name }}</span>
        <span class="department-comment"><strong>Комментарий:</strong>{{department.comment}}</span>
      </div>

      <div class="department-buttons" style="">
        <MyButton modifier="edit" @click="editDepartment(department)">Редактировать</MyButton>
        <MyButton modifier="showHistory" @click="showHistory(department)">История</MyButton>
        <MyButton modifier="delete" @click="deleteDepartment(department)">Удалить</MyButton>
      </div>

      <MyModalWindow v-model:show="dialogVisible">
        <DepartmentEditForm
            :cancel="cancelEdit"
            :department="selectedDepartment"
            :organizations="organizations"
            @departmentUpdated="departmentUpdated"
        />
      </MyModalWindow>

      <!-- Модельное окно просмотра истории отдела -->
      <MyModalWindow v-model:show="dialogVisibleHistory">
        <DepartmentWatchHistory
            :cancel="cancelHistory"
            :department="selectedDepartment"
        />
      </MyModalWindow>

      <OrganizationDepartmentTree
          v-if="department.showChildren && hasChildren(department)"
          :departments="department.children"
          class="department-children"
          @delete="deleteDepartment"
          @departmentUpdated="departmentUpdated"
      />
    </li>
  </ul>
</template>

<script>
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import DepartmentEditForm from "@/components/departments/departmentEditForm.vue";
import {fetchOrganizations} from "@/http/organizationAPI.js";
import {deleteDepartment as apiDeleteDepartment} from "@/http/departmentAPI.js";
import DepartmentWatchHistory from "@/components/departments/departmentModal/departmentWatchHistory.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  name: 'OrganizationDepartmentTree',
  components: {MyButton, DepartmentWatchHistory, DepartmentEditForm, MyModalWindow },
  data() {
    return {
      selectedDepartment: null,
      organizations: [],
      dialogVisible: false,
      dialogVisibleHistory: false,

    };
  },
  props: {
    departments: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  async created() {
    await this.loadOrganizations();
  },
  methods: {
    async loadOrganizations() {
      try {
        const response = await fetchOrganizations();
        this.organizations = response.data.rows;
      } catch (error) {
        console.error('Ошибка при загрузке организаций:', error);
      }
    },
    hasChildren(department) {
      return department.children && department.children.length > 0;
    },
    toggleChildren(department) {
      if (this.hasChildren(department)) {
        department.showChildren = !department.showChildren;
      }
    },
    editDepartment(department) {
      this.selectedDepartment = department;
      this.dialogVisible = true;
    },
    cancelEdit() {
      this.dialogVisible = false;
      this.selectedDepartment = null;
    },
    departmentUpdated() {
      this.$emit('departmentUpdated');
    },

    async deleteDepartment(department) {
      try {
        this.selectedDepartment = department;
        await apiDeleteDepartment(department.id);
        this.$emit('departmentDeleted', department.id);
        alert("Отдел успешно удален");
      } catch (error) {
        console.error('Ошибка при удалении отдела:', error);
      }
    },

  //   Управление модальными окнами
    showHistory(department) {
      this.selectedDepartment = department;
      this.dialogVisibleHistory = true;
    },
    cancelHistory() {
      this.dialogVisibleHistory = false;
    },
  },
};
</script>



<style lang="scss" scoped>
.department-tree {
  list-style-type: none;
  padding: 0;
  margin: 0;

  .department-item {
    margin-bottom: 15px;
    border-left: 2px solid #792ec9;
    padding-left: 15px;

    .department-header {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 10px 15px;
      background-color: rgba(121, 46, 201, 0.05);
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(121, 46, 201, 0.1);
      }

      .department-name, .department-comment {
        display: block;

        strong {
          color: #792ec9;
          margin-right: 8px;
          font-weight: 600;
        }
      }

      .department-name {
        font-size: 16px;
      }

      .department-comment {
        font-size: 14px;
        color: #666;
      }
    }

    .department-buttons {
      width: 200px;
      display: flex;
      margin-top: 8px;
    }

    .department-children {
      margin-top: 10px;
      margin-left: 20px;
    }
  }
}
</style>