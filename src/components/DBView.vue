<script setup>
import { inject, computed, reactive, ref } from "vue";
import rawData from "../assets/weibo_sexism.json";
const selectedGeo = inject("selectedGeo");
// const dataSource = rawData.map((ele, idx) => {
//   ele["key"] = idx;
//   return ele;
// });
const dataSource = computed(() =>
  rawData
    .map((ele, idx) => {
      ele["key"] = idx;
      return ele;
    })
    .filter((ele) => {
      if (selectedGeo.value === "China") {
        return ele.region !== "Overseas";
      }
      return ele.region === selectedGeo.value;
    })
);
const columns = [
  {
    title: "sexism",
    dataIndex: "sexism",
    key: "sexism",
    filters: [
      {
        text: "Sexism",
        value: 1,
      },
      {
        text: "Non-sexism",
        value: 0,
      },
    ],
    onFilter: (value, record) => record.sexism == value,
  },
  {
    title: "gender",
    dataIndex: "gender",
    key: "gender",
    filters: [
      {
        text: "Female",
        value: "F",
      },
      {
        text: "Male",
        value: "M",
      },
    ],
    onFilter: (value, record) => record.gender == value,
  },
  {
    title: "region",
    dataIndex: "region",
    key: "region",
  },
  {
    title: "like",
    dataIndex: "like",
    key: "like",
    sorter: (a, b) => a.like - b.like,
  },
  {
    title: "repost",
    dataIndex: "repost",
    key: "repost",
    sorter: (a, b) => a.repost - b.repost,
  },
  {
    title: "comment",
    dataIndex: "comment",
    key: "comment",
    sorter: (a, b) => a.comment - b.comment,
  },
  {
    title: "follower",
    dataIndex: "user_follower",
    key: "user_follower",
    sorter: (a, b) => a.user_follower - b.user_follower,
  },
];
const showSectionInfo = ref(false);
</script>

<template>
  <div style="width: 100%; height: 100%; overflow: scroll">
    <div class="box-header" style="justify-content: space-between">
      <div class="box-title">Database View</div>
      <div class="question-logo" @click="() => (showSectionInfo = true)">
        <img src="../assets/question.svg" />
      </div>
    </div>
    <br />
    <a-table :dataSource="dataSource" :columns="columns">
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.text }}
        </p>
      </template>
    </a-table>
    <a-modal
      v-model:visible="showSectionInfo"
      :footer="null"
      title="Dataset"
      @ok="() => (showSectionInfo = false)"
    >
      <p>
        • The table shows the data we used in our study. You can click the
        “plus” icon on the left of every record to unfold the text and read the
        content of every post. You can also browse the data by filtering
        categorical variables and sorting the continuous variables. <br />• For
        the variable "Sexism", we trained a neural network on a labeled Sexist
        language dataset, mainly consisting of Weibo comments, and have it
        predict the sexism label for our dataset. Prior to training the neural
        network, certain transformations were carried out to the text including
        tokenization and one-hot-encoding, to which end a dictionary was
        compiled so as to give reference when describing the relative positions
        of characters in each sentence. <br />
        • After parameter tuning, the model did manage to score an 81.5%
        accuracy on the validation data we had held out in training. Feel free
        to click around and judge on yourself!
      </p>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.box-title::after {
  width: 120px !important;
}
</style>
