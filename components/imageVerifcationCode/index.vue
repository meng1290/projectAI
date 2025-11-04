<template>
	<view class="imageVerifcationCode">
		<up-popup :show="showModal" @close="close" mode="center" closeable>
			<view class="box">
				<view class="codeimage">
					<view class="image">
						<up-image :show-loading="true" :src="captchaObj.captcha" width="280rpx" height="80rpx" @click=""></up-image>
					</view>
					<view class="text" @click="getCaptchaFun()">看不清？</view>
				</view>
				<up-input v-model="captchaObj.code" placeholder="请输入图形验证码" maxlength="4" clearable :customStyle="{padding:'12rpx 18rpx',marginTop:'20rpx'}"></up-input>
				<up-button type="primary" @click="handelSend()" :loading="btnLoading" loadingText="正在发送" color="#0166FE" :customStyle="{fontSize:'28rpx !important',marginTop:'40rpx'}">发送短信验证码</up-button>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { getCaptcha } from "@/api/index.js"
	const showModal = ref(false)
	const btnLoading = ref(false)
	
	const show = async () => {
		showModal.value = true; 
		await getCaptchaFun()
		
	}
	// 获取验证码
	const captchaObj = ref({
		code:'',
		captcha:'',
		key:'',
	})
	const getCaptchaFun = async () => {
		await getCaptcha().then(res => {
			captchaObj.value.captcha = res.captcha || ''
			captchaObj.value.key = res.key || ''
		})
	}
	//发送验证码
	const emit = defineEmits(['sendVerifcationCode']);
	const handelSend = () => {
		if(captchaObj.value.code && captchaObj.value.code.length == 4){
			btnLoading.value = true
			emit('sendVerifcationCode', captchaObj.value); 
		}else{
			uni.showToast({
				title: '请输入4位图形验证码',
				icon: 'none'
			});
		}
	}
	const close = () => {
		showModal.value = false;  
		btnLoading.value = false
		captchaObj.value = {
			code:'',
			captcha:'',
			key:'',
		}
	}
	const hideBtnLoading = () => {
		btnLoading.value = false
	}
	defineExpose({
	  show,
		close,
		hideBtnLoading
	});
</script>

<style lang="scss">
	.box{
		width: 80vw;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 60rpx 32rpx;
		box-sizing: border-box;
		.codeimage{
			width: 100%;
			display: flex;
			align-items: flex-end;
			.text{
				margin-left: 40rpx;
				font-size: 28rpx;
				text-decoration: underline;
				color: blue;
			}
		}
	}
</style>