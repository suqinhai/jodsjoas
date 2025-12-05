
<template>
    <Dialog title="修改厂家信息" top="10vh" @cancel="emits('close')" @confirm="handleConfirm">
        <el-form :model="editForm" ref="editFormRef" label-width="150px">
            <el-form-item label="厂家开关:">
                <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="维护开关:">
                <el-switch v-model="editForm.maintain" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="厂家图标:">
                <UploadImage v-model="editForm.image" :size="30" params="image" :width="VENDOR_LOGO_WIDTH" :height="VENDOR_LOGO_HEIGHT"
                    :style="{width:VENDOR_LOGO_WIDTH,height:VENDOR_LOGO_HEIGHT}"
                    :tip="`请上传${VENDOR_LOGO_WIDTH}*${VENDOR_LOGO_HEIGHT}或等比例，PNG/JPG格式小于${30}KB的图片`">
                </UploadImage>
            </el-form-item>
            <el-form-item label="厂家宣传图标(欧美):">
                <UploadImage v-model="editForm.sloganImage_us" :size="100" params="sloganImage_us" bizType="game" :gameParams="getGameParams(1)"
                    :width="LIMIT_US.VENDOR_IMG_WIDTH" :height="LIMIT_US.VENDOR_IMG_HEIGHT"
                    :style="{width:LIMIT_US.VENDOR_IMG_WIDTH,height:LIMIT_US.VENDOR_IMG_HEIGHT}"
                    :tip="`请上传${LIMIT_US.VENDOR_IMG_WIDTH}*${LIMIT_US.VENDOR_IMG_HEIGHT}或等比例，PNG/JPG格式小于${100}KB的图片`">
                </UploadImage>
            </el-form-item>
            <el-form-item label="热门图片(欧美):">
                <UploadImage v-model="editForm.hotImage_us" :size="100" params="hotImage_us" bizType="game" :gameParams="getGameParams(1,1)"
                    :width="LIMIT_US.VENDOR_IMG_WIDTH" :height="LIMIT_US.VENDOR_IMG_HEIGHT"
                    :style="{width:LIMIT_US.VENDOR_IMG_WIDTH,height:LIMIT_US.VENDOR_IMG_HEIGHT}"
                    :tip="`请上传${LIMIT_US.VENDOR_IMG_WIDTH}*${LIMIT_US.VENDOR_IMG_HEIGHT}或等比例，PNG/JPG格式小于${100}KB的图片`">
                </UploadImage>
            </el-form-item>
            <el-form-item label="厂家宣传图标(亚太):">
                <UploadImage v-model="editForm.sloganImage_as" :size="300" params="sloganImage_as" bizType="game" :gameParams="getGameParams(2)"
                    :width="LIMIT_AS.VENDOR_IMG_SQUARE_WIDTH" :height="LIMIT_AS.VENDOR_IMG_SQUARE_HEIGHT"
                    :style="{width:LIMIT_AS.VENDOR_IMG_SQUARE_WIDTH,height:LIMIT_AS.VENDOR_IMG_SQUARE_HEIGHT}"
                    :tip="`请上传${LIMIT_AS.VENDOR_IMG_SQUARE_WIDTH}*${LIMIT_AS.VENDOR_IMG_SQUARE_HEIGHT}或等比例，PNG/JPG格式小于${300}KB的图片`">
                </UploadImage>
            </el-form-item>
            <el-form-item label="热门图片(亚太):">
                <UploadImage v-model="editForm.hotImage_as" :size="100" params="hotImage_as" bizType="game" :gameParams="getGameParams(2,1)"
                    :width="LIMIT_AS.HOT_IMG_WIDTH" :height="LIMIT_AS.HOT_IMG_HEIGHT"
                    :style="{width:LIMIT_AS.HOT_IMG_WIDTH,height:LIMIT_AS.HOT_IMG_HEIGHT}"
                    :tip="`请上传${LIMIT_AS.HOT_IMG_WIDTH}*${LIMIT_AS.HOT_IMG_HEIGHT}或等比例，PNG/JPG格式小于${100}KB的图片`">
                </UploadImage>
            </el-form-item>
            <!-- <el-form-item label="定制版LOGO(已选择):">
                <UploadImage v-model="editForm.activeLogo" :width="200" :height="100" :size="100" bizType="game" :gameParams="getGameParams(3)"
                    :tip="`请上传200*100或等比例，PNG/JPG格式小于100KB的图片`">
                </UploadImage>
            </el-form-item>
            <el-form-item label="定制版LOGO(未选择):" style="margin-bottom: 0">
                <UploadImage v-model="editForm.nonActiveLogo" :width="200" :height="100" :size="100" bizType="game" :gameParams="getGameParams(3)"
                    :tip="`请上传200*100或等比例，PNG/JPG格式小于100KB的图片`">
                </UploadImage>
            </el-form-item> -->
            <el-form-item label="厂家分成:">
                <el-input-number v-model="editForm.shareRate" :min="0" :step="0.01" step-strictly :precision="2">
                </el-input-number>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from "@/components/Dialog/index.vue"
import { LIMIT_US, LIMIT_AS, VENDOR_LOGO_WIDTH, VENDOR_LOGO_HEIGHT } from "@/common/source_map"

const emits = defineEmits(["close", "update:editForm", "confirm"])
const props = defineProps({
    editForm: {
        type: Object,
        default: () => { },
    },
})

const getGameParams = (style, isHot) => {
    let params = {
        style,
        vendor: props.editForm.alias,
        gameType: props.editForm.type,
    }
    if (isHot) {
        params.gameId = 'HOT'
    }
    return params
}

const handleConfirm = () => {
    emits("update:editForm", props.editForm)
    emits("confirm")
}

</script>

<style lang="scss" scoped></style>
