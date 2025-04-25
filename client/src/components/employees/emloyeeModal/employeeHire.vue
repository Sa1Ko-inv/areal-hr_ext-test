<template>
  <form @submit.prevent="employeeHireOnWork">
    <h4>Принятие сотрудника на работу</h4>
    <div v-if="hireError.general" class="error-message">{{ hireError.general }}</div>

    <div class="form-group">
      <label>Организация</label>
      <MySelect
        style="width: 720px"
      placeholder="Выберите организацию для сортировки"
      v-model="selectedOrganizationId"
      :options="organizationOptions"
      />
    </div>

    <div class="form-group">
      <label>Отдел</label>
      <div v-if="hireError.department_id" class="error-message">{{ hireError.department_id }}</div>
      <MySelect
        style="width: 720px"
        v-model="hireEmployeeData.department_id"
        placeholder="Выберите отдел"
        :options="departmentOptions"
      />
    </div>

    <div class="form-group">
      <label>Должность</label>
      <div v-if="hireError.position_id" class="error-message">{{ hireError.position_id }}</div>
      <MySelect
        style="width: 720px"
        v-model="hireEmployeeData.position_id"
        placeholder="Выберите должность"
        :options="positionOptions"
      />
    </div>

    <div class="salary">
      <label>Зарплата</label>
      <div v-if="hireError.salary" class="error-message">{{ hireError.salary }}</div>
      <MyInput
        size="medium"
        style="font-size: 15px;"
        v-model.number="hireEmployeeData.salary"
        placeholder="Зарплата"
        type="text"
      />
    </div>

    <div class="form-actions">
      <MyButton type="submit">Сохранить</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<script>
import { fetchOrganizations } from '@/http/organizationAPI.js';
import { fetchDepartments } from '@/http/departmentAPI.js';
import { fetchPositions } from '@/http/positionAPI.js';
import MySelect from '@/components/UI/MySelect.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MyInput from '@/components/UI/MyInput.vue';

export default {
  components: { MyInput, MyButton, MySelect },
  props: {
    employeeId: {
      type: [Number, String],
      required: true,
    },
    cancel: {
      type: Function,
      default: () => {},
    },
    hireError: {
      type: {},
      default: null,
    }
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
    };
  },
  computed: {
    filteredDepartments() {
      if (!this.selectedOrganizationId) {
        return this.departments;
      }
      return this.departments.filter(
        (dept) => dept.organization_id === Number(this.selectedOrganizationId)
      );
    },
    organizationOptions() {
      return [
        ...this.organizations.map(org => ({
          value: org.id,
          name: org.name
        }))
      ];
    },
    departmentOptions() {
      const options = [];

      // Добавим проверку на наличие filteredDepartments
      if (this.filteredDepartments && this.filteredDepartments.length) {
        this.filteredDepartments.forEach(dept => {
          options.push({ value: dept.id, name: dept.name, disabled: true});

          if (dept.children && dept.children.length) {
            dept.children.forEach(child => {
              options.push({ value: child.id, name: `— ${child.name}` , disabled: false });
            });
          }
        });
      }

      return options;
    },
    positionOptions() {
      return [
        ...this.positions.map(pos => ({
          value: pos.id,
          name: pos.name
        }))
      ];
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
@import "@/styles/base";

form {
  max-width: 100%;
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


.form-group,
.salary {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: $text-color-primary;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}
</style>
