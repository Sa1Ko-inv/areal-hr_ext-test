<script>
import {createPosition, deletePosition, fetchPositions, updatePosition} from "@/http/positionAPI.js";
import PositionList from "@/components/positions/positionList.vue";

export default {
  components: {PositionList},
  data() {
    return {
      positions: [],
      createError: null,
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingPositionId: null, // Для отслеживания какой должности показывать ошибку
      currentPage: 1,
      pageSize: 9,
      totalItems: 0
    }
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

    async createPosition(position) {
      try {
        this.createError = null; // Сбрасываем ошибку перед запросом
        const response = await createPosition(position.name);
        this.positions.push(response.data);
        this.getPositions();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.createError = error.response.data.errors[0].message; // Сохраняем сообщение об ошибке
          console.error('Ошибка при создании должностей:', error);
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
        if (error.response && error.response.data && error.response.data.errors) {
          this.updateError = {
            id: updatedPosition.id,
            message: error.response.data.errors[0].message
          };
        } else {
          this.updateError = {
            id: updatedPosition.id,
            message: 'Произошла ошибка при обновлении должности'
          };
        }
      console.log('Ошибка при обновлении должности:', error);
      }
    },

    async deletePosition(id) {
      try {
        await deletePosition(id);
        this.positions = this.positions.filter(position => position.id !== id);
        this.getPositions();
        alert("Должность успешна удалена");
      } catch (error) {
        console.error('Ошибка при удалении должности:', error);
        alert("Ошибка при удалении должности");
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getPositions();
    }
  },

  mounted() {
    this.getPositions();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    }
  }
}
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
  <div class="pagination" v-if="totalPages > 1">
    <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="pagination-button"
    >
      Предыдущая
    </button>

    <span class="pagination-info">Страница {{ currentPage }} из {{ totalPages }}</span>

    <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="pagination-button"
    >
      Следующая
    </button>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
}
</style>
