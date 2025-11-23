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
				<view class="info" v-if="productDetail.store_name">
					<view class="store_name">{{productDetail.store_name}}</view>
					<view class="price">
						<text>消耗算力：</text>
						<text>{{productDetail.price}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="btns">
			<up-button type="primary" @click="handleCreation(productDetail)" color="#0166FE" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx'}">做同款</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { aiproductDetail } from "@/api/index.js"
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const productDetail = ref({})
	const id = ref(null)
	onLoad((query) => {
		id.value = query.id
		getAiproductDetail()
	})
	const getAiproductDetail = () => {
		aiproductDetail(id.value).then(res => {
			console.log(res)
			productDetail.value = res || {}
		})
	}
	const handleCreation = (item) => {
		store.setProductDetailParams(item)
		uni.navigateTo({
			url:`/pages/creation/creation`
		})
	}
</script>

<style lang="scss" scoped>
	.page{
		min-height: 100vh;
		padding-bottom: 180rpx;
		box-sizing: border-box;
		position: relative;
		.content{
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
				.price{
					
				}
			}
			
		}
		.btns{
			background-color: #fff;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			padding: 32rpx;
			box-sizing: border-box;
		}
	}
</style>