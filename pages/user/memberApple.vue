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
			
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-container">
				<view class="loading-spinner"></view>
				<text class="loading-text">加载商品信息...</text>
			</view>
			
			<!-- 商品列表 -->
			<view class="list" v-else-if="displayList.length > 0">
				<up-radio-group v-model="radioVipValue" placement="column">
					<view
            class="li"
            :class="{ active: radioVipValue === item.mc_id }"
            v-for="item in displayList"
            :key="item.mc_id"
            @click="handleRadio(item.mc_id)"
          >
						<view class="li_box">
							<view class="li_l">
								<up-radio shape="square" :name="item.mc_id"></up-radio>
								<view class="text">
									<view>{{item.displayTitle}}</view>
									<view class="day" v-if="item.vip_day > 0">（{{item.vip_day}}天）</view>
								</view>
							</view>
							<view class="li_r">
								<!-- 显示苹果价格或后台价格 -->
								<view class="pre_price">
									{{item.displayPrice}}
								</view>
							</view>
						</view>
						<view class="li_fotter">
							<view class="tips">
								<view>{{item.lvalues}}算力</view>
								<view>最多生成{{item.imgnums}}张图片</view>
							</view>
							<!-- 显示原价（如果有优惠） -->
							<view class="price" v-if="item.price">￥{{item.price}}</view>
						</view>
					</view>
				</up-radio-group>
			</view>
			
			<!-- 无数据提示 -->
			<view v-else class="empty-container">
				<view class="empty-content">
					<image 
						src="/static/image/data.png" 
						class="empty-image"
						mode="widthFix"
					></image>
					<text class="empty-text">暂无可用套餐</text>
				</view>
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
            :loading="isPaying"
            :disabled="isPaying || !radioVipValue"
					>
            {{ isPaying ? '处理中...' : '立即开通' }}
					</up-button>
				</view>
				<up-checkbox-group v-model="radioValue">
					<up-checkbox shape="square">
						<template #label>
							<view class="agreement">已阅读并同意<text class="link" @click="handlePayAgreement">《童创AI付费协议》</text></view>
						</template>
					</up-checkbox>
				</up-checkbox-group>
				<!-- 仅iOS设备显示恢复购买链接 -->
				<view v-if="isIOS" class="restore-link" @click="handleRestore">
					<text class="restore-text" :class="{ 'restoring': isRestoring }">
						{{ isRestoring ? '恢复中...' : '恢复购买' }}
					</text>
				</view>
			</view>
			
		</view>
		
		<selectPayMethod ref="selectPayMethodRef"></selectPayMethod>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { memberRight, memberShip } from "@/api/index.js"
	import selectPayMethod from "@/components/selectPayMethod/index.vue"
	import config from '@/config/index.js'
	import { Iap } from '@/utils/iap.js';
	
	const state = reactive({
		memberRightList:[],
	  dataList: [],  // 原始后台数据
	  displayList: [], // 显示用的合并数据
		radioVipValue: 0,
		amount:'0',
		radioValue: false,
	})
	const { memberRightList, dataList, displayList, radioVipValue, amount, radioValue } = toRefs(state)
	
	// 支付状态
	const isPaying = ref(false)
	const isRestoring = ref(false)
	const loading = ref(false)
	const iapInstance = ref(null)
	const selectPayMethodRef = ref(null)
	const isIOS = ref(false)
	
	// 商品映射表（必须配置！）
	const productMapping = {
		// 格式：后台套餐ID: 苹果商品ID
		// 这些ID必须与App Store Connect中配置的一致
		1: 'com.tongchuang.ai.coins_100_test',  // 月卡
	}
	
	onLoad(async () => {
		loading.value = true
		
		// 检测设备类型
		const systemInfo = uni.getSystemInfoSync()
		isIOS.value = systemInfo.platform === 'ios'
		
		try {
			// 并行获取数据
			await Promise.all([
				getDataList(),
				getMemberRight()
			])
			
			// 如果是iOS设备，初始化IAP并合并数据
			if (isIOS.value) {
				await initIAPAndMergeProducts()
			} else {
				// 非iOS设备直接使用后台数据
				displayList.value = [...dataList.value]
			}
			
			// 设置默认选中
			if (displayList.value.length > 0) {
				radioVipValue.value = displayList.value[0].mc_id
				updateAmount()
			}
			
		} catch (error) {
			console.error('初始化失败:', error)
			uni.showToast({
				title: '加载失败，请重试',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	})
	
	const getDataList = async () => {
		try {
			const res = await memberShip()
			if(res && res.length){
				dataList.value = res.map(item => ({
					...item,
					displayTitle: item.title,  // 默认显示后台标题
					displayPrice: `￥${item.pre_price}`, // 默认显示后台价格
					hasDiscount: parseFloat(item.pre_price) < parseFloat(item.price) // 是否有优惠
				}))
			}
		} catch (error) {
			console.error('获取套餐列表失败:', error)
			throw error
		}
	}
	
	const getMemberRight = async () => {
		try {
			const res = await memberRight()
			memberRightList.value = res.member_right || []
		} catch (error) {
			console.error('获取会员权益失败:', error)
			throw error
		}
	}
	
	// 初始化IAP并合并商品数据
	const initIAPAndMergeProducts = async () => {
		try {
			// 1. 初始化IAP
			const appleProductIds = Object.values(productMapping)
			
			// 检查商品映射是否为空
			if (!appleProductIds || appleProductIds.length === 0) {
				throw new Error('商品映射表为空，请配置productMapping')
			}
			
			iapInstance.value = new Iap({
				products: appleProductIds
			})
			
			await iapInstance.value.init()
			
			// 2. 获取苹果商品信息
			const appleProducts = await iapInstance.value.getProduct()
			
			// 如果获取的商品为空，使用降级方案
			if (!appleProducts || appleProducts.length === 0) {
				displayList.value = [...dataList.value]
				return
			}
			
			// 3. 创建苹果商品映射，方便查找
			const appleProductMap = {}
			appleProducts.forEach(product => {
				appleProductMap[product.productid] = product
			})
			
			// 4. 合并数据：只显示在苹果后台存在的商品
			const mergedList = []
			
			dataList.value.forEach(backendItem => {
				const appleProductId = productMapping[backendItem.mc_id]
				
				if (appleProductId && appleProductMap[appleProductId]) {
					// 该套餐在苹果后台存在，合并信息
					const appleProduct = appleProductMap[appleProductId]
					
					// 处理苹果价格，确保格式统一
					let formattedPrice = appleProduct.price || appleProduct.localizedPrice || ''
					// 确保 formattedPrice 是字符串类型
					if (formattedPrice != null) {
						formattedPrice = String(formattedPrice)
					} else {
						formattedPrice = ''
					}
					// 如果苹果价格不包含￥符号，则添加
					if (formattedPrice && !formattedPrice.includes('￥') && !formattedPrice.includes('¥')) {
						// 提取数字部分
						const priceMatch = formattedPrice.match(/[\d\.]+/)
						if (priceMatch) {
							formattedPrice = `￥${priceMatch[0]}`
						} else {
							formattedPrice = `￥${backendItem.pre_price}`
						}
					} else if (!formattedPrice) {
						formattedPrice = `￥${backendItem.pre_price}`
					}
					
					mergedList.push({
						...backendItem,
						// 关键：使用苹果的商品信息
						displayTitle: appleProduct.title || backendItem.title,
						appleDescription: appleProduct.description || '',
						applePrice: appleProduct.price || appleProduct.localizedPrice,
						// 显示价格：统一格式，确保包含￥符号
						displayPrice: formattedPrice,
						// 苹果商品ID
						appleProductId: appleProductId,
						// 是否有优惠（苹果价格 vs 后台显示的原价）
						hasDiscount: backendItem.price && 
							parseFloat(backendItem.pre_price) < parseFloat(backendItem.price)
					})
				} else {
					// 该套餐在苹果后台不存在，iOS设备不显示
					console.warn(`套餐ID ${backendItem.mc_id} 在苹果后台未配置，iOS设备不显示`)
				}
			})
			
			displayList.value = mergedList
			
			if (mergedList.length === 0) {
				uni.showToast({
					title: '暂无可用套餐，请检查苹果后台配置',
					icon: 'none',
					duration: 3000
				})
			}
			
		} catch (error) {
			console.error('IAP初始化或合并失败:', error)
			
			// IAP初始化失败，降级使用后台数据
			displayList.value = [...dataList.value]
		}
	}
	
	// 更新金额
	const updateAmount = () => {
		const selected = displayList.value.find(item => item?.mc_id === radioVipValue.value)
		if (selected) {
			// 提取价格数字部分
			let priceStr = selected.displayPrice || selected.applePrice || `￥${selected.pre_price}`
			
			// 确保 priceStr 是字符串类型
			if (priceStr != null) {
				priceStr = String(priceStr)
			} else {
				priceStr = `￥${selected.pre_price || 0}`
			}
			
			const priceMatch = priceStr.match(/[\d\.]+/)
			amount.value = priceMatch ? priceMatch[0] : (selected.pre_price || '0')
		}
	}
	
	// 发起支付
	const handlePaySubmit = async () => {
		if(!radioVipValue.value){
			uni.showToast({
				title: '请选择会员类型',
				icon: 'none'
			})
			return
		}
		if(!radioValue.value){
			uni.showToast({
				title: '请阅读并同意支付协议',
				icon: 'none'
			})
			return
		}
		
		// 获取选中的套餐
		const selectedPackage = displayList.value.find(item => item.mc_id === radioVipValue.value)
		if (!selectedPackage) {
			uni.showToast({
				title: '套餐信息错误',
				icon: 'none'
			})
			return
		}
		
		// iOS设备使用苹果支付
		if (isIOS.value) {
			await handleApplePay(selectedPackage)
		} else {
			// 其他设备使用原来的支付方式
			selectPayMethodRef.value.show(radioVipValue.value, amount.value)
		}
	}
	
	// 苹果支付处理
	const handleApplePay = async (selectedPackage) => {
		if (!iapInstance.value || !iapInstance.value.ready) {
			uni.showToast({
				title: '支付功能未就绪',
				icon: 'none'
			})
			return
		}
		
		// 检查是否有苹果商品ID
		if (!selectedPackage.appleProductId) {
			uni.showToast({
				title: '该套餐不支持苹果支付',
				icon: 'none'
			})
			return
		}
		
		isPaying.value = true
		
		try {
			// 发起苹果支付
			const paymentResult = await iapInstance.value.requestPayment({
				productid: selectedPackage.appleProductId,
				quantity: 1
			})
			
			console.log('苹果支付成功:', paymentResult)
			
			// 支付成功，调用服务器验证接口
			await verifyApplePayment(paymentResult, selectedPackage)
			
			// 显示成功提示
			uni.showToast({
				title: '支付成功！',
				icon: 'success',
				duration: 2000
			})
			
			// 支付成功后的操作
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
			
		} catch (error) {
			console.error('苹果支付失败:', error)
			// 错误提示已在 verifyApplePayment 或 requestPayment 中显示
			// 这里不再重复显示，避免用户看到多个错误提示
		} finally {
			isPaying.value = false
		}
	}
	
	// 验证苹果支付结果
	const verifyApplePayment = async (paymentResult, selectedPackage) => {
		try {
			// 获取收据数据
			const receipt = paymentResult.receipt || paymentResult.transactionReceipt
			
			// 检查收据是否存在
			if (!receipt) {
				throw new Error('支付收据数据缺失，请重试')
			}
			
			// 调用服务器验证接口
			const verifyRes = await uni.request({
				url: `${config.baseUrl}/payment/verify-apple`,
				method: 'POST',
				data: {
					receipt: receipt,
					packageId: selectedPackage.mc_id,
					appleProductId: selectedPackage.appleProductId,
					transactionId: paymentResult.transaction?.transactionIdentifier
				},
				header: {
					'Content-Type': 'application/json',
					'X-Token': uni.getStorageSync('token') || ''
				}
			})
			
			// 检查响应格式
			if (verifyRes.statusCode === 200 && verifyRes.data) {
				if (verifyRes.data.code === 200) {
					// 验证成功，完成交易
					if (paymentResult.transaction) {
						try {
							await iapInstance.value.finishTransaction(paymentResult.transaction)
						} catch (finishError) {
							console.error('完成交易失败:', finishError)
							// 即使完成交易失败，也不影响支付成功，因为服务器已验证
						}
					}
					
					// 通知其他页面更新
					uni.$emit('paymentSuccess', {
						packageId: selectedPackage.mc_id
					})
					
					return true
				} else {
					throw new Error(verifyRes.data.message || '服务器验证失败')
				}
			} else {
				throw new Error('服务器响应格式错误')
			}
			
		} catch (error) {
			console.error('验证支付失败:', error)
			uni.showToast({
				title: error.message || '验证支付失败，请联系客服',
				icon: 'none',
				duration: 3000
			})
			throw error
		}
	}
	
	// 恢复购买
	const handleRestore = async () => {
		if (!iapInstance.value || !iapInstance.value.ready) {
			uni.showToast({
				title: '支付功能未就绪',
				icon: 'none'
			})
			return
		}
		
		isRestoring.value = true
		
		try {
			const restoredTransactions = await iapInstance.value.restoreCompletedTransactions({
				username: ""
			})
			
			if (restoredTransactions && restoredTransactions.length > 0) {
				// 处理恢复的购买记录
				const result = await processRestoredPurchases(restoredTransactions)
				
				// 刷新用户信息
				uni.$emit('restoreSuccess')
				
				if (result.successCount > 0) {
					uni.showModal({
						title: '恢复购买',
						content: `成功恢复${result.successCount}个购买记录${result.failCount > 0 ? `，${result.failCount}个失败` : ''}，会员权益已生效`,
						showCancel: false
					})
				} else {
					uni.showModal({
						title: '恢复失败',
						content: `未能成功恢复购买记录，请稍后重试或联系客服`,
						showCancel: false
					})
				}
			} else {
				// 没有可恢复的购买记录
				uni.showModal({
					title: '恢复购买',
					content: '没有找到可恢复的购买记录',
					showCancel: false
				})
			}
			
		} catch (error) {
			console.error('恢复购买失败:', error)
			uni.showToast({
				title: error.message || '恢复购买失败，请稍后重试',
				icon: 'none',
				duration: 3000
			})
		} finally {
			isRestoring.value = false
		}
	}
	
	// 处理恢复的购买记录
	const processRestoredPurchases = async (transactions) => {
		let successCount = 0
		let failCount = 0
		
		for (const transaction of transactions) {
			try {
				// 检查交易数据
				if (!transaction.receipt && !transaction.transactionReceipt) {
					console.warn('交易收据缺失:', transaction)
					failCount++
					continue
				}
				
				const receipt = transaction.receipt || transaction.transactionReceipt
				
				// 调用服务器验证接口
				const verifyRes = await uni.request({
					url: `${config.baseUrl}/payment/restore-verify`,
					method: 'POST',
					data: {
						receipt: receipt,
						productId: transaction.productId || transaction.productIdentifier,
						transactionId: transaction.transactionIdentifier
					},
					header: {
						'Content-Type': 'application/json',
						'X-Token': uni.getStorageSync('token') || ''
					}
				})
				
				if (verifyRes.statusCode === 200 && verifyRes.data && verifyRes.data.code === 200) {
					// 验证成功，完成交易
					try {
						await iapInstance.value.finishTransaction(transaction)
						successCount++
					} catch (finishError) {
						console.error('完成恢复交易失败:', finishError)
						failCount++
					}
				} else {
					console.error('恢复交易验证失败:', verifyRes.data?.message)
					failCount++
				}
				
			} catch (error) {
				console.error('处理恢复交易失败:', error)
				failCount++
			}
		}
		
		// 返回处理结果
		return { successCount, failCount, total: transactions.length }
	}
	
	const handleRadio = (id) => {
		radioVipValue.value = id
		updateAmount()
	}

	const handlePayAgreement = () => {
		uni.setStorageSync('webViewObj',{url:config.paymentAgreement,title:'付费协议'})
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		})
	}
	
	// 页面显示时检查未完成订单（仅iOS）
	onShow(() => {
		if (isIOS.value && iapInstance.value?.ready) {
			checkPendingTransactions()
		}
	})
	
	const checkPendingTransactions = async () => {
		try {
			// 注意：restoreCompletedTransactions 主要用于恢复购买
			// 如果需要检查未完成的交易，应该监听支付回调
			// 这里仅做日志记录，实际应该通过支付回调处理
			const transactions = await iapInstance.value.restoreCompletedTransactions({
				username: ""
			})
			
			if (transactions && transactions.length > 0) {
				console.log('发现可恢复的购买记录，数量:', transactions.length)
				// 可以选择自动处理这些交易
				// await processRestoredPurchases(transactions)
			}
		} catch (error) {
			console.error('检查购买记录失败:', error)
			// 静默失败，不影响用户体验
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 240rpx;
		box-sizing: border-box;
		position: relative;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
		min-height: 100vh;
		/* #ifdef APP-PLUS */
		padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
		/* #endif */

		.content {
			width: 100%;
			margin-top: 0;

			.main {
				width: 100%;
				padding: 48rpx 32rpx;
				box-sizing: border-box;
				/* #ifdef APP-PLUS */
				padding-top: calc(48rpx + constant(safe-area-inset-top));
				padding-top: calc(48rpx + env(safe-area-inset-top));
				/* #endif */
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
						line-height: 1.5;
						
						text {
							flex: 1;
							word-break: break-word;
						}
					}
				}
			}
			
			.loading-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 100rpx 0;
				
				.loading-spinner {
					width: 80rpx;
					height: 80rpx;
					border: 6rpx solid #f3f3f3;
					border-top: 6rpx solid #0166FE;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin-bottom: 30rpx;
				}
				
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				
				.loading-text {
					font-size: 28rpx;
					color: #666;
					margin-top: 20rpx;
				}
			}
			
			.empty-container {
				padding: 100rpx 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				
				.empty-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.empty-image {
						width: 200rpx;
						height: 200rpx;
						margin-bottom: 30rpx;
					}
					
					.empty-text {
						font-size: 28rpx;
						color: #999;
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
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					cursor: pointer;
					
					&:active {
						transform: scale(0.98);
						opacity: 0.9;
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
								flex-direction: column;
								row-gap: 4rpx;
								font-size: 34rpx;
								font-weight: 600;
								line-height: 1.4;

								.day {
									font-size: 24rpx;
									color: #6b7280;
									font-weight: 400;
								}
								
								.apple-price-tip {
									font-size: 20rpx;
									color: #0166FE;
									background: rgba(1, 102, 254, 0.1);
									padding: 4rpx 12rpx;
									border-radius: 12rpx;
									display: inline-block;
									width: fit-content;
								}
							}
						}

						.li_r {
							min-width: 220rpx;
							flex-shrink: 0;
							display: flex;
							flex-direction: column;
							align-items: flex-end;

							.pre_price {
								width: 100%;
								font-size: 52rpx;
								font-weight: 700;
								text-align: right;
								color: #0166FE;
								line-height: 1.2;
							}
							
							.original-price {
								font-size: 24rpx;
								color: #9ca3af;
								text-decoration: line-through;
								margin-top: 6rpx;
								text-align: right;
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
							min-width: 0;
							
							view {
								margin-bottom: 4rpx;
								word-break: break-word;
								
								&:last-child {
									margin-bottom: 0;
								}
							}
							
							.apple-desc {
								font-size: 24rpx;
								color: #4b5563;
								margin-top: 8rpx;
								font-style: italic;
								line-height: 1.5;
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
						transition: all 0.2s ease;
					}
					
					&.is-checked .u-radio__icon-wrap {
						background-color: #0166FE;
						border-color: #0166FE;
					}
				}
			}

			.btn {
				width: 100%;
				padding: 24rpx 32rpx;
				box-sizing: border-box;
				/* #ifdef APP-PLUS */
				padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
				padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
				/* #endif */
				background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
				/* #ifdef APP-PLUS || H5 */
				backdrop-filter: blur(20rpx);
				-webkit-backdrop-filter: blur(20rpx);
				/* #endif */
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
					display: flex;
					flex-direction: column;
					gap: 16rpx;
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
					word-break: break-word;

					.link {
						color: #0166FE;
						font-weight: 500;
						text-decoration: none;
						
						&:active {
							opacity: 0.7;
						}
					}
				}
				
				.restore-link {
					width: 100%;
					text-align: center;
					margin-top: 16rpx;
					padding: 8rpx 0;
					
					.restore-text {
						font-size: 24rpx;
						color: #9ca3af;
						text-decoration: underline;
						cursor: pointer;
						
						&.restoring {
							color: #6b7280;
							opacity: 0.6;
						}
						
						&:active {
							opacity: 0.7;
						}
					}
				}
			}
		}
	}
</style>