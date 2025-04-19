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
      <select v-model="formData.department_id">
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

    <div class="form-actions">
      <MyButton modifier="save" type="submit">Сохранить</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<script>
import { fetchOrganizations } from '@/http/organizationAPI.js';
import { fetchDepartments } from '@/http/departmentAPI.js';
import { changeDepartment } from '@/http/employeeAPI.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton },
  props: {
    employeeId: {
      type: [Number, String],
      required: true,
    },
    currentDepartmentId: {
      type: [Number, String],
      default: null,
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
      formData: {
        department_id: this.currentDepartmentId || null,
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

        if (this.currentDepartmentId) {
          const currentDept = response.data.find(
            (d) => d.id === this.currentDepartmentId
          );
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
          department_id: this.formData.department_id,
        });
        this.cancel();
        this.$emit('updateDepartment');
      } catch (error) {
        console.error('Ошибка при изменении отдела:', error);
      }
    },
  },
  mounted() {
    this.loadOrganizations();
    this.loadDepartments();
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/base";
.error-message {
  color: $danger-color;
  font-size: $font-size-text;
  margin-bottom: 16px;
  padding: 8px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: $border-radius;
}

form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: $border-radius;
  background-color: $background-color-light;

  h4 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: $text-color-primary;
  }

  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: $border-radius;
    font-size: $font-size-text;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: $box-shadow;
    }
  }
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

select {
  width: calc(100% + 25px);
  padding: 10px 15px;
  font-size: $font-size-text;
  line-height: 1.5;
  color: $text-color-primary;
  background-color: $background-color-light;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 12px;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  appearance: none;
  transition:
    border-color $transition-duration ease-in-out,
    box-shadow $transition-duration ease-in-out;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: $text-color-secondary;
    cursor: not-allowed;
  }

  option {
    padding: 8px;
    color: $text-color-primary;

    &[disabled] {
      color: $text-color-secondary;
    }
  }

  option:not([disabled]) {
    &:hover {
      background-color: rgba($primary-color, 0.1);
    }
  }
}
</style>
