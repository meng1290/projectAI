<template>
	<view class="page">
		<qf-image-cropper :width="100" :height="100" :radius="0" @crop="handleCrop"></qf-image-cropper>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	import config from '@/config/index.js'
	import QfImageCropper  from "@/uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue"
	import { changeUserInfo } from "@/api/index.js"
	
	const handleCrop = (e) => {
		uni.uploadFile({
			url: config.baseUrl + '/upload/image/file',
			filePath: e.tempFilePath,
			name: 'file',
			formData: {},
			success: (res) => {
				const data = JSON.parse(res.data);
				if (res.statusCode === 200) {
					if (data.code === 200) {
						changeUserInfo({avatar: data.result.path}).then(result => {
							uni.showToast({ title: "上传成功", icon: 'success' });
							setTimeout(() => {
								uni.switchTab({
								  url: '/pages/user/index'
								});
							},300)
						}).catch(err => {
							uni.showToast({ title: "上传失败", icon: 'none' });
						})
					} else {
						uni.showToast({ title: data.message, icon: 'none' });
					}
				} else {
					uni.showToast({ title: '服务器异常', icon: 'none' });
				}
			},
			fail: (err) => {
				uni.showToast({ title: '上传失败', icon: 'none' });
			}
		});
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #f5f5f5;
	}
	.page{
		
	}
</style>