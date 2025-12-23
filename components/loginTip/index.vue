<template>
	<up-popup :show="show" mode="center" round="15">
		<view class="pop_title">保护您的创作</view>
		<view class="pop_content">
			<view class="p_title">登录后可跨设备同步您的作品</view>
			<up-image :src="loginbg" width="100px" height="100px" mode="widthFix"></up-image>
			<view class="agreement">
				<up-checkbox-group v-model="radiovalue" @change="checkboxChange">
					<up-checkbox name="1" activeColor="#0166FE" iconSize="14"></up-checkbox>
					<view class="text" @click="checkboxChange()">我已阅读并同意<text class="link" @click.stop="toUserAgreement(1)">《童创AI服务协议》</text>和<text class="link" @click.stop="toUserAgreement(2)">《隐私政策》</text></view>
				</up-checkbox-group>
			</view>
			<view class="btns">
			  <up-button class="item_btn" :disabled="close" @click="cancelLogin">暂不需要</up-button>
			  <up-button class="item_btn confirm_btn" @click="handleLogin">去登陆</up-button>
			</view>
			<view class="anonymousLogin" @click="handleAnonymousLogin">
				<text class="anonymousText">跳过登录 / 以游客身份体验</text>
			</view>
			
		</view>
		
	</up-popup>
</template>

<script setup>
	import { ref } from 'vue';  
	import loginbg from "@/static/image/loginbg.png"
	import config from '@/config/index.js'
	// 创建响应式数据  
	const show = ref(false);
	const isBtnLoading = ref(false)
	// 定义方法  
	function open() {
	  show.value = true;
	}  
	defineExpose({
		open
	});  
	function cancelLogin() {
	  show.value = false;  
	} 
	const handleLogin = () => {
		show.value = false
		uni.navigateTo({
			url:"/pages/login/index"
		})
	}
	const handleAnonymousLogin = () => {
		isBtnLoading.value = true
		
	}
	//协议勾选
	const radiovalue = ref([])
	const checkboxChange = (val) => {
		if(val){
			radiovalue.value = val
		}else{
			if(radiovalue.value.length){
				radiovalue.value = []
			}else{
				radiovalue.value = ['1']
			}
		}
	}
	const toUserAgreement = (type) => {
		if(type === 1){
			uni.setStorageSync('webViewObj',{url:config.userAgreement,title:'用户协议'})
		}else{
			uni.setStorageSync('webViewObj',{url:config.privacyPolicy,title:'隐私政策'})
		}
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		});
	}
</script>

<style lang="scss" scoped>
	.pop_title {
	  margin: 18px 12px 12px;
	  font-size: 16px;
	  line-height: 22px;
	  color: #333;
	  font-weight: 600;
	  text-align: center;
	}
	.pop_content{
		width: 260px;
		box-sizing: border-box;
		padding: 0 16px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.p_title {
			color: #666;
			font-size: 13px;
			line-height: 13px;
		}
		.agreement{
			width: 100%;
		  height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin: auto;
			text-align: center;
			.u-checkbox-group--row{
				justify-content: center;
				align-items: center;
				.u-checkbox{
					margin: 0;
				}
			}
			.text{
				flex: 1;
				text-align: left;
				font-size: 24rpx;
				color: #333;
			}
			.link{
				color: #249afa;
			}
		}
		.btns{
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
			margin-top: 16px;
			justify-content: space-between;
			.item_btn{
				flex: 1;
				height: 44px;
				font-size: 15px;
				border-radius: 8px;
				background: #f5f5f5;
				color: #333;
				border: none;
			}
			.confirm_btn{
				background: #0166FE;
				color: #fff;
			}
		}
		.anonymousLogin{
			width: 100%;
			margin-top: 16px;
			padding: 8px 0;
			text-align: center;
			cursor: pointer;
			
			.anonymousText{
				font-size: 12px;
				color: #999;
				line-height: 1.5;
				transition: color 0.2s ease;
			}
			
			&:active .anonymousText{
				color: #666;
			}
		}
	}
</style>