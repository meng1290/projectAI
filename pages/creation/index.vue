<template>
	<view class="page">
		<view class="title">创作</view>
		<view class="upload">
			<up-upload
			  :fileList="fileList"
			  @afterRead="afterRead"
			  @delete="deletePic"
				multiple
			  :maxCount="1"
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
			<view class="points">
				<view class="text">本次消耗算力：50</view>
				<view class="text">我的算力余额：600</view>
			</view>
		</view>
		<view class="btns">
			<up-button type="primary" color="#FF9500" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">充值</up-button>
			<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'2'}">生成</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import uploadUrl from "@/static/image/upload.png"
	import exampleUrl from "@/static/image/example.png"
	import checkSquareUrl from "@/static/image/checkSquare.png"
	
	const fileList = ref([])
	
	const afterRead = async(event) =>{
		// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file);
		let fileListLen = fileList.value.length;
		lists.map((item) => {
			fileList.value.push({
				...item,
				status: "uploading",
				message: "上传中",
			});
		});
		for (let i = 0; i < lists.length; i++) {
			const result = await uploadFilePromise(lists[i].url);
			let item = fileList.value[fileListLen];
			fileList.value.splice(
				fileListLen,
				1,
				Object.assign(item, {
					status: "success",
					message: "",
					url: result,
				})
			);
			fileListLen++;
		}
	}
	
	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: "http://192.168.2.21:7001/upload", // 仅为示例，非真实的接口地址
				filePath: url,
				name: "file",
				formData: {
					user: "test",
				},
				success: (res) => {
					setTimeout(() => {
						resolve(res.data.data);
					}, 1000);
				},
			});
		});
	}
	const deletePic = (event) => {
		fileList.value.splice(event.index, 1);
	}
</script>

<style lang="scss" scoped>
	.page{
		padding: 20rpx 32rpx;
		padding-top: calc(var(--status-bar-height) + 20px) !important;
		box-sizing: border-box;
		.title{
			width: 100%;
			height: 120rpx;
			line-height: 120rpx;
			font-size: 64rpx;
			text-align: center;
			font-weight: bold;
		}
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
			.points{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-top: 60rpx;
				.text{
					flex: 1;
					font-size: 32rpx;
					height: 48rpx;
					line-height: 48rpx;
					&:nth-of-type(2){
						text-align: right;
					}
				}
			}
		}
		.btns{
			width: 100%;
			padding: 100rpx 0rpx 80rpx;
			box-sizing: border-box;
			display: flex;
			.u-button:nth-child(odd) {
				margin-right: 40rpx;
			}
		}
	}
</style>