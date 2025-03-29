<script>
export default {
  props: {
    cancel: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      position: {
        name: '',
      }
    }
  },

  methods: {
    createPosition() {
      this.$emit('create', this.position);
      this.position = { name: '' };

    },

  },
}
</script>

<template>
  <form @submit.prevent="createPosition">
    <h4>Создание должности</h4>

    <input
        v-model="position.name"
        placeholder="Название должности"
        type="text"
    >

    <div class="">
      <button @click="createPosition">Добавить должность</button>
      <button type="button" @click="cancel()" >Отмена</button>

    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 500px;
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
</style>