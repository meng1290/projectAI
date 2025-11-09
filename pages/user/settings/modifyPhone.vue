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
				<up-input type="number" v-model="code" maxlength="6" border="none" placeholder="请输入手机验证码" placeholder-class="placeholder">
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
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
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
	const getCode = () => {
		return uni.showToast({
			title: '功能开发中',
			icon: 'none'
		});
		console.log(uCodeRef)
	  if (uCodeRef.value.canGetCode) {
	    // 模拟向后端请求验证码
	    uni.showLoading({
	      title: '正在获取验证码',
	    });
	    setTimeout(() => {
	      uni.hideLoading();
	      // 这里此提示会被start()方法中的提示覆盖
	      uni.$u.toast('验证码已发送');
	      // 通知验证码组件内部开始倒计时
	      uCodeRef.value.start();
	    }, 2000);
	  } else {
	    uni.$u.toast('倒计时结束后再发送');
	  }
	};
	
	const btnClick = () => {
		return uni.showToast({
			title: '功能开发中',
			icon: 'none'
		});
		modifyUserName({
			username:this.username.value
		}).then(res=>{
			
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