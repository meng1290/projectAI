<template>
	<view class="selectPayMethod">
		<up-popup :show="showModal" mode="bottom" :round="10" @close="close" closeable :closeOnClickOverlay="false" bgColor="#fff">
			<view class="content">
				<view class="tit">支付详情</view>
				<view class="con">
					<view class="amount"><span>￥</span>{{utils.formatAmount(amount)}}</view>
					<view class="tips">选择支付方式</view>
					<view class="payType">
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
					<up-button type="primary" @click="handleSubmit" color="#0166FE" shape="circle" :customStyle="{height:'80rpx',fontSize:'30rpx'}">确认支付</up-button>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { svipPay } from "@/api/index.js"
	import utils from "@/utils/index.js"
	const showModal = ref(false)
	const radioPay = ref(1)
	const amount = ref("0")
	const typeId = ref('')
	
	const show = (id,prize) => {
		typeId.value = id
		amount.value = prize
		showModal.value = true
	}
	const handleRadioPay = (id) => {
		radioPay.value = id
	}
	const handleSubmit = () => {
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
		svipPay(typeId.value,{pay_type:'alipayApp'}).then(res => {
			const orderInfo = res.config.data || ''
			if(orderInfo === 'freecard'){
				payResult(true)
			}else{
				uni.getProvider({
					service: 'payment',
					success: function (res) {
						close()
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
			}
			
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
	
	
	const close = () => {
		showModal.value = false
	}
	defineExpose({
	  show,
	});
</script>

<style lang="scss">
.selectPayMethod{
	.content{
		padding: 0 32rpx;
		box-sizing: border-box;
		.tit{
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			border-bottom: 2rpx solid #ddd;
		}
		.con{
			padding: 0rpx 0 32rpx;
			.amount{
				width: 100%;
				text-align: center;
				font-size: 60rpx;
				font-weight: bold;
				border-bottom: 2rpx solid #f5f5f5;
				padding: 50rpx 0;
				span{
					font-size: 40rpx;
				}
			}
			.tips{
				font-size: 28rpx;
				color: #999;
				text-align: center;
				padding: 20rpx;
			}
			.payType{
				width: 100%;
				padding: 32rpx 32rpx 60rpx;
				box-sizing: border-box;
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
		}
	}
}
</style>