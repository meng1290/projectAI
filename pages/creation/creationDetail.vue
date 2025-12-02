<template>
	<view class="page">
		<view class="content">
			<view class="image_box">
				<up-image class="image" v-for="(item,i) in creationResultsList" :key="i" :src="item" @load="imageload" width="100%" mode="widthFix">
				  <template #loading><up-loading-icon></up-loading-icon></template>
					<template #error>
						<view style="font-size: 28rpx;">加载失败</view>
					</template>
				</up-image>
				<view class="watermark" v-if="isAiImage && isShowWatermark">AI生成</view>
			</view>
			
		</view>
		
		<view class="btns">
			<up-button type="primary" @click="handleSaveImage" color="#0166FE" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx'}">保存图片</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { permissionCheck, phonePermissionSetting } from "@/utils/phonePermissionCheck.js"
	
	const creationResultsList = uni.getStorageSync('creationResults') || []
	
	const isAiImage = ref(false)
	onLoad((opsion) => {
		isAiImage.value = opsion.isAiImage ? Boolean(opsion.isAiImage) : false
	})
	
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
	const isShowWatermark = ref(false)
	const imageload = (e) => {
		console.log(e,12)
		isShowWatermark.value = true
	}
</script>

<style lang="scss" scoped>
	.page{
		position: relative;
		padding-bottom: 160rpx;
		box-sizing: border-box;
		.content{
			padding-bottom: 80rpx;
			width: 100%;
			.image_box{
				width: 100%;
				position: relative;
				.image {
					display: block;
				  width: 100%; 
				  height: auto;
				  margin: 0 auto;
					background-color: rgb(243, 244, 246);
				}
				.watermark{
					font-family: "Microsoft YaHei", "微软雅黑", SimHei, sans-serif;
					display: inline-block;
					font-size: 28rpx;
					padding: 0rpx 12rpx;
					border-radius: 8rpx;
					border: 2rpx solid rgba(255,255,255,0.5);
					color: rgba(255,255,255,0.5);
					position: absolute;
					right: 20rpx;
					bottom: 20rpx;
				}
			}
			
		}
		.btns{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 32rpx;
			box-sizing: border-box;
		}
	}
</style>