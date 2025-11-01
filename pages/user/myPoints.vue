<template>
	<view class="page">
		<view class="banner">
			<view class="tit">
				<text>我的算力</text>
				<!-- <text>算力明细</text> -->
			</view>
			<view class="points">1736648.00</view>
			<view class="times">算力将于2025-12-12 12:00:00过期</view>
		</view>
		<view class="list">
			<view class="tit">算力明细</view>
			<view class="ul">
				<view class="li" v-for="(item,i) in 8" :key="i">
					<view class="li_l">
						<view class="name">消费</view>
						<view class="time">2025-12-12 12:12:00</view>
					</view>
					<view class="li_r">
						<view class="num">-20</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	
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
				color: #ccc;
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
				color: #ccc;
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
					}
				}
			}
		}
	}
</style>