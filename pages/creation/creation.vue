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
	import exampleUrl from "@/static/image/example.png"
	import checkSquareUrl from "@/static/image/checkSquare.png"
	
	const id = ref('')
	const price = ref(null)
	onLoad((query) => {
	  id.value = query.id;
		price.value = query.price
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