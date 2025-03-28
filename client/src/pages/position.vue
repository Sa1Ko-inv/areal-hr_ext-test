<script>
//вывод ошибок есть в Cody
import {createPosition, deletePosition, fetchPositions, updatePosition} from "@/http/positionAPI.js";
import PositionList from "@/components/positions/positionList.vue";

export default {
  components: {PositionList},
  data() {
    return {
      positions: [],
    }
  },

  methods: {
    async getPositions() {
      try {
        const response = await fetchPositions();
        this.positions = response.data;
        console.log(this.positions);
      } catch (error) {
        console.error('Ошибка при получении должностей:', error);
      }
    },

    async createPosition(position) {
      try {
        const response = await createPosition(position.name);
        this.positions.push(response.data);
        this.getPositions();
      } catch (error) {
        console.error('Ошибка при создании должности:', error);
      }
    },

    async updatePosition(updatedPosition) {
      try {
        const response = await updatePosition(updatedPosition.id, updatedPosition.name);
        this.getPositions();
      } catch (error) {
        console.error('Ошибка при обновлении должности:', error);
      }
    },

    async deletePosition(id) {
      try {
        await deletePosition(id);
        this.positions = this.positions.filter(position => position.id !== id);
        this.getPositions();
      } catch (error) {
        console.error('Ошибка при удалении должности:', error);
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
      @create="createPosition"
      @update="updatePosition"
      @delete="deletePosition"
  />

</template>

<style scoped>

</style>