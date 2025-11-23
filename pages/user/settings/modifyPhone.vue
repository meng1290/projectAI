<template>
	<view class="page">
		<view class="detail_box">
			<view class="detail_item">
				<view class="label"> 手机号 </view>
				<up-input type="number" v-model="username" maxlength="11" border="none" placeholder="请输入登陆手机号" placeholder-class="placeholder"></up-input>
			</view>
		</view>
		<view class="detail_box">
			<view class="detail_item">
				<view class="label"> 验证码 </view>
				<up-input type="number" v-model="code" maxlength="4" border="none" placeholder="请输入手机验证码" placeholder-class="placeholder">
					<template #suffix>
					  <up-code ref="uCodeRef" @change="codeChange" seconds="60" changeText="X秒重新获取" ></up-code>
					  <up-button @tap="getCode" :text="tips" type="success" size="mini" ></up-button>
					</template>
				</up-input>
			</view>
		</view>
		<view class="bottom_btn">
			<up-button type="primary" style="width: 100%; margin: 50rpx auto;" @click='btnClick'>确认提交</up-button>
		</view>
		
		<imageVerifcationCode ref="imageVerifcationCodeRef" @sendVerifcationCode="sendVerifcationCode"></imageVerifcationCode>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import imageVerifcationCode from "@/components/imageVerifcationCode/index.vue"
	import { authVerify, bindPhone } from "@/api/index.js"
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const username = ref('')
	const code = ref('')
	onLoad(() => {
	  username.value = store.userInfo.phone || ''
	})
	
	const tips = ref('');
	const uCodeRef = ref(null);
	const codeChange = (text) => {
	  tips.value = text;
	};
	const imageVerifcationCodeRef = ref(null)
	const getCode = () => {
		if(!uni.$u.test.mobile(username.value)){
			return uni.showToast({
				title: '手机号不正确',
				icon: 'none'
			});
		}
		
		if (uCodeRef.value.canGetCode) {
		  imageVerifcationCodeRef.value.show()
		} else {
		  uni.$u.toast('倒计时结束后再发送');
		}
	};
	const sendVerifcationCode = (data) => {
		uni.showLoading({
		  title: '正在获取验证码',
		});
		const params = {
			phone: username.value,
			type: 'binding',
			captcha: data.code,
			checkKey: data.key
		}
		authVerify(params).then(res => {
			uni.hideLoading();
			uni.$u.toast('验证码已发送');
			uCodeRef.value.start();
			imageVerifcationCodeRef.value.close()
		}).catch(err => {
			imageVerifcationCodeRef.value.hideBtnLoading()
		})
	}
	const btnClick = () => {
		if(!code.value.trim()){
			return uni.showToast({
				title: '请输入验证码',
				icon: 'none'
			});
		}
		if(code.value.length != 4){
			return uni.showToast({
				title: '请输入4位验证码',
				icon: 'none'
			});
		}
		bindPhone({
			phone:username.value,
			sms_code:code.value
		}).then(res=>{
			uni.showToast({
				title: '绑定成功',
				icon: 'success'
			});
			setTimeout(()=>{
				uni.switchTab({
					url:'/pages/user/index'
				})
			},1000)
		})
	}
</script>

<style lang="scss" scoped>

  .page{
		min-height: 100vh;
		padding: 32rpx;
		box-sizing: border-box;
		position: relative;
		background-color: #f5f5f5;
		.detail_box{
			background-color: #FFFFFF;
			border-radius: 12rpx;
			font-size: 28rpx;
			margin-bottom: 20rpx;
			.detail_item{
				padding: 26rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.label{
					margin-right: 20rpx;
				}
			}
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