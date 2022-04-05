<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
<div>
    <div class="box-title">Database View</div>
</div>

</template>

<style lang="less" scoped>
.box-title::after {
    width: 120px !important;
}
</style>
