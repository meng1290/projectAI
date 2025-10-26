<template>
	<view class="user">
		<view class="header">
			<view class="avatar-text" v-if="store.isLogin">
				<up-avatar :src="store.userInfo.avatar?store.userInfo.avatar:avatar" size="64" shape="circle" mode="aspectFill"></up-avatar>
				<view class="userName">{{store.userInfo.nickname}}</view>
			</view>
			<view class="avatar-text" v-else @click="handleLogin">
				<up-avatar size="64" shape="circle" mode="aspectFill"></up-avatar>
				<view class="userName">登录/注册</view>
			</view>
			<up-icon @click="handleSettings" name="setting" size="32" color="#000"></up-icon>
		</view>
		<view class="vip">
			<view class="left">
				<view class="toptext">即刻成为童创AI会员</view>
				<view class="bottomtext">开通会员享受全部权益</view>
			</view>
			<view class="right">
				<up-button type="primary" color="#0166FE" style="border-radius: 10px;" @click="handleMember">立即开通</up-button>
			</view>
		</view>
		<view class="cell-box">
			<u-cell title="我的算力" @click="handleCell(0)" :isLink="true" arrow-direction="right" value="200" color="#000"></u-cell>
			<u-cell title="我的创作" @click="handleCell(1)" :isLink="true" arrow-direction="right" color="#000"></u-cell>
			<u-cell title="我的收藏" @click="handleCell(2)" :isLink="true" arrow-direction="right" color="#000"></u-cell>
			<u-cell title="关于我们" @click="handleCell(3)" :isLink="true" arrow-direction="right" color="#000"></u-cell>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	import avatar from "@/static/image/userAvatar.png"
	
	const handleLogin = () => {
		uni.navigateTo({
			url:"/pages/login/index"
		})
	}
	const handleSettings = () => {
		uni.navigateTo({
			url:"/pages/user/settings/index"
		})
	}
	
	const handleMember = () => {
		uni.navigateTo({
			url:"/pages/user/member"
		})
	}
	const routerList = [
		{url:'/pages/user/myPoints',name:'我的算力'},
		{url:'/pages/user/myCreation',name:'我的创作'},
		{url:'/pages/user/myCollection',name:'我的收藏'},
		{url:'/pages/user/aboutUs',name:'我的收藏'},
	]
	const handleCell = (index) => {
		uni.navigateTo({
			url: routerList[index].url
		})
	}
</script>

<style lang="scss" scoped>
	.user::v-deep{
		padding: 52rpx 32rpx;
		padding-top: calc(var(--status-bar-height) + 52rpx) !important;
		box-sizing: border-box;
		.header{
			line-height: 128rpx;
			display:flex;
			justify-content: space-between;
			.avatar-text{
				flex: 1;
				width: 0;
				display: flex;
				.userName{
					font-size: 50rpx;
					font-weight: 600;
					margin-left: 30rpx;
					margin-right: 20rpx;
					white-space:nowrap;
					text-overflow:ellipsis; overflow:hidden;
				}
			}
		}
		.vip{
			height:192rpx;
			width:100%;
			background: conic-gradient(from -62.37deg at 72.89% 11.98%, #2F703E -93.46deg, #59D677 25.96deg, #2F703E 266.54deg, #59D677 385.96deg);
			border-radius: 40rpx;
			margin-top:40rpx;
			padding: 32rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.toptext{
				color:#fff;
				font-size: 40rpx;
				font-weight: 600;
				margin-bottom:10rpx;
			}
			.bottomtext{
				color:#fff;
				font-size: 32rpx;
			}
		}
		.cell-box{
			margin-top: 30rpx;
			.u-cell__body{
				padding-left:0rpx;
				padding-right:0rpx;
			}
		}
		
	}
</style>