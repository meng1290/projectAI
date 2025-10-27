<template>
	<view class="update_details">
		<p class="title">v{{version}}更新内容</p>
		<text class="text">{{config.versionUpdateContent}}</text>
	</view>
</template>

<script setup>
	import { reactive, ref, onMounted, toRefs, unref, inject} from 'vue'
	import config from "@/config/index.js"
	const version = ref('0.0.0')
	
	onMounted(() => {
	  if (typeof plus !== 'undefined') {
	    version.value = plus.runtime.version;
	  }
	});
</script>

<style scoped lang="scss">
	.update_details{
		min-height: 100vh;
		padding: 16px;
		box-sizing: border-box;
		background-color: #f5f5f5;
	}
	.title{
		width: 100%;
		text-align: center;
		font-weight: bold;
	}
	.text{
		display: inline-block;
		width: 100%;
		margin: 10px 0;
		color: #666;
	}
</style>