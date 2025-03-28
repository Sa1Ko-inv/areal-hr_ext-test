<template>
  <div class="positionList">
    <h3 class="positionList__title">Список должностей</h3>
    <button @click="showDialog">
      Создать должность
    </button>

    <MyModalWindow v-model:show="dialogVisible">
      <PositionCreateForm
          @create="createPosition"
          :cancel="cancelCreate"
      />
    </MyModalWindow>

    <div class="positionList__items">
      <PositionItems
          v-for="position in positions"
          :position="position"
          :key="position.id"
          @update="updatePosition"
          @delete="deletePositions"
      />
    </div>
  </div>
</template>

<script>
import PositionItems from "@/components/positions/positionItems.vue";
import PositionCreateForm from "@/components/positions/positionCreateForm.vue";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";

export default {
  components: {MyModalWindow, PositionCreateForm, PositionItems},
  props: {
    positions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },

// Передаем данные в родительский элемент, пишем функцию, а не прямо в методе, потому что сначала нужно принять position, а потом уже передать в родительский элемент
    createPosition(position) {
      this.$emit('create', position);
      this.dialogVisible = false;
    },

    updatePosition(updatedPosition) {
      this.$emit('update', updatedPosition);
    },

    deletePositions(id) {
      this.$emit('delete', id);
    },

    cancelCreate() {
      this.dialogVisible = false;
    }

  },
}
</script>

<style lang="scss" scoped>
.positionList {
  padding: 16px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &__title {
    color: #792ec9;
    font-size: 22px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
    padding-bottom: 10px;
    //border-bottom: 1px solid rgba(#792ec9, 0.2);
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>