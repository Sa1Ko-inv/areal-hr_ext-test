<script>
import { createDepartment } from '@/http/departmentAPI.js';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MySelect from '@/components/UI/MySelect.vue';

export default {
  components: { MySelect, MyButton, MyInput },
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
      errors: {
        name: null,
        comment: null,
        general: null // для общих ошибок
      },
    };
  },
  methods: {
    async createDepartment() {
      try {
        // Сбрасываем все ошибки перед запросом
        this.errors = {
          name: null,
          comment: null,
          general: null
        };

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
        if (error.response && error.response.data && error.response.data.errors) {
          // Обрабатываем ошибки валидации
          error.response.data.errors.forEach(err => {
            if (err.field && Object.prototype.hasOwnProperty.call(this.errors, err.field)) {
              this.errors[err.field] = err.message;
            } else {
              this.errors.general = err.message;
            }
          });
        } else {
          this.errors.general = 'Произошла ошибка при создании организации';
        }
        console.error('Ошибка при создании организации:', error);
      }
    },
  },
  computed: {
    departmentOptions() {
      return [
        { value: null, name: 'Без родительского отдела' },
        ...this.departments.map(dept => ({
          value: dept.id,
          name: dept.name
        }))
      ];
    }
  },
};
</script>

<template>
  <form @submit.prevent="createDepartment">
    <h4>Создание Отдела</h4>
    <div v-if="errors.general" class="error-message">{{ errors.general }}</div>
    <div class="input-form">
      <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      <MyInput
        v-model.number="department.name"
        placeholder="Название отдела"
        type="text"
      />
      <div v-if="errors.comment" class="error-message">{{ errors.comment }}</div>
      <MyInput
        v-model.number="department.comment"
        placeholder="Комментарий"
        type="text"
      />
    </div>

    <MySelect
      style="width: 720px;"
      placeholder="Выберите отдел"
      v-model="department.parent_id"
      :options="departmentOptions"
    />

    <div class="">
      <MyButton modifier="create" type="submit">Создать отдел</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@use "@/styles/base" as *;
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
    width: 720px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;


  }
}
</style>
