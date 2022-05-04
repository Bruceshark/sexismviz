<script setup>
import { reactive, ref, nextTick, onMounted, inject } from "vue";
import regResList from "../assets/reg_results.json";
import regVarDesc from "../assets/reg_var_desc.json";
const selectedGeo = inject("selectedGeo");
const ivList = ref(["Sexist", "no", "no"]);
const dv = ref("CommentNum");
const ivOptions = ref([
  { value: "Sentiment", label: "Sentiment" },
  { value: "Gender", label: "Gender" },
  { value: "Sexist", label: "Sexist" },
  { value: "no", label: "--" },
]);
const dvOptions = ref([
  { value: "LikeNum", label: "LikeNum" },
  { value: "CommentNum", label: "CommentNum" },
  { value: "RepostNum", label: "RepostNum" },
  { value: "no", label: "--" },
]);
const selectIV = () => {
  ivOptions.value.forEach((ele, idx) => {
    if (ivList.value.indexOf(ele.value) > -1 && ele.value !== "no") {
      ivOptions.value[idx]["disabled"] = true;
    } else {
      ivOptions.value[idx]["disabled"] = false;
    }
  });
};
const showResult = async () => {
  const validIVList = ivList.value.filter((iv) => iv !== "no");
  const validRegRes = regResList.filter((regRes) => {
    if (
      regRes.dv === dv.value &&
      validIVList.length === regRes.iv.length &&
      regRes.iv.map((iv) => iv.name).every((ele) => validIVList.includes(ele))
    ) {
      return true;
    }
  })[0];
  const ivResList = validIVList.map((iv) => {
    return validRegRes.iv.filter((ele) => ele.name === iv)[0];
  });
  console.log(ivResList);
  validRegRes.iv = ivResList;
  regRes.value = validRegRes;
  const formula =
    "$$" +
    "\\hat{" +
    dv.value +
    "}" +
    "=" +
    "\\hat{\\beta_0}+" +
    validIVList
      .map((iv, idx) => "\\hat{\\beta_" + (idx + 1) + "}" + iv)
      .join("+") +
    "$$";
  regFormula.value = formula;
  console.log(validRegRes);
  isLoadingReg.value = true;
  setTimeout(async () => {
    isLoadingReg.value = false;
    await nextTick();
    window.MathJax.Hub.Queue([
      "Typeset",
      MathJax.Hub,
      document.getElementById("regression"),
    ]);
  }, 500);
  //   isLoadingReg.value = false;
  //   setTimeout(() => {
  //   }, 1000);
};
onMounted(() => {
  selectIV();
  showResult();
});
const regRes = reactive({});
const regFormula = ref("");
const isLoadingReg = ref(false);
</script>

<template>
  <div style="height: 100%">
    <div class="box-title">Regression View</div>
    <a-row style="height: 450px" v-show="selectedGeo === 'China'">
      <a-col :span="6" style="height: 100%; overflow: scroll">
        <h3 class="var">Variable Descriptions:</h3>
        <h3>• IV List</h3>
        <a-collapse ghost>
          <a-collapse-panel
            v-for="(iv, idx) in ivOptions.slice(0, ivOptions.length - 1)"
            :key="idx"
            :header="iv.label"
          >
            <div>• {{ regVarDesc[iv.label].class }}</div>
            <div>• {{ regVarDesc[iv.label].coding }}</div>
            <div>• mean: {{ regVarDesc[iv.label].mean }}</div>
            <div>• std: {{ regVarDesc[iv.label].std }}</div>
            <div>• max: {{ regVarDesc[iv.label].max }}</div>
            <div>• min: {{ regVarDesc[iv.label].min }}</div>
          </a-collapse-panel>
        </a-collapse>
        <h3>• DV List</h3>
        <a-collapse ghost>
          <a-collapse-panel
            v-for="(dv, idx) in dvOptions.slice(0, dvOptions.length - 1)"
            :key="idx"
            :header="dv.label"
          >
            <div>• {{ regVarDesc[dv.label].class }}</div>
            <div>• mean: {{ regVarDesc[dv.label].mean }}</div>
            <div>• std: {{ regVarDesc[dv.label].std }}</div>
            <div>• max: {{ regVarDesc[dv.label].max }}</div>
            <div>• min: {{ regVarDesc[dv.label].min }}</div>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
      <a-col :span="1"
        ><a-divider type="vertical" style="height: 100%"
      /></a-col>

      <a-col :span="6">
        <div v-for="idx in [0, 1, 2]" :key="idx" class="var">
          <h3>
            <b>IV {{ idx + 1 }}</b>
          </h3>
          <a-select
            class="var-selector"
            :options="ivOptions"
            v-model:value="ivList[idx]"
            @change="selectIV"
          />
        </div>
        <br />
        <div class="var">
          <h3><b>DV</b></h3>
          <a-select
            class="var-selector"
            :options="dvOptions"
            v-model:value="dv"
          />
        </div>
        <br />
        <a-button
          shape="round"
          type="primary"
          @click="showResult"
          :disabled="
            ivList.filter((x) => x === 'no').length === 3 || dv === 'no'
          "
          >Run Regression</a-button
        >
      </a-col>

      <a-col :span="11" id="regression">
        <div style="text-align: center; margin-top: 50px" v-if="isLoadingReg">
          <a-spin :spinning="isLoadingReg" />
        </div>
        <div v-else>
          <h3>
            <b>Regression Formula</b>
          </h3>
          <div>{{ regFormula }}</div>
          <h3>
            <b>Results of Regression</b>
          </h3>
          <div v-if="Object.keys(regRes).length > 0" style="text-align: left">
            <div>$${R}^2: {{ regRes.value.r2 }}$$</div>
            <div>$$adjusted \ {R}^2: {{ regRes.value.r2_adjusted }}$$</div>
            <div>$$intercept: {{ regRes.value.intercept }}$$</div>
            <div v-for="(iv, idx) in regRes.value.iv" :key="idx">
              $$\hat{\beta_{{ idx + 1 }}}: {{ iv.coef }} \ ({{ iv.p }})
              <template v-if="iv.p <= 0.001"> ***$$</template>
              <template v-else-if="iv.p <= 0.01"> \color{red}{**}$$</template>
              <template v-else-if="iv.p <= 0.05"> *$$</template>
              <template v-else>$$</template>
            </div>
            <div style="text-align: right">
              <i>note: *: P ≤ 0.05; **: P ≤ 0.01; ***: P ≤ 0.001</i>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <div
      v-show="selectedGeo !== 'China'"
      style="text-align: center; padding: 30px"
    >
      Due to the data size, the regression is only available when the selected
      region is "China".<br />Please reselect the region by clicking the
      <svg style="width: 55px; height: 50px; margin-bottom: -20px">
        <path
          d="M892.8 854.4c-3.2 0 0-6.4-6.4-6.4v-3.2h-6.4s0-3.2-3.2-3.2-3.2-3.2-3.2-3.2l-3.2-3.2c0-3.2 3.2-6.4 3.2-12.8 0 0 0-3.2-3.2-3.2 0-6.4 3.2-12.8 6.4-19.2v-9.6l3.2-3.2v-6.4c0-3.2 6.4-3.2 6.4-6.4 3.2 0 3.2 0 6.4-3.2h6.4s3.2 3.2 6.4 3.2c3.2 12.8 0 28.8 0 44.8-3.2 6.4 0 16-6.4 22.4-3.2 3.2 0 6.4 0 12.8 0 3.2 0 3.2-3.2 6.4 0-6.4 0-6.4-3.2-6.4zM646.4 960s-3.2-3.2-6.4-3.2h-6.4l-3.2-3.2v-6.4-9.6s3.2-3.2 3.2-6.4c3.2-3.2 9.6-9.6 16-12.8 3.2 0 6.4 0 9.6-3.2 3.2 0 3.2 3.2 6.4 3.2h3.2v-3.2s-3.2 0-6.4-3.2l-3.2-3.2c0-3.2-3.2-6.4-3.2-9.6l-6.4-3.2v-6.4H643.2l-3.2-3.2c-3.2 0-6.4-3.2-12.8 0-3.2 0-3.2 3.2-6.4 3.2H611.2c-3.2 0-6.4-3.2-12.8-6.4h-9.6l-9.6-9.6s0-3.2-3.2-6.4v-12.8h-3.2-6.4c-6.4-3.2-12.8-6.4-16-9.6 0 3.2-3.2 3.2-6.4 6.4 0 3.2-6.4 3.2-6.4 6.4-3.2 3.2-6.4 0-9.6 0-3.2 0-3.2 3.2-6.4 3.2-6.4-3.2-16 0-22.4-3.2-3.2 0-3.2 0-6.4 3.2v3.2H483.2h-3.2c0 6.4 3.2 16 0 25.6-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 0-3.2-3.2-6.4-6.4 0-3.2 0-3.2-3.2-6.4-3.2 0-3.2 3.2-6.4 3.2h-6.4c0-3.2-3.2-3.2-3.2-3.2s0-3.2-3.2-3.2c0 0-3.2 0-3.2-3.2 0 0-3.2-3.2-6.4-3.2l-3.2-3.2s-3.2-3.2-3.2-6.4v-9.6c3.2 0 0-3.2 3.2-6.4 0-3.2-3.2-3.2-6.4-3.2 0-3.2-3.2-3.2-6.4-6.4v-12.8c-3.2-3.2-12.8 0-19.2 0h-3.2c0-6.4-3.2-12.8 0-22.4 0-3.2 3.2-3.2 6.4-6.4v-3.2c3.2-3.2 3.2-6.4 9.6-9.6 3.2-3.2 3.2-6.4 6.4-6.4V768c0-3.2 3.2-3.2 3.2-6.4v-9.6c3.2-6.4 0-6.4 0-9.6l-3.2-3.2h-3.2c-3.2-6.4-6.4-12.8-6.4-16h-3.2s-3.2 6.4-6.4 6.4c-3.2 3.2-9.6 0-12.8 0-6.4-3.2-9.6-6.4-16-9.6h-6.4l-3.2 3.2c-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 0-3.2 3.2-9.6 6.4-3.2 3.2-9.6 3.2-12.8 6.4-3.2 0-3.2 3.2-6.4 3.2h3.2c-3.2 0-3.2 3.2-6.4 3.2H291.2l-3.2-3.2v-9.6c-3.2-3.2-6.4-6.4-9.6-6.4 0-3.2-3.2-3.2-6.4-6.4v-3.2l-3.2-12.8-3.2-3.2c-3.2-3.2-6.4-3.2-12.8-3.2l-3.2-3.2h-6.4c-3.2 3.2-6.4 3.2-6.4 6.4s-3.2 3.2-3.2 6.4c0 0-3.2 0-6.4 3.2 0 0-3.2 0-6.4-3.2s0-12.8-3.2-16c-3.2 0-3.2 3.2-9.6 3.2-3.2 0-3.2-3.2-6.4-3.2h-3.2l-6.4-3.2c-3.2 0-9.6-3.2-16-6.4-3.2 0-3.2-3.2-6.4-3.2h-12.8c0-3.2-3.2-3.2-3.2-6.4-3.2 0-6.4-3.2-9.6-3.2 0 0 0-3.2-3.2-3.2v-3.2c-3.2 0-3.2 0-6.4-3.2l-3.2-3.2-3.2-3.2V640h-3.2c-3.2 0-6.4 0-9.6-3.2-6.4-12.8-12.8-22.4-25.6-28.8h-6.4c-3.2 0-3.2 3.2-6.4 6.4 0 0-3.2 0-6.4-3.2-3.2-6.4-6.4-9.6-9.6-12.8-3.2-3.2-3.2-6.4-3.2-9.6-3.2-3.2-6.4-6.4-9.6-12.8h-3.2c0-3.2-3.2-6.4-6.4-6.4-3.2-9.6 0-19.2 0-28.8v-6.4c3.2 0 3.2-3.2 6.4-3.2s3.2 3.2 6.4 3.2l3.2-3.2c0-9.6-3.2-16-3.2-25.6 0-3.2 3.2-3.2 3.2-9.6-3.2-9.6-6.4-16-6.4-25.6 0-3.2-3.2 0-6.4-3.2h3.2c-6.4-3.2-9.6-9.6-12.8-12.8-3.2 0-3.2-3.2-6.4-3.2-3.2-6.4 0-16-3.2-25.6-3.2 0-3.2-6.4-6.4-6.4s-6.4-3.2-9.6-6.4v-6.4c3.2-3.2 6.4-3.2 9.6-3.2v-6.4c0-3.2 3.2-3.2 3.2-9.6v-6.4s0-3.2-3.2-6.4-6.4 0-12.8-3.2l-3.2-3.2v-6.4l6.4-6.4v-12.8c3.2 0 3.2 0 3.2-3.2 3.2 0 6.4-3.2 9.6-6.4 3.2-3.2 9.6 0 12.8 0l3.2-3.2c3.2 0 9.6 3.2 12.8 3.2 3.2 0 3.2 3.2 6.4 3.2h9.6c3.2 0 3.2-3.2 9.6-3.2v-3.2s3.2 0 3.2-3.2c3.2 0 9.6 0 9.6-3.2 9.6-3.2 19.2 0 28.8 0 9.6-3.2 12.8-3.2 19.2-3.2h3.2c3.2-3.2 6.4-9.6 6.4-16l3.2-3.2c3.2 0 3.2-3.2 3.2-3.2V262.4c3.2 0 0-3.2 3.2-6.4 3.2 0 3.2-3.2 6.4-3.2 6.4 0 16-3.2 22.4 3.2H195.2v-3.2c0-3.2 0-6.4 3.2-12.8l3.2-3.2v-3.2c0-3.2 3.2-3.2 3.2-3.2 3.2-6.4 6.4-6.4 6.4-9.6 3.2 0 0-3.2 3.2-6.4 3.2 0 3.2-3.2 6.4-3.2 6.4 0 6.4 3.2 12.8 3.2 3.2 0 3.2 3.2 6.4 3.2h6.4c3.2 0 6.4 0 9.6-3.2 3.2 0 0-3.2 3.2-6.4 0-3.2 0-9.6 3.2-16 0 0 3.2 0 3.2-3.2h6.4c3.2 3.2 6.4 3.2 6.4 3.2v-3.2s0-3.2 3.2-3.2c9.6-3.2 19.2-6.4 25.6-3.2 3.2 6.4 0 12.8 3.2 19.2 3.2 0 3.2 3.2 6.4 6.4 3.2 0 3.2 3.2 3.2 6.4 0 0 3.2 3.2 6.4 3.2h3.2c3.2 0 3.2 3.2 6.4 3.2 0 0 0 3.2 3.2 3.2v16h3.2c3.2 6.4 0 12.8 3.2 19.2 0 3.2-3.2 9.6-6.4 12.8v12.8c6.4 3.2 9.6 3.2 16 3.2v3.2c6.4 0 12.8 3.2 19.2 6.4h3.2c3.2 0 6.4 6.4 12.8 6.4v6.4c3.2 0 3.2 6.4 6.4 6.4 0 0 3.2 0 3.2 3.2 3.2 3.2 0 6.4 3.2 12.8l3.2 3.2c0 3.2 3.2 3.2 3.2 6.4 0 0 0 3.2 3.2 3.2v6.4s3.2 0 3.2 3.2c0 0 3.2 3.2 6.4 3.2s3.2 3.2 6.4 3.2c6.4 0 16 0 22.4 3.2l3.2 3.2c12.8 0 22.4 3.2 38.4 3.2 3.2 0 3.2 3.2 6.4 3.2h6.4c3.2 3.2 3.2 3.2 6.4 3.2v3.2c3.2 3.2 9.6 0 12.8 3.2 0 3.2 6.4 3.2 6.4 9.6h19.2c3.2 0 3.2 3.2 6.4 3.2 6.4-3.2 9.6-3.2 16-9.6h6.4V384c3.2 0 6.4 0 9.6-3.2l3.2-3.2c9.6-3.2 16-3.2 25.6-6.4h32c3.2 0 3.2-3.2 3.2-6.4 3.2-3.2 6.4-6.4 9.6-6.4h3.2c3.2 0 3.2-3.2 3.2-6.4 3.2 0 3.2-3.2 3.2-3.2v-3.2l-3.2-3.2c-3.2-3.2-6.4-6.4-6.4-12.8v-12.8c3.2 0 3.2 0 3.2-3.2 3.2 0 3.2-3.2 6.4-3.2 9.6 0 19.2 3.2 28.8 0 3.2 0 3.2 0 6.4-3.2v-3.2h3.2l9.6-9.6c3.2 0 6.4 0 9.6-3.2l3.2-3.2c3.2 0 6.4 0 9.6-3.2 0-3.2 3.2-6.4 3.2-12.8l3.2-3.2h6.4c3.2-3.2 6.4-6.4 12.8-9.6h3.2l3.2-3.2h16l3.2-3.2c0-3.2-3.2-3.2-3.2-6.4-3.2 0-3.2-3.2-3.2-3.2-3.2 0-3.2-3.2-6.4-6.4h-3.2l-3.2-3.2h-9.6l-3.2 3.2c-3.2 0-3.2 3.2-6.4 3.2h-6.4l-3.2-3.2H739.2v12.8c-3.2 0-6.4 3.2-9.6 3.2l-3.2-3.2-3.2-3.2c0-6.4 0-12.8 3.2-19.2h3.2c0-6.4 3.2-9.6 3.2-12.8h3.2c0-6.4 3.2-9.6 6.4-12.8h19.2c3.2 0 3.2 0 3.2-3.2l9.6-9.6c3.2-3.2 0-9.6 3.2-12.8 3.2-3.2 3.2-9.6 6.4-12.8h3.2v-6.4l3.2-3.2 3.2-3.2v-9.6h-9.6l-3.2-3.2v-16c0-3.2 3.2-3.2 3.2-6.4h3.2c3.2 0 3.2 0 3.2-3.2 0 0 0-3.2 3.2-3.2h3.2c3.2 0 6.4-3.2 9.6 0 3.2 0 3.2-3.2 6.4-3.2s3.2-3.2 6.4-3.2h9.6c6.4-6.4 6.4-6.4 12.8-6.4 3.2 0 6.4 3.2 9.6 6.4 3.2 0 3.2 0 3.2-3.2h9.6c0 3.2 3.2 3.2 6.4 3.2 0 0 0 3.2 3.2 3.2 3.2 3.2 3.2 6.4 6.4 9.6 0 3.2 0 6.4 3.2 6.4h3.2s0 6.4 3.2 6.4c3.2 3.2 6.4 3.2 6.4 6.4s3.2 3.2 3.2 6.4h6.4s0 3.2 3.2 3.2c0 3.2 3.2 9.6 3.2 12.8l3.2 3.2 3.2 3.2c6.4 3.2 16 0 22.4 3.2 3.2 3.2 6.4 3.2 9.6 6.4h9.6c0 3.2 3.2 3.2 6.4 6.4 0 0 0 3.2 3.2 3.2-6.4 6.4-6.4 9.6-6.4 12.8v3.2h3.2c3.2 0 3.2 3.2 6.4 3.2 6.4 0 9.6-3.2 16-3.2 3.2-3.2 3.2-6.4 6.4-6.4 0-3.2 3.2-3.2 3.2-6.4 3.2-3.2 3.2-3.2 9.6-3.2l9.6-9.6h3.2l3.2-3.2 3.2 3.2v6.4l-3.2 3.2V192c3.2 3.2 3.2 9.6 0 12.8h-3.2c-3.2 16 0 35.2-3.2 51.2 0 0 0 3.2-3.2 6.4 0 0-3.2 0-3.2 3.2-6.4 0-12.8 0-19.2 3.2v3.2c-3.2 3.2-6.4 3.2-6.4 6.4v6.4c6.4 3.2 9.6 6.4 9.6 12.8 3.2 6.4 3.2 12.8 3.2 22.4-3.2 3.2-3.2 6.4-6.4 6.4 0 3.2 0 9.6-3.2 12.8h-3.2v-3.2s-3.2-3.2-6.4-3.2c-3.2 3.2-3.2 6.4-6.4 12.8-3.2 3.2-9.6 6.4-12.8 12.8 0 3.2 3.2 3.2 3.2 3.2 0 3.2-3.2 3.2-3.2 6.4l-3.2 3.2c-6.4 3.2-16 0-22.4 0-3.2 0-3.2 0-3.2 3.2s-3.2 3.2-3.2 6.4l-3.2 3.2-3.2 3.2c0 3.2-3.2 3.2-6.4 9.6v3.2c-3.2 3.2-3.2 6.4-3.2 6.4-3.2 0-6.4 3.2-6.4 6.4-6.4 6.4-12.8 9.6-22.4 6.4-3.2 0-3.2 0-6.4 3.2 0 3.2 0 3.2-3.2 6.4 0 0 0 3.2-3.2 3.2v6.4l-6.4 9.6s0 3.2-3.2 3.2h-3.2l-3.2 3.2c-3.2 0-6.4 3.2-9.6 3.2 0-3.2-3.2-3.2-3.2-6.4v-6.4l3.2-3.2c3.2-6.4 0-16 3.2-25.6l3.2-3.2c3.2 0 0-3.2 3.2-6.4v-9.6c-3.2 0-3.2 3.2-6.4 3.2h-6.4c-3.2 3.2-3.2 6.4-3.2 9.6 0 3.2-3.2 3.2-3.2 3.2s0 3.2-3.2 6.4c-3.2 0-6.4 3.2-9.6 6.4-3.2 3.2-6.4 9.6-9.6 12.8 0 3.2-3.2 3.2 0 3.2l-6.4 6.4c-3.2 0-3.2 0-6.4 3.2h-6.4-3.2c-3.2 0 0 3.2 0 6.4s3.2 6.4 6.4 6.4h12.8c3.2 0 9.6 3.2 12.8 6.4v6.4h-3.2l3.2 3.2h6.4l9.6-9.6h3.2c3.2-3.2 12.8-9.6 19.2-9.6l3.2 3.2c3.2 0 3.2 0 9.6 3.2h3.2c3.2 0 3.2 3.2 9.6 3.2h3.2c3.2 0 3.2 0 6.4 3.2v3.2c-3.2 6.4-9.6 9.6-19.2 12.8 0 0-6.4 0-9.6 3.2 0 3.2 0 6.4-3.2 6.4h-3.2c0 3.2-3.2 3.2-3.2 6.4-3.2 3.2-9.6 6.4-12.8 12.8-3.2 0-3.2 3.2-3.2 6.4-3.2 0-3.2 3.2-3.2 6.4s3.2 3.2 3.2 6.4c3.2 3.2 6.4 0 9.6 0 3.2 3.2 6.4 0 6.4 3.2h3.2c3.2 0 0 6.4 3.2 9.6l3.2 3.2c0 6.4 3.2 16 3.2 22.4 3.2 3.2 6.4 3.2 9.6 6.4 3.2 3.2 3.2 6.4 6.4 9.6l3.2 3.2c0 3.2 3.2 6.4 3.2 9.6 3.2 3.2 3.2 6.4 6.4 6.4l3.2 3.2-9.6 9.6c-3.2 0-3.2 3.2-6.4 3.2h-3.2l-3.2 3.2h12.8l9.6 9.6c0 6.4 3.2 12.8 3.2 19.2l-3.2 3.2c-3.2 3.2 0 9.6 0 16 0 0-3.2 3.2-6.4 3.2-3.2 3.2-3.2 6.4-6.4 9.6 0 6.4-3.2 9.6-6.4 16 0 3.2-3.2 3.2-3.2 9.6 0 3.2-3.2 3.2-3.2 6.4v6.4s-3.2 0-3.2 3.2c0 0 0 3.2-3.2 3.2v12.8c0 3.2-3.2 6.4-3.2 9.6v6.4l-3.2 3.2c-3.2 0-3.2 6.4-6.4 9.6l-3.2 3.2h-6.4l-3.2 3.2v6.4l-3.2 3.2c-3.2 3.2-3.2 6.4-9.6 9.6h-3.2c0 3.2 3.2 0 3.2 3.2h-6.4c0 3.2-6.4 3.2-6.4 6.4s-3.2 6.4-6.4 9.6h-3.2c-3.2 3.2-9.6 6.4-16 6.4l-3.2 3.2h-12.8c-3.2 0-6.4 6.4-12.8 6.4h-3.2c-3.2 0-3.2 3.2-6.4 3.2v-3.2h-3.2s0 3.2-3.2 3.2l-12.8 22.4h-6.4c-3.2 0-6.4 3.2-6.4 3.2 0 3.2-3.2 3.2-3.2 6.4-3.2 3.2-9.6 0-12.8 3.2v3.2h-6.4c-3.2 0-3.2 3.2-9.6 6.4h-9.6c-3.2 0-3.2 3.2-3.2 3.2h-6.4l-3.2 6.4h3.2s3.2 3.2 3.2 6.4-3.2 6.4-3.2 9.6c0 0-3.2 0-6.4 3.2 6.4 3.2 12.8 0 19.2 3.2l3.2 3.2v6.4h-3.2c-3.2 0-3.2 3.2-6.4 6.4 0 3.2 3.2 9.6 0 12.8H675.2v3.2c-3.2 3.2-6.4 3.2-9.6 3.2 0 3.2-3.2 0-3.2 3.2l-16 3.2z m0 0"
          id="China"
          transform="scale(0.05)"
          style="fill: rgb(199, 122, 154)"
        ></path>
      </svg>
      at the upper left corner to continue running regressions. <br />
    </div>
  </div>
</template>

<style lang="less" scoped>
.box-title::after {
  width: 120px !important;
}
.info-logo {
  width: 16px;
  margin: 5px;
}
.var {
  margin: 10px 0;
}
.var-selector {
  width: 180px;
}
</style>
