<template>
  <form @submit.prevent="saveDepartment">
    <h4>Редактирование Отдела</h4>
    <div v-if="updateError" class="error-message">
      {{ updateError.message }}
    </div>
    <div class="input-form">
      <MyInput
        v-model.number="editDepartment.name"
        placeholder="Название отдела"
        type="text"
      />
      <MyInput
        v-model.number="editDepartment.comment"
        placeholder="Комментарий"
        type="text"
      />
    </div>

    <div class="input-form">
      <MySelect
        v-model="editDepartment.organization_id"
        placeholder="Выберите организацию"
        :options="organizationOptions"
        @change="filterDepartments"
      />

      <MySelect
        placeholder="Выберите родительский отдел"
        v-model="editDepartment.parent_id"
        :options="parentDepartmentOptions"
      />
    </div>


    <div class="">
      <MyButton modifier="edit" type="submit">Редактировать отдел</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

<script>
import { fetchDepartments, updateDepartment } from '@/http/departmentAPI.js';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MySelect from '@/components/UI/MySelect.vue';

export default {
  components: { MyButton, MyInput, MySelect },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
    department: {
      type: Object,
      required: true,
    },
    organizations: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      editDepartment: {
        id: this.department ? this.department.id : null,
        name: this.department ? this.department.name : '',
        comment: this.department ? this.department.comment : '',
        organization_id: this.department
          ? this.department.organization_id
          : null,
        parent_id: this.department ? this.department.parent_id : null,
      },
      departments: [],
      filteredDepartments: [],
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingDepartmentId: null, // Для отслеживания какой отдела показывать ошибку
    };
  },
  computed: {
    organizationOptions() {
      return [
        ...this.organizations.map(org => ({
          value: org.id,
          name: org.name
        }))
      ];
    },
    parentDepartmentOptions() {
      return [
        { value: null, name: 'Без родительского отдела' },
        ...this.filteredDepartments.map(dept => ({
          value: dept.id,
          name: `${dept.name} (${this.getOrganizationName(dept.organization_id)})`
        }))
      ];
    }
  },
  methods: {
    async getDepartments() {
      try {
        const response = await fetchDepartments();
        this.departments = response.data;
        this.filteredDepartments = this.getAvailableParentDepartments();
      } catch (error) {
        console.error('Ошибка при получении отделов:', error);
      }
    },
    getOrganizationName(orgId) {
      const org = this.organizations.find((o) => o.id === orgId);
      return org ? org.name : 'Нет организации';
    },
    filterDepartments() {
      this.filteredDepartments = this.getAvailableParentDepartments();
      // Сброс parent_id при смене организации
      this.editDepartment.parent_id = null;
    },
    getAvailableParentDepartments() {
      // Исключаем текущий отдел и его дочерние отделы
      const excludedIds = this.getChildDepartmentIds(this.editDepartment.id);
      excludedIds.push(this.editDepartment.id); // Добавляем сам отдел в исключения

      // Отделы без родительского отдела, исключая текущий и его дочерние
      const availableDepartments = this.departments.filter(
        (d) => !excludedIds.includes(d.id)
      );

      // Если выбрана организация, показываем только ее отделы
      if (this.editDepartment.organization_id) {
        return availableDepartments.filter(
          (d) => d.organization_id === this.editDepartment.organization_id
        );
      }
      return availableDepartments;
    },
    // Рекурсивно получаем все ID дочерних отделов
    getChildDepartmentIds(parentId) {
      const childIds = [];
      const directChildren = this.departments.filter(
        (d) => d.parent_id === parentId
      );

      directChildren.forEach((child) => {
        childIds.push(child.id);
        // Рекурсивно добавляем ID дочерних отделов
        const nestedChildIds = this.getChildDepartmentIds(child.id);
        childIds.push(...nestedChildIds);
      });

      return childIds;
    },
    async saveDepartment() {
      try {
        this.updateError = null; // Сбрасываем ошибку перед запросом
        this.updatingDepartmentId = this.editDepartment.id; // Запоминаем ID отдела

        // Проверка на циклическую ссылку
        if (this.editDepartment.id === this.editDepartment.parent_id) {
          this.updateError = {
            id: this.editDepartment.id,
            message: 'Отдел не может быть родительским для самого себя',
          };
          return;
        }

        const departmentData = {
          id: this.editDepartment.id,
          name: this.editDepartment.name,
          comment: this.editDepartment.comment,
          parent_id: this.editDepartment.parent_id,
          organization_id: this.editDepartment.organization_id,
        };

        await updateDepartment(departmentData);
        this.updatingDepartmentId = null;
        this.cancel();
        this.$emit('departmentUpdated');
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.updateError = {
            id: this.editDepartment,
            message: error.response.data.errors[0].message,
          };
        } else {
          this.updateError = {
            id: this.editDepartment,
            message: 'Произошла ошибка при обновлении отдела',
          };
        }
        console.error('Ошибка при обновлении отдела:', error);
      }
    },
  },
  mounted() {
    this.getDepartments();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  background-color: $background-color-light;

  h4 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
    text-align: center;
  }

  .input-form {
    width: 715px;
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
