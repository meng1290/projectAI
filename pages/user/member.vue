<template>
	<view class="page">
		<view class="content">
			<view class="main">
				<view class="ul">
					<view class="li" v-for="(item,i) in memberRightList" :key="i">
						<up-icon name="checkbox-mark" size="24" color="#fff"></up-icon>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="list">
				<up-radio-group v-model="radioVipValue" placement="column">
					<view class="li" v-for="item in dataList" :key="item.mc_id" @click="handleRadio(item.mc_id)">
						<view class="li_box">
							<view class="li_l">
								<up-radio shape="square" :name="item.mc_id"></up-radio>
								<view class="text">
									<view>{{item.title}}</view>
									<view class="day" v-if="item.vip_day > 0">（{{item.vip_day}}天）</view>
								</view>
							</view>
							<view class="li_r">
								<view class="pre_price">￥{{item.pre_price}}</view>
							</view>
						</view>
						<view class="li_fotter">
							<view class="tips">
								<view>{{item.lvalues}}算力</view>
								<view>最多生成{{item.imgnums}}张图片</view>
							</view>
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
								<text class="iconfont icon-zhifu-weixinzhifu"></text>
							</view>
							<view class="text">微信支付</view>
						</view>
						<up-radio shape="square" :name="1"></up-radio>
					</view>
					<view class="li" @click="handleRadioPay(2)">
						<view class="li_l">
							<view class="img">
								<text class="iconfont icon-zhifubaozhifu"></text>
							</view>
							<view class="text">支付宝</view>
						</view>
						<up-radio shape="square" :name="2"></up-radio>
					</view>
				</up-radio-group>
			</view>
			<view class="btn">
				<up-button type="primary" @click="handlePaySubmit" color="#0166FE" shape="circle" :customStyle="{height:'100rpx',fontSize:'32rpx'}">立即开通</up-button>
				<view class="agreement">已阅读并同意<text class="link" @click="handlePayAgreement">《童创AI付费协议》</text>（含自动续费条款）</view>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
	import { memberRight, memberShip, svipPay } from "@/api/index.js"
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],
		radioVipValue: 0,
		radioPay: 1,
		vipObj:{
			lvalues:0,
			imgnums:0
		},
	})
	const { memberRightList, dataList, radioVipValue, radioPay, vipObj } = toRefs(state)
	
	
	onLoad(() => {
		getDataList()
		getMemberRight()
	})
	
	onNavigationBarButtonTap(() => {
		console.log('点击了右侧')
	})
	
	const getDataList = () => {
		memberShip().then(res => {
			if(res && res.length){
				dataList.value = res
				radioVipValue.value = res[0].mc_id
				vipObj.value = dataList.value.find(item => item.mc_id === radioVipValue.value)
			}
		})
	}
	const getMemberRight = () => {
		memberRight().then(res => {
			memberRightList.value = res.member_right || []
		})
	}
	//发起支付
	const handlePaySubmit = () =>{
		if(!radioVipValue.value){
			return uni.showToast({
				title: '请选择会员类型',
				icon: 'none'
			});
		}
		if(!radioPay.value){
			return uni.showToast({
				title: '请选择支付方式',
				icon: 'none'
			});
		}
		if(radioPay.value === 1){//微信
			weChatPay()
		}else if(radioPay.value === 2){//支付宝
			alipayPayment()
		}
	}
	
	const weChatPay = () => {
		
	}
	const alipayPayment = () => {
		svipPay(radioVipValue.value,{pay_type:'alipayApp'}).then(res => {
			const orderInfo = res.config.data || ''
			uni.getProvider({
				service: 'payment',
				success: function (res) {
					console.log(res.provider)
					if (~res.provider.indexOf('alipay')) {
						uni.requestPayment({
							"provider": "alipay",   //固定值为"alipay"
							"orderInfo": orderInfo, //此处为服务器返回的订单信息字符串
							success: function (res) {
								
								var rawdata = JSON.parse(res.rawdata);
								console.log(1,res.rawdata)
								console.log(2,JSON.stringify(res.rawdata))
								console.log('支付成功',rawdata)
								payResult(true)
							},
							fail: function (err) {
								const errStr = JSON.stringify(err)
								if(errStr.includes('取消支付')){
									uni.showToast({
										title: '取消支付',
										icon: 'none'
									});
								}else{
									uni.showToast({
										title: '支付失败',
										icon: 'none'
									});
								}
								// payResult(false)
							}
						});
					}
				},
				fail: function(err) {
					uni.showToast({
						title: '支付失败：当前环境不支持',
						icon: 'none'
					});
				}
			});
		})
	}
	const payResult = (res) => {
		if(res){
			uni.redirectTo({
				url:"/pages/common/payResult/success"
			})
		}else{
			uni.redirectTo({
				url:"/pages/common/payResult/fail"
			})
		}
	}
	
	const handleRadio = (id) => {
		console.log(id)
		radioVipValue.value = id
		vipObj.value = dataList.value.find(item => item.mc_id === radioVipValue.value)
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
					.li_box{
						display: flex;
						justify-content: space-between;
						.li_l{
							flex: 1;
							width: 100%;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.text{
								margin-left: 10rpx;
								display: flex;
								align-items: flex-end;
								.day{
									font-size: 24rpx;
								}
							}
						}
						.li_r{
							flex: 1;
							.pre_price{
								width: 100%;
								font-size: 64rpx;
								font-weight: bold;
								text-align: right;
							}
							
						}
					}
					.li_fotter{
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.tips{
							padding-left: 56rpx;
							font-size: 24rpx;
						}
						.price{
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
							.iconfont{
								font-size: 60rpx;
							}
							.icon-zhifubaozhifu{
								color: #009FE8;
							}
							.icon-zhifu-weixinzhifu{
								color: #48B338;
							}
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