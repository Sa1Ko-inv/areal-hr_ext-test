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
          :error="error"
      />
    </MyModalWindow>

    <div class="positionList__items">
      <PositionItems
          v-for="position in positions"
          :position="position"
          :key="position.id"
          @update="updatePosition"
          @delete="deletePosition"
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
    },
    error: {
      type: String,
      default: null
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

    createPosition(position, callback) {
      this.$emit('create', position, (errors) => {
        if (!errors || errors.length === 0) {
          this.dialogVisible = false;
        }
        // Вызываем callback с ошибками или без
        callback && callback(errors);
      });
    },

    updatePosition(position, callback) {
      this.$emit('update', position, callback);
    },

    deletePosition(id) {
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
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  button {
    display: inline-block;
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #792ec9;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #792ec9
    }
  }
}
</style>
