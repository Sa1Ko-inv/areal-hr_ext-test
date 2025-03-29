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

<style scoped lang="scss">

</style>