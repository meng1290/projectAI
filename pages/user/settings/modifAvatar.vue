<template>
	<view class="page">
		<view class="avatar">
			<up-cropper 
				ref="avatarCropperRef"
				:canChangeSize="false"
				areaWidth="300rpx" 
				areaHeight="300rpx" 
				exportWidth="260rpx" 
				exportHeight="260rpx"
				@confirm="onAvatarConfirm"
			>
				<view class="avatar-wrapper">
					<up-avatar :src="avatarImage" size="120px"></up-avatar>
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
	
	const avatarImage = ref('');
	const avatarCropperRef = ref(null);
	
	const onAvatarConfirm = (rsp) => {
	  avatarImage.value = rsp.path;
		console.log(avatarImage.value)
	};
</script>

<style lang="scss" scoped>
	page{
		background-color: #f5f5f5;
	}
	.page{
		padding: 32rpx;
		.avatar{
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