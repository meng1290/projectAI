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
				<view class="name">
					<view class="store_name">{{item.store_name}}</view>
				</view>
				<view class="price">
					<text>消耗算力</text>
					<text>{{item.price}}</text>
				</view>
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
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
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
		uni.navigateTo({
			url:`/pages/index/product?id=${item.id}`
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
		store.setProductDetailParams(item)
		uni.navigateTo({
			url:`/pages/creation/creation`
		})
	}
</script>

<style lang="scss" scoped>
	.myProductCard{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: stretch;
		
		.li{
			width: 48.5%;
			margin-bottom: 28rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
			overflow: hidden;

			.img-box{
				width: 100%;
				height: 420rpx;
				background-color: #f3f4f6;
				overflow: hidden;
				.image{
					width: 100%;
					height: 100%;
					transition: transform 0.25s ease-out;
				}
			}

			&:active .img-box .image{
				transform: scale(0.97);
			}
			.info{
				padding: 16rpx 20rpx 20rpx;
				.name{
					width: 100%;
					height: 80rpx;
					.store_name{
						font-size: 28rpx;
						font-weight: 500;
						display: -webkit-box;
						display: box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
				}
				.price{
					display: flex;
					justify-content: space-between;
					font-size: 26rpx;
					color: #999;
					padding-right: 14rpx;
					margin-top: 6rpx;
					text{
						&:first-child{
							color: #999;
						}
						&:last-child{
							color: #ff9500;
							font-weight: 600;
						}
					}
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
							color: #ffb300;
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
						::v-deep .u-button{
							font-weight: 500;
						}
					}
				}
			}
		}
	}
</style>