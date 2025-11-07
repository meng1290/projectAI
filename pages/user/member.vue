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
			
			<view class="btn">
				<up-button type="primary" @click="handlePaySubmit" color="#0166FE" shape="circle" :customStyle="{height:'100rpx',fontSize:'32rpx'}">立即开通</up-button>
				<view class="agreement">已阅读并同意<text class="link" @click="handlePayAgreement">《童创AI付费协议》</text>（含自动续费条款）</view>
			</view>
			
		</view>
		
		<selectPayMethod ref="selectPayMethodRef"></selectPayMethod>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
	import { memberRight, memberShip } from "@/api/index.js"
	import selectPayMethod from "@/components/selectPayMethod/index.vue"
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],
		radioVipValue: 0,
		amount:'0',
	})
	const { memberRightList, dataList, radioVipValue, amount } = toRefs(state)
	
	
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
				amount.value = res[0].pre_price
			}
		})
	}
	const getMemberRight = () => {
		memberRight().then(res => {
			memberRightList.value = res.member_right || []
		})
	}
	//发起支付
	const selectPayMethodRef = ref(null)
	const handlePaySubmit = () =>{
		if(!radioVipValue.value){
			return uni.showToast({
				title: '请选择会员类型',
				icon: 'none'
			});
		}
		selectPayMethodRef.value.show(radioVipValue.value,amount.value)
	}
	
	
	
	const handleRadio = (id) => {
		radioVipValue.value = id
		amount.value = (dataList.value || []).find(item => item?.mc_id === radioVipValue.value)?.pre_price ?? '';
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