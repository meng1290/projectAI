<template>
	<view class="page">
		<view class="avatar">
			<up-cropper 
				ref="avatarCropperRef"
				:canChangeSize="false"
				areaWidth="400rpx" 
				areaHeight="400rpx" 
				exportWidth="400rpx" 
				exportHeight="400rpx"
				@confirm="onAvatarConfirm"
			>
				<view class="avatar-wrapper">
					<up-avatar :src="avatarImage" size="400rpx"></up-avatar>
				</view>
			</up-cropper>
		</view>
		
		<view class="bottom_btn">
			<up-button type="primary" style="width: 100%; margin: 50rpx auto;" @click='btnClick'>确认提交</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	import { uploadImageFile } from "@/utils/imageRequest.js"
	import utils from "@/utils/index.js"

	const avatarImage = ref('');
	
	const avatarCropperRef = ref(null);
	
	const onAvatarConfirm = (rsp) => {
		
	  avatarImage.value = rsp.path;
		console.log(avatarImage.value,rsp)
	};
	
	const btnClick = async () => {
		if(!avatarImage.value){
			return uni.showToast({
				title: '请先选择头像',
				icon: 'none'
			});
		}
		try {
			const file = await utils.blobUrlToFormData(avatarImage.value,`avatar_${Date.now()}.png`)
			const formData = new FormData()
			formData.append('file', file)
			
			const result = await uploadImageFile(formData,avatarImage.value)
			
			URL.revokeObjectURL(avatarImage.value)
		} catch(err) {
			console.log(err)
			uni.showToast({
				title: '上传失败',
				icon: 'none'
			});
		}
		// utils.blobUrlToFile(avatarImage.value,'avatar.png').then(file => {
		// 	console.log(file)
		// 	const formData = new FormData();
		// 	formData.append('file', file);
		// 	uploadImageFile(formData).then(res => {
		// 		console.log(res)
		// 	})
		// })
		
		
		
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #f5f5f5;
	}
	.page{
		padding: 32rpx;
		.avatar{
			padding: 100rpx 0;
			display: flex;
			justify-content: center;
		}
		
		.bottom_btn{
			padding: 0 32rpx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
		}
	}
</style>