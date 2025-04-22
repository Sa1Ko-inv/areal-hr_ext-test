<template>
  <form @submit.prevent="create" class="organization-create-form">
    <h3>Создание организации</h3>

    <div v-if="error.general" class="error-message">{{error.general }}</div>
    <div class="form-group">
      <div v-if="error.name" class="error-message">{{error.name}}</div>
      <label>Название организации</label>
      <MyInput v-model.number="name" type="text" class="form-input" />
    </div>

    <div class="form-group">
      <div v-if="error.comment" class="error-message"></div>
      <label>Комментарий</label>
      <textarea v-model="comment" class="form-textarea"></textarea>
    </div>

    <div class="form-actions">
      <MyButton modifier="create" type="submit">Создать</MyButton>
      <MyButton modifier="cancel" type="button" @click="cancel">Отмена</MyButton>
    </div>
  </form>
</template>

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
      name: '',
      comment: '',
    };
  },
  methods: {
    create() {
      this.$emit('create', {
        name: this.name,
        comment: this.comment,
      });
      this.name = '';
      this.comment = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
.error-message {
  color: $danger-color;
  margin-top: 5px;
  font-size: $font-size-text;
  font-weight: normal;
}

.organization-create-form {
  width: 100%;

  h3 {
    color: $primary-color;
    font-size: $font-size-title;
    margin-bottom: 20px;
  }
}

.form-group {
  width: 770px;
  margin-bottom: 15px;
  color: $primary-color;
  font-weight: bold;
  font-size: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
}

.form-textarea {
  width: 780px;
  padding: 8px 5px;
  height: 100px;
  border: 1px solid $primary-color;
  border-radius: $border-radius;
  font-size: 18px;
  font-family: $font-family;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
