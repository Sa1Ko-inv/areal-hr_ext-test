<template>
  <div class="file-header">
    <h3>Файлы сотрудника</h3>
    <button class="close-btn" @click="cancel">×</button>
  </div>

  <div v-if="employee.files && employee.files.length > 0" class="employee__file">
    <div v-for="file in employee.files" key="file.id" class="file__item">
      <div class=""><strong>Имя файла</strong>{{ file.name }}</div>
      <img
          :src="getImageUrl(file.file_url)"
          :alt="file.name"
          style="width: 100px; height: 100px;"
      >
    </div>
  </div>

  <div v-else class="">
    Файлов нет
  </div>
</template>

<script setup>
defineProps({
  employee: {
    type: Object,
    required: true
  },
  cancel: {
    type: Function,
    required: true
  }
})

const getImageUrl = (fileName) => {
  return `http://localhost:5000/${fileName}`;

};


</script>


<style scoped lang="scss">

</style>