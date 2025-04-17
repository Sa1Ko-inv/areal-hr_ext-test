<template>
  <div class="positionList">
    <h3 class="positionList__title">Список должностей</h3>
    <MyButton modifier="create" @click="showCreatePosition">
      Создать должность
    </MyButton>
    <MyButton modifier="showHistory" @click="showDeletePosition"
      >Просмотр удаленных должностей
    </MyButton>

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
    <PositionDeleteHistrory :cancel="cancelDialog" />
  </MyModalWindow>
</template>

<script>
import PositionItems from '@/components/positions/positionItems.vue';
import PositionCreateForm from '@/components/positions/positionModal/positionCreateForm.vue';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import PositionDeleteHistrory from '@/components/positions/positionModal/positionDeleteHistrory.vue';
import MyButton from '@/components/UI/MyButton.vue';
import { UserStore } from '@/store/UserStore.js';

export default {
  components: {
    MyButton,
    PositionDeleteHistrory,
    MyModalWindow,
    PositionCreateForm,
    PositionItems,
  },
  props: {
    positions: {
      type: Array,
      required: true,
    },
    createError: {
      type: String,
      default: null,
    },
    updateError: {
      // Добавляем проп для ошибки обновления
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      userStore: UserStore(),
      dialogCreatePosition: false,
      dialogDeletePosition: false,
    };
  },
  methods: {
    showCreatePosition() {
      if (this.userStore.role !== 'admin') {
        alert('У вас нет прав для создания должности');
        return;
      } else {
        this.dialogCreatePosition = true;
      }
    },
    showDeletePosition() {
      this.dialogDeletePosition = true;
    },

    createPosition(position) {
      this.$emit('create', position);
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
    },
  },
};
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
}
</style>
