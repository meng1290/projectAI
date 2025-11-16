<template>
	<view class="page">
		<view class="list">
			<view class="box" v-for="(item,index) in dataList" :key="index">
				<view class="list-time">生成时间：{{item.create_time}}</view>
				<view class="grid" @click="handleDetail([item.submitimgs])">
					<view class="grid-title">参考图</view>
					<view class="img-box">
						<up-image class="image" width="100%" height="100%" :src="item.submitimgs" mode="aspectFill">
						  <template #loading><up-loading-icon></up-loading-icon></template>
							<template #error>
								<view style="font-size: 28rpx;">加载失败</view>
							</template>
						</up-image>
					</view>
				</view>
				<view class="grid" @click="handleDetail(item.images)">
					<view class="grid-title">生成图</view>
					<view class="img-box">
						<up-image class="image" width="100%" height="100%" :src="item.images.length?item.images[0]:''" mode="aspectFill">
						  <template #loading>
								<view class="loadingImg">
									<up-loading-icon></up-loading-icon>
									<view style="font-size: 28rpx;margin-top: 20rpx;">生成中</view>
								</view>
							</template>
							<template #error>
								<view style="font-size: 28rpx;">加载失败</view>
							</template>
						</up-image>
					</view>
				</view>
				<view class="border" v-show="index + 1 !== dataList.length" ></view>
			</view>
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
			<up-loadmore line :status="loadStatus" />
			<up-back-top :scroll-top="scrollTop"></up-back-top>
		</view>	
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
	import { zuopinlist } from '@/api/index.js'
	import { useLoginRefresh } from '@/utils/useLoginRefresh.js';
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const state = reactive({
	  dataList: [],
	  queryParams:{
	    page: 1,
	    limit: 10,
	  },
	  loadStatus: 'nomore',//loadmore/ loading / nomore
	})
	const { dataList, queryParams, loadStatus } = toRefs(state)
	onLoad(() => {
		if(store.isLogin){
			getList()
		}
	})
	//下拉刷新
	onPullDownRefresh(() => {
		uni.stopPullDownRefresh()
		resetList()
	})
	//滚动触底
	onReachBottom(() => {
		getList()
	})
	/* 分页加载列表 */
	const getList = () => {
		loadStatus.value = 'loading'
		zuopinlist(queryParams.value).then(res => {
			let len = res.records.length
			if(len > 0){
				dataList.value = [...dataList.value,...res.records]
				queryParams.value.page++
				if(len < queryParams.value.limit){
					loadStatus.value = 'nomore'
				}else{
					loadStatus.value = 'loadmore'
				}
			}else{
				loadStatus.value = 'nomore'
			}
			uni.stopPullDownRefresh()
		}).catch(err => {
			loadStatus.value = 'nomore'
		})
	}
	/* 重置列表 */
	const resetList = () => {
		dataList.value = []
		queryParams.value.page = 1
		loadStatus.value = 'loading'
		getList()
	}
	//监听到登录状态变化触发
	useLoginRefresh(resetList)
	
	const handleDetail = (image) => {
		if(!image.length){
			return uni.showToast({
				title: '生成中，请稍后',
				icon: 'none'
			});
		}
		uni.setStorageSync('creationResults',image)
		uni.navigateTo({
			url:"/pages/creation/creationDetail"
		})
	}
	
	const scrollTop = ref(0);  
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	});
</script>

<style lang="scss" scoped>
	.page{
		padding: 0 32rpx;
		box-sizing: border-box;
		.list{
			padding-bottom: 32rpx;
			.box{
				padding: 20rpx 0;
				box-sizing: border-box;
				.list-time{
					font-size: 28rpx;
					color: #000;
					padding: 10rpx 0 40rpx;
					box-sizing: border-box;
				}
				.grid{
					display:inline-block;
					width:calc((100% - 80rpx) / 2);
					padding: 0 20rpx;
					text-align: center;
					.grid-title{
						font-size: 28rpx;
						padding: 10rpx 0;
						box-sizing: border-box;
					}
					.img-box{
						width: 100%;
						height: 400rpx;
						border-radius: 16rpx;
						overflow: hidden;
						background-color: #f5f5f5;
						box-shadow: 4rpx 4rpx 12rpx rgba(0, 0, 0, 0.08);
						.image{
							width:100%;
							height: 100%;
						}
					}
				}
				.border{
					border-top: 2rpx solid #000;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>