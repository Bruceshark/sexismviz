<script setup>
import MapView from "./components/MapView.vue";
import DivergenceView from "./components/DivergenceView.vue";
import TopicView from "./components/TopicView.vue";
import DBView from "./components/DBView.vue";
import RegView from "./components/RegView.vue";
import { provide, ref } from "vue";
const selectedGeo = ref("China");
const updateSelectedGeo = (val) => {
  selectedGeo.value = val;
  if (val !== "China") {
    DivergenceViewKey.value = "2";
  }
};
const showTeamInfo = ref(false);
const DivergenceViewKey = ref("1");
provide("selectedGeo", selectedGeo);
provide("updateSelectedGeo", updateSelectedGeo);
</script>

<template>
  <div class="outer">
    <a-row>
      <div class="header">
        <div style="display: flex">
          <span class="title">SexismViz</span>
          <img class="logo" src="./assets/logo.svg" />
        </div>
        <div class="team-logo" @click="() => (showTeamInfo = true)">
          <img class="logo" src="./assets/team.svg" />
        </div>
      </div>
    </a-row>
    <a-row class="row" style="margin-bottom: 15px">
      <div class="box" style="width: 740px">
        <MapView />
      </div>
      <div class="box" style="width: 1140px; padding-top: 0">
        <a-tabs v-model:activeKey="DivergenceViewKey" style="height: 100%">
          <a-tab-pane
            key="1"
            tab="LDA Topics"
            style="height: 100%; overflow: scroll"
          >
            <TopicView style="height: 100%; overflow: scroll" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Word divergence" forceRender>
            <DivergenceView />
          </a-tab-pane>
          <template #leftExtra>
            <div class="box-title" style="margin-right: 30px">Text View</div>
          </template>
        </a-tabs>
      </div>
    </a-row>
    <a-row class="row">
      <div class="box" style="width: 840px">
        <DBView />
      </div>
      <div class="box" style="width: 1040px">
        <RegView />
      </div>
    </a-row>
    <a-modal
      v-model:visible="showTeamInfo"
      :footer="null"
      title="More Info..."
      @ok="() => (showTeamInfo = false)"
    >
      <h3>Project</h3>
      <p>This website is the final project of SOSC 4300 of Group 1.</p>
      <h3>Team & Contribution</h3>
      <table>
        <tr>
          <th>Name</th>
          <th>Work</th>
        </tr>
        <tr>
          <td>CHEN Jingruo</td>
          <td>Regression analysis</td>
        </tr>
        <tr>
          <td>LIU Junde</td>
          <td>NLP model</td>
        </tr>
        <tr>
          <td>WANG Yiwei</td>
          <td>Word divergence & LDA analysis</td>
        </tr>
        <tr>
          <td>
            <a
              href="http://yyubv.student.ust.hk"
              style="color: #003f63"
              target="_window"
              >YU Yue</a
            >
          </td>
          <td>Data visualization design & development</td>
        </tr>
      </table>
    </a-modal>
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  .title {
    font-weight: bold;
    font-size: 25px;
    line-height: 60px;
    margin: 0 10px;
    color: #c92268;
  }
  .team-logo {
    display: flex;
    border-radius: 5px;
    margin: 10px 0;
    padding: 0 10px;
    margin-right: 30px;
  }
  .team-logo:hover {
    cursor: pointer;
    background: rgb(214, 214, 214);
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
    .box-header {
      height: 25px;
      width: 100%;
      display: flex;
      .question-logo {
        border-radius: 5px;
        padding: 0 5px;
        img {
          width: 20px
        }
      }
      .question-logo:hover {
        cursor: pointer;
        background: rgb(214, 214, 214);
      }
    }
  }
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
.ant-tabs-content-holder {
  overflow: scroll;
}
</style>
