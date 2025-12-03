<template>
	<view class="page">
		<view class="content">
			<view class="image-wrapper" v-for="(item,i) in creationResultsList" :key="i">
				<up-image class="image" :src="item" width="100%" mode="widthFix">
					<template #loading>
						<view class="loading-wrapper">
							<up-loading-icon></up-loading-icon>
						</view>
					</template>
					<template #error>
						<view class="error-wrapper">
							<view class="error-icon">⚠️</view>
							<view class="error-text">加载失败</view>
						</view>
					</template>
				</up-image>
			</view>
			
			<view class="empty" v-if="!creationResultsList.length">
				<view class="empty-content">
					<up-loading-icon color="#0166FE" size="48"></up-loading-icon>
					<!-- <view class="text">正在生成中，请稍后</view> -->
					<view class="sub-text">AI正在为您创作，请耐心等待</view>
				</view>
			</view>
		</view>
		
		<view class="btns" v-if="creationResultsList.length">
			<view class="btn-container">
				<up-button 
					type="primary" 
					@click="handleSaveImage" 
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
					保存图片
				</up-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { permissionCheck, phonePermissionSetting } from "@/utils/phonePermissionCheck.js"
	import { getTaskResult } from "@/api/index.js"
	const creationResultsList = ref([])
	const id = ref(null)
	const btnLoading = ref(false)
	
	onLoad((query) =>{
		id.value = query.id;
		getImageResult()
    // creationResultsList.value = uni.getStorageSync('creationResults') || []
	})
	const getImageResult = async() => {
		uni.showLoading({ title: '生成中' });
		btnLoading.value = true
		const result = await pollTaskResult(id.value,16)
		uni.hideLoading()
		btnLoading.value = false
		if (result.code) {
			console.log('获取到任务结果:', result)
			creationResultsList.value = result.waterimgs
		}else{
			uni.showModal({
				title:'提示',
				content: result.msg,
				showCancel:false,
				success(res) {
					if(res.confirm){
						uni.navigateBack({ delta: 1 });
					}
				}
			})
		}
	}
	//延迟函数
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
	//轮询获取任务结果
	const pollTaskResult = async (id, maxRetries = 5, interval = 5000) => {
	  btnLoading.value = true
	  for (let i = 0; i < maxRetries; i++) {
	    try {
	      const result = await getTaskResult({id})
	      // 检查是否有图片数据
	      if (result.images && result.images.length > 0) {
					const obj = {
						code: true,
						msg: null,
						images: result.images
					}
	        return obj // 返回结果并结束轮询
	      }
	      console.log(`第 ${i + 1} 次请求，images为空，${interval/1000}秒后重试`)
	      // 如果不是最后一次重试，则等待5秒
	      if (i < maxRetries - 1) {
	        await delay(interval)
	      }
	    } catch (error) {
	      console.error(`第 ${i + 1} 次请求失败:`, error)
				console.log('接口返回错误，终止轮询')
				const obj = {
					code: false,
					msg: error,
				}
	      return obj
	    }
	  }
	  
	  // 达到最大重试次数仍未获取到数据
	  return {code: false,msg: "任务创作超时，稍后可在创作记录中查看",}
	}
	const handleSaveImage = () => {
		if(!creationResultsList.value.length){
			return uni.showToast({
				title: '保存失败',
				icon: 'none',
			});
		}
		uni.showLoading()
		let imgSrc = creationResultsList.value[0]
		uni.downloadFile({
			url: imgSrc,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: () => {
							uni.showLoading()
							uni.showToast({
								title: '保存成功',
								icon: "none",
								duration: 5000
							})
						},
						fail: (err) => {
							permissionCheck().then(res=>{
								uni.showLoading()
								uni.showToast({
									title: '保存失败',
									icon: "none",
									duration: 5000
								})
							}).catch(err =>{
								uni.showModal({
									title: '手机权限',
									content: err,
									success: function (res) {
										if (res.confirm) {
											uni.hideLoading()
											phonePermissionSetting()
										} else if (res.cancel) {
											uni.showLoading()
											uni.showToast({
												title: '保存失败',
												icon: 'none'
											});
										}
									}
								});
							})
							
						}
					})
				}else{
					uni.showLoading()
				}
			},
			fail: (err) => {
				uni.showLoading()
				uni.showToast({
					title: JSON.stringify(err),
					icon: "none",
					duration: 5000
				})
			}
		});
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		min-height: 100vh;
		padding-bottom: 200rpx;
		box-sizing: border-box;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
		
		.content {
			padding: 32rpx 24rpx;
			width: 100%;
			box-sizing: border-box;
			
			.image-wrapper {
				margin-bottom: 32rpx;
				border-radius: 24rpx;
				overflow: hidden;
				background: #ffffff;
				box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
				transition: all 0.3s ease;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				&:active {
					transform: scale(0.98);
					box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.12);
				}
				
				.image {
					display: block;
					width: 100%;
					height: auto;
					margin: 0 auto;
					background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
					border-radius: 24rpx;
					
					:deep(img) {
						border-radius: 24rpx;
					}
				}
				
				.loading-wrapper {
					display: flex;
					align-items: center;
					justify-content: center;
					min-height: 400rpx;
					background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
				}
				
				.error-wrapper {
          width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					min-height: 400rpx;
					background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
					padding: 40rpx;
					
					.error-icon {
						font-size: 64rpx;
						margin-bottom: 16rpx;
						opacity: 0.7;
					}
					
					.error-text {
						font-size: 28rpx;
						color: #909399;
						font-weight: 400;
					}
				}
			}
			
			.empty {
				width: 100%;
				min-height: 60vh;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 120rpx 40rpx;
				box-sizing: border-box;
				
				.empty-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					
					.text {
						width: 100%;
						text-align: center;
						font-size: 32rpx;
						margin-top: 32rpx;
						color: #111827;
						font-weight: 600;
					}
					
					.sub-text {
						width: 100%;
						text-align: center;
						font-size: 26rpx;
						margin-top: 12rpx;
						color: #6b7280;
						font-weight: 400;
					}
				}
			}
		}
		
		.btns {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 24rpx 32rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
			box-sizing: border-box;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
			backdrop-filter: blur(20rpx);
			z-index: 100;
			
			.btn-container {
				width: 100%;
				max-width: 750rpx;
				margin: 0 auto;
			}
		}
	}
</style>