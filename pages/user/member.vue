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
					<view
            class="li"
            :class="{ active: radioVipValue === item.mc_id }"
            v-for="item in dataList"
            :key="item.mc_id"
            @click="handleRadio(item.mc_id)"
          >
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
				<up-checkbox-group v-model="radioValue">
					<up-checkbox shape="square">
						<template #label>
							<view class="agreement">已阅读并同意<text class="link" @click="handlePayAgreement">《童创AI付费协议》</text></view>
						</template>
					</up-checkbox>
				</up-checkbox-group>
				
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
	import config from '@/config/index.js'
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],
		radioVipValue: 0,
		amount:'0',
		radioValue: false,
	})
	const { memberRightList, dataList, radioVipValue, amount, radioValue } = toRefs(state)
	
	
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
		if(!radioValue.value){
			return uni.showToast({
				title: '请阅读并同意支付协议',
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
		uni.setStorageSync('webViewObj',{url:config.paymentAgreement,title:'付费协议'})
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		});
	}
</script>

<style lang="scss" scoped>
	.page{
		padding-bottom: 220rpx;
		box-sizing: border-box;
		position: relative;
		background: #f4f6fa;

		::v-deep .u-navbar__content__right{
			.u-icon__icon{
				color: #ADAFB2 !important;
			}
		}

		.content{
			width: 100%;

			.main{
				width: 100%;
				padding: 40rpx 48rpx;
				box-sizing: border-box;
				background: #1f6bff;
				color: #fff;
				border-radius: 0 0 40rpx 40rpx;
				box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.2);

				.ul{
					width: 100%;
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					grid-row-gap: 24rpx;
					grid-column-gap: 12rpx;

					.li{
						display: flex;
						align-items: center;
						font-size: 28rpx;
						column-gap: 12rpx;
						opacity: 0.95;
					}
				}
			}

			.list{
				width: 100%;
				padding: 40rpx 32rpx 24rpx;
				box-sizing: border-box;

				.li{
					width: 100%;
					border-radius: 28rpx;
					background-color: #fff;
					padding: 32rpx;
					box-sizing: border-box;
					margin-bottom: 24rpx;
					color: #111827;
					box-shadow: 0 10rpx 32rpx rgba(15, 23, 42, 0.08);
					border: 2rpx solid transparent;
					transition: all 0.2s ease;

					&.active{
						border-color: #0f8bff;
						box-shadow: 0 16rpx 40rpx rgba(15, 118, 255, 0.2);
					}

					.li_box{
						display: flex;
						justify-content: space-between;
						align-items: center;
						column-gap: 24rpx;

						.li_l{
							flex: 1;
							display: flex;
							align-items: center;

							.text{
								margin-left: 12rpx;
								display: flex;
								align-items: baseline;
								column-gap: 8rpx;
								font-size: 34rpx;
								font-weight: 600;

								.day{
									font-size: 24rpx;
									color: #6b7280;
								}
							}
						}

						.li_r{
							min-width: 220rpx;

							.pre_price{
								width: 100%;
								font-size: 52rpx;
								font-weight: 700;
								text-align: right;
								color: #0f8bff;
							}
						}
					}

					.li_fotter{
						margin-top: 28rpx;
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;

						.tips{
							font-size: 26rpx;
							color: #4b5563;
							line-height: 1.5;
						}

						.price{
							text-align: right;
							font-size: 26rpx;
							color: #9ca3af;
							text-decoration: line-through;
						}
					}
				}

				::v-deep .u-radio-group{
					gap: 0 !important;
				}

				::v-deep .u-radio{
					.u-radio__icon-wrap{
						width: 44rpx;
						height: 44rpx;
						border-radius: 12rpx !important;
					}
				}
			}

			.btn{
				width: 100%;
				padding: 24rpx 32rpx 32rpx;
				box-sizing: border-box;
				background-color: #fff;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				box-shadow: 0 -8rpx 32rpx rgba(15, 23, 42, 0.15);

				.u-checkbox{
					width: 100%;
					justify-content: center;
					margin-top: 16rpx;
				}

				.agreement{
					font-size: 26rpx;
					text-align: center;
					color: #4b5563;

					.link{
						color: #0f8bff;
					}
				}
			}
			
		}
	}
</style>