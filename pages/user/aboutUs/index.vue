<template>
	<view class="page">
		<view class="img_box">
			<view class="img_center_box">
				<image :src="avatar" mode="widthFix"></image>
			</view>
		</view>
		<view class="version">
			{{name}}
		</view>
		<view class="versionNum">
			版本：{{version}}
		</view>
		<view class="body">
			<view class="detail_box">
				<view class="detail_item">
					<view class="">
						检查更新
					</view>
					<view class="">
						已是最新版本
					</view>
				</view>
				<view class="detail_item" @click="toUpdateDetails()">
					<view class="">
						更新内容
					</view>
					<up-icon name="arrow-right" color="#909399" size="28rpx"></up-icon>
				</view>
				<view class="detail_item" @click="toAgreement(1)">
					<view class="">
						协议
					</view>
					<up-icon name="arrow-right" color="#909399" size="28rpx"></up-icon>
				</view>
				<view class="detail_item"  @click="toAgreement(0)">
					<view class="">
						隐私政策
					</view>
					<up-icon name="arrow-right" color="#909399" size="28rpx"></up-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, onMounted, toRefs, unref, inject} from 'vue'
	// #ifdef APP-HARMONY
	import { myApiSync1 } from '@/uni_modules/mark-battery'
	import { getAppVersionSync } from '@/uni_modules/get-app-version'
	// #endif
	import avatar from '@/static/image/avatar.png';
	import config from "@/config/index.js"
	const name = config.appName
	const version = ref('0.0.0')
	
	onMounted(() => {
		getAppVersionInfo()
	  
	});
	const getAppVersionInfo = () => {
		// #ifdef APP-PLUS
		if (typeof plus !== 'undefined') {
		  version.value = plus.runtime.version;
		}
		// #endif
		// #ifdef APP-HARMONY
		const msg = 'Hello Harmony!';
		const result = myApiSync1(msg);
		console.log(result); // 输出: Hello Harmony!
		const versionInfo = getAppVersionSync()
		console.log('应用版本号:', versionInfo)
		version.value = versionInfo.versionCode
		 // #endif
	}
	const toAgreement = (type) => {
		if(type === 1){
			uni.setStorageSync('webViewObj',{url:config.userAgreement,title:'用户协议'})
		}else{
			uni.setStorageSync('webViewObj',{url:config.privacyPolicy,title:'隐私政策'})
		}
		uni.navigateTo({
			url: `/pages/common/webview/index`,
		});
	}
	const toUpdateDetails = () => {
		uni.navigateTo({
			url:'/pages/user/aboutUs/updateDetails'
		})
	}
</script>

<style lang="scss" scoped>
	.page{
		.img_box{
			.img_center_box{
				padding-top: 140rpx;
				width: 160rpx;
				height: 160rpx;
				margin: 0 auto 10rpx;
				image{
					width: 160rpx;
					border-radius: 16rpx;
				}
			}
		}
		.version{
			text-align: center;
		}
		.versionNum{
			text-align: center;
			color: #bbb;
		}
		.body{
			padding-top: 30rpx;
			.detail_box{
				padding: 0 20rpx;
				margin: 30rpx;
				background-color: #FFFFFF;
				border-radius: 12rpx;
				font-size: 28rpx;
				.detail_item:last-child{
					// border-bottom: 0;
				}
				.detail_item{
					padding: 26rpx 0;
					display: flex;
					justify-content: space-between;
					border-bottom: 2rpx solid rgb(214, 215, 217);
				}
			}
		}
	}
</style>