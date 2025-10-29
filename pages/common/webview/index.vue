<template>
	<view class="page">
		<web-view :src="webViewObj.url"></web-view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	
	const webViewObj = ref({})
	onLoad(() => {
		webViewObj.value = uni.getStorageSync('webViewObj') || {}
		uni.setNavigationBarTitle({
			title: webViewObj.value.title
		});
	})
</script>

<style lang="scss" scoped>
	.page{
		
	}
</style>