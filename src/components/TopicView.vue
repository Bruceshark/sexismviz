<script setup>
import * as d3 from "d3";
import { ref, inject, computed, onMounted, watch } from "vue";
import topicList from "../assets/lda_topics.json";
const selectedGeo = inject("selectedGeo");
const showTopicReport = ref(false);
const showSectionInfo = ref(false);
const singleChartHeight = 50;
const singleChartMargin = 20;
const canvasWidth = 1100;
const topicLabelWidth = 50;
const padding = { left: 0, right: 30, top: 30, bottom: 30 };
const canvasHeight =
  topicList.length * (singleChartHeight + singleChartMargin) +
  padding.top +
  padding.bottom;
const drawChart = () => {
  const width = canvasWidth - padding.left - padding.right - topicLabelWidth;
  const height = canvasHeight;

  var svg = d3.select("#topicChartSvg");
  var xScale = d3
    .scaleBand()
    .padding(0.3)
    .domain(d3.range(topicList[0].word_list.length))
    .range([0, width]);

  topicList.forEach((ele, idx) => {
    const valueList = ele.word_list.map((ele) => ele.value);

    var yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...valueList)])
      .range([singleChartHeight, 0]);
    var g = svg.append("g").selectAll("mybar").data(ele.word_list).enter();
    g.append("g")
      .on("mouseover", function (d, i) {
        d3.select(`#text-${idx}-${i.word}`).text(i.value);
      })
      .on("mouseout", function (d, i) {
        d3.select(`#text-${idx}-${i.word}`).text(i.word);
      })
      .append("rect")
      .attr("x", function (d, i) {
        return xScale(i) + topicLabelWidth;
      })
      .attr("y", function (d) {
        return (
          idx * (singleChartHeight + singleChartMargin) +
          yScale(d.value) +
          padding.top
        );
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return singleChartHeight - yScale(d.value);
      })
      .attr("fill", "#3c4f76");
    g.append("text")
      .attr("x", function (d, i) {
        return xScale(i) + xScale.bandwidth() / 2 + topicLabelWidth;
      })
      .attr("y", function (d, i) {
        return (
          idx * (singleChartHeight + singleChartMargin) +
          yScale(d.value) +
          padding.top -
          5
        );
      })
      .attr("id", function (d, i) {
        return `text-${idx}-${d.word}`;
      })
      .text(function (d, i) {
        return d.word;
      })
      .style("text-anchor", "middle");
    svg
      .append("text")
      .text(ele.topic)
      .attr("x", function (d, i) {
        return 0;
      })
      .attr("y", function (d) {
        return (
          idx * (singleChartHeight + singleChartMargin) + singleChartHeight
        );
      })
      .style("font-weight", "bold");
  });
};
watch(
  () => selectedGeo.value,
  (val) => {
    d3.select("#topicChartSvg").selectAll("svg > *").remove();
    if (selectedGeo.value !== "China") return;
    console.log("i");
    drawChart();
  }
);
onMounted(() => {
  drawChart();
});
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div v-show="selectedGeo === 'China'">
      <div class="box-header" style="justify-content: space-between">
        <div>
          <a-button type="primary" @click="() => (showTopicReport = true)"
            >Interactive Report</a-button
          >
        </div>
        <div class="question-logo" @click="() => (showSectionInfo = true)">
          <img src="../assets/question.svg" />
        </div>
      </div>
      <div class="chart-outer">
        <svg
          id="topicChartSvg"
          :height="canvasHeight"
          :width="canvasWidth"
          y="0"
        />
      </div>
    </div>
    <div
      v-show="selectedGeo !== 'China'"
      style="text-align: center; padding: 30px"
    >
      Due to the data size, the LDA topic data are only available when the
      selected region is "China", but the word divergence data are available to
      all regions.<br />Please reselect the region by clicking the
      <svg style="width: 55px; height: 50px; margin-bottom: -20px">
        <path
          d="M892.8 854.4c-3.2 0 0-6.4-6.4-6.4v-3.2h-6.4s0-3.2-3.2-3.2-3.2-3.2-3.2-3.2l-3.2-3.2c0-3.2 3.2-6.4 3.2-12.8 0 0 0-3.2-3.2-3.2 0-6.4 3.2-12.8 6.4-19.2v-9.6l3.2-3.2v-6.4c0-3.2 6.4-3.2 6.4-6.4 3.2 0 3.2 0 6.4-3.2h6.4s3.2 3.2 6.4 3.2c3.2 12.8 0 28.8 0 44.8-3.2 6.4 0 16-6.4 22.4-3.2 3.2 0 6.4 0 12.8 0 3.2 0 3.2-3.2 6.4 0-6.4 0-6.4-3.2-6.4zM646.4 960s-3.2-3.2-6.4-3.2h-6.4l-3.2-3.2v-6.4-9.6s3.2-3.2 3.2-6.4c3.2-3.2 9.6-9.6 16-12.8 3.2 0 6.4 0 9.6-3.2 3.2 0 3.2 3.2 6.4 3.2h3.2v-3.2s-3.2 0-6.4-3.2l-3.2-3.2c0-3.2-3.2-6.4-3.2-9.6l-6.4-3.2v-6.4H643.2l-3.2-3.2c-3.2 0-6.4-3.2-12.8 0-3.2 0-3.2 3.2-6.4 3.2H611.2c-3.2 0-6.4-3.2-12.8-6.4h-9.6l-9.6-9.6s0-3.2-3.2-6.4v-12.8h-3.2-6.4c-6.4-3.2-12.8-6.4-16-9.6 0 3.2-3.2 3.2-6.4 6.4 0 3.2-6.4 3.2-6.4 6.4-3.2 3.2-6.4 0-9.6 0-3.2 0-3.2 3.2-6.4 3.2-6.4-3.2-16 0-22.4-3.2-3.2 0-3.2 0-6.4 3.2v3.2H483.2h-3.2c0 6.4 3.2 16 0 25.6-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 0-3.2-3.2-6.4-6.4 0-3.2 0-3.2-3.2-6.4-3.2 0-3.2 3.2-6.4 3.2h-6.4c0-3.2-3.2-3.2-3.2-3.2s0-3.2-3.2-3.2c0 0-3.2 0-3.2-3.2 0 0-3.2-3.2-6.4-3.2l-3.2-3.2s-3.2-3.2-3.2-6.4v-9.6c3.2 0 0-3.2 3.2-6.4 0-3.2-3.2-3.2-6.4-3.2 0-3.2-3.2-3.2-6.4-6.4v-12.8c-3.2-3.2-12.8 0-19.2 0h-3.2c0-6.4-3.2-12.8 0-22.4 0-3.2 3.2-3.2 6.4-6.4v-3.2c3.2-3.2 3.2-6.4 9.6-9.6 3.2-3.2 3.2-6.4 6.4-6.4V768c0-3.2 3.2-3.2 3.2-6.4v-9.6c3.2-6.4 0-6.4 0-9.6l-3.2-3.2h-3.2c-3.2-6.4-6.4-12.8-6.4-16h-3.2s-3.2 6.4-6.4 6.4c-3.2 3.2-9.6 0-12.8 0-6.4-3.2-9.6-6.4-16-9.6h-6.4l-3.2 3.2c-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 0-3.2 3.2-9.6 6.4-3.2 3.2-9.6 3.2-12.8 6.4-3.2 0-3.2 3.2-6.4 3.2h3.2c-3.2 0-3.2 3.2-6.4 3.2H291.2l-3.2-3.2v-9.6c-3.2-3.2-6.4-6.4-9.6-6.4 0-3.2-3.2-3.2-6.4-6.4v-3.2l-3.2-12.8-3.2-3.2c-3.2-3.2-6.4-3.2-12.8-3.2l-3.2-3.2h-6.4c-3.2 3.2-6.4 3.2-6.4 6.4s-3.2 3.2-3.2 6.4c0 0-3.2 0-6.4 3.2 0 0-3.2 0-6.4-3.2s0-12.8-3.2-16c-3.2 0-3.2 3.2-9.6 3.2-3.2 0-3.2-3.2-6.4-3.2h-3.2l-6.4-3.2c-3.2 0-9.6-3.2-16-6.4-3.2 0-3.2-3.2-6.4-3.2h-12.8c0-3.2-3.2-3.2-3.2-6.4-3.2 0-6.4-3.2-9.6-3.2 0 0 0-3.2-3.2-3.2v-3.2c-3.2 0-3.2 0-6.4-3.2l-3.2-3.2-3.2-3.2V640h-3.2c-3.2 0-6.4 0-9.6-3.2-6.4-12.8-12.8-22.4-25.6-28.8h-6.4c-3.2 0-3.2 3.2-6.4 6.4 0 0-3.2 0-6.4-3.2-3.2-6.4-6.4-9.6-9.6-12.8-3.2-3.2-3.2-6.4-3.2-9.6-3.2-3.2-6.4-6.4-9.6-12.8h-3.2c0-3.2-3.2-6.4-6.4-6.4-3.2-9.6 0-19.2 0-28.8v-6.4c3.2 0 3.2-3.2 6.4-3.2s3.2 3.2 6.4 3.2l3.2-3.2c0-9.6-3.2-16-3.2-25.6 0-3.2 3.2-3.2 3.2-9.6-3.2-9.6-6.4-16-6.4-25.6 0-3.2-3.2 0-6.4-3.2h3.2c-6.4-3.2-9.6-9.6-12.8-12.8-3.2 0-3.2-3.2-6.4-3.2-3.2-6.4 0-16-3.2-25.6-3.2 0-3.2-6.4-6.4-6.4s-6.4-3.2-9.6-6.4v-6.4c3.2-3.2 6.4-3.2 9.6-3.2v-6.4c0-3.2 3.2-3.2 3.2-9.6v-6.4s0-3.2-3.2-6.4-6.4 0-12.8-3.2l-3.2-3.2v-6.4l6.4-6.4v-12.8c3.2 0 3.2 0 3.2-3.2 3.2 0 6.4-3.2 9.6-6.4 3.2-3.2 9.6 0 12.8 0l3.2-3.2c3.2 0 9.6 3.2 12.8 3.2 3.2 0 3.2 3.2 6.4 3.2h9.6c3.2 0 3.2-3.2 9.6-3.2v-3.2s3.2 0 3.2-3.2c3.2 0 9.6 0 9.6-3.2 9.6-3.2 19.2 0 28.8 0 9.6-3.2 12.8-3.2 19.2-3.2h3.2c3.2-3.2 6.4-9.6 6.4-16l3.2-3.2c3.2 0 3.2-3.2 3.2-3.2V262.4c3.2 0 0-3.2 3.2-6.4 3.2 0 3.2-3.2 6.4-3.2 6.4 0 16-3.2 22.4 3.2H195.2v-3.2c0-3.2 0-6.4 3.2-12.8l3.2-3.2v-3.2c0-3.2 3.2-3.2 3.2-3.2 3.2-6.4 6.4-6.4 6.4-9.6 3.2 0 0-3.2 3.2-6.4 3.2 0 3.2-3.2 6.4-3.2 6.4 0 6.4 3.2 12.8 3.2 3.2 0 3.2 3.2 6.4 3.2h6.4c3.2 0 6.4 0 9.6-3.2 3.2 0 0-3.2 3.2-6.4 0-3.2 0-9.6 3.2-16 0 0 3.2 0 3.2-3.2h6.4c3.2 3.2 6.4 3.2 6.4 3.2v-3.2s0-3.2 3.2-3.2c9.6-3.2 19.2-6.4 25.6-3.2 3.2 6.4 0 12.8 3.2 19.2 3.2 0 3.2 3.2 6.4 6.4 3.2 0 3.2 3.2 3.2 6.4 0 0 3.2 3.2 6.4 3.2h3.2c3.2 0 3.2 3.2 6.4 3.2 0 0 0 3.2 3.2 3.2v16h3.2c3.2 6.4 0 12.8 3.2 19.2 0 3.2-3.2 9.6-6.4 12.8v12.8c6.4 3.2 9.6 3.2 16 3.2v3.2c6.4 0 12.8 3.2 19.2 6.4h3.2c3.2 0 6.4 6.4 12.8 6.4v6.4c3.2 0 3.2 6.4 6.4 6.4 0 0 3.2 0 3.2 3.2 3.2 3.2 0 6.4 3.2 12.8l3.2 3.2c0 3.2 3.2 3.2 3.2 6.4 0 0 0 3.2 3.2 3.2v6.4s3.2 0 3.2 3.2c0 0 3.2 3.2 6.4 3.2s3.2 3.2 6.4 3.2c6.4 0 16 0 22.4 3.2l3.2 3.2c12.8 0 22.4 3.2 38.4 3.2 3.2 0 3.2 3.2 6.4 3.2h6.4c3.2 3.2 3.2 3.2 6.4 3.2v3.2c3.2 3.2 9.6 0 12.8 3.2 0 3.2 6.4 3.2 6.4 9.6h19.2c3.2 0 3.2 3.2 6.4 3.2 6.4-3.2 9.6-3.2 16-9.6h6.4V384c3.2 0 6.4 0 9.6-3.2l3.2-3.2c9.6-3.2 16-3.2 25.6-6.4h32c3.2 0 3.2-3.2 3.2-6.4 3.2-3.2 6.4-6.4 9.6-6.4h3.2c3.2 0 3.2-3.2 3.2-6.4 3.2 0 3.2-3.2 3.2-3.2v-3.2l-3.2-3.2c-3.2-3.2-6.4-6.4-6.4-12.8v-12.8c3.2 0 3.2 0 3.2-3.2 3.2 0 3.2-3.2 6.4-3.2 9.6 0 19.2 3.2 28.8 0 3.2 0 3.2 0 6.4-3.2v-3.2h3.2l9.6-9.6c3.2 0 6.4 0 9.6-3.2l3.2-3.2c3.2 0 6.4 0 9.6-3.2 0-3.2 3.2-6.4 3.2-12.8l3.2-3.2h6.4c3.2-3.2 6.4-6.4 12.8-9.6h3.2l3.2-3.2h16l3.2-3.2c0-3.2-3.2-3.2-3.2-6.4-3.2 0-3.2-3.2-3.2-3.2-3.2 0-3.2-3.2-6.4-6.4h-3.2l-3.2-3.2h-9.6l-3.2 3.2c-3.2 0-3.2 3.2-6.4 3.2h-6.4l-3.2-3.2H739.2v12.8c-3.2 0-6.4 3.2-9.6 3.2l-3.2-3.2-3.2-3.2c0-6.4 0-12.8 3.2-19.2h3.2c0-6.4 3.2-9.6 3.2-12.8h3.2c0-6.4 3.2-9.6 6.4-12.8h19.2c3.2 0 3.2 0 3.2-3.2l9.6-9.6c3.2-3.2 0-9.6 3.2-12.8 3.2-3.2 3.2-9.6 6.4-12.8h3.2v-6.4l3.2-3.2 3.2-3.2v-9.6h-9.6l-3.2-3.2v-16c0-3.2 3.2-3.2 3.2-6.4h3.2c3.2 0 3.2 0 3.2-3.2 0 0 0-3.2 3.2-3.2h3.2c3.2 0 6.4-3.2 9.6 0 3.2 0 3.2-3.2 6.4-3.2s3.2-3.2 6.4-3.2h9.6c6.4-6.4 6.4-6.4 12.8-6.4 3.2 0 6.4 3.2 9.6 6.4 3.2 0 3.2 0 3.2-3.2h9.6c0 3.2 3.2 3.2 6.4 3.2 0 0 0 3.2 3.2 3.2 3.2 3.2 3.2 6.4 6.4 9.6 0 3.2 0 6.4 3.2 6.4h3.2s0 6.4 3.2 6.4c3.2 3.2 6.4 3.2 6.4 6.4s3.2 3.2 3.2 6.4h6.4s0 3.2 3.2 3.2c0 3.2 3.2 9.6 3.2 12.8l3.2 3.2 3.2 3.2c6.4 3.2 16 0 22.4 3.2 3.2 3.2 6.4 3.2 9.6 6.4h9.6c0 3.2 3.2 3.2 6.4 6.4 0 0 0 3.2 3.2 3.2-6.4 6.4-6.4 9.6-6.4 12.8v3.2h3.2c3.2 0 3.2 3.2 6.4 3.2 6.4 0 9.6-3.2 16-3.2 3.2-3.2 3.2-6.4 6.4-6.4 0-3.2 3.2-3.2 3.2-6.4 3.2-3.2 3.2-3.2 9.6-3.2l9.6-9.6h3.2l3.2-3.2 3.2 3.2v6.4l-3.2 3.2V192c3.2 3.2 3.2 9.6 0 12.8h-3.2c-3.2 16 0 35.2-3.2 51.2 0 0 0 3.2-3.2 6.4 0 0-3.2 0-3.2 3.2-6.4 0-12.8 0-19.2 3.2v3.2c-3.2 3.2-6.4 3.2-6.4 6.4v6.4c6.4 3.2 9.6 6.4 9.6 12.8 3.2 6.4 3.2 12.8 3.2 22.4-3.2 3.2-3.2 6.4-6.4 6.4 0 3.2 0 9.6-3.2 12.8h-3.2v-3.2s-3.2-3.2-6.4-3.2c-3.2 3.2-3.2 6.4-6.4 12.8-3.2 3.2-9.6 6.4-12.8 12.8 0 3.2 3.2 3.2 3.2 3.2 0 3.2-3.2 3.2-3.2 6.4l-3.2 3.2c-6.4 3.2-16 0-22.4 0-3.2 0-3.2 0-3.2 3.2s-3.2 3.2-3.2 6.4l-3.2 3.2-3.2 3.2c0 3.2-3.2 3.2-6.4 9.6v3.2c-3.2 3.2-3.2 6.4-3.2 6.4-3.2 0-6.4 3.2-6.4 6.4-6.4 6.4-12.8 9.6-22.4 6.4-3.2 0-3.2 0-6.4 3.2 0 3.2 0 3.2-3.2 6.4 0 0 0 3.2-3.2 3.2v6.4l-6.4 9.6s0 3.2-3.2 3.2h-3.2l-3.2 3.2c-3.2 0-6.4 3.2-9.6 3.2 0-3.2-3.2-3.2-3.2-6.4v-6.4l3.2-3.2c3.2-6.4 0-16 3.2-25.6l3.2-3.2c3.2 0 0-3.2 3.2-6.4v-9.6c-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 3.2-3.2 6.4-3.2 9.6 0 3.2-3.2 3.2-3.2 3.2s0 3.2-3.2 6.4c-3.2 0-6.4 3.2-9.6 6.4-3.2 3.2-6.4 9.6-9.6 12.8 0 3.2-3.2 3.2 0 3.2l-6.4 6.4c-3.2 0-3.2 0-6.4 3.2h-6.4-3.2c-3.2 0 0 3.2 0 6.4s3.2 6.4 6.4 6.4h12.8c3.2 0 9.6 3.2 12.8 6.4v6.4h-3.2l3.2 3.2h6.4l9.6-9.6h3.2c3.2-3.2 12.8-9.6 19.2-9.6l3.2 3.2c3.2 0 3.2 0 9.6 3.2h3.2c3.2 0 3.2 3.2 9.6 3.2h3.2c3.2 0 3.2 0 6.4 3.2v3.2c-3.2 6.4-9.6 9.6-19.2 12.8 0 0-6.4 0-9.6 3.2 0 3.2 0 6.4-3.2 6.4h-3.2c0 3.2-3.2 3.2-3.2 6.4-3.2 3.2-9.6 6.4-12.8 12.8-3.2 0-3.2 3.2-3.2 6.4-3.2 0-3.2 3.2-3.2 6.4s3.2 3.2 3.2 6.4c3.2 3.2 6.4 0 9.6 0 3.2 3.2 6.4 0 6.4 3.2h3.2c3.2 0 0 6.4 3.2 9.6l3.2 3.2c0 6.4 3.2 16 3.2 22.4 3.2 3.2 6.4 3.2 9.6 6.4 3.2 3.2 3.2 6.4 6.4 9.6l3.2 3.2c0 3.2 3.2 6.4 3.2 9.6 3.2 3.2 3.2 6.4 6.4 6.4l3.2 3.2-9.6 9.6c-3.2 0-3.2 3.2-6.4 3.2h-3.2l-3.2 3.2h12.8l9.6 9.6c0 6.4 3.2 12.8 3.2 19.2l-3.2 3.2c-3.2 3.2 0 9.6 0 16 0 0-3.2 3.2-6.4 3.2-3.2 3.2-3.2 6.4-6.4 9.6 0 6.4-3.2 9.6-6.4 16 0 3.2-3.2 3.2-3.2 9.6 0 3.2-3.2 3.2-3.2 6.4v6.4s-3.2 0-3.2 3.2c0 0 0 3.2-3.2 3.2v12.8c0 3.2-3.2 6.4-3.2 9.6v6.4l-3.2 3.2c-3.2 0-3.2 6.4-6.4 9.6l-3.2 3.2h-6.4l-3.2 3.2v6.4l-3.2 3.2c-3.2 3.2-3.2 6.4-9.6 9.6h-3.2c0 3.2 3.2 0 3.2 3.2h-6.4c0 3.2-6.4 3.2-6.4 6.4s-3.2 6.4-6.4 9.6h-3.2c-3.2 3.2-9.6 6.4-16 6.4l-3.2 3.2h-12.8c-3.2 0-6.4 6.4-12.8 6.4h-3.2c-3.2 0-3.2 3.2-6.4 3.2v-3.2h-3.2s0 3.2-3.2 3.2l-12.8 22.4h-6.4c-3.2 0-6.4 3.2-6.4 3.2 0 3.2-3.2 3.2-3.2 6.4-3.2 3.2-9.6 0-12.8 3.2v3.2h-6.4c-3.2 0-3.2 3.2-9.6 6.4h-9.6c-3.2 0-3.2 3.2-3.2 3.2h-6.4l-3.2 6.4h3.2s3.2 3.2 3.2 6.4-3.2 6.4-3.2 9.6c0 0-3.2 0-6.4 3.2 6.4 3.2 12.8 0 19.2 3.2l3.2 3.2v6.4h-3.2c-3.2 0-3.2 3.2-6.4 6.4 0 3.2 3.2 9.6 0 12.8H675.2v3.2c-3.2 3.2-6.4 3.2-9.6 3.2 0 3.2-3.2 0-3.2 3.2l-16 3.2z m0 0"
          id="China"
          transform="scale(0.05)"
          style="fill: rgb(199, 122, 154)"
        ></path>
      </svg>
      at the upper left corner to browse the LDA topics. <br />
    </div>
    <a-modal
      style="width: 1640px; height: 780px"
      v-model:visible="showTopicReport"
      :footer="null"
      title="interactive topic model visualization | powered by pyLDAvis"
      @ok="() => (showTopicReport = false)"
    >
      <iframe
        src="topic_report.html"
        style="width: 1600px; height: 800px"
      ></iframe>
      <a
        href="https://pyldavis.readthedocs.io/en/latest/readme.html"
        target="_window"
        >Tool: pyLDAvis</a
      >
    </a-modal>
    <a-modal
      v-model:visible="showSectionInfo"
      :footer="null"
      title="LDA Topic Modeling"
      @ok="() => (showSectionInfo = false)"
    >
      <p>
        • On the LDA topic bar chart, there are top 20 words of the 12 topics
        with word probabilities. You can also view the interactive report by
        clicking the “Interactive report” button. <br />
        • We applied the Genism package to run the LDA model. Before running the
        topic model, we used the Coherence model in the Genism package to find
        the best number of topics based on the coherence score of topics in each
        model. <br />• The word probability of each word is encoded as the
        height on the bar chart
      </p>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
iframe {
  border-width: 0;
  overflow: hidden;
}
.chart-outer {
  width: 100%;
  height: 90%;
  overflow: scroll;
}
</style>