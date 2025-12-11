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
				<view class="btn-container">
					<up-button 
						type="primary" 
						@click="handlePaySubmit" 
						color="#0166FE" 
						:customStyle="{
							width: '100%',
							height:'96rpx',
							fontSize:'32rpx',
							borderRadius: '48rpx',
							fontWeight: '500',
							boxShadow: '0 8rpx 24rpx rgba(1, 102, 254, 0.3)'
						}"
					>
						立即开通
					</up-button>
				</view>
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
	import { reactive, ref, toRefs, unref, inject, onMounted, onUnmounted} from 'vue'
	import { onLoad, onShow, onNavigationBarButtonTap } from '@dcloudio/uni-app'
	import { memberRight, memberShip } from "@/api/index.js"
	import selectPayMethod from "@/components/selectPayMethod/index.vue"
	import config from '@/config/index.js'
	import { Iap, IapTransactionState } from '@/utils/iap.js';
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],
		radioVipValue: 0,
		amount:'0',
		radioValue: false,
	})
	const { memberRightList, dataList, radioVipValue, amount, radioValue } = toRefs(state)
	
	const products = ref([])
	const loading = ref(false)
	const loadingText = ref('')
	const debugInfo = ref('')
	const currentProduct = ref(null)
	// 商品配置（从manifest或服务器获取）
	const productConfig = [
	  { id: 'com.tongchuang.ai.coins_100_test', type: 'consumable' },
	]
	
	onLoad( async() => {
		// getDataList()
		// getMemberRight()
		
		
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
	
	
	
	
	
	
	
	
	// 1. 先声明所有响应式变量和普通变量（避免未初始化访问）
	// const loading = ref(false);
	const disabled = ref(true);
	const productId = ref('');
	const productList = ref([]);
	let _iap = null; // 先声明，后在 onMounted 中初始化
	
	// 2. 生命周期钩子直接调用（无 vue. 前缀）
	onMounted(() => {
	  console.log('页面挂载：初始化 IAP 实例');
	  // 苹果开发者中心配置的产品 ID 填入 products 数组
	  _iap = new Iap({
	    products: ['com.tongchuang.ai.coins_100_test','com.tongchuang.ai.coins_100'] // 示例：['com.xxx.product1', 'com.xxx.product2']
	  });
	  // 初始化支付环境（await 必须在 async 函数中，这里用立即执行函数）
	  (async () => {
	    await init();
	  })(); 
	});
	
	// 页面显示时触发（直接调用 onShow，无 vue. 前缀）
	onShow(() => {
	  console.log('页面显示：检测未完成订单');
	  if (_iap?.ready) {
	    // 恢复订单需异步执行
	    (async () => {
	      await restore();
	    })();
	  }
	});
	
	onUnmounted(() => {
	  console.log('页面卸载：清理 IAP 资源');
	  _iap = null; // 清理实例，避免内存泄漏
	});
	
	// 3. 初始化支付环境和产品列表（async 函数）
	const init = async () => {
	  uni.showLoading({ title: '检测支付环境...' });
	  try {
	    if (!_iap) throw new Error('IAP 实例未初始化');
	    
	    // 初始化 IAP 支付通道
	    await _iap.init();
	    console.log('IAP 通道初始化成功');
	    
	    // 获取产品列表
	    const products = await _iap.getProduct();
	    if (!products.length) throw new Error('未获取到产品列表，请检查产品 ID 配置');
	    console.log(products,12)
	    productList.value = products;
	    // 默认选中第一个产品
	    productList.value[0].checked = true;
	    productId.value = productList.value[0].productid;
	    
	    // 启用支付按钮
	    disabled.value = false;
	    console.log('产品列表加载成功：', productList.value);
	  } catch (e) {
	    uni.showModal({
	      title: "初始化失败",
	      content: e.message || '支付环境检测失败',
	      showCancel: false
	    });
	    console.error('初始化错误：', e);
	  } finally {
	    uni.hideLoading();
	  }
	};
	
	// 恢复未完成订单
	const restore = async () => {
	  uni.showLoading({ title: '检测未完成订单...' });
	  try {
	    if (!_iap) throw new Error('IAP 实例未初始化');
	    
	    // 从苹果服务器检查未关闭的订单
	    const transactions = await _iap.restoreCompletedTransactions({ username: "" });
	    console.log('检测到未完成订单数：', transactions.length);
	    
	    if (!transactions.length) return;
	    
	    // 遍历处理每个订单
	    for (const transaction of transactions) {
	      switch (transaction.transactionState) {
	        case IapTransactionState.purchased:
	          console.log('待验证已支付订单：', transaction.transactionIdentifier);
	          // 此处调用服务器验证票据（需实现 validatePaymentResult）
	          // const validateRes = await validatePaymentResult(transaction);
	          // if (validateRes.success) await _iap.finishTransaction(transaction);
	          break;
	        case IapTransactionState.failed:
	          console.log('失败订单关闭：', transaction.transactionIdentifier);
	          await _iap.finishTransaction(transaction);
	          break;
	        default:
	          console.log('其他状态订单：', transaction.transactionState);
	          break;
	      }
	    }
	  } catch (e) {
	    uni.showModal({
	      content: e.message || '订单检测失败',
	      showCancel: false
	    });
	    console.error('恢复订单错误：', e);
	  } finally {
	    uni.hideLoading();
	  }
	};
	
	// 发起支付
	const payment = async () => {
	  if (loading.value) return;
	  loading.value = true;
	  uni.showLoading({ title: '支付处理中...' });
	  
	  try {
	    if (!_iap) throw new Error('IAP 实例未初始化');
	    if (!productId.value) throw new Error('请选择产品');
	    
	    // 1. 调用服务器创建订单（需实现 createOrder）
	    // const orderRes = await createOrder({ productId: productId.value });
	    // const { orderId, username } = orderRes;
	    
	    // 2. 发起苹果支付
	    const transaction = await _iap.requestPayment({
	      productid: productId.value,
	      manualFinishTransaction: true,
	      // username: `${username}_${orderId}` // 透传用户+订单关联信息
	    });
	    console.log('支付请求成功，待验证：', transaction);
	    
	    // 3. 服务器验证票据（关键步骤，必须实现）
	    // const validateRes = await validatePaymentResult({
	    //   orderId,
	    //   transactionReceipt: transaction.transactionReceipt,
	    //   transactionIdentifier: transaction.transactionIdentifier
	    // });
	    
	    // 4. 验证成功后关闭订单
	    // if (validateRes.success) {
	    //   await _iap.finishTransaction(transaction);
	    //   uni.showToast({ title: '支付成功' });
	    // } else {
	    //   throw new Error('支付验证失败');
	    // }
	  } catch (e) {
	    uni.showModal({
	      content: e.message || '支付失败',
	      showCancel: false
	    });
	    console.error('支付错误：', e);
	  } finally {
	    loading.value = false;
	    uni.hideLoading();
	  }
	};
	
	// 产品选择变更
	const applePriceChange = (e) => {
	  const selectedId = e.detail.value;
	  productId.value = selectedId;
	  // 更新选中状态（确保响应式更新）
	  productList.value.forEach(item => {
	    item.checked = item.productid === selectedId;
	  });
	};
	
	// 待实现：创建订单（对接服务器）
	const createOrder = ({ productId }) => {
	  return new Promise((resolve, reject) => {
	    // 示例：
	    // uni.request({
	    //   url: 'https://your-server.com/create-order',
	    //   method: 'POST',
	    //   data: { productId, userId: '当前登录用户ID' },
	    //   success: res => resolve(res.data),
	    //   fail: err => reject(err)
	    // });
	    reject(new Error('createOrder 未实现'));
	  });
	};
	
	// 待实现：验证支付票据（对接服务器）
	const validatePaymentResult = (data) => {
	  return new Promise((resolve, reject) => {
	    // 示例：
	    // uni.request({
	    //   url: 'https://your-server.com/validate-iap',
	    //   method: 'POST',
	    //   data,
	    //   success: res => resolve(res.data),
	    //   fail: err => reject(err)
	    // });
	    reject(new Error('validatePaymentResult 未实现'));
	  });
	};
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 240rpx;
		box-sizing: border-box;
		position: relative;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
		min-height: 100vh;

		::v-deep .u-navbar__content__right {
			.u-icon__icon {
				color: #ADAFB2 !important;
			}
		}

		.content {
			width: 100%;
			margin-top: 0;

			.main {
				width: 100%;
				padding: 48rpx 32rpx;
				padding-top: calc(48rpx + env(safe-area-inset-top));
				box-sizing: border-box;
				background: linear-gradient(135deg, #0166FE 0%, #2f7df6 50%, #145ff3 100%);
				color: #fff;
				border-radius: 0 0 48rpx 48rpx;
				box-shadow: 0 12rpx 40rpx rgba(1, 102, 254, 0.25);
				position: relative;
				overflow: hidden;
				
				&::before {
					content: '';
					position: absolute;
					top: -50%;
					right: -20%;
					width: 200%;
					height: 200%;
					background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
					pointer-events: none;
				}

				.ul {
					width: 100%;
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					grid-row-gap: 28rpx;
					grid-column-gap: 16rpx;
					position: relative;
					z-index: 1;

					.li {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						column-gap: 12rpx;
						opacity: 0.95;
						font-weight: 500;
					}
				}
			}

			.list {
				width: 100%;
				padding: 40rpx 32rpx 24rpx;
				box-sizing: border-box;

				.li {
					width: 100%;
					border-radius: 24rpx;
					background-color: #fff;
					padding: 32rpx;
					box-sizing: border-box;
					margin-bottom: 24rpx;
					color: #111827;
					box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
					border: 2rpx solid transparent;
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.98);
					}

					&.active {
						border-color: #0166FE;
						box-shadow: 0 8rpx 32rpx rgba(1, 102, 254, 0.2);
						background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
					}

					.li_box {
						display: flex;
						justify-content: space-between;
						align-items: center;
						column-gap: 24rpx;

						.li_l {
							flex: 1;
							display: flex;
							align-items: center;
							min-width: 0;

							.text {
								margin-left: 12rpx;
								display: flex;
								align-items: baseline;
								column-gap: 8rpx;
								font-size: 34rpx;
								font-weight: 600;
								line-height: 1.4;

								.day {
									font-size: 24rpx;
									color: #6b7280;
									font-weight: 400;
								}
							}
						}

						.li_r {
							min-width: 220rpx;
							flex-shrink: 0;

							.pre_price {
								width: 100%;
								font-size: 52rpx;
								font-weight: 700;
								text-align: right;
								color: #0166FE;
								line-height: 1.2;
							}
						}
					}

					.li_fotter {
						margin-top: 28rpx;
						padding-top: 24rpx;
						border-top: 1rpx solid #f3f4f6;
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;

						.tips {
							font-size: 26rpx;
							color: #4b5563;
							line-height: 1.6;
							flex: 1;
							
							view {
								margin-bottom: 4rpx;
								
								&:last-child {
									margin-bottom: 0;
								}
							}
						}

						.price {
							text-align: right;
							font-size: 26rpx;
							color: #9ca3af;
							text-decoration: line-through;
							flex-shrink: 0;
							margin-left: 16rpx;
						}
					}
				}

				::v-deep .u-radio-group {
					gap: 0 !important;
				}

				::v-deep .u-radio {
					.u-radio__icon-wrap {
						width: 44rpx;
						height: 44rpx;
						border-radius: 12rpx !important;
					}
				}
			}

			.btn {
				width: 100%;
				padding: 24rpx 32rpx;
				padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
				box-sizing: border-box;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
				backdrop-filter: blur(20rpx);
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
				z-index: 100;

				.btn-container {
					width: 100%;
					max-width: 750rpx;
					margin: 0 auto;
				}

				.u-checkbox {
					width: 100%;
					justify-content: center;
					margin-top: 20rpx;
				}

				.agreement {
					font-size: 26rpx;
					text-align: center;
					color: #4b5563;
					line-height: 1.5;

					.link {
						color: #0166FE;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>