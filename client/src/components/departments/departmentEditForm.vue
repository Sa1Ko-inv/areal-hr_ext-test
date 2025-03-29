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
form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(121, 46, 201, 0.1);
  background-color: #fff;

  h4 {
    color: #792ec9;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
  }

  input, select {
    width: 100%;
    padding: 10px 12px;
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #792ec9;
      box-shadow: 0 0 0 2px rgba(121, 46, 201, 0.2);
    }

    &::placeholder {
      color: #aaa;
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23792ec9' d='M6 8.825L1.175 4 2.05 3.125 6 7.075 9.95 3.125 10.825 4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;

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

        &:hover {
          background-color: #792ec9
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
}
</style>