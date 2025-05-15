<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="pagination-button"
    >Предыдущая</button>

    <span class="pagination-info">
      Страница {{ currentPage }} из {{ totalPages }}
    </span>

    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="pagination-button"
    >Следующая</button>
  </div>
</template>
<script>
export default {
  name: "MyPagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    // Можно добавить опционально:
    // pageSize, totalItems, showInfo, и т.д.
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit("page-change", page);
      }
    },
  },
};
</script>

<style lang="scss">
@use "@/styles/base" as *;
</style>