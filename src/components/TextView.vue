<script setup>
import { ref, inject, computed } from "vue";
const selectedGeo = inject("selectedGeo");
const selectedGeoReactive = computed(() => {
  return selectedGeo.value;
});
// return { selectedGeoReactive };
</script>

<template>
  <div>
    <div class="box-title">Text View</div>
    {{ selectedGeo }}
  </div>
</template>

<style lang="less" scoped>
</style>
