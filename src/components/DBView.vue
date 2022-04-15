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
        text: "sexism",
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
    title: "following",
    dataIndex: "user_following",
    key: "user_following",
    sorter: (a, b) => a.user_following - b.user_following,
  },
  {
    title: "follower",
    dataIndex: "user_follower",
    key: "user_follower",
    sorter: (a, b) => a.user_follower - b.user_follower,
  },
];
</script>

<template>
  <div style="width: 100%; height: 100%; overflow: scroll">
    <div class="box-title">Database View</div>
    <br />
    <a-table :dataSource="dataSource" :columns="columns">
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.text }}
        </p>
      </template>
    </a-table>
  </div>
</template>

<style lang="less" scoped>
.box-title::after {
  width: 120px !important;
}
</style>
