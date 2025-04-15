<script>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton, MyInput},
  props: {
    cancel: {
      type: Function,
      required: true
    },
    error: { // Добавляем пропс для ошибки
      type: String,
      default: null
    }
  },
  data() {
    return {
      position: {
        name: '',
      },
    }
  },

  methods: {
    createPosition() {
      this.$emit('create', this.position);
      this.position = {name: ''};
    },
  }
}
</script>

<template>
  <form @submit.prevent="createPosition">
    <h4>Создание должности</h4>

    <div class="form-group">
      <MyInput
          size="medium"
          v-model.number="position.name"
          placeholder="Название должности"
          type="text"
      />
    </div>
    <!-- Отображение ошибки для поля name -->
    <div v-if="error" class="error-message">
      {{error}}
    </div>

    <div class="form-actions">
      <MyButton modifier="create" type="submit">Добавить должность</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel()">Отмена</MyButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(121, 46, 201, 0.1);
  background-color: #fff;

  h4 {
    color: #792ec9;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;

  }
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
}

.general-error {
  background-color: #ffebee;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border-left: 3px solid #d32f2f;
}

</style>