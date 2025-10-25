<template>
	<view class="page">
		<view class="content">
			<view class="main">
				<view class="points"><text>3000</text><text>积分/月</text></view>
				<view class="tips">最多每月生成300张图片</view>
				<view class="ul">
					<view class="li" v-for="(item,i) in 4" :key="i">
						<up-icon name="checkbox-mark" size="24" color="#fff"></up-icon>
						<text>生图速度优先</text>
					</view>
				</view>
			</view>
			<view class="list">
				<up-radio-group v-model="radiovalue" placement="column">
					<view class="li" v-for="item in dataList" :key="item.id" @click="handleRadio(item.id)">
						<view class="li_l">
							<view class="name">
								<up-radio shape="square" :name="item.id"></up-radio>
								<view class="text">{{item.name}}</view>
							</view>
							<view v-if="item.tips" class="tips">{{item.tips}}</view>
						</view>
						<view class="li_r">￥{{item.amount}}</view>
					</view>
				</up-radio-group>
			</view>
			<view class="btn">
				<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{height:'130rpx',fontSize:'32rpx'}">立即开通</up-button>
			</view>
			<view class="agreement">已阅读并同意<text class="link">《童创AI付费协议》</text>（含自动续费条款）</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
	const dataList = [
				{id:1,name:"连续包月",tips:"",amount:"69"},
				{id:2,name:"连续包年",tips:"折合￥55元每月",amount:"699"},
			]
	const radiovalue = ref(1)
	
	
	
	onNavigationBarButtonTap(() => {
		console.log('点击了右侧')
	})
	const handleRadio = (id) => {
		console.log(id)
		radiovalue.value = id
	}
</script>

<style lang="scss" scoped>
	.page{
		padding-bottom: 10rpx;
		box-sizing: border-box;
		::v-deep .u-navbar__content__right{
			.u-icon__icon{
				color: #ADAFB2 !important;
			}
		}
		.content{
			width: 100%;
			.main{
				width: 100%;
				padding: 20rpx 60rpx;
				box-sizing: border-box;
				background-color: #0166FE;
				color: #fff;
				border-radius: 0 0 40rpx 40rpx;
				.points{
					text{
						font-size: 32rpx;
						&:nth-of-type(1){
							font-size: 64rpx;
							font-weight: bold;
							margin-right: 10rpx;
						}
					}
				}
				.tips{
					font-size: 28rpx;
					margin-top: 10rpx;
				}
				.ul{
					width: 100%;
					margin: 80rpx 0;
					.li{
						width: 100%;
						height: 48rpx;
						font-size: 28rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-bottom: 20rpx;
					}
				}
			}
			.list{
				width: 100%;
				padding: 80rpx 32rpx 10rpx 32rpx;
				box-sizing: border-box;
				color: #fff;
				font-size: 32rpx;
				.li{
					width: 100%;
					border-radius: 40rpx;
					background-color: #5C5C5C;
					padding: 30rpx;
					box-sizing: border-box;
					margin-bottom: 30rpx;
					display: flex;
					justify-content: space-between;
					.li_l{
						flex: 1;
						.name{
							width: 100%;
							height: 100rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.text{
								margin-left: 10rpx;
							}
						}
						.tips{
							padding-left: 56rpx;
						}
					}
					.li_r{
						flex: 1;
						font-size: 64rpx;
						font-weight: bold;
						display: flex;
						justify-content: flex-end;
						align-items: center;
					}
				}
			}
			.btn{
				width: 100%;
				padding: 0 32rpx;
				box-sizing: border-box;
			}
			.agreement{
				font-size: 28rpx;
				text-align: center;
				margin: 40rpx 0;
				color: #333;
				.link{
					color: #249afa;
				}
			}
		}
	}
</style>