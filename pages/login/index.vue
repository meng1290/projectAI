<template>
	<view class="page">
		
		<view class="content">
      <view class="logo">
        <up-avatar :src="avatar" size="200"></up-avatar>
        <view class="title">你好，我是童创AI</view>
      </view>
			<view class="form">
        <up-form labelPosition="left" :model="form" :rules="rules" ref="formRef" errorType="toast">
          <view class="phoneMsg" v-if="loginType === 3">
            <up-form-item prop="account">
              <up-input type="number" v-model="form.account" placeholder="请输入手机号" clearable prefixIcon="account-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'20rpx 18rpx',background:'#F3F4F6'}"></up-input>
            </up-form-item>
            <up-form-item prop="code">
              <up-input type="number" v-model="form.code" placeholder="请输入短信验证码" prefixIcon="chat-fill" prefixIconStyle="font-size: 20px;color: #909399" :customStyle="{padding:'20rpx 18rpx',marginTop:'20rpx',background:'#F3F4F6'}">
                <template #suffix>
                  <up-code ref="uCodeRef" @change="codeChange" seconds="60" changeText="X秒重新获取" ></up-code>
                  <up-button @tap="getCode" :text="tips" type="success" size="mini" ></up-button>
                </template>
              </up-input>
            </up-form-item>
          </view>
          <view class="phonePaw" v-if="loginType === 4">
            <up-form-item prop="account">
              <up-input type="number" v-model="form.account" placeholder="请输入手机号" clearable prefixIcon="account-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'20rpx 18rpx',background:'#F3F4F6'}"></up-input>
            </up-form-item>
            <up-form-item prop="password">
              <up-input type="password" v-model="form.password" placeholder="请输入密码" prefixIcon="lock-fill" prefixIconStyle="font-size: 22px;color: #909399" :customStyle="{padding:'20rpx 18rpx',marginTop:'20rpx',background:'#F3F4F6'}"></up-input>
            </up-form-item>
          </view>
          
        </up-form>
				<view class="btns">
          <up-button type="primary" @click="login()" color="#0166FE" :customStyle="{fontSize:'32rpx !important'}">登录</up-button>
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
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
  import { passWordLogin } from '@/api/index.js'
  import { useUserStore } from '@/stores/index'
  const store = useUserStore()
	
	import avatar from '@/static/image/avatar.png';
  //切换登录类型
  const loginType = ref(4)
  const changeLoginType = (type) => {
    if(type === loginType.value)return
    if([1,2].includes(type)){
      return uni.$u.toast('暂未开通')
    }
    loginType.value = type
  }
	//获取短信验证码
	const tips = ref('');
	const uCodeRef = ref(null);
	const codeChange = (text) => {
	  tips.value = text;
	};
	const getCode = () => {
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
			console.log(val,radiovalue.value)
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
    // 登录
    const state = reactive({
      form:{
        account:'18600443402',
        code:'',
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
        code:[
          {required: true,message:'请输入验证码',trigger:['blur','change']},
          {len: 6,message:'请输入6位验证码',trigger:['blur','change']}
        ],
        password:[{required: true,message:'请输入密码',trigger:['blur','change']}]
      }
    })
    const { form, rules } = toRefs(state)
    const formRef = ref(null)
		const login = () => {
      formRef.value.validate().then(valid => {  
        if (valid) {
          store.login(form.value).then(() => {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(()=>{
              uni.navigateBack()
            },1000)
          })
        }
      })
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