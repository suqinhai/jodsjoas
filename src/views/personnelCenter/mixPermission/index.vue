<template>
    <!-- 分配权限 -->
    <div class="mixPermission">
        <div class="filter">
            <el-input v-model="searchNames" placeholder="一级菜单搜索，支持空格隔开的多关键字匹配" @input="changeSearchIds"></el-input>
        </div>
        <el-table :row-key="(row) => row.id" table-layout="auto" :show-header="false" :data="allPermission" @toggleRowExpansion="toggleRowExpansion"
            ref="tableRef">
            <el-table-column type="expand" label="一级权限">
                <template #default="{ row }">
                    <div class="permission" v-if="row.children && row.children.length > 0">
                        <el-checkbox v-model="row.checkAll" :indeterminate="row.isIndeterminate" @change="handleCheckAllChange(row)">Check all
                        </el-checkbox>
                        <el-table :data="row.children" ref="tableRefnd" :show-header="false" border table-layout="auto">
                            <el-table-column prop="name" label="二级权限">
                                <template #default="{ row }">
                                    <div>
                                        <el-checkbox :label="row.id" v-model="row.checked" :disabled="!canSelected(row)" @change="handleClickst(row)">
                                            {{ row.name }}</el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="三级菜单权限/操作权限">
                                <template #default="{ row }">
                                    <div v-if="row.children && row.children.length > 0">
                                        <template v-if="!row.children[0].isMenu">
                                            <div>
                                                <el-checkbox v-model="row.checkAll" :indeterminate="row.isIndeterminate"
                                                    @change="handleCheckAllChange(row)">Check all</el-checkbox>
                                            </div>
                                            <el-checkbox v-for="item in row.children" :key="item.id" :label="item.id" v-model="item.checked"
                                                @change="handleClickst(item)">{{ item.name }}</el-checkbox>
                                        </template>
                                        <template v-else>
                                            <el-checkbox v-model="row.checkAll" :indeterminate="row.isIndeterminate"
                                                @change="handleCheckAllChange(row)">Check all</el-checkbox>
                                            <el-table :data="row.children" :show-header="false" border table-layout="auto">
                                                <el-table-column prop="name" label="三级菜单权限">
                                                    <template #default="{ row }">
                                                        <div>
                                                            <el-checkbox :label="row.id" v-model="row.checked" :disabled="!canSelected(row)"
                                                                @change="handleClickst(row)">
                                                                {{ row.name }}</el-checkbox>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="name" label="四级操作权限">
                                                    <template #default="{ row }">
                                                        <div v-if="row.children && row.children.length > 0">
                                                            <div>
                                                                <el-checkbox v-model="row.checkAll" :indeterminate="row.isIndeterminate"
                                                                    @change="handleCheckAllChange(row)">Check all</el-checkbox>
                                                            </div>
                                                            <el-checkbox v-for="item in row.children" :key="item.id" :label="item.id"
                                                                @change="handleClickst(item)" v-model="item.checked">{{ item.name }}</el-checkbox>
                                                        </div>
                                                        <div v-else>暂无相关权限</div>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </template>

                                    </div>
                                    <span v-else>暂无相关权限</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-empty v-else :image-size="100" />
                </template>
            </el-table-column>
            <el-table-column type="selection" :reserve-selection="true" :selectable="canSelected">
                <template #default="{ row }">
                    <el-checkbox :indeterminate="row.selfIndeterminate" :disabled="!canSelected(row)" @change="handleCheckTopMenu(row)"
                        v-model="row.checked"> </el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="全选" />
        </el-table>
        <div class="submitAndCancel">
            <el-button v-throttle size="large" @click="handleCancel">取 消</el-button>
            <el-button v-throttle type="primary" style="margin-left: 20px" size="large" @click="handleSubmit">确 认</el-button>
        </div>
    </div>
</template>

<script setup name='mixPermission'>
import { useIndexHook } from "./index";
const {
    searchNames,
    expandRowKeys,
    allPermission,
    tableRef,
    tableRefnd,
    handleClickst,
    handleSubmit,
    changeSearchIds,
    toggleRowExpansion,
    handleCancel,
    handleCheckAllChange,
    canSelected,
    handleCheckTopMenu
} = useIndexHook();
</script>

<style lang="scss" scoped>
.mixPermission {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-table {
        flex: 1;
        .permission {
            width: 90%;
            margin: auto;
        }
    }
    .submitAndCancel {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        .el-button {
            width: 80px;
        }
    }
    .filter {
        margin-bottom: 10px;
    }
}
</style>
