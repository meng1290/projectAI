<template>
	<view class="myProductCard">
		<view class="li" v-for="(item,i) in dataList" :key="i">
			<view class="img-box"  @click="handleDetail(item)">
				<up-image class="image" width="100%" height="100%" :src="item.image" mode="aspectFill">
		      <template #loading><up-loading-icon></up-loading-icon></template>
					<template #error>
						<view style="font-size: 28rpx;">加载失败</view>
					</template>
		    </up-image>
			</view>
			<view class="info">
				<view class="store_name">{{item.store_name}}</view>
				<view class="btns">
					<view class="collect">
						<view>
							<up-icon @click="handleCollect(item)" :name="item.userCollect?'star-fill':'star'" :color="item.userCollect?'rgb(255, 149, 0)':'#000'"></up-icon>
						</view>
						<view v-if="isCollectNum" class="collectNum">{{item.userCollectNums}}</view>
					</view>
					<view class="btn">
						<up-button type="primary" @click="handleCreation(item)" color="#0166FE" shape="circle" :customStyle="{height:'50rpx',padding:'0 20rpx',fontSize:'24rpx'}">画同款</up-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { addCollect, delCollect } from "@/api/index.js"
	const props = defineProps({
	  dataList: {
	    type: Array,
	    default: []
	  },
		isCollectNum: {
			type: Boolean,
			default: true
		}
	})
	
	const handleDetail = (item) => {
		let productDetail = {
			id: item.id,
			image: item.image,
			store_name: item.store_name,
			userCollect: item.userCollect,
			userCollectNums: item.userCollectNums
		}
		uni.setStorageSync('productDetail',productDetail)
		uni.navigateTo({
			url:"/pages/index/product"
		})
	}
	
	const handleCollect = (item) => {
		if(item.userCollect){
			delCollect({product_id:item.id}).then(res => {
				item.userCollectNums--
				item.userCollect = !item.userCollect
				uni.showToast({
					icon:'success',
					title:'取消成功'
				})
			})
		}else{
			addCollect({id:item.id}).then(res => {
				item.userCollectNums++
				item.userCollect = !item.userCollect
				uni.showToast({
					icon:'success',
					title:'收藏成功'
				})
			})
		}
	}
	
	const handleCreation = (item) => {
		uni.navigateTo({
			url:`/pages/creation/creation?id=${item.id}`
		})
	}
</script>

<style lang="scss" scoped>
	.myProductCard{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.li{
			width: calc((100% - 20rpx) / 2);
			margin-bottom: 30rpx;
			border-radius: 16rpx;
			box-shadow: 4rpx 4rpx 12rpx rgba(0, 0, 0, 0.08);
			overflow: hidden;
			&:nth-child(odd) {
				margin-right: 20rpx;
			}
			.img-box{
				width: 100%;
				height: 400rpx;
				background-color: rgb(243, 244, 246);
				overflow: hidden;
				.image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				padding: 10rpx 20rpx 20rpx;
				.store_name{
					font-size: 28rpx;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					word-break: break-all;
				}
				.btns{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 10rpx;
					.collect{
						flex: 1;
						display: flex;
						align-items: center;
						width: 0;
						::v-deep .u-icon__icon{
							font-size: 48rpx !important;
						}
						.collectNum{
							font-size: 32rpx;
							margin-left: 10rpx;
							white-space:nowrap;
							text-overflow:ellipsis; overflow:hidden;
						}
					}
					.btn{
						// flex: 1;
						padding: 0;
					}
				}
			}
		}
	}
</style>