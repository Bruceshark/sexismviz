<script setup>
import { defineComponent, onMounted, ref, getCurrentInstance } from "vue";
// export default defineComponent({
//   setup() {
const echarts = getCurrentInstance().appContext.config.globalProperties
  .$echarts;
onMounted(() => {
  let myChart = echarts.init(document.getElementById("myChartChina"));
  myChart.setOption({
    title: {
    //   text: "number of sexist posts",
    },
    tooltip: {
      trigger: "item",
    },
    visualMap: {
      // 根据数据展示不同颜色
      min: 0,
      max: 400,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["yellow", "orange", "red"],
      },
    },
    geo: [
      {
        // 绘制geo地图
        map: "china", // 定义的数据名称
        roam: false,
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"],
        layoutSize: 560,
        label: {
          // 基本的一些样式
          normal: {
            show: false,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: "10",
            },
          },
          emphasis: {
            color: "#333",
          },
        },
        regions: [
          //隐藏南海诸岛，可以不去掉，根据业务需求
          {
            name: "南海诸岛",
            itemStyle: {
              // 隐藏地图
              normal: {
                opacity: 0, // 为 0 时不绘制该图形
              },
            },
            label: {
              show: false, // 隐藏省份文案，false不隐藏
            },
          },
        ],
      },
    ],
    series: [
      {
        name: "post number",
        type: "map",
        // roam: true,
        // map: "china",
        geoIndex: 0,
        data: [
            { name: 'Beijing', value: 123 },
            { name: 'Zhejiang', value: 244 },
            { name: 'Overseas', value: 141 },
        ],
      },
    ],
    // ....第四步
  });
});
// });
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div class="box-title">Map View</div>
    <div class="map-outer">
      <div id="myChartChina" :style="{ width: '100%', height: '90%' }"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.map-outer {
  width: 100%;
  height: 100%;
}
</style>
