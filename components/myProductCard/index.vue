<template>
	<view class="myProductCard">
		<view class="li" v-for="(item,i) in dataList" :key="i" @click="handleDetail(item)">
			<view class="img-box">
				<up-image class="image" width="100%" height="100%" :src="item.image" mode="aspectFill">
		      <template #loading><up-loading-icon></up-loading-icon></template>
					<template #error>
						<view style="font-size: 28rpx;">加载失败</view>
					</template>
		    </up-image>
			</view>
			<view class="btns">
				<view class="collect">
					<view>
						<up-icon :name="item.collectIcon?'star-fill':'star'" :color="item.collectIcon?'rgb(255, 149, 0)':'#000'"></up-icon>
					</view>
					<view class="collectNum">12344</view>
				</view>
				<view class="btn">
					<up-button type="primary" color="#0166FE" shape="circle">画同款</up-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	const props = defineProps({
	  dataList: {
	    type: Array,
	    default: []
	  }
	})
	
	const handleDetail = (item) =>{
		uni.navigateTo({
			url:"/pages/index/product"
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
			&:nth-child(odd) {
				margin-right: 20rpx;
			}
			.img-box{
				width: 100%;
				height: 580rpx;
				background-color: rgb(243, 244, 246);
				border-radius: 16rpx;
				overflow: hidden;
				.image{
					width: 100%;
					height: 100%;
				}
			}
			.btns{
				width: 100%;
				height: 72rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
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
					flex: 1;
					padding: 0;
				}
			}
		}
	}
</style>