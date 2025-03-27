<script>
//вывод ошибок есть в Cody
import {createPosition, fetchPositions, updatePosition} from "@/http/positionAPI.js";
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
        // Обновляем массив positions
        // const index = this.positions.findIndex(p => p.id === updatedPosition.id);
        // if (index !== -1) {
        //   this.positions.splice(index, 1, response.data);
        // }
        // Или можно просто перезагрузить список:
        this.getPositions();
      } catch (error) {
        console.error('Ошибка при обновлении должности:', error);
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
  />

</template>

<style scoped>

</style>