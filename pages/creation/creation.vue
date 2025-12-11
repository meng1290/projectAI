<template>
	<view class="page">
		<view class="section-card upload">
      <view class="upload-title">上传参考图片</view>
      <view class="upload-desc">请选择参考照片，避免遮挡、模糊、强烈背光，便于 AI 更好识别。</view>
      <view class="upload-box">
        <up-upload
          :fileList="fileList"
          autoDelete
          autoUpload
          :autoUploadApi="config.baseUrl+'/upload/image/file'"
          :multiple="false"
          :maxCount="1"
          :previewFullImage="true"
          accept="image"
          :maxSize="16 * 1024 * 1024"
          customAfterAutoUpload
          @afterAutoUpload="afterAutoUpload"
        >
          <view class="box">
            <image class="image" :src="uploadUrl"></image>
            <view class="text">上传图片</view>
          </view>
        </up-upload>
      </view>
		</view>
		<view class="section-card example">
      <view class="section-title">效果示例</view>
			<view v-if="tips" class="tips">温馨提示：{{tips}}</view>
			<view class="imgs">
				<view class="imgBox">
					<up-image :src="exampleUrl1" width="100%" height="100%" mode="aspectFill">
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
				<view class="line">
					<view style="width: 100%;">
						<view class="text">生成</view>
						<view class="arrow"></view>
					</view>
				</view>
				<view class="imgBox">
					<up-image class="image" :src="exampleUrl2" width="100%" height="100%" mode="aspectFill">
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
			</view>
			
		</view>
		<view class="footer">
			<view class="points">
				<view class="text">本次消耗算力：{{price}}</view>
				<view class="text">我的算力余额：{{store.isLogin?store.userInfo.now_money:0}}</view>
			</view>
			<view class="btns">
				<up-button 
					type="primary" 
					@click="handleCharging()" 
					color="#FF9500" 
					:customStyle="{
						height:'96rpx',
						fontSize:'32rpx',
						flex:'1',
						borderRadius: '48rpx',
						fontWeight: '500',
						boxShadow: '0 8rpx 24rpx rgba(255, 149, 0, 0.3)'
					}"
				>
					充值
				</up-button>
				<up-button 
					type="primary" 
					@click="handleCreateTask()" 
					:loading="btnLoading" 
					loadingText="生成中" 
					color="#0166FE" 
					:customStyle="{
						height:'96rpx',
						fontSize:'32rpx',
						flex:'2',
						borderRadius: '48rpx',
						fontWeight: '500',
						boxShadow: '0 8rpx 24rpx rgba(1, 102, 254, 0.3)'
					}"
				>
					生成
				</up-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import { useUserStore } from '@/stores/index'
	import { createTask, getTaskResult } from "@/api/index.js"
	import { onLoad, onShow } from '@dcloudio/uni-app'
	const store = useUserStore()
	import config from "@/config/index.js"
	
	
	import uploadUrl from "@/static/image/upload.png"
	import checkSquareUrl from "@/static/image/checkSquare.png"
	
	const id = ref('')
	const price = ref(null)
	let exampleUrl1 = ''
	let exampleUrl2 = ''
	let tips = ''
	onLoad(() => {
		const productDetailParams = store.productDetailParams;
		if(productDetailParams){
			uni.setNavigationBarTitle({
				title: productDetailParams.store_name
			});
			id.value = productDetailParams.id;
			price.value = productDetailParams.price
			exampleUrl1 = productDetailParams.cloth_image
			exampleUrl2 = productDetailParams.image
			tips = productDetailParams.store_info
		}
	});
	onShow(() => {
    if(store.isLogin){
      store.getUserInfo()
    }
	})
	const fileList = ref([])
	
	const afterAutoUpload = (res) => {
		const data = JSON.parse(res)
		if(data.code != 200){
			uni.showToast({
				title: data.message || '上传失败，请重试',
				icon: 'none',
			});
			fileList.value = []
		}else{
			res.callback({
				url: data.result.path
			});
		}
	}
	const btnLoading = ref(false)
	const handleCreateTask = () => {
		if(fileList.value.length === 0){
			return uni.showToast({
				title: '请先上传图片',
				icon: 'none',
			});
		}
		if(!store.isLogin){
			return uni.navigateTo({
				url:"/pages/login/index"
			})
		}
		btnLoading.value = true
		createTask({submitimgs:fileList.value[0].url,aiproduct_id:id.value}).then( async (res) => {
			if(res.id){
				fileList.value = []
				uni.navigateTo({
					url:`/pages/creation/creationResults?id=${res.id}`
				})
				btnLoading.value = false
			}else{
				btnLoading.value = false
				uni.showToast({
					title: '任务创建失败',
					icon: 'none',
				});
			}
		}).catch(err => {
			btnLoading.value = false
		})
	} 
	
	
	const handleCharging = () => {
    if(!store.isLogin){
			return uni.navigateTo({
				url:"/pages/login/index"
			})
		}
		if(btnLoading.value)return
		uni.navigateTo({
			// #ifdef APP-IOS
			url:"/pages/user/member",
			// #endif
			// #ifndef APP-IOS
			url:"/pages/user/memberApple",
			// #endif
		})
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		padding: 32rpx 32rpx 240rpx;
		box-sizing: border-box;
		position: relative;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);

		.section-card {
			width: 100%;
			background: #fff;
			border-radius: 24rpx;
			padding: 32rpx;
			box-sizing: border-box;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
			margin-bottom: 32rpx;
			transition: all 0.3s ease;
		}

		.upload {
			display: flex;
			flex-direction: column;
			align-items: center;

			.upload-title {
				width: 100%;
				font-size: 32rpx;
				font-weight: 600;
				color: #111827;
				margin-bottom: 16rpx;
			}

			.upload-desc {
				width: 100%;
				font-size: 26rpx;
				color: #6b7280;
				line-height: 1.6;
				margin-bottom: 28rpx;
			}

			.upload-box {
				width: 460rpx;
				height: 460rpx;
				border-radius: 32rpx;
				padding: 10rpx;
				box-sizing: border-box;
				background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
				border: 2rpx solid rgba(1, 102, 254, 0.12);
				display: flex;
				justify-content: center;
				align-items: center;
				transition: all 0.3s ease;
			}

			::v-deep .u-upload {
				width: 100%;
				height: 100%;
				.u-upload__wrap {
					width: 100%;
					height: 100%;
					.box {
						width: 440rpx;
						height: 440rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						background: #fff;
						border-radius: 24rpx;
						box-shadow: inset 0 0 0 2rpx rgba(1, 102, 254, 0.06);
						transition: all 0.3s ease;
						
						&:active {
							transform: scale(0.98);
						}
						
						.image {
							width: 192rpx;
							height: 192rpx;
							opacity: 0.8;
						}
						.text {
							margin-top: 24rpx;
							font-size: 30rpx;
							font-weight: 600;
							color: #111827;
						}
					}
				}
				.u-upload__wrap__preview {
					margin: 0;
					.u-upload__wrap__preview__image {
						width: 440rpx !important;
						height: 440rpx !important;
						border-radius: 24rpx;
					}
				}
			}
		}

		.example {
			width: 100%;

			.section-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #111827;
				margin-bottom: 16rpx;
			}

			.tips {
				font-size: 26rpx;
				color: #6b7280;
				text-align: left;
				margin-bottom: 28rpx;
				padding: 24rpx;
				border-radius: 20rpx;
				background: linear-gradient(135deg, #fafdff 0%, #f0f9ff 100%);
				border: 1rpx solid rgba(1, 102, 254, 0.08);
				line-height: 1.6;
			}

			.imgs {
				width: 100%;
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				align-items: center;
				flex-wrap: nowrap;
				column-gap: 24rpx;
				padding: 0 8rpx;
				
				.imgBox {
					position: relative;
					width: 210rpx;
					height: 210rpx;
					border: 6rpx solid rgba(34, 197, 94, 0.6);
					border-radius: 24rpx;
					overflow: hidden;
					box-shadow: 0 10rpx 30rpx rgba(34, 197, 94, 0.14);
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.95);
					}
					
					.checkSquare {
						width: 48rpx;
						height: 48rpx;
						position: absolute;
						right: 10rpx;
						top: 6rpx;
					}
					
					.loading-wrapper {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
					}
					
					.error-wrapper {
            width: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
						padding: 20rpx;
						
						.error-icon {
							font-size: 48rpx;
							margin-bottom: 12rpx;
							opacity: 0.7;
						}
						
						.error-text {
							font-size: 24rpx;
							color: #909399;
							font-weight: 400;
						}
					}
				}
				
				.line {
					flex: 1;
					min-width: 110rpx;
					padding: 0 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 12rpx;
					
					.text {
						width: 100%;
						text-align: center;
						color: #6b7280;
						font-size: 28rpx;
						font-weight: 500;
					}
					
					.arrow {
						height: 4rpx;
						width: 100%;
						max-width: 260rpx;
						background: linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%);
						position: relative;
						border-radius: 4rpx;
						
						&::after {
							content: ''; 
							width: 20rpx;
							height: 4rpx;
							position: absolute;
							right: 0;
							bottom: 0;
							background: #9ca3af;
							transform-origin: right bottom; 
							transform: rotate(30deg); 
							border-radius: 4rpx;
						}
						&::before {
							content: ''; 
							width: 20rpx;
							height: 4rpx;
							position: absolute;
							right: 0;
							bottom: 0;
							background: #9ca3af;
							transform-origin: right top; 
							transform: rotate(330deg); 
							border-radius: 4rpx;
						}
					}
				}
			}
		}

		.footer {
			width: 100%;
			padding: 24rpx 32rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
			box-sizing: border-box;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
			backdrop-filter: blur(20rpx);
			box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
			z-index: 100;
			
			.points {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-bottom: 20rpx;
				padding: 0 4rpx;
				
				.text {
					flex: 1;
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #374151;
					font-weight: 400;
					
					&:nth-of-type(2) {
						text-align: right;
						font-weight: 500;
					}
				}
			}
			
			.btns {
				width: 100%;
				display: flex;
				gap: 24rpx;
			}
		}
	}
</style>