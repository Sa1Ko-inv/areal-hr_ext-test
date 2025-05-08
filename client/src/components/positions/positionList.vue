<template>
  <div class="positionList">
    <h3 class="positionList__title">Список должностей</h3>
    <MyButton modifier="create" @click="showCreatePosition">
      Создать должность
    </MyButton>
    <MyButton modifier="showHistory" @click="showDeletePosition">
      Просмотр удаленных должностей
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
    <PositionDeleteHistory :cancel="cancelDialog" />
  </MyModalWindow>
</template>

<script>
import PositionItems from '@/components/positions/positionItems.vue';
import PositionCreateForm from '@/components/positions/positionModal/positionCreateForm.vue';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import PositionDeleteHistory from '@/components/positions/positionModal/positionDeleteHistory.vue';
import MyButton from '@/components/UI/MyButton.vue';
import { UserStore } from '@/store/UserStore.js';

export default {
  components: {
    MyButton,
    PositionDeleteHistory,
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
      type: {},
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
      this.dialogCreatePosition = true;
    },
    showDeletePosition() {
      this.dialogDeletePosition = true;
    },

    createPosition(position) {
      this.$emit('create', {
        position, onSuccess: () => {
          this.dialogCreatePosition = false;
        },
      });
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
@use "@/styles/base" as *;

.positionList {
  padding: 16px;
  border-radius: $border-radius;
  background-color: $background-color-light;
  box-shadow: $box-shadow;

  &__title {
    color: $primary-color;
    font-size: $font-size-title;
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
