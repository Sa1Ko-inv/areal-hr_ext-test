<template>
  <form @submit.prevent="employeeHireOnWork">
    <h4>Принятие сотрудника на работу</h4>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-group">
      <label>Организация</label>
      <select v-model="selectedOrganizationId">
        <option :value="null">Выберите организацию</option>
        <option v-for="org in organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Отдел</label>
      <select v-model="this.hireEmployeeData.department_id">
        <option :value="null">Выберите отдел</option>
        <template v-for="dept in filteredDepartments" :key="dept.id">
          <option :value="dept.id">
            {{ dept.name }}
          </option>
          <option
            v-for="child in dept.children"
            :key="child.id"
            :value="child.id"
          >
            — {{ child.name }}
          </option>
        </template>
      </select>
    </div>

    <div class="form-group">
      <label>Должность</label>
      <select v-model="this.hireEmployeeData.position_id">
        <option :value="null">Выберите должность</option>
        <option v-for="pos in positions" :key="pos.id" :value="pos.id">
          {{ pos.name }}
        </option>
      </select>
    </div>

    <div class="salary">
      <label>Зарплата</label>
      <input
        v-model.number="hireEmployeeData.salary"
        placeholder="Зарплата"
        type="text"
      />
    </div>

    <div class="form-actions">
      <button type="submit">Сохранить</button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import { fetchOrganizations } from '@/http/organizationAPI.js';
import { fetchDepartments } from '@/http/departmentAPI.js';
import { fetchPositions } from '@/http/positionAPI.js';

export default {
  props: {
    employeeId: {
      type: [Number, String],
      required: true,
    },
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      organizations: [],
      departments: [],
      selectedOrganizationId: null,
      positions: [],
      hireEmployeeData: {
        employee_id: this.employeeId,
        department_id: '',
        position_id: '',
        salary: '',
      },
      error: null,
    };
  },
  computed: {
    filteredDepartments() {
      if (!this.selectedOrganizationId) {
        return this.departments;
      }
      return this.departments.filter(
        (dept) => dept.organization_id === this.selectedOrganizationId
      );
    },
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
      } catch (error) {
        console.log('Ошибка при загрузке отделов:', error);
      }
    },
    async loadPositions() {
      try {
        const response = await fetchPositions();
        this.positions = response.data.rows;
        // this.totalItems = response.data.count;
      } catch (error) {
        console.error('Ошибка при получении должностей:', error);
      }
    },

    employeeHireOnWork() {
      try {
        this.cancel();
        this.$emit('hireEmployee', this.hireEmployeeData);
        this.hireEmployeeData = {
          employee_id: this.employeeId,
          department_id: '',
          position_id: '',
          salary: '',
        };
      } catch (error) {
        console.error('Ошибка при принятии на работу:', error);
      }
    },
  },

  mounted() {
    this.loadOrganizations();
    this.loadDepartments();
    this.loadPositions();
  },
};
</script>

<style lang="scss" scoped>
$primary-color: #792ec9;
$primary-color-dark: #6525a7;
$border-color: #e0e0e0;
$text-color-primary: #333;
$text-color-secondary: #666;
$background-color-light: #fff;
$error-color: #dc3545;
$success-color: #28a745;
$border-radius: 8px;
$box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
$transition-duration: 0.2s;
$input-padding: 10px 15px;
$button-padding: 10px 20px;

form {
  max-width: 650px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;

  h4 {
    color: $primary-color;
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.3rem;
  }
}

.error-message {
  color: $error-color;
  background-color: rgba($error-color, 0.1);
  padding: 10px 15px;
  border-radius: $border-radius;
  margin-bottom: 20px;
  text-align: center;
}

.form-group,
.salary {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: $text-color-primary;
  }

  select {
    width: 650px;
    padding: $input-padding;
    font-size: 1rem;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: $background-color-light;
    transition:
      border-color $transition-duration,
      box-shadow $transition-duration;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
  }
  input {
    width: 620px;
    padding: $input-padding;
    font-size: 1rem;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: $background-color-light;
    transition:
      border-color $transition-duration,
      box-shadow $transition-duration;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
  }
  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px 12px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;

  button {
    padding: $button-padding;
    border: none;
    border-radius: $border-radius;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color $transition-duration,
      transform 0.1s;

    &:first-child {
      background-color: $primary-color;
      color: white;

      &:hover {
        background-color: $primary-color-dark;
      }
    }

    &:last-child {
      background-color: transparent;
      color: $text-color-secondary;
      border: 1px solid $border-color;

      &:hover {
        background-color: #f5f5f5;
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }
}

option {
  padding: 8px;

  &[disabled] {
    color: $text-color-secondary;
  }
}

option:not([disabled]) {
  &:hover {
    background-color: rgba($primary-color, 0.1) !important;
  }
}
</style>
