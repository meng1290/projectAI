<template>
	<view class="page">
		
		<view class="content">
      <view class="logo">
        <up-avatar :src="avatar" size="200"></up-avatar>
        <view class="title">你好，我是童创AI</view>
      </view>
			<view class="form">
        <up-form labelPosition="left" :model="form" :rules="rules" ref="formRef" errorType="toast">
					<view class="phoneAuth" v-if="loginType === 1">
						<view class="phone">188****8888</view>
						<view class="tips">首次验证通过即注册 童创AI账号</view>
					</view>
					<view class="WeChatAuth" v-if="loginType === 2">
						<text class="iconfont icon-weixin"></text>
						<text class="iconfont icon-shuangxiang"></text>
						<up-avatar :src="avatar" size="50"></up-avatar>
					</view>
          <view class="phoneMsg" v-if="loginType === 3">
            <up-form-item prop="account">
              <up-input type="number" v-model="form.account" placeholder="请输入手机号" maxlength="11" clearable prefixIcon="account-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'10px 9px',background:'#F3F4F6'}"></up-input>
            </up-form-item>
            <up-form-item prop="sms_code">
              <up-input type="number" v-model="form.sms_code" placeholder="请输入短信验证码" maxlength="4" prefixIcon="chat-fill" prefixIconStyle="font-size: 20px;color: #909399" :customStyle="{padding:'10px 9px',marginTop:'10px',background:'#F3F4F6'}">
                <template #suffix>
                  <up-code ref="uCodeRef" @change="codeChange" seconds="60" changeText="X秒重新获取" ></up-code>
                  <up-button @tap="getCode" :text="tips" type="success" size="mini" ></up-button>
                </template>
              </up-input>
            </up-form-item>
          </view>
          <view class="phonePaw" v-if="loginType === 4">
            <up-form-item prop="account">
              <up-input type="number" v-model="form.account" placeholder="请输入手机号" maxlength="11" clearable prefixIcon="account-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'10px 9px',background:'#F3F4F6'}"></up-input>
            </up-form-item>
            <up-form-item prop="password">
              <up-input type="password" v-model="form.password" placeholder="请输入密码" prefixIcon="lock-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'10px 9px',marginTop:'10px',background:'#F3F4F6'}"></up-input>
            </up-form-item>
          </view>
          
        </up-form>
				<view class="btns">
          <up-button type="primary" @click="login()" :loading="btnLoading" loadingText="请求中" color="#0166FE" :customStyle="{fontSize:'32rpx !important'}">{{['','本机号一键登录','微信授权登录','短信登录','账户密码登录'][loginType]}}</up-button>
          <!-- <up-button type="primary" @click="login()" icon="heart" color="#ffffff" iconColor="#333" text="本机登录"></up-button> -->
        </view>
			</view>
			
      <view class="loginType">
        <text @click="changeLoginType(1)" class="iconfont icon-denglu-shoujidenglu"></text>
        <text @click="changeLoginType(2)" class="iconfont icon-weixin"></text>
        <text @click="changeLoginType(3)" class="iconfont icon-duanxindenglu1"></text>
        <text @click="changeLoginType(4)" class="iconfont icon-mimadenglu"></text>
      </view>
		</view>
		<view class="agreement">
			<up-checkbox-group v-model="radiovalue" @change="checkboxChange">
				<up-checkbox name="1" activeColor="#0166FE" iconSize="14"></up-checkbox>
				<view class="text" @click="checkboxChange()">我已阅读并同意<text class="link" @click.stop="toUserAgreement(1)">《童创AI服务协议》</text>和<text class="link" @click.stop="toUserAgreement(2)">《隐私政策》</text></view>
			</up-checkbox-group>
		</view>
		
		<imageVerifcationCode ref="imageVerifcationCodeRef" @sendVerifcationCode="sendVerifcationCode"></imageVerifcationCode>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject, computed} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
  import { passWordLogin, authVerify } from '@/api/index.js'
  import { useUserStore } from '@/stores/index'
  const store = useUserStore()
	import utils from "@/utils/index.js"
	import imageVerifcationCode from "@/components/imageVerifcationCode/index.vue"
	import avatar from '@/static/image/avatar.png';
	
	// 登录参数
	const state = reactive({
	  form:{
	    // account:'18600443402',
	    account:'',
	    sms_code:'',
	    password:''
	  },
	  rules:{
	    account:[
	      {required: true,message:'请输入手机号',trigger:['blur','change']},
	      {
	        validator: (rule, value, callback) => {
	          return uni.$u.test.mobile(value);
	        },
	        message: '手机号码不正确',
	        trigger: ['change','blur'],
	      }
	    ],
	    sms_code:[
	      {required: true,message:'请输入验证码',trigger:['blur','change']},
	      {len: 4,message:'请输入4位验证码',trigger:['blur','change']}
	    ],
	    password:[{required: true,message:'请输入密码',trigger:['blur','change']}]
	  }
	})
	const { form, rules } = toRefs(state)
  //切换登录类型
  const loginType = ref(4)
  const changeLoginType = (type) => {
    if(type === loginType.value)return
    if([1].includes(type)){
      return uni.$u.toast('暂未开通')
    }
    loginType.value = type
  }
	//短信验证码
	const tips = ref('');
	const uCodeRef = ref(null);
	const codeChange = (text) => {
	  tips.value = text;
	};
	const imageVerifcationCodeRef = ref(null)
	const getCode = () => {
		if(!uni.$u.test.mobile(form.value.account)){
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
			phone: form.value.account,
			type: 'login',
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
	
	
	// 登录
	const formRef = ref(null)
	const btnLoading = ref(false)
	const login = () => {
		if(loginType.value === 1){
			if(!radiovalue.value.length){
				return uni.showToast({
					title: '请阅读并勾选服务协议',
					icon: 'none'
				});
			}
			
		}else if(loginType.value === 2){
			if(!radiovalue.value.length){
				return uni.showToast({
					title: '请阅读并勾选服务协议',
					icon: 'none'
				});
			}
			wechatLogin()
		}else if(loginType.value === 3){
			formRef.value.validate().then(valid => {
				if (valid) {
					if(!radiovalue.value.length){
						return uni.showToast({
							title: '请阅读并勾选服务协议',
							icon: 'none'
						});
					}
					btnLoading.value = true
					const params = {
						phone: form.value.account,
						sms_code: form.value.sms_code,
						user_type:'app'
					}
					store.smsLogin(params).then(res => {
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						navigateBackOrHome()
					}).catch(err => {
						btnLoading.value = false
					})
				}
			})
		}else if(loginType.value === 4){
			formRef.value.validate().then(valid => {
				if (valid) {
					if(!radiovalue.value.length){
						return uni.showToast({
							title: '请阅读并勾选服务协议',
							icon: 'none'
						});
					}
					btnLoading.value = true
					store.login(form.value).then(() => {
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						navigateBackOrHome()
					}).catch(err => {
						btnLoading.value = false
					})
				}
			})
		}else{
			
		}
		
	}
	//微信授权登录
	const wechatLogin = () => {
		uni.login({
			provider: 'weixin',
			onlyAuthorize: true, // 微信登录仅请求授权认证
			success: (loginRes) => {
				const { code } = loginRes;
				if (code) {
					btnLoading.value = true
					store.wechatLoain({code:code}).then(res => {
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						navigateBackOrHome()
					}).catch(err => {
						btnLoading.value = false
					})
				} else {
					uni.showToast({ title: '授权失败，未获取到 code', icon: 'none' });
				}
			},
			fail: (err) => {
				uni.showToast({ title: '授权已取消', icon: 'none' });
			}
		});
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
			uni.setStorageSync('webViewObj',{url:'/static/agreement/userAgreement.html',title:'用户协议'})
		}else{
			uni.setStorageSync('webViewObj',{url:'/static/agreement/privacyPolicy.html',title:'隐私政策'})
		}
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		});
	}
	//判断回退规则
	const navigateBackOrHome = (homePath = '/pages/index/index') => {
	  const pages = getCurrentPages();
	  if (pages.length > 1) {
	    // 有上一页，返回
			setTimeout(()=>{
				btnLoading.value = false
				uni.navigateBack({ delta: 1 });
			},300)
	  } else {
			setTimeout(()=>{
				btnLoading.value = false
				// 无上一页，跳首页
				uni.switchTab({
				  url: homePath,
				  animationType: 'push-in',
				  animationDuration: 300
				});
			},300)
	  }
	}
</script>

<style lang="scss" scoped>
	.page{
		width: 100%;
    height: 100vh;
		min-height: 1300rpx;
		
		.content{
			width: 100%;
      height: calc( 100% - 100rpx );
			padding: 40rpx 32rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .logo{
        width: 100%;
        .u-avatar{
          margin: auto;
        }
        .title{
          width: 100%;
          height: 72rpx;
          line-height: 72rpx;
          text-align: center;
          font-size: 64rpx;
          font-weight: bold;
          margin: 20rpx 0 40rpx;
        }
      }
			.form{
        width: 100%;
				::v-deep .u-form-item__body{
          padding: 0;
        }
				.phoneAuth{
					height: 100.67px;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					padding: 20px 0;
					box-sizing: border-box;
					.phone{
						width: 100%;
						font-size: 30px;
						text-align: center;
					}
					.tips{
						width: 100%;
						text-align: center;
						font-size: 12px;
						color: #999;
						margin-top: 4px;
					}
				}
				.WeChatAuth{
					height: 100.67px;
					display: flex;
					align-items: center;
					justify-content: center;
					.icon-weixin{
						font-size: 48px;
						color: #28C445;
					}
					.icon-shuangxiang{
						font-size: 30px;
						color: #999;
						margin: 0 40px;
					}
				}
			}
			.btns{
        width: 100%;
        box-sizing: border-box;
        margin-top: 40rpx;
				.u-button{
					height: 102rpx;
					line-height: 102rpx;
					font-size: 32rpx;
					border-radius: 16rpx;
					border: 2rpx solid #0166FE !important;
					&:nth-of-type(2){
						margin-top: 20rpx;
						color: #333 !important;
					}
				}
				::v-deep .u-icon{
					margin-top: 4rpx;
					margin-right: 10rpx;
				}
			}
      .loginType{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 60rpx;
        .iconfont{
          font-size: 70rpx;
          margin: 0 24rpx;
          &:nth-of-type(1){color: #636DF1;}
          &:nth-of-type(2){color: #28C445;}
          &:nth-of-type(3){color: #FFAE13;}
          &:nth-of-type(4){color: #47A0FC;}
        }
      }
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
				.u-checkbox{
					margin: 0;
				}
			}
			.text{
				font-size: 24rpx;
				color: #333;
			}
			.link{
				color: #249afa;
			}
		}
	}
</style>