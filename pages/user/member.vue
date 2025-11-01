<template>
	<view class="page">
		<view class="content">
			<view class="main">
				<view class="points"><text>3000</text><text>积分/月</text></view>
				<view class="tips">最多每月生成300张图片</view>
				<view class="ul">
					<view class="li" v-for="(item,i) in memberRightList" :key="i">
						<up-icon name="checkbox-mark" size="24" color="#fff"></up-icon>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="list">
				<up-radio-group v-model="radiovalue" placement="column">
					<view class="li" v-for="item in dataList" :key="item.mc_id" @click="handleRadio(item.mc_id)">
						<view class="li_l">
							<view class="name">
								<up-radio shape="square" :name="item.mc_id"></up-radio>
								<view class="text">{{item.title}}</view>
							</view>
							<view v-if="item.vip_day > 0" class="tips">{{item.vip_day}}天</view>
						</view>
						<view class="li_r">
							<view class="pre_price">￥{{item.pre_price}}</view>
							<view class="price">￥{{item.price}}</view>
						</view>
					</view>
				</up-radio-group>
			</view>
			<view class="payType">
				<view class="tit">支付方式</view>
				<up-radio-group v-model="radioPay" placement="column">
					<view class="li" @click="handleRadioPay(1)">
						<view class="li_l">
							<view class="img">
								<up-image class="image" width="100%" :src="'/static/image/pay/wxPay.png'" mode="widthFix"></up-image>
							</view>
							<view class="text">微信支付</view>
						</view>
						<up-radio shape="square" :name="1"></up-radio>
					</view>
					<view class="li" @click="handleRadioPay(2)">
						<view class="li_l">
							<view class="img">
								<up-image class="image" width="100%" :src="'/static/image/pay/aliPay.png'" mode="widthFix"></up-image>
							</view>
							<view class="text">支付宝</view>
						</view>
						<up-radio shape="square" :name="2"></up-radio>
					</view>
				</up-radio-group>
			</view>
			<view class="btn">
				<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{height:'100rpx',fontSize:'32rpx'}">立即开通</up-button>
				<view class="agreement">已阅读并同意<text class="link" @click="handlePayAgreement">《童创AI付费协议》</text>（含自动续费条款）</view>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
	import { memberRight, memberShip } from "@/api/index.js"
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],
		radiovalue: 1,
		radioPay: 1,
	})
	const { memberRightList, dataList, radiovalue, radioPay } = toRefs(state)
	
	
	onLoad(() => {
		getDataList()
		getMemberRight()
	})
	
	onNavigationBarButtonTap(() => {
		console.log('点击了右侧')
	})
	
	const getDataList = () => {
		memberShip().then(res => {
			dataList.value = res || []
		})
	}
	const getMemberRight = () => {
		memberRight().then(res => {
			memberRightList.value = res.member_right || []
		})
	}
	
	const handleRadio = (id) => {
		console.log(id)
		radiovalue.value = id
	}
	const handleRadioPay = (id) => {
		console.log(id)
		radioPay.value = id
	}
	const handlePayAgreement = () => {
		uni.setStorageSync('webViewObj',{url:'/static/agreement/paymentAgreement.html',title:'付费协议'})
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		});
	}
</script>

<style lang="scss" scoped>
	.page{
		padding-bottom: 200rpx;
		box-sizing: border-box;
		position: relative;
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
					margin: 30rpx 0;
					.li{
						width: 100%;
						height: 48rpx;
						font-size: 28rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
				}
			}
			.list{
				width: 100%;
				padding: 40rpx 32rpx 10rpx 32rpx;
				box-sizing: border-box;
				color: #fff;
				font-size: 32rpx;
				.li{
					width: 100%;
					border-radius: 40rpx;
					background-color: #5C5C5C;
					padding: 30rpx;
					box-sizing: border-box;
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
						
						display: flex;
						flex-wrap: wrap;
						justify-content: flex-end;
						align-items: center;
						.pre_price{
							width: 100%;
							font-size: 64rpx;
							font-weight: bold;
							text-align: right;
						}
						.price{
							width: 100%;
							text-align: right;
							text-decoration: line-through;
						}
					}
				}
			}
			.payType{
				width: 100%;
				padding: 32rpx;
				box-sizing: border-box;
				.tit{
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 20rpx;
				}
				.li{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.li_l{
						flex: 1;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.img{
							width: 60rpx;
							height: 60rpx;
							margin-right: 32rpx;
							display: flex;
							align-items: center;
						}
						.text{
							font-size: 32rpx;
							font-weight: bold;
						}
					}
				}
			}
			.btn{
				width: 100%;
				padding: 20rpx 32rpx;
				box-sizing: border-box;
				background-color: #fff;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				.agreement{
					font-size: 28rpx;
					text-align: center;
					margin-top: 20rpx;
					color: #333;
					.link{
						color: #249afa;
					}
				}
			}
			
		}
	}
</style>