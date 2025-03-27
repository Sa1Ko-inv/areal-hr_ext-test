<!--Компонент модального окна-->
<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div @click.stop class="dialog__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyModalWindow',
  props: { //Отвечает за то, что видим мы модальное окно или нет
    show: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:show', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}

.dialog__content {
  margin: auto;

  background: white;
  border-radius: 12px;

  min-height: 50px;
  min-width: 300px;

  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>