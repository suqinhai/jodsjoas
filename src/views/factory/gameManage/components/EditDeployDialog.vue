
<template>
    <Dialog top="5vh" title="修改子游戏" @close="emits('close')" @confirm="handleConfirm">
        <div class="tips" v-if="editForm.alias == 'PGC' || editForm.alias == 'BPG'">Tips：请在PG类型中更改名称和图标</div>
        <el-form :model="editForm" label-width="150px">
            <el-form-item label="游戏名称:" v-if="editForm.alias !== 'PGC' && editForm.alias !== 'BPG'">
                <el-input v-model="editForm.name" placeholder="请输入游戏名字" clearable></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="游戏开关:">
                  <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标签选择:">
                  <el-select 
                  v-model="editForm.tagIds" 
                  multiple 
                  collapse-tags 
                  collapse-tags-tooltip 
                  max-collapse-tags="2"
                  placeholder="请选择标签">
                    <el-option v-for="item in props.tags" :key="item.id" :label="item.zhName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="维护开关:">
                <el-switch v-model="editForm.maintain" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="子游戏图标(欧美):" v-if="editForm.alias !== 'PGC' && editForm.alias !== 'BPG'">
                <UploadImage v-model="editForm.image_us" :width="LIMIT_US.VENDOR_IMG_WIDTH" bizType="game" :gameParams="getGameParams(1)"
                    :height="LIMIT_US.VENDOR_IMG_HEIGHT" :size="100"
                    :tip="`请上传${LIMIT_US.VENDOR_IMG_WIDTH}*${LIMIT_US.VENDOR_IMG_HEIGHT}或等比例，PNG/JPG格式小于${100}KB的图片`"></UploadImage>
            </el-form-item>
            <el-form-item label="子游戏图标(亚太):" v-if="editForm.alias !== 'PGC' && editForm.alias !== 'BPG'">
                <UploadImage v-model="editForm.image_as" :width="LIMIT_AS.HOT_IMG_WIDTH" bizType="game" :gameParams="getGameParams(2)"
                    :height="LIMIT_AS.HOT_IMG_HEIGHT" :size="100"
                    :tip="`请上传${LIMIT_AS.HOT_IMG_WIDTH}*${LIMIT_AS.HOT_IMG_HEIGHT}或等比例，PNG/JPG格式小于${100}KB的图片`"></UploadImage>
            </el-form-item>
            <el-form-item label="子游戏图标(定制版):" v-if="editForm.alias !== 'PGC' && editForm.alias !== 'BPG'">
                <UploadImage v-model="editForm.image_c" :width="170" :height="170" :size="100" bizType="game" :gameParams="getGameParams(3)"
                    :tip="`请上传170*170或等比例，PNG/JPG格式小于100KB的图片`"></UploadImage>
            </el-form-item>
            <!--            <el-form-item label="遮罩图:">
                <UploadImage v-model="editForm.maskImage" :width="GAME_MASK_WIDTH" :height="GAME_MASK_HEIGHT" :size="50"
                    :tip="`请上传${GAME_MASK_WIDTH}*${GAME_MASK_HEIGHT}或等比例，PNG/JPG格式小于${50}KB的图片`"></UploadImage>
            </el-form-item> -->
            <el-form-item label="排序:">
                <el-input-number :step="1" v-model="editForm.sort" :min="1"></el-input-number>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from "@/components/dialogHook/index.vue";
import { LIMIT_US, LIMIT_AS } from "@/common/source_map"
import UploadImage from "@/components/UploadImage/index.vue"
import { onMounted } from "vue";

const emits = defineEmits(["close", "update:editForm", "confirm"])
const props = defineProps({
    editForm: {
        type: Object,
        default: () => { },
    },
    tags: {
        type: Array,
        default: () => [],
    },
})

const getGameParams = (style) => {
    let params = {
        style,
        vendor: props.editForm.alias,
        gameType: props.editForm.type,
        gameId: props.editForm.gameId
    }
    return params
}

const handleConfirm = () => {
    emits('update:editForm', props.editForm)
    emits('confirm')
}

onMounted(() => {
    console.log(props.editForm)
})
</script>

<style lang="scss" scoped>
.maskImage {
    :deep .el-upload-list__item {
        width: 106px;
        height: 44px;
    }
    :deep .el-upload {
        width: 106px;
        height: 44px;
    }
}
.tips {
    color: red;
    text-align: center;
}
</style>
