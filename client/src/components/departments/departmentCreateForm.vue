<script>
import { createDepartment } from "@/http/departmentAPI.js";

export default {
  props: {
    cancel: {
      type: Function,
      required: true
    },
    organizationId: {
      type: Number,
      required: true
    },
    departments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      department: {
        name: '',
        comment: '',
        organization_id: this.organizationId,
        parent_id: null
      }
    }
  },
  methods: {
    async createDepartment() {
      try {
        await createDepartment(this.department);
        this.$emit('created');
        this.department = { name: '', comment: '', organization_id: this.organizationId, parent_id: null };
        this.dialogVisible = false;
      } catch (error) {
        console.error('Ошибка при создании отдела:', error);
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="createDepartment">
    <h4>Создание Отдела</h4>

    <input
        v-model="department.name"
        placeholder="Название отдела"
        type="text"
    >
    <input
        v-model="department.comment"
        placeholder="Комментарий"
        type="text"
    >
    <select v-model="department.parent_id">
      <option :value="null">Без родительского отдела</option>
      <option v-for="dept in departments" :key="dept.id" :value="dept.id">
        {{ dept.name }}
      </option>
    </select>

    <div class="">
      <button type="submit">Создать отдел</button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

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