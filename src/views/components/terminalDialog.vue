<template>
  <el-dialog
    width="868px"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :append-to-body="true"
    :custom-class="'dialogBox'"
    :show-close="false"
    class="dialogWrap"
  >
    <div class="content-box">
      <div class="bg-box">
        <img
          src="@/assets/dialog/dialog-bg.png"
          class="dialog-bg"
          width="100%"
        />
        <img src="@/assets/dialog/list.png" class="list-img" />
        <img src="@/assets/dialog/name-bg.png" class="name-img" />
        <img src="@/assets/dialog/position.png" class="position-img" />
      </div>
      <div class="header-box">
        <span>{{ currentData?.name || "测试" }}</span>
        <img src="@/assets/dialog/close.png" class="close" @click="cancle" />
      </div>
      <!-- 自助机的内容 -->
      <div class="terminal-wrap">
        <div v-for="item in terminalData" :key="item.id" class="terminal-box">
          <div class="terminal-title-box">
            <div class="terminal-title">
              <span class="circle"></span>
              {{ item.recOrgName }} - {{ item.terminalCount }}台
            </div>
            <img
              v-if="item.isCollapse"
              src="@/assets/dialog/fold-open.png"
              class="fold-open-img"
              @click="collapseClick(item.id)"
            />
            <img
              v-if="!item.isCollapse"
              src="@/assets/dialog/fold-close.png"
              class="fold-open-img"
              @click="collapseClick(item.id)"
            />
          </div>
          <div v-show="!item.isCollapse" class="terminal-contaier-box">
            <div class="terminal-contaier">
              <div
                v-for="(ele, index) in item.terminalVos"
                :key="index"
                class="terminal-item"
              >
                <div
                  class="item-box"
                  :class="{
                    success: ele.alarmStatus === 1,
                    error: ele.alarmStatus !== 1,
                  }"
                >
                  <img
                    src="@/assets/dialog/terminal.png"
                    class="terminal-img"
                  />
                  <div class="info-box">
                    <div class="name">{{ ele.name }}</div>
                    <div class="code">{{ ele.terminalCode }}</div>
                    <div
                      class="status"
                      :class="{
                        'status-success': ele.alarmStatus === 1,
                        'status-error': ele.alarmStatus !== 1,
                      }"
                    >
                      <span class="circle"></span
                      >{{ ele.alarmStatus === 1 ? "正常" : "故障" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const dialogVisible = ref(false);
const currentData = ref();
const showDialog = async (data: any) => {
  dialogVisible.value = true;
  currentData.value = data;

  getTerminalList();
};
const terminalData = ref<any[]>([]);
const getTerminalList = () => {
  terminalData.value.map((item: any, index: number) => {
    item["id"] = index;
    item["isCollapse"] = index !== 0;
  });
};
const cancle = () => {
  dialogVisible.value = false;
};

const collapseClick = (id: number) => {
  terminalData.value.map((item: any) => {
    if (item.id === id) {
      item.isCollapse = !item.isCollapse;
    }
  });
};
defineExpose({
  showDialog,
});
</script>

<style lang="less" scoped>
.dialogWrap {
  background: transparent;
  :deep(.dialogBox) {
    background: transparent;
  }
  :deep(.el-dialog__header) {
    padding: 0;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
}
.content-box {
  position: relative;
  width: 868px;
  height: 746px;
  .bg-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .dialog-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .list-img {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 244px;
      height: 44px;
    }
    .name-img {
      position: absolute;
      top: 6px;
      left: 210px;
      width: 406px;
      height: 44px;
    }
    .position-img {
      position: absolute;
      top: 18px;
      left: 253px;
      width: 18px;
      height: 18px;
    }
  }
  .header-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 280px;
    height: 44px;
    font-size: 16px;
    font-family:
      PingFang SC,
      PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #f7db2a;
    top: 6px;
    width: 568px;
    .close {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
  .terminal-wrap {
    position: relative;
    padding: 4px 12px;
    height: 660px;
    overflow: scroll;
    width: 830px;
    /* margin: auto; */
    margin: 0 14px 12px 14px;
    // display: flex;
    // // align-items: center;
    // justify-content: flex-start;
    // flex-wrap: wrap;
    // gap: 16px;
    .terminal-box {
      // height: 100px;
      // margin: 0 5px 5px 0;
      // box-sizing: border-box;
      // background-color: #999;
      // flex: 0 0 calc((100% - 16px) / 3);
      margin-top: 24px;
      // margin-bottom:4px;;
      .terminal-title-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        .terminal-title {
          display: flex;
          align-items: center;
          height: 26px;
          font-size: 18px;
          font-family:
            PingFang SC,
            PingFang SC-Semibold;
          font-weight: 600;
          text-align: left;
          color: #ffffff;
          line-height: 26px;
          .circle {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #00c68e;
            margin-right: 8px;
          }
        }
        .fold-open-img {
          width: 58px;
          height: 24px;
          cursor: pointer;
        }
      }
      .terminal-contaier-box {
        .terminal-contaier {
          display: flex;
          // align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          .item-box {
            display: flex;
            align-items: center;
            width: 256px;
            height: 100px;
            border-radius: 2px;
            flex: 0 0 256px;
            padding: 12px;
            &.success {
              background: linear-gradient(
                270deg,
                rgba(15, 58, 116, 0),
                #0f3a74
              );
              border-image: linear-gradient(
                  270deg,
                  rgba(9, 131, 167, 0),
                  #0983a7
                )
                0.5 0.5;
            }
            &.error {
              background: linear-gradient(
                270deg,
                rgba(185, 33, 33, 0),
                rgba(185, 33, 33, 0.58)
              );
              border-image: linear-gradient(
                  270deg,
                  rgba(226, 70, 70, 0),
                  #e24646
                )
                0.5 0.5;
            }
            .terminal-img {
              width: 76px;
              height: 76px;
            }
            .info-box {
              flex: 1;
              margin-left: 8px;
              .name {
                height: 14px;
                font-size: 14px;
                font-family:
                  PingFang SC,
                  PingFang SC-Regular;
                font-weight: 400;
                text-align: left;
                color: #a8e6ff;
                line-height: 14px;
              }
              .code {
                height: 12px;
                font-size: 12px;
                font-family:
                  PingFang SC,
                  PingFang SC-Regular;
                font-weight: 400;
                text-align: left;
                color: rgba(168, 230, 255, 0.75);
                line-height: 12px;
                margin-top: 12px;
              }
              .status {
                height: 14px;
                font-size: 14px;
                font-family:
                  PingFang SC,
                  PingFang SC-Regular;
                font-weight: 400;
                text-align: left;

                line-height: 14px;
                margin-top: 16px;
                .circle {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  margin-right: 6px;
                }
                &.status-success {
                  color: #00c68e;
                  .circle {
                    background: #00c68e;
                  }
                }
                &.status-error {
                  color: #ff4646;
                  .circle {
                    background: #ff4646;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
