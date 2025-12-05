<template>
	<EditMerchantInfo v-if="isRouterAlive"></EditMerchantInfo>
</template>

<script setup name="editMerchantInfo">
	import { defineAsyncComponent, watch, ref, nextTick } from 'vue'
	import { useRoute } from 'vue-router'
	
	const EditMerchantInfo = defineAsyncComponent(() => import("./index.vue"))
	const route = useRoute()
	const merchantId = ref(route.query.id)
	const isRouterAlive = ref(true)
	
	watch( () => route.query.id, (newId, oldId) => {
		if(newId && newId != merchantId.value){
			merchantId.value = newId
			isRouterAlive.value = false
			nextTick(()=>{ isRouterAlive.value = true })
		}
	  }
	)
</script>

<style>
</style>