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
						<up-button type="primary" @click="checkVersion" color="#0166FE" text="检查新版本" size="mini"></up-button>
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
		
		<!-- #ifdef APP-HARMONY -->
			<upgradePopupVue ref="upgradePopup" />
		<!-- #endif -->
	</view>
</template>

<script setup>
	import { reactive, ref, onMounted, toRefs, unref, inject} from 'vue'
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	// #ifdef APP-HARMONY
	// import { myApiSync1 } from '@/uni_modules/mark-battery'
	// import { getAppVersionSync } from '@/uni_modules/get-app-version'
	import upgradePopupVue from '@/uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue';
	// #endif
	import avatar from '@/static/image/avatar.png';
	import config from "@/config/index.js"
	const name = config.appName
	const version = ref('0.0.0')
	const upgradePopup = ref(null)
	
	onMounted(() => {
		getAppVersionInfo()
	});
	const getAppVersionInfo = () => {
		version.value = config.version
		// #ifdef APP-PLUS
		// if (typeof plus !== 'undefined') {
		//   version.value = plus.runtime.version;
		// }
		// #endif
		// #ifdef APP-HARMONY
		// const msg = 'Hello Harmony!';
		// const result = myApiSync1(msg);
		// console.log(result); // 输出: Hello Harmony!
		// const versionInfo = getAppVersionSync()
		// console.log('应用版本号:', versionInfo)
		// version.value = versionInfo.versionCode
		 // #endif
	}
	const checkVersion = () => {
		// #ifdef APP-PLUS
		checkUpdate().then((res) => {
			console.log('res: ', res);
			toastFun(res.code)
		}).catch((e) => {
			console.log('e: ', e);
			toastFun(-10001)
		});
		// #endif
		// #ifdef APP-HARMONY
		checkUpdate(upgradePopup.value).then((res) => {
			console.log('res: ', res);
			toastFun(res.code)
		}).catch((e) => {
			console.log('e: ', e);
			toastFun(-10001)
		});
		// #endif
	}
	const toastFun = (code) => {
		if(code === 0){
			uni.showToast({
				title: '已经是最新版本，无需更新',
				icon: 'none'
			});
		}else if(code === -101){
			uni.showToast({
				title: '暂无更新',
				icon: 'none'
			});
		}else if(code === -10001){
			uni.showToast({
				title: '暂无更新!',
				icon: 'none'
			});
		}
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
		min-height: 100vh;
		background-color: #f4f6fa;
		padding: 80rpx 40rpx 40rpx;
		box-sizing: border-box;
		.img_box{
			text-align: center;

			.img_center_box{
				padding-top: 0;
				width: 176rpx;
				height: 176rpx;
				margin: 0 auto 16rpx;

				image{
					width: 176rpx;
					height: 176rpx;
					border-radius: 32rpx;
					box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
				}
			}
		}

		.version{
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-top: 8rpx;
		}
		.versionNum{
			text-align: center;
			color: #999;
			font-size: 26rpx;
			margin-top: 6rpx;
		}
		.body{
			padding-top: 40rpx;

			.detail_box{
				padding: 0 24rpx;
				margin: 0;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
				font-size: 28rpx;

				.detail_item{
					padding: 26rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #f0f0f0;

					&:last-child{
						border-bottom: 0;
					}
				}
			}
		}
	}
</style>