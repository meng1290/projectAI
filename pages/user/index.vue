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
				<up-button type="primary" color="#0166FE" style="border-radius: 10px;" @click="handleMember">立即开通</up-button>
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
			url:"/pages/user/member"
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
	.user::v-deep{
		padding: 48rpx 32rpx 80rpx;
		padding-top: calc(var(--status-bar-height) + 48rpx) !important;
		box-sizing: border-box;
		min-height: 100vh;
		background: #f6f8fc;

		.header{
			display:flex;
			justify-content: space-between;
			align-items: center;

			.avatar-text{
				flex: 1;
				width: 0;
				display: flex;
				align-items: center;

				.userName{
					font-size: 46rpx;
					font-weight: 600;
					margin-left: 24rpx;
					margin-right: 20rpx;
					white-space:nowrap;
					text-overflow:ellipsis; overflow:hidden;
					color: #0f172a;
				}
			}

			.u-icon{
				background: #fff;
				border-radius: 50%;
				padding: 16rpx;
				box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.12);
			}
		}

		.vip{
			width:100%;
			margin-top:36rpx;
			padding: 32rpx 36rpx;
			box-sizing: border-box;
			border-radius: 36rpx;
			background: radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 55%), linear-gradient(120deg, #20c997, #11998e);
			box-shadow: 0 20rpx 40rpx rgba(17, 153, 142, 0.35);
			display: flex;
			justify-content: space-between;
			align-items: center;
			color:#fff;

			.left{
				display: flex;
				flex-direction: column;
				row-gap: 12rpx;
			}

			.toptext{
				font-size: 38rpx;
				font-weight: 700;
			}

			.bottomtext{
				font-size: 28rpx;
				opacity: 0.9;
			}

			.right{
				.up-button{
					border-radius: 999rpx !important;
					padding: 0 28rpx;
				}
			}
		}

		.cell-box{
			margin-top: 40rpx;
			background: #fff;
			border-radius: 28rpx;
			box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);

			.u-cell__body{
				padding-left:24rpx;
				padding-right:24rpx;
				min-height: 110rpx;
			}

			.u-cell__title-text{
				font-size: 30rpx;
				color: #111827;
			}

			.u-cell__value{
				font-size: 30rpx;
				font-weight: 600;
				color: #0f70ff;
			}
		}
		
	}
</style>