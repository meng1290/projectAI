<template>
	<view class="page">
		<view class="content">
			<view v-if="creationResultsList.length === 0" class="empty-state">
				<view class="empty-icon">📷</view>
				<view class="empty-text">暂无创作结果</view>
			</view>
			<view v-else class="image-wrapper" v-for="(item,i) in creationResultsList" :key="i">
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
		</view>
		
		<view class="btns" v-if="creationResultsList.length > 0">
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
	import { permissionCheck, phonePermissionSetting } from "@/utils/phonePermissionCheck.js"
	
	const creationResultsList = uni.getStorageSync('creationResults') || []
	
	
	const handleSaveImage = () => {
		if(!creationResultsList.length){
			return uni.showToast({
				title: '保存失败',
				icon: 'none',
			});
		}
		uni.showLoading()
		let imgSrc = creationResultsList[0]
		uni.downloadFile({
			url: imgSrc, //仅为示例，并非真实的资源
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
			
			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 200rpx 0;
				
				.empty-icon {
					font-size: 120rpx;
					margin-bottom: 32rpx;
					opacity: 0.6;
				}
				
				.empty-text {
					font-size: 28rpx;
					color: #909399;
					font-weight: 400;
				}
			}
			
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