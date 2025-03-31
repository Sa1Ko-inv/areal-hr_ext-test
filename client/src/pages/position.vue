<script>
import {createPosition, deletePosition, fetchPositions, updatePosition} from "@/http/positionAPI.js";
import PositionList from "@/components/positions/positionList.vue";

export default {
  components: {PositionList},
  data() {
    return {
      positions: [],
      Error: null,
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
        this.Error = null; // Сбрасываем ошибку перед запросом
        const response = await createPosition(position.name);
        this.positions.push(response.data);
        this.getPositions();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.Error = error.response.data.errors[0].message; // Сохраняем сообщение об ошибке
          console.error('Ошибка при создании должностей:', error);
        } else {
          this.Error = 'Произошла ошибка при создании должностей';
        }
        console.error('Ошибка при создании должностей:', error);
      }
    },

    // async createPosition(position, callback) {
    //   try {
    //     const result = await createPosition(position.name);
    //     if (result.success) {
    //       // Если успешно, обновляем список должностей
    //       await this.getPositions();
    //       callback && callback([]); // Вызываем callback без ошибок
    //     } else {
    //       // Если есть ошибки, передаем их в callback
    //       callback && callback(result.errors);
    //     }
    //   } catch (error) {
    //     console.error('Ошибка при создании должности:', error);
    //     callback && callback([{
    //       field: 'general',
    //       message: 'Произошла непредвиденная ошибка при создании должности'
    //     }]);
    //   }
    // },

    async updatePosition(updatedPosition, callback) {
      try {
        const result = await updatePosition(updatedPosition.id, updatedPosition.name);
        if (result.success) {
          // Если успешно, обновляем список должностей
          await this.getPositions();
          callback && callback([]); // Вызываем callback без ошибок
        } else {
          // Если есть ошибки, передаем их в callback
          callback && callback(result.errors);
        }
      } catch (error) {
        console.error('Ошибка при обновлении должности:', error);
        callback && callback([{
          field: 'general',
          message: 'Произошла непредвиденная ошибка при обновлении должности'
        }]);
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
      :error="Error"
      @create="createPosition"
      @update="updatePosition"
      @delete="deletePosition"
  />
</template>

<style scoped>
</style>
