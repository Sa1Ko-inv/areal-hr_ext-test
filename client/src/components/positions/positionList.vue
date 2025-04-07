<template>
  <div class="positionList">
    <h3 class="positionList__title">Список должностей</h3>
    <button @click="showCreatePosition">
      Создать должность
    </button>
    <button style="margin-left: 10px" @click="showDeletePosition">Просмотр удаленных должностей</button>


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
  <!-- Модальное окно создания должности -->
    <MyModalWindow v-model:show="dialogCreatePosition">
      <PositionCreateForm
          @create="createPosition"
          :cancel="cancelDialog"
          :error="createError"
      />
    </MyModalWindow>
  
<!-- Модальное окно просмотра удаленных должностей -->
  <MyModalWindow v-model:show="dialogDeletePosition">
    <PositionDeleteHistrory 
    :cancel="cancelDialog"
    />
  </MyModalWindow>
</template>

<script>
import PositionItems from "@/components/positions/positionItems.vue";
import PositionCreateForm from "@/components/positions/positionModal/positionCreateForm.vue";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import PositionDeleteHistrory from "@/components/positions/positionModal/positionDeleteHistrory.vue";

export default {
  components: {PositionDeleteHistrory, MyModalWindow, PositionCreateForm, PositionItems},
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
      dialogCreatePosition: false,
      dialogDeletePosition: false
    }
  },
  methods: {
    showCreatePosition() {
      this.dialogCreatePosition = true;
    },
    showDeletePosition() {
      this.dialogDeletePosition = true;
    },

    createPosition(position, callback) {
      this.$emit('create', position)
      this.dialogCreatePosition = false;
    },

    updatePosition(position) {
      this.$emit('update', position);
    },

    deletePosition(id) {
      this.$emit('delete', id);
    },

    cancelDialog() {
      this.dialogCreatePosition = false;
      this.dialogDeletePosition = false;
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
