<template>
	<view class="page">
		<view class="content">
			<image class="image" :src="imgUrl"  alt="" mode="widthFix" />
			
			<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{width: '440rpx',height:'96rpx',fontSize:'32rpx',marginTop:'80rpx'}">做同款</up-button>
		</view>
		
	</view>
</template>

<script setup>
	import imgUrl from "@/static/image/picture2.png"
			
</script>

<style lang="scss" scoped>
	.page{
		.content{
			padding-bottom: 80rpx;
			.image {
				display: block;
			  width: 100%; 
			  height: auto;
			  margin: 0 auto;
			}
		}
	}
</style>