<script setup>
import * as d3 from "d3";
import { ref, inject, computed, onMounted, watch } from "vue";
import wordData from "../assets/word_divergence.json";
const selectedGeo = inject("selectedGeo");
const selectedWordData = computed(
  () => wordData.filter((ele) => ele.region === selectedGeo.value)[0].word_list
);
const canvasWidth = 980;
const canvasHeight = 400;
const padding = { left: 0, right: 30, top: 30, bottom: 30 };
const fontSize = 15;
const hoveredWordEntropy = ref(null);
const maxSexismColor = "#c20051";
const minBothColor = "#c9bbc1";
const maxNonSexismColor = "#0d00c2";
const drawChart = () => {
  const width = canvasWidth - padding.left - padding.right;
  const height = canvasHeight;
  const colorLevelSexism = d3.interpolateRgb(
    d3.rgb(minBothColor),
    d3.rgb(maxSexismColor)
  );
  const colorLevelNonSexism = d3.interpolateRgb(
    d3.rgb(minBothColor),
    d3.rgb(maxNonSexismColor)
  );

  var svg = d3
    .select("#wordChartSvg")
    .attr("transform", "translate(" + padding.left + "," + 0 + ")");
    // .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

  var xScale = d3
    .scaleBand()
    .padding(0.3)
    .domain(d3.range(selectedWordData.value.length))
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + (height / 2) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .remove();

  var yScale = d3.scaleLinear().domain([0, 2.3]).range([height, 0]);
  var g = svg
    .selectAll("mybar")
    .data(selectedWordData.value)
    .enter()
    .append("g");

  g.append("rect")
    .attr("x", function (d, i) {
      return xScale(i);
    })
    .attr("y", function (d, i) {
      return d.label ? yScale(d.value) - height / 2 : height / 2;
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d.value);
    })
    .attr("fill", function (d) {
      return d.label
        ? colorLevelSexism(d.entropy)
        : colorLevelNonSexism(d.entropy);
    })
    .on("mouseover", function (d, i) {
      const pointerHeight = (i.entropy * (canvasHeight - padding.top)) / 2;
      if (i.label === 1) {
        hoveredWordEntropy.value = canvasHeight / 2 - pointerHeight;
      } else {
        hoveredWordEntropy.value = canvasHeight / 2 + pointerHeight;
      }
    })
    .on("mouseout", function () {
      hoveredWordEntropy.value = null;
    })

  g.append("text")
    .attr("x", function (d, i) {
      return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function (d, i) {
      return d.label
        ? yScale(d.value) - height / 2 - 5
        : (height * 3) / 2 - yScale(d.value) + fontSize;
    })
    .text(function (d, i) {
      return d.word;
    })
    .style("text-anchor", "middle");
};
watch(
  () => selectedGeo.value,
  (val) => {
    d3.select("#wordChartSvg").selectAll("svg > *").remove();
    drawChart();
  }
);
onMounted(() => {
  drawChart();
});
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div class="box-title">Text View - {{selectedGeo}}</div>
    <div class="chart-outer">
      <svg y="0" :height="canvasHeight" width="80">
        <text x="0" :y="canvasHeight / 4">Sexism</text>
        <text x="0" :y="(canvasHeight * 3) / 4">Non-Sexism</text>
      </svg>
      <svg :height="canvasHeight" width="10">
        <polygon
          v-if="hoveredWordEntropy"
          :points="
            '0,' +
            (hoveredWordEntropy - 2.5) +
            ' 10,' +
            (hoveredWordEntropy + 2.5) +
            ' 0,' +
            (hoveredWordEntropy + 7.5)
          "
        />
      </svg>
      <svg id="wordLegend" :height="canvasHeight" width="20">
        <defs>
          <linearGradient id="legend" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              :style="'stop-color:' + maxSexismColor + ';stop-opacity:1'"
            />
            <stop
              offset="50%"
              :style="'stop-color:' + minBothColor + ';stop-opacity:1'"
            />
            <stop
              offset="100%"
              :style="'stop-color:' + maxNonSexismColor + ';stop-opacity:1'"
            />
          </linearGradient>
        </defs>
        <g>
          <text x="0" :y="padding.top">1</text>
          <text x="0" :y="(padding.top + canvasHeight - 15) / 2">0</text>
          <text x="0" :y="canvasHeight - 15">1</text>
          <rect
            :height="canvasHeight - padding.top"
            :y="padding.top / 2"
            x="10"
            width="10"
            fill="url(#legend)"
          ></rect>
        </g>
      </svg>
      <svg id="wordChartSvg" :height="canvasHeight" :width="canvasWidth" y="0"/>
      <div style="text-align: right; font-style: italic">
        Height = Jensen-Shannon divergence <br />
        Shade of Color = Shannon index
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chart-outer {
  width: 100%;
  height: 90%;
}
</style>
