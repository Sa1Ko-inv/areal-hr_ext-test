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
        <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
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
      <button type="submit">
        Сохранить
      </button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import {fetchOrganizations} from "@/http/organizationAPI.js";
import {fetchDepartments} from "@/http/departmentAPI.js";
import {fetchPositions} from "@/http/positionAPI.js";
import employee from "@/pages/employee.vue";

export default {
  props: {
    employeeId: {
      type: [Number, String],
      required: true
    },
    cancel: {
      type: Function,
      default: () => {
      }
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
        department_id:'',
        position_id: '',
        salary: '',
      },
      // formData: {
      //   department_id: this.currentDepartmentId || null
      // },
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

        // if (this.currentDepartmentId) {
        //   const currentDept = response.data.find(d => d.id === this.currentDepartmentId);
        //   if (currentDept) {
        //     this.selectedOrganizationId = currentDept.organization_id;
        //   }
        // }
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
        // await changeDepartment(this.employeeId, {
        //   department_id: this.formData.department_id
        // });
        this.cancel()
        this.$emit('hireEmployee', this.hireEmployeeData);
        this.hireEmployeeData = {employee_id: this.employeeId,
            department_id:'',
            position_id: '',
            salary: '', }
      } catch (error) {
        console.error('Ошибка при принятии на работу:', error);
      }
    },
    // filterDepartments() {
    //   this.formData.department_id = null;
    // },
  },

  mounted() {
    this.loadOrganizations();
    this.loadDepartments();
    this.loadPositions();
  }
}
</script>

<style lang="scss" scoped>

</style>