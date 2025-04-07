<script>
export default {
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
      <input
          v-model.number="position.name"
          placeholder="Название должности"
          type="text"
      >
    </div>
    <!-- Отображение ошибки для поля name -->
    <div v-if="error" class="error-message">
      {{error}}
    </div>

    <div class="form-actions">
      <button type="submit">Добавить должность</button>
      <button type="button" @click="cancel()">Отмена</button>
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

  input {
    width: 100%;
    padding: 10px 12px;
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #792ec9;
      box-shadow: 0 0 0 2px rgba(121, 46, 201, 0.2);
    }

    &::placeholder {
      color: #aaa;
    }
  }

  div {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    button {
      flex: 1;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:first-child {
        background-color: #792ec9;
        color: white;

        &:hover {
          background-color: #792ec9
        }
      }

      &:last-child {
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;

        &:hover {
          background-color: #eaeaea;
        }
      }
    }
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