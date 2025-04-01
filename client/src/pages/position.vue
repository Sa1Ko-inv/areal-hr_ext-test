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
      updatingPositionId: null // Для отслеживания какой должности показывать ошибку
    }
  },

  methods: {
    async getPositions() {
      try {
        const response = await fetchPositions();
        this.positions = response.data;
      } catch (error) {
        console.error('Ошибка при получении должностей:', error);
      }
    },

    async createPosition(position, callback) {
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

    async updatePosition(updatedPosition, callback) {
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
    }
  },

  mounted() {
    this.getPositions();
  },
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
</template>

<style scoped>
</style>
