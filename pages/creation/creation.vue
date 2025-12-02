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
						<template #loading><up-loading-icon></up-loading-icon></template>
						<template #error>
							<view style="font-size: 28rpx;">加载失败</view>
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
						<template #loading><up-loading-icon></up-loading-icon></template>
						<template #error>
							<view style="font-size: 28rpx;">加载失败</view>
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
				<up-button type="primary" @click="handleCharging()" color="#FF9500" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">充值</up-button>
				<up-button type="primary" @click="handleCreateTask()" :loading="btnLoading" loadingText="生成中" color="#0166FE" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'2'}">生成</up-button>
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
		store.getUserInfo()
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
		if(btnLoading.value)return
		uni.navigateTo({
			url:"/pages/user/member"
		})
	}
</script>

<style lang="scss" scoped>
	.page{
		min-height: 100vh;
		padding: 32rpx 32rpx 226rpx;
		box-sizing: border-box;
		position: relative;
		background: #f4f6fa;

		.section-card{
			width: 100%;
			background: #fff;
			border-radius: 24rpx;
			padding: 32rpx;
			box-sizing: border-box;
			box-shadow: 0 12rpx 40rpx rgba(15, 23, 42, 0.08);
			margin-bottom: 32rpx;
		}

		.upload{
			display: flex;
			flex-direction: column;
			align-items: center;

			.upload-title{
				width: 100%;
				font-size: 32rpx;
				font-weight: 600;
				color: #111827;
				margin-bottom: 16rpx;
			}

			.upload-desc{
				width: 100%;
				font-size: 26rpx;
				color: #6b7280;
				line-height: 1.5;
				margin-bottom: 28rpx;
			}

			.upload-box{
        width: 460rpx;
        height: 460rpx;
        border-radius: 32rpx;
        padding: 10rpx;
        box-sizing: border-box;
        background: #f8f9ff;
        border: 2rpx solid rgba(1, 102, 254, 0.08);
        display: flex;
        justify-content: center;
        align-items: center;
			}

			::v-deep .u-upload{
				width: 100%;
				height: 100%;
				.u-upload__wrap{
					width: 100%;
					height: 100%;
					.box{
						width: 440rpx;
						height: 440rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						background: #fff;
						border-radius: 24rpx;
						box-shadow: inset 0 0 0 2rpx rgba(1, 102, 254, 0.04);
						.image{
							width: 192rpx;
							height: 192rpx;
						}
						.text{
							margin-top: 24rpx;
							font-size: 30rpx;
							font-weight: 600;
							color: #111827;
						}
					}
				}
				.u-upload__wrap__preview{
					margin: 0;
					.u-upload__wrap__preview__image{
						width: 440rpx !important;
						height: 440rpx !important;
						border-radius: 24rpx;
					}
				}
			}
		}

		.example{
			width: 100%;

			.section-title{
				font-size: 30rpx;
				font-weight: 600;
				color: #111827;
				margin-bottom: 16rpx;
			}

			.tips{
				font-size: 26rpx;
				color: #6b7280;
				text-align: left;
				margin-bottom: 28rpx;
				padding: 24rpx;
				border-radius: 20rpx;
				background-color: #fafdff;
			}

			.imgs{
				width: 100%;
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				align-items: center;
        flex-wrap: nowrap;
        column-gap: 24rpx;
        padding: 0 8rpx;
				.imgBox{
					position: relative;
					width: 210rpx;
					height: 210rpx;
					border: 6rpx solid rgba(34, 197, 94, 0.6);
					border-radius: 24rpx;
					overflow: hidden;
					box-shadow: 0 10rpx 30rpx rgba(34, 197, 94, 0.14);
					.checkSquare{
						width: 48rpx;
						height: 48rpx;
						position: absolute;
						right: 10rpx;
						top: 6rpx;
					}
				}
				.line{
					flex: 1;
          min-width: 110rpx;
          padding: 0 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 12rpx;
					.text{
						width: 100%;
						text-align: center;
						color: #6b7280;
						font-size: 28rpx;
					}
					.arrow{
						height: 4rpx;
						width: 100%;
						max-width: 260rpx;
						background: #9ca3af;
						position: relative;
						border-radius: 4rpx;
						&::after{
							content: ''; 
							width: 20rpx;
							height: 4rpx;
							position: absolute;
							right: 0;
							bottom: 0;
							background: #9ca3af;
							transform-origin: right bottom; 
							transform: rotate(30deg); 
						}
						&::before{
							content: ''; 
							width: 20rpx;
							height: 4rpx;
							position: absolute;
							right: 0;
							bottom: 0;
							background: #9ca3af;
							transform-origin: right top; 
							transform: rotate(330deg); 
						}
					}
				}
			}
		}

		.footer{
			width: 100%;
			padding: 24rpx 32rpx 32rpx;
			box-sizing: border-box;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #fff;
			box-shadow: 0 -8rpx 40rpx rgba(15, 23, 42, 0.12);
			.points{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-bottom: 16rpx;
				padding: 0 4rpx;
				.text{
					flex: 1;
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #374151;
					&:nth-of-type(2){
						text-align: right;
					}
				}
			}
			.btns{
				width: 100%;
				display: flex;
				gap: 32rpx;
			}
		}
		
	}
</style>