<template>
	<view class="page">
		<view class="content">
			<view class="icon">
				<text class="iconfont icon-zhifuchenggong1"></text>
			</view>
			<view class="text">支付成功</view>
			
			 <up-button @click="handleBackHome" :plain="true" shape="circle" :custom-style="{width:'60vw',marginTop:'140rpx'}">返回首页</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	const handleBackHome = () => {
		uni.switchTab({
		  url: "/pages/index/index"
		});
	}
</script>

<style scoped lang="scss">
	.page{
		padding: 32rpx 32rpx 200rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		.content{
			width: 100%;
			.icon{
				width: 100%;
				text-align: center;
				.iconfont{
					font-size: 140rpx;
					color: #39DF7F;
				}
			}
			.text{
				font-size: 60rpx;
				text-align: center;
				margin-top: 20rpx;
				font-weight: bold;
			}
		}
	}
</style>