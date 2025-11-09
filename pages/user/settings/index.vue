<template>
	<view class="page">
		<view class="cell-box">
			<u-cell title="头像" :isLink="true" arrow-direction="right" color="#000">
				<template #value>
					<!-- <up-cropper
						ref="avatarCropperRef"
						:canChangeSize="false"
						areaWidth="300rpx" 
						areaHeight="300rpx" 
						exportWidth="260rpx" 
						exportHeight="260rpx"
						@confirm="onAvatarConfirm"
					> -->
						<view class="avatar-wrapper">
							<up-avatar :src="store.userInfo.avatar?store.userInfo.avatar:'/static/image/userAvatar.png'" size="60rpx"></up-avatar>
						</view>
					<!-- </up-cropper> -->
				</template>
			</u-cell>
			<u-cell title="用户名称" @click="handleCell(1)" :isLink="true" arrow-direction="right" :value="store.userInfo.nickname" color="#000"></u-cell>
			<u-cell title="登录手机号" @click="handleCell(2)" :isLink="true"  color="#000" arrow-direction="right">
				<template #value>
					<view v-if="store.userInfo.phone">
						<text style="color: #666;">{{store.userInfo.phone}}</text>
					</view>
					<view v-else style="display: flex;">
						<text style="margin-right: 20rpx;color: #666;" >未绑定</text>
					</view>
				</template>
			</u-cell>
			<!-- <u-cell title="邀请码" :isLink="true" color="#000" rightIcon="">
				<template #value>
					<view style="display: flex;">
						<text style="margin-right: 20rpx;color: #666;" >1234567</text>
						<up-button type="primary" :plain="true" size="mini" @click="utils.copy(12345)" text="复制"></up-button>
					</view>
				</template>
			</u-cell> -->
		</view>
		
		<view class="btns">
			<up-button type="primary" @click="logOut" color="#aaa"  text="退出登录"></up-button>
			<view class="logOff" ><text @click="logOff">注销账户</text></view>
		</view>
		
		
		<up-modal :show="showModal" title="提示" content='您确认要退出登录吗？' showCancelButton @confirm="logOut" @cancel="showModal = false" contentTextAlign="center"></up-modal>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import utils from "@/utils/index.js"
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const showModal = ref(false)
	
	const avatarImage = ref('');
	const avatarCropperRef = ref(null);
	
	const onAvatarConfirm = (rsp) => {
	  avatarImage.value = rsp.path;
		console.log(avatarImage.value)
	};
	
	const logOut = () => {
		uni.showModal({
			title:'退出登录',
			content:'您确认要退出登录吗？',
			success(res) {
				if(res.confirm){
					store.logout().then(res => {
						uni.reLaunch({
							url:'/pages/index/index'
						})
					})
				}
			}
		})
	}
	const logOff = () => {
		uni.showModal({
			title:'注销账户',
			content:'您在该平台所有的信息将被清空且无法恢复，请确认是否注销。',
			success(res) {
				if(res.confirm){
					store.logout().then(res => {
						uni.reLaunch({
							url:'/pages/index/index'
						})
					})
				}
			}
		})
	}
	
	const routerList = [
		{url:'/pages/user/settings/modifyAvatar',name:'头像'},
		{url:'/pages/user/settings/modifyName',name:'用户名称'},
		{url:'/pages/user/settings/modifyPhone',name:'登录手机号'},
	]
	const handleCell = (index) => {
		uni.navigateTo({
			url: routerList[index].url
		})
	}
	
	
</script>

<style lang="scss" scoped>
	.page{
		padding: 32rpx;
		box-sizing: border-box;
		position: relative;
		.btns{
			width: 100%;
			margin-top: 100rpx;
			.logOff{
				width: 100%;
				text-align: center;
				color: #999;
				font-size: 28rpx;
				margin: 30rpx auto 0;
			}
		}
	}
</style>