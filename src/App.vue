<script setup>
import MapView from "./components/MapView.vue";
import TextView from "./components/TextView.vue";
import DBView from "./components/DBView.vue";
import RegView from "./components/RegView.vue";
import { provide, ref } from "vue";
const selectedGeo = ref();
const updateSelectedGeo = (val) => {
  selectedGeo.value = val;
};
provide("selectedGeo", selectedGeo);
provide("updateSelectedGeo", updateSelectedGeo);
</script>

<template>
  <div class="outer">
    <a-row>
      <div class="header">
        <span class="title">SexismViz</span>
        <img
          class="logo"
          src="https://upload.wikimedia.org/wikipedia/zh/4/46/Sina_Weibo_logo.svg"
        />
      </div>
    </a-row>
    <a-row class="row" style="margin-bottom: 15px">
      <div class="box" style="width: 740px">
        <MapView />
      </div>
      <div class="box" style="width: 1140px">
        <TextView />
      </div>
    </a-row>
    <a-row class="row">
      <div class="box" style="width: 740px">
        <DBView />
      </div>
      <div class="box" style="width: 1140px">
        <RegView />
      </div>
    </a-row>
  </div>
</template>

<style lang="less">
.outer {
  height: 1080px;
  width: 1920px;
  box-sizing: border-box;
  padding: 15px;
  padding-top: 0;
  background: rgb(241, 241, 241);
}
.header {
  height: 60px;
  display: flex;
  .title {
    font-weight: bold;
    font-size: 25px;
    line-height: 60px;
    margin: 0 10px;
    color: @primaryColor;
  }
}

.logo {
  width: 30px;
}
.row {
  display: flex;
  justify-content: space-between;
  .box {
    padding: 10px;
    background: white;
    height: 495px;
    .box-title {
      font-weight: bold;
      line-height: 24px;
      font-size: 18px;
      position: relative;
    }
    .box-title::after {
      background-color: #c92268;
      opacity: 0.3;
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      height: 8px;
      width: 80px;
    }
  }
}
</style>
