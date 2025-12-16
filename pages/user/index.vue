<template>
	<view class="user">
		<view class="header">
			<view class="avatar-text" v-if="store.isLogin">
				<up-avatar :src="store.userInfo.avatar?store.userInfo.avatar:''" size="64" shape="circle" mode="aspectFill"></up-avatar>
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
				<up-button 
					type="primary" 
					color="#0166FE" 
					@click="handleMember"
					:customStyle="{
						borderRadius: '48rpx',
						padding: '0 32rpx',
						height: '64rpx',
						fontSize: '28rpx',
						fontWeight: '500',
						boxShadow: '0 6rpx 20rpx rgba(1, 102, 254, 0.3)'
					}"
				>
					立即开通
				</up-button>
			</view>
		</view>
		<view class="cell-box">
			<u-cell title="我的算力" @click="handleCell(0)" :isLink="true" arrow-direction="right" color="#000">
				<template #value>
					{{store.userInfo.now_money}}
				</template>
			</u-cell>
			<!-- <u-cell title="我的创作" @click="handleCell(1)" :isLink="true" arrow-direction="right" color="#000"></u-cell> -->
			<u-cell title="我的收藏" @click="handleCell(2)" :isLink="true" arrow-direction="right" color="#000"></u-cell>
			<u-cell title="关于我们" @click="handleCell(3)" :isLink="true" arrow-direction="right" color="#000" :border="false"></u-cell>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	onShow(() => {
		if(store.isLogin){
			store.getUserInfo()
		}
	})
	
	const handleLogin = () => {
		uni.navigateTo({
			url:"/pages/login/index"
		})
	}
	const handleSettings = () => {
		if(!store.isLogin){
			return uni.navigateTo({
				url:"/pages/login/index"
			})
		}
		uni.navigateTo({
			url:"/pages/user/settings/index"
		})
	}
	
	const handleMember = () => {
		if(!store.isLogin){
			return uni.navigateTo({
				url:"/pages/login/index"
			})
		}
		uni.navigateTo({
			url:"/pages/user/member",
		})
	}
	const routerList = [
		{url:'/pages/user/myPoints',name:'我的算力',isLogin:true},
		{url:'/pages/user/myCreation',name:'我的创作',isLogin:true},
		{url:'/pages/user/myCollection',name:'我的收藏',isLogin:true},
		{url:'/pages/user/aboutUs/index',name:'关于我们',isLogin:false},
	]
	const handleCell = (index) => {
		if(routerList[index].isLogin && !store.isLogin){
			return uni.navigateTo({
				url:"/pages/login/index"
			})
		}
		uni.navigateTo({
			url: routerList[index].url
		})
	}
</script>

<style lang="scss" scoped>
	.user::v-deep {
		padding: 48rpx 32rpx 80rpx;
		padding-top: calc(var(--status-bar-height) + 48rpx) !important;
		box-sizing: border-box;
		min-height: 100vh;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.avatar-text {
				flex: 1;
				width: 0;
				display: flex;
				align-items: center;
				transition: opacity 0.3s ease;
				
				&:active {
					opacity: 0.7;
				}

				.userName {
					font-size: 46rpx;
					font-weight: 600;
					margin-left: 24rpx;
					margin-right: 20rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					color: #111827;
					line-height: 1.4;
				}
			}

			.u-icon {
				background: #fff;
				border-radius: 50%;
				padding: 16rpx;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
				transition: all 0.3s ease;
				
				&:active {
					transform: scale(0.95);
					box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
				}
			}
		}

		.vip {
			width: 100%;
			margin-top: 40rpx;
			padding: 40rpx 36rpx;
			box-sizing: border-box;
			border-radius: 32rpx;
			background: linear-gradient(135deg, #0166FE 0%, #2f7df6 50%, #145ff3 100%);
			box-shadow: 0 12rpx 40rpx rgba(1, 102, 254, 0.25);
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			position: relative;
			overflow: hidden;
			transition: all 0.3s ease;
			
			&::before {
				content: '';
				position: absolute;
				top: -50%;
				right: -20%;
				width: 200%;
				height: 200%;
				background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
				pointer-events: none;
			}
			
			&:active {
				transform: scale(0.98);
			}

			.left {
				display: flex;
				flex-direction: column;
				row-gap: 12rpx;
				position: relative;
				z-index: 1;
				flex: 1;
			}

			.toptext {
				font-size: 38rpx;
				font-weight: 700;
				line-height: 1.3;
			}

			.bottomtext {
				font-size: 28rpx;
				opacity: 0.95;
				line-height: 1.4;
			}

			.right {
				position: relative;
				z-index: 1;
				flex-shrink: 0;
			}
		}

		.cell-box {
			margin-top: 40rpx;
			background: #fff;
			border-radius: 24rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
			overflow: hidden;
			border: 1rpx solid rgba(0, 0, 0, 0.04);

			.u-cell__body {
				padding-left: 28rpx;
				padding-right: 28rpx;
				min-height: 110rpx;
				transition: background-color 0.2s ease;
			}
			
			.u-cell {
				&:active .u-cell__body {
					background-color: #f9fafb;
				}
			}

			.u-cell__title-text {
				font-size: 30rpx;
				color: #111827;
				font-weight: 500;
			}

			.u-cell__value {
				font-size: 30rpx;
				font-weight: 600;
				color: #0166FE;
			}
		}
	}
</style>