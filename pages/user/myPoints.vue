<template>
	<view class="page">
		<view class="banner">
			<view class="tit">
				<text>我的算力</text>
				<!-- <text>算力明细</text> -->
			</view>
			<view class="points">{{store.userInfo.now_money}}</view>
			<view class="times">
				<text v-if="store.userInfo.overdue_time && !['非会员'].includes(store.userInfo.overdue_time)">算力将于{{store.userInfo.overdue_time}}过期</text>
			</view>
		</view>
		<view class="list">
			<view class="tit">算力明细</view>
			<view class="ul">
				<view class="li" v-for="(item,i) in dataList" :key="i">
					<view class="li_l">
						<view class="name">{{item.title}}</view>
						<view class="time">{{item.create_time}}</view>
					</view>
					<view class="li_r">
						<view v-if="item.pm" class="num add">+{{item.number}}</view>
						<view v-else class="num subtract">-{{item.number}}</view>
						<view class="balance">余额：{{item.balance}}</view>
					</view>
				</view>
			</view>
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
			<up-loadmore line :status="loadStatus" />
			<up-back-top :scroll-top="scrollTop"></up-back-top>
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
	import { billList } from "@/api/index.js"
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	const state = reactive({
	  dataList: [],
	  queryParams:{
	    page: 1,
	    limit: 20,
	  },
	  loadStatus: 'nomore',//loadmore/ loading / nomore
	})
	const { dataList, queryParams, loadStatus } = toRefs(state)
	
	onLoad(() => {
		getDataList()
	})
	//滚动触底
	onReachBottom(() => {
		getDataList()
	})
	const getDataList = () => {
		billList(queryParams.value).then(res => {
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
		}).catch(err => {
			loadStatus.value = 'nomore'
		})
	}
	const scrollTop = ref(0);
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	});
</script>

<style lang="scss" scoped>
	.page{
		padding: 32rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f5f6fa;

		.banner{
			width: 100%;
			padding: 26rpx 28rpx;
			box-sizing: border-box;
			border-radius: 26rpx;
			background: linear-gradient(135deg, #2f7df6, #145ff3);
			color: #fff;
			box-shadow: 0 20rpx 40rpx rgba(20, 95, 243, 0.3);

			.tit{
				width: 100%;
				font-size: 30rpx;
				display: flex;
				justify-content: space-between;
				color: rgba(255,255,255,0.75);
			}

			.points{
				width: 100%;
				margin-top: 18rpx;
				margin-bottom: 6rpx;
				text-align: center;
				font-size: 56rpx;
				font-weight: 700;
				letter-spacing: 2rpx;
			}

			.times{
				width: 100%;
				text-align: center;
				font-size: 24rpx;
				color: rgba(255,255,255,0.8);
			}
		}

		.list{
			width: 100%;
			margin-top: 32rpx;

			.tit{
				font-size: 30rpx;
				font-weight: 600;
				height: 64rpx;
				line-height: 64rpx;
				color: #111827;
			}

			.ul{
				width: 100%;

				.li{
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #fff;
					border-radius: 24rpx;
					padding: 24rpx 28rpx;
					box-sizing: border-box;
					margin-bottom: 16rpx;
					box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);

					.li_l{
						display: flex;
						flex-direction: column;
						row-gap: 8rpx;

						.name{
							font-size: 30rpx;
							color: #0f172a;
							font-weight: 600;
						}

						.time{
							font-size: 24rpx;
							color: #6b7280;
						}
					}

					.li_r{
						text-align: right;

						.num{
							font-size: 34rpx;
							font-weight: 600;
						}

						.balance{
							font-size: 24rpx;
							color: #6b7280;
							margin-top: 8rpx;
						}

						.add{
							color: #10b981;
						}

						.subtract{
							color: #ef4444;
						}
					}
				}
			}
		}
	}
</style>