<script>
import { createDepartment } from '@/http/departmentAPI.js';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton, MyInput },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
    organizationId: {
      type: Number,
      required: true,
    },
    departments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      department: {
        name: '',
        comment: '',
        organization_id: this.organizationId,
        parent_id: null,
      },
      createError: null,
    };
  },
  methods: {
    async createDepartment() {
      try {
        this.createError = null; // Сбрасываем ошибку перед запросом
        await createDepartment(this.department);
        this.$emit('created');
        this.department = {
          name: '',
          comment: '',
          organization_id: this.organizationId,
          parent_id: null,
        };
        this.dialogVisible = false;
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.createError = error.response.data.errors[0].message; // Сохраняем сообщение об ошибке
          console.error('Ошибка при создании организации:', error);
        } else {
          this.createError = 'Произошла ошибка при создании организации';
        }
        console.error('Ошибка при создании организации:', error);
      }
    },
  },
};
</script>

<template>
  <form @submit.prevent="createDepartment">
    <h4>Создание Отдела</h4>
    <div v-if="createError" class="error-message">{{ createError }}</div>
    <div class="input-form">
      <MyInput
        v-model.number="department.name"
        placeholder="Название отдела"
        type="text"
      />
      <MyInput
        v-model.number="department.comment"
        placeholder="Комментарий"
        type="text"
      />
    </div>
    <select v-model="department.parent_id">
      <option :value="null">Без родительского отдела</option>
      <option v-for="dept in departments" :key="dept.id" :value="dept.id">
        {{ dept.name }}
      </option>
    </select>

    <div class="">
      <MyButton modifier="create" type="submit">Создать отдел</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/styles/base";
.error-message {
  color: $danger-color;
  font-size: $font-size-text;
  margin-top: 8px;
}
form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: $box-shadow;
  background-color: $background-color-light;

  h4 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
    text-align: center;
  }

  .input-form {
    width: 740px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  select {
    width: 765px;
    padding: 8px 12px;
    font-size: $font-size-text;
    line-height: 1.5;
    color: $text-color-primary;
    background-color: $background-color-light;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px 12px;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    appearance: none;
    transition:
      border-color $transition-duration ease-in-out,
      box-shadow $transition-duration ease-in-out;
    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }

    &:disabled {
      background-color: #f5f5f5;
      color: $text-color-secondary;
      cursor: not-allowed;
    }
    option {
      padding: 8px;
      color: $text-color-primary;

      &[disabled] {
        color: $text-color-secondary;
      }
    }

    option:not([disabled]) {
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
    }
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;


  }
}
</style>
