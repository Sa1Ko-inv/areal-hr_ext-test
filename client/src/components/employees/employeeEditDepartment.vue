<template>
  <form @submit.prevent="saveDepartmentChange">
    <h4>Изменение отдела сотрудника</h4>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-group">
      <label>Организация</label>
      <select v-model="selectedOrganizationId" @change="filterDepartments">
        <option :value="null">Выберите организацию</option>
        <option v-for="org in organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Отдел</label>
      <select v-model="formData.department_id" @change="loadPositions">
        <option :value="null">Выберите отдел</option>
        <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>
    </div>

    <div class="form-actions">
      <button type="submit">
        Сохранить
      </button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import { fetchOrganizations } from '@/http/organizationAPI.js';
import { fetchDepartments } from '@/http/departmentAPI.js';
import { changeDepartment } from '@/http/employeeAPI.js';

export default {
  props: {
    employeeId: {
      type: [Number, String],
      required: true
    },
    currentDepartmentId: {
      type: [Number, String],
      default: null
    },
    cancel: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      organizations: [],
      departments: [],
      selectedOrganizationId: null,
      formData: {
        department_id: this.currentDepartmentId || null
      },
      error: null,
    };
  },
  computed: {
    filteredDepartments() {
      if (!this.selectedOrganizationId) {
        return this.departments;
      }
      return this.departments.filter(dept => dept.organization_id === this.selectedOrganizationId);
    }
  },
  methods: {
    async loadOrganizations() {
      try {
        const response = await fetchOrganizations();
        this.organizations = response.data.rows;
      } catch (error) {
        console.error('Ошибка при получении организаций:', error);
      }
    },
    async loadDepartments() {
      try {
        const response = await fetchDepartments();
        this.departments = response.data;

        if (this.currentDepartmentId) {
          const currentDept = response.data.find(d => d.id === this.currentDepartmentId);
          if (currentDept) {
            this.selectedOrganizationId = currentDept.organization_id;
          }
        }
      } catch (error) {
        console.log('Ошибка при загрузке отделов:', error);

      }
    },
    filterDepartments() {
      this.formData.department_id = null;
    },
    async saveDepartmentChange() {
      try {
        await changeDepartment(this.employeeId, {
          department_id: this.formData.department_id
        });
        this.cancel()
        this.$emit('updateDepartment');
      } catch (error) {
        console.error('Ошибка при изменении отдела:', error);
      }
    },
  },
  mounted() {
    this.loadOrganizations();
    this.loadDepartments();
  }
};
</script>


<style scoped lang="scss">
.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 4px;
}

form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;

  h4 {
    color: #792ec9;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #792ec9;
      box-shadow: 0 0 0 2px rgba(121, 46, 201, 0.2);
    }
  }
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  button {
    flex: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &[type="submit"] {
      background-color: #792ec9;
      color: white;

      &:hover:not(:disabled) {
        background-color: #792ec9
      }

      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    }

    &[type="button"] {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;

      &:hover {
        background-color: #eaeaea;
      }
    }
  }
}
</style>
