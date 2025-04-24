<script>
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton, MyInput },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
    error: {
      // Добавляем пропс для ошибки
      type: {},
      default: null,
    },
  },
  data() {
    return {
      position: {
        name: '',
      },
    };
  },

  methods: {
    createPosition() {
      this.$emit('create', this.position);
      this.position = { name: '' };
    },
  },
};
</script>

<template>
  <form @submit.prevent="createPosition">
    <h4>Создание должности</h4>
    <!-- Отображение общей ошибки -->
    <div v-if="error.name" class="error-message">{{ error.name }}</div>

    <div class="form-group">
      <MyInput
        size="medium"
        v-model.number="position.name"
        placeholder="Название должности"
        type="text"
      />
    </div>


    <div class="form-actions">
      <MyButton modifier="create" type="submit">Добавить должность</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel()">Отмена</MyButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/styles/base";

form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  background-color: $background-color-light;

  h4 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
    text-align: center;
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
}
.form-actions {
  padding-top: 15px;
}
</style>
