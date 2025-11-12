<template>
	<view class="page">
		<view class="detail_box">
			<view class="detail_item between_flex borderBottom">
				<view class="">
					用户名称
				</view>
				<input type="text" focus v-model="username" placeholder="请输入新用户名称" pattern="^\S*$" @input="handleInput"  placeholder-class="placeholder">
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
	import { changeUserInfo } from "@/api/index.js"
	
	const username = ref('')
	onLoad(() => {
	  username.value = store.userInfo.nickname
	})
	const handleInput = (e) => {
		username.value = e.detail.value.replace(/\s+/g, '');
	}
	const btnClick = () => {
		if(!username.value || !username.value.trim()){
			return uni.showToast({
				title: '请输入昵称',
				icon: 'none'
			});
		}
		
		changeUserInfo({nickname:username.value}).then(res=>{
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
			.detail_item{
				padding: 26rpx;
				display: flex;
				justify-content: space-between;
			}
		}
		input{
			text-align: end;
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