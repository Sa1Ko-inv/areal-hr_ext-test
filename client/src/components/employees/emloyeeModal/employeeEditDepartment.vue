<template>
  <form @submit.prevent="saveDepartmentChange">
    <h4>Изменение отдела сотрудника</h4>

    <div class="form-group">
      <label>Организация</label>
      <MySelect
        placeholder="Выберите организацию для сортировки"
        v-model="selectedOrganizationId"
        :options="organizationOptions"
        @change="filterDepartments"
      />
    </div>

    <div class="form-group">
      <label>Отдел</label>
      <MySelect
        v-model="formData.department_id"
        placeholder="Выберите отдел"
        :options="departmentOptions"
      />
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>

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
import MySelect from '@/components/UI/MySelect.vue';

export default {
  components: { MySelect, MyButton },
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
      default: () => {
      },
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
        (dept) => dept.organization_id === this.selectedOrganizationId,
      );
    },
    organizationOptions() {
      return [
        ...this.organizations.map(org => ({
          value: org.id,
          name: org.name,
        })),
      ];
    },
    departmentOptions() {
      const options = [];

      // Добавим проверку на наличие filteredDepartments
      if (this.filteredDepartments && this.filteredDepartments.length) {
        this.filteredDepartments.forEach(dept => {
          options.push({ value: dept.id, name: dept.name, disabled: true });

          if (dept.children && dept.children.length) {
            dept.children.forEach(child => {
              options.push({ value: child.id, name: `— ${child.name}`, disabled: false });
            });
          }
        });
      }

      return options;
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
            (d) => d.id === this.currentDepartmentId,
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
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
