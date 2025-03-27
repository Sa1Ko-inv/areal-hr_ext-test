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

<style scoped lang="scss">

</style>