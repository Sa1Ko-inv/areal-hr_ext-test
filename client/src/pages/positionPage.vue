<script>
import {
  createPosition,
  deletePosition,
  fetchPositions,
  updatePosition,
} from '@/http/positionAPI.js';
import PositionList from '@/components/positions/positionList.vue';
import MyPagination from '@/components/UI/MyPagination.vue';

export default {
  components: { MyPagination, PositionList },
  data() {
    return {
      positions: [],
      createError: { name: null, general: null },
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingPositionId: null, // Для отслеживания какой должности показывать ошибку
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    };
  },

  methods: {
    async getPositions() {
      try {
        const response = await fetchPositions(this.currentPage, this.pageSize);
        this.positions = response.data.rows;
        this.totalItems = response.data.count;
      } catch (error) {
        console.error('Ошибка при получении должностей:', error);
      }
    },

    async createPosition(position, onSuccess) {
      try {
        this.createError = { name: null, general: null }; // Сбрасываем ошибку перед запросом
        const response = await createPosition(position.name);
        this.positions.push(response.data);
        this.getPositions();
        onSuccess();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            if (err.field && Object.prototype.hasOwnProperty.call(this.createError, err.field)) {
              this.createError[err.field] = err.message;
            } else {
              this.createError.general = err.message;
            }
          })
        } else {
          this.createError = 'Произошла ошибка при создании должностей';
        }
        console.error('Ошибка при создании должностей:', error);
      }
    },

    async updatePosition(updatedPosition) {
      try {
        this.updateError = null;
        this.updatingPositionId = updatedPosition.id; // Запоминаем ID должности
        await updatePosition(updatedPosition.id, updatedPosition.name);
        this.getPositions();
        this.updatingPositionId = null; // Сбрасываем ID после обновления
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.updateError = {
            id: updatedPosition.id,
            message: error.response.data.errors[0].message,
          };
        } else {
          this.updateError = {
            id: updatedPosition.id,
            message: 'Произошла ошибка при обновлении должности',
          };
        }
        console.log('Ошибка при обновлении должности:', error);
      }
    },

    async deletePosition(id) {
      try {
        await deletePosition(id);
        this.positions = this.positions.filter(
          (position) => position.id !== id
        );
        this.getPositions();
        alert('Должность успешна удалена');
      } catch (error) {
        console.error('Ошибка при удалении должности:', error);
        alert('Ошибка при удалении должности');
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getPositions();
    },
  },

  mounted() {
    this.getPositions();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
  },
};
</script>

<template>
  <PositionList
    :positions="positions"
    :createError="createError"
    :updateError="updateError"
    @create="createPosition"
    @update="updatePosition"
    @delete="deletePosition"
  />
  <!-- Пагинация -->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<style scoped>
</style>
