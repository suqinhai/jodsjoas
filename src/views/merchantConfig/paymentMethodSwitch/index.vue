<template>
    <!-- 商户支付方式开关 -->
    <div class="tabs payment-method-switch">
        <el-tabs v-model="type">
            <el-tab-pane label="商户支付开关配置" :name="0">
                <SwitchConfigTable :payChannelList="payChannelList"></SwitchConfigTable>
            </el-tab-pane>
            <el-tab-pane label="商户支付方式" :name="1">
                <PaymentMethodTable :payChannelList="payChannelList"></PaymentMethodTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup name="paymentMethodSwitch">
import { ref, onMounted } from 'vue'
import { getPayChannelList } from '@/api/common'
import SwitchConfigTable from './components/SwitchConfigTable.vue'
import PaymentMethodTable from './components/PaymentMethodTable.vue'

let payChannelList = ref([])
const type = ref(0)

onMounted(async () => {
    let { data } = await getPayChannelList()
    if (data){
		data[1]?.forEach((item)=>{
			item.setting.r = false
			item.setting.c = false
		})
		data[2]?.forEach((item)=>{
			item.setting.r = false
			item.setting.c = false
		})
		payChannelList.value = data || []
	}
})
</script>

<style lang="scss">
.payment-method-switch {
}
</style>
