<template>
	<view class="page">
		<view class="content">
			<view class="box">
				<up-image class="image" width="100%" :src="productDetail.image" mode="widthFix">
				  <template #loading><up-loading-icon></up-loading-icon></template>
					<template #error>
						<view style="font-size: 28rpx;">加载失败</view>
					</template>
				</up-image>
				<view class="info">
					<view class="store_name">{{productDetail.store_name}}</view>
				</view>
			</view>
			
			<view class="btns">
				<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx',marginTop:'80rpx'}">做同款</up-button>
			</view>
			
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import imgUrl from "@/static/image/picture2.png"
	
	let productDetail = {}
	onLoad(() => {
		productDetail = uni.getStorageSync('productDetail')
	})
			
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
			.info{
				padding: 32rpx;
				box-sizing: border-box;
			}
			.btns{
				padding: 32rpx;
				box-sizing: border-box;
			}
		}
		
	}
</style>