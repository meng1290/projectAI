<template>
	<view class="page">
		<view class="upload">
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
		<view class="example">
			<view class="tips">温馨提示：上传白底平拍产品图，示例如下</view>
			<view class="imgs">
				<view class="imgBox">
					<image class="image" :src="exampleUrl"></image>
					<image class="checkSquare" :src="checkSquareUrl"></image>
				</view>
				<view class="imgBox">
					<image class="image" :src="exampleUrl"></image>
					<image class="checkSquare" :src="checkSquareUrl"></image>
				</view>
			</view>
			
		</view>
		<view class="footer">
			<view class="points">
				<view class="text">本次消耗算力：50</view>
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
	import { onLoad } from '@dcloudio/uni-app'
	const store = useUserStore()
	import config from "@/config/index.js"
	
	
	import uploadUrl from "@/static/image/upload.png"
	import exampleUrl from "@/static/image/example.png"
	import checkSquareUrl from "@/static/image/checkSquare.png"
	
	const id = ref('')
	onLoad((query) => {
	  id.value = query.id;
	});
	
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
			uni.showLoading({ title: '生成中' });
			const result = await pollTaskResult(res.id,5)
			uni.hideLoading()
			if (result) {
				console.log('获取到任务结果:', result)
				uni.setStorageSync('creationResults',result.images)
				uni.navigateTo({
					url:"/pages/creation/creationResults"
				})
			} else {
				console.log('未获取到有效任务结果')
				uni.showModal({
					title:'提示',
					content:'任务已提交，可在创作记录中查看',
					showCancel:false,
					success(res) {
						if(res.confirm){
							fileList.value = []
							store.getUserInfo()
						}
					}
				})
			}
		}).catch(err => {
			btnLoading.value = false
		})
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
	        btnLoading.value = false
	        return result // 返回结果并结束轮询
	      }
	      console.log(`第 ${i + 1} 次请求，images为空，${interval/1000}秒后重试`)
	      // 如果不是最后一次重试，则等待5秒
	      if (i < maxRetries - 1) {
	        await delay(interval)
	      }
	    } catch (error) {
	      console.error(`第 ${i + 1} 次请求失败:`, error)
	      // 如果不是最后一次重试，则等待5秒
	      if (i < maxRetries - 1) {
	        await delay(interval)
	      }
	    }
	  }
	  
	  // 达到最大重试次数仍未获取到数据
	  btnLoading.value = false
	  console.log('已达到最大重试次数，未获取到有效数据')
	  return null
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
		padding: 20rpx 32rpx 194rpx;
		box-sizing: border-box;
		position: relative;
		.upload{
			width: 600rpx;
			height: 600rpx;
			background-color: #D9D9D9;
			margin: auto;
			::v-deep .u-upload{
				width: 100%;
				height: 100%;
				.u-upload__wrap{
					width: 100%;
					height: 100%;
					.box{
						width: 600rpx;
						height: 600rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.image{
							width: 192rpx;
							height: 192rpx;
						}
					}
				}
				.u-upload__wrap__preview{
					margin: 0;
					.u-upload__wrap__preview__image{
						width: 600rpx !important;
						height: 600rpx !important;
					}
				}
			}
			.text{
				width: 100%;
				height: 48rpx;
				line-height: 48rpx;
				font-size: 32rpx;
				text-align: center;
				font-weight: bold;
			}
		}
		.example{
			width: 100%;
			.tips{
				font-size: 32rpx;
				color: #333;
				text-align: center;
				margin: 40rpx 0;
			}
			.imgs{
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 0 40rpx;
				box-sizing: border-box;
				.imgBox{
					position: relative;
					.image{
						width: 260rpx;
						height: 260rpx;
						border: 6rpx solid #59D677;
					}
					.checkSquare{
						width: 48rpx;
						height: 48rpx;
						position: absolute;
						right: 10rpx;
						top: 6rpx;
					}
				}
			}
		}
		.footer{
			width: 100%;
			padding: 20rpx 32rpx;
			box-sizing: border-box;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #fff;
			.points{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-bottom: 10rpx;
				.text{
					flex: 1;
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					&:nth-of-type(2){
						text-align: right;
					}
				}
			}
			.btns{
				width: 100%;
				display: flex;
				.u-button:nth-child(odd) {
					margin-right: 40rpx;
				}
			}
		}
		
	}
</style>