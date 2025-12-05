<!--
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-19 18:02:26
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-03 10:42:45
 * @FilePath: \management-bg\src\views\manageConfig\menuFunction\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="menuFunction">
        <!-- <operateBtn></operateBtn> -->
        <el-table class="allMenulist" ref="multipleTableRef" :data="allMenulist" table-layout="auto" row-key="id"
            default-expand-all border>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="id" prop="id" align="center" />
            <el-table-column label="标题" prop="name" align="center" />
            <el-table-column label="图标" prop="url" align="center" />
            <el-table-column label="规则" prop="url" />
            <el-table-column label="权重" prop="id" align="center" />
            <!-- <el-table-column label="状态" prop="status" align="center">
        <template #default="scope">
          <div
            :class="scope.row.status ? 'status1Container' : 'statusContainer'"
          >
            <span class="circle"></span>
            <span>{{ scope.row.status ? "正常" : "不正常" }}</span>
          </div>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="菜单" prop="stateVal" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.stateVal"
            style="--el-switch-on-color: #18bc9cff"
            :active-value="3"
            :inactive-value="2"
            @change=""
          >
          </el-switch>
        </template>
      </el-table-column> -->
            <!-- <el-table-column align="center">
        <template #header>
          <el-button v-throttle color="#18bc9cff" :icon="ArrowUpBold"></el-button>
        </template>
        <template #default="scope">
          <el-button v-throttle color="#18bc9cff" :icon="Histogram"></el-button>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <div class="scopeBtn">
            <el-button v-throttle color="#444c69ff" :icon="Rank"></el-button>
            <el-button v-throttle color="#18bc9cff" :icon="EditPen"></el-button>
            <el-button v-throttle color="#f75444ff" :icon="Delete"></el-button>
          </div>
        </template>
      </el-table-column> -->
        </el-table>
    </div>
</template>

<script setup>
import {
    Rank,
    EditPen,
    Delete,
    ArrowUpBold,
    Histogram,
} from "@element-plus/icons-vue";
import { useIndexHook } from "./index";
import operateBtn from "./components/operateBtn/index.vue";
const { allMenulist } = useIndexHook();
</script>

<style lang="scss" scoped>
.menuFunction {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-table {
        flex: 1;
    }
    .el-button {
        color: #fff;
    }
    .status1Container {
        color: #18bc9cff;
        display: flex;
        justify-content: center;
        align-items: center;
        .circle {
            display: inline-block;
            width: 15px;
            height: 15px;
            background-color: #18bc9cff;
            border-radius: 50%;
            margin-right: 5px;
        }
    }
    .statusContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        .circle {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1px solid #ddd;
            border-radius: 50%;
            margin-right: 5px;
        }
    }
}
</style>
