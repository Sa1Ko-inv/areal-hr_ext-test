<template>
  <form @submit.prevent="saveDepartment">
    <h4>Редактирование Отдела</h4>

    <input
        v-model="editDepartment.name"
        placeholder="Название отдела"
        type="text"
    >
    <input
        v-model="editDepartment.comment"
        placeholder="Комментарий"
        type="text"
    >
    <select v-model="editDepartment.parent_id">
      <option :value="null">Без родительского отдела</option>
      <option
          v-for="dept in departments"
          :key="dept.id"
          :value="dept.id">
        {{ dept.name }} из {{organizations.find(org => org.id === dept.organization_id)?.name}}
      </option>
    </select>

    <select v-model="editDepartment.organization_id">
      <option :value="null">Без переноса в организацию</option>
      <option v-for="org in organizations" :key="org.id" :value="org.id">
        {{ org.name }}
      </option>
    </select>

    <div class="">
      <button type="submit">Редактировать отдел</button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import {fetchDepartments, updateDepartment} from "@/http/departmentAPI.js";

export default {

  props: {
    cancel: {
      type: Function,
      required: true
    },
    department: {
      type: Object,
      required: true
    },
    organizations: {
      type: Array,
      required: true,
      default: () => []
    },
  },

  data() {
    return {
      editDepartment: {
        id: this.department ? this.department.id : null,
        name: this.department ? this.department.name : '',
        comment: this.department ? this.department.comment : '',
        organization_id: this.department ? this.department.organization_id : null,
        parent_id: this.department ? this.department.parent_id : null
      },
      departments: []
    }
  },

  methods: {
    async getDepartments() {
      try {
        const response = await fetchDepartments();
        this.departments = response.data;
        console.log(this.departments);
      } catch (error) {
        console.error('Ошибка при получении отделов:', error);
      }
    },
    async saveDepartment() {
      try {
        // Объект для отправки, исключая поля с null
        const dataToSend = {
          id: this.editDepartment.id,
          name: this.editDepartment.name,
          comment: this.editDepartment.comment,
          parent_id: this.editDepartment.parent_id
        };

        if (this.editDepartment.organization_id !== null) {
          dataToSend.organization_id = this.editDepartment.organization_id;
        }

        await updateDepartment(dataToSend);

        this.cancel();

        this.$emit('department-updated');
      } catch (error) {
        console.error('Ошибка при обновлении отдела:', error);
      }
    }
  },
  mounted() {
    this.getDepartments();
  },

};
</script>

<style lang="scss" scoped>

</style>