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
				<view class="watermark" v-if="isShowWatermark">AI生成</view>
			</view>
			
			<view class="empty" v-if="!creationResultsList.length">
				<up-loading-icon color="#666" size="40"></up-loading-icon>
				<view class="text">正在生成中，请稍后</view>
			</view>
		</view>
		
		<view class="btns" v-if="creationResultsList.length">
			<up-button type="primary" @click="handleSaveImage" color="#0166FE" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx'}">保存图片</up-button>
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
	})
	const getImageResult = async() => {
		uni.showLoading({ title: '生成中' });
		btnLoading.value = true
		const result = await pollTaskResult(id.value,6)
		uni.hideLoading()
		btnLoading.value = false
		if (result.code) {
			console.log('获取到任务结果:', result)
			creationResultsList.value = result.images
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
	const isShowWatermark = ref(false)
	const imageload = (e) => {
		console.log(e,12)
		isShowWatermark.value = true
	}
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
			
			.empty{
				width: 100%;
				height: 60vh;
				background: rgb(243, 244, 246);
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				padding: 30% 0 50%;
				box-sizing: border-box;
				.text{
					width: 100%;
					text-align: center;
					font-size: 36rpx;
					margin-top: 20rpx;
					color: #666;
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