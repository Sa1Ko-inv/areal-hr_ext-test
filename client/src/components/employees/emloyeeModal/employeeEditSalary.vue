<template>
  <form @submit.prevent="updateSalary">
    <h4>Изменение зарплаты сотрудника</h4>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="input-form">
      <MyInput
        v-model.number="formData.salary"
        placeholder="Зарплата"
        type="text"
      />
    </div>


    <div class="form-actions">
      <MyButton modifier="save" type="submit">Сохранить</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<script>
import { changeSalary } from '@/http/employeeAPI.js';
import MyButton from '@/components/UI/MyButton.vue';
import MyInput from '@/components/UI/MyInput.vue';

export default {
  components: { MyInput, MyButton },
  props: {
    employeeId: {
      type: [Number, String],
      required: true,
    },
    currentSalary: {
      type: Object,
      default: null,
    },
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      formData: {
        salary: this.currentSalary || null,
      },
      error: null,
    };
  },

  methods: {
    async updateSalary() {
      try {
        await changeSalary(this.employeeId, {
          salary: this.formData.salary,
        });
        this.cancel();
        this.$emit('updateSalary');
      } catch (error) {
        console.log('Ошибка при обновлении зарплаты:', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/base" as *;

form {
  max-width: 750px;
  margin: 0 auto;
  padding: 25px;
  font-family: 'Arial', sans-serif;
  background-color: $background-color-light;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  h4 {
    color: $primary-color;
    margin-bottom: 25px;
    text-align: center;
    font-size: $font-size-title;
    font-weight: 600;
  }
}

.error-message {
  background-color: rgba($danger-color, 0.1);
  padding: 10px 15px;
  border-radius: $border-radius;
  margin-bottom: 20px;
  text-align: center;
}

.input-form {
  width: 720px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}
</style>
