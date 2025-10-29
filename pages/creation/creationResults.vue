<template>
	<view class="page">
		<view class="content">
			<up-image class="image" width="100%" :src="creationResults" mode="widthFix">
			  <template #loading><up-loading-icon></up-loading-icon></template>
				<template #error>
					<view style="font-size: 28rpx;">加载失败</view>
				</template>
			</up-image>
		</view>
		
		<view class="btns">
			<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx',marginTop:'80rpx'}">保存图片</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	
	const creationResults = uni.getStorageSync('creationResults') || ""
	
</script>

<style lang="scss" scoped>
	.page{
		.content{
			padding-bottom: 80rpx;
			width: 100%;
			.image {
				display: block;
			  width: 100%; 
			  height: auto;
			  margin: 0 auto;
				background-color: rgb(243, 244, 246);
			}
		}
		.btns{
			padding: 32rpx;
			box-sizing: border-box;
		}
	}
</style>