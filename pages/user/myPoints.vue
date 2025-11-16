<template>
	<view class="page">
		<view class="banner">
			<view class="tit">
				<text>我的算力</text>
				<!-- <text>算力明细</text> -->
			</view>
			<view class="points">{{store.userInfo.now_money}}</view>
			<view class="times" v-if="store.userInfo.now_money>0">算力将于{{store.userInfo.overdue_time}}过期</view>
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
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onReachBottom } from '@dcloudio/uni-app'
	import { billList } from "@/api/index.js"
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
</script>

<style lang="scss" scoped>
	.page{
		padding: 32rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f5f5f5;
		.banner{
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			background-color: #0166FE;
			overflow: hidden;
			color: #fff;
			.tit{
				width: 100%;
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				color: #ddd;
			}
			.points{
				width: 100%;
				height: 140rpx;
				line-height: 140rpx;
				text-align: center;
				font-size: 60rpx;
				font-weight: bold;
				
			}
			.times{
				width: 100%;
				text-align: center;
				font-size: 28rpx;
				color: #ddd;
			}
		}
		.list{
			width: 100%;
			.tit{
				font-size: 32rpx;
				font-weight: bold;
				height: 90rpx;
				line-height: 90rpx;
			}
			.ul{
				width: 100%;
				.li{
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #fff;
					border-radius: 16rpx;
					padding: 20rpx;
					box-sizing: border-box;
					margin-bottom: 20rpx;
					.li_l{
						display: flex;
						flex-wrap: wrap;
						.name{
							width: 100%;
							font-size: 28rpx;
						}
						.time{
							width: 100%;
							font-size: 24rpx;
							margin-top: 4rpx;
						}
					}
					.li_r{
						text-align: right;
						font-size: 32rpx;
						.balance{
							font-size: 24rpx;
						}
						.add{
							color: green;
						}
						.subtract{
							color: red;
						}
					}
				}
			}
		}
	}
</style>