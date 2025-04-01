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
          :error="createError"
      />
    </MyModalWindow>

    <div class="positionList__items">
      <PositionItems
          v-for="position in positions"
          :position="position"
          :key="position.id"
          :error="updateError?.id === position.id ? updateError.message : null"
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
    createError: {
      type: String,
      default: null
    },
    updateError: { // Добавляем проп для ошибки обновления
      type: Object,
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
      this.$emit('create', position)
    },

    updatePosition(position) {
      this.$emit('update', position);
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
