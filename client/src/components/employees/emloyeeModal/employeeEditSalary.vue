<template>
  <form @submit.prevent="updateSalary">
    <h4>Изменение зарплаты сотрудника</h4>
    <div v-if="error" class="error-message">{{ error }}</div>

    <input
      v-model.number="formData.salary"
      placeholder="Зарплата"
      type="text"
    />

    <div class="form-actions">
      <button type="submit">Сохранить</button>
      <button type="button" @click="cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
import { changeSalary } from '@/http/employeeAPI.js';

export default {
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
$primary-color: #792ec9;
$primary-color-dark: #6525a7;
$border-color: #e0e0e0;
$text-color-primary: #333;
$text-color-secondary: #666;
$background-color-light: #fff;
$error-color: #dc3545;
$border-radius: 8px;
$box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
$transition-duration: 0.2s;
$input-padding: 12px 15px;
$button-padding: 10px 20px;

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
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.error-message {
  color: $error-color;
  background-color: rgba($error-color, 0.1);
  padding: 10px 15px;
  border-radius: $border-radius;
  margin-bottom: 20px;
  text-align: center;
  font-size: 0.9rem;
}

input {
  width: 720px;
  padding: $input-padding;
  font-size: 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $background-color-light;
  transition: all $transition-duration ease;
  margin-bottom: 25px;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }

  &::placeholder {
    color: $text-color-secondary;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;

  button {
    padding: $button-padding;
    border: none;
    border-radius: $border-radius;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-duration ease;
    font-size: 0.95rem;

    &:first-child {
      background-color: $primary-color;
      color: white;

      &:hover {
        background-color: $primary-color-dark;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &:last-child {
      background-color: transparent;
      color: $text-color-secondary;
      border: 1px solid $border-color;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}

@media (max-width: 576px) {
  form {
    padding: 20px 15px;

    h4 {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 10px;

    button {
      width: 100%;
    }
  }
}
</style>
