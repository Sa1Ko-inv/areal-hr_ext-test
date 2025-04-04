<template >
  <form @submit.prevent="updateSalary">
    <h4>Изменение зарплаты сотрудника</h4>
    <div v-if="error" class="error-message">{{ error }}</div>

    <input
      v-model.number="formData.salary"
      placeholder="Зарплата"
      type="text"
    />

    <div class="form-actions">
      <button type="submit">
        Сохранить
      </button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import {changeSalary} from "@/http/employeeAPI.js";

export default {
  props: {
    employeeId: {
      type: [Number, String],
      required: true
    },
    currentSalary: {
      type: Object,
      default: null
    },
    // onSuccess: {
    //   type: Function,
    //   default: () => {
    //   }
    // },
    cancel: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      formData: {
        salary: this.currentSalary || null
      },
      error: null,
    };
  },

  methods: {
    async updateSalary() {
      try {
        await changeSalary(this.employeeId, {
          salary: this.formData.salary
        });
        this.cancel();
        this.$emit('updateSalary');
      } catch (error) {
        console.log('Ошибка при обновлении зарплаты:', error);
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>