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
	.page {
		padding: 32rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);

		.banner {
			width: 100%;
			padding: 40rpx 32rpx;
			box-sizing: border-box;
			border-radius: 32rpx;
			background: linear-gradient(135deg, #0166FE 0%, #2f7df6 50%, #145ff3 100%);
			color: #fff;
			box-shadow: 0 12rpx 40rpx rgba(1, 102, 254, 0.25);
			position: relative;
			overflow: hidden;
			transition: all 0.3s ease;
			
			&::before {
				content: '';
				position: absolute;
				top: -50%;
				right: -20%;
				width: 200%;
				height: 200%;
				background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
				pointer-events: none;
			}

			.tit {
				width: 100%;
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				color: rgba(255, 255, 255, 0.85);
				font-weight: 500;
				position: relative;
				z-index: 1;
			}

			.points {
				width: 100%;
				margin-top: 24rpx;
				margin-bottom: 12rpx;
				text-align: center;
				font-size: 64rpx;
				font-weight: 700;
				letter-spacing: 4rpx;
				position: relative;
				z-index: 1;
				text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			}

			.times {
				width: 100%;
				text-align: center;
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.9);
				position: relative;
				z-index: 1;
				padding-top: 8rpx;
			}
		}

		.list {
			width: 100%;
			margin-top: 40rpx;

			.tit {
				font-size: 32rpx;
				font-weight: 600;
				height: 64rpx;
				line-height: 64rpx;
				color: #111827;
				margin-bottom: 8rpx;
				padding: 0 4rpx;
			}

			.ul {
				width: 100%;

				.li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #fff;
					border-radius: 24rpx;
					padding: 28rpx 32rpx;
					box-sizing: border-box;
					margin-bottom: 20rpx;
					box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
					transition: all 0.3s ease;
					border: 1rpx solid rgba(0, 0, 0, 0.04);
					
					&:active {
						transform: scale(0.98);
						box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.12);
					}
					
					&:last-child {
						margin-bottom: 0;
					}

					.li_l {
						display: flex;
						flex-direction: column;
						row-gap: 10rpx;
						flex: 1;
						min-width: 0;

						.name {
							font-size: 30rpx;
							color: #0f172a;
							font-weight: 600;
							line-height: 1.4;
							word-break: break-all;
						}

						.time {
							font-size: 24rpx;
							color: #6b7280;
							font-weight: 400;
						}
					}

					.li_r {
						text-align: right;
						flex-shrink: 0;
						margin-left: 24rpx;

						.num {
							font-size: 36rpx;
							font-weight: 700;
							line-height: 1.2;
							white-space: nowrap;
						}

						.balance {
							font-size: 24rpx;
							color: #6b7280;
							margin-top: 10rpx;
							font-weight: 400;
							white-space: nowrap;
						}

						.add {
							color: #10b981;
							text-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.2);
						}

						.subtract {
							color: #ef4444;
							text-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.2);
						}
					}
				}
			}
		}
	}
</style>