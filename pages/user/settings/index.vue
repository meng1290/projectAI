<template>
	<view class="page">
		<view class="cell-box">
			<u-cell title="头像" @click="handleCell(0)" :isLink="true" arrow-direction="right" color="#000">
				<template #value>
					<up-avatar :src="store.userInfo.avatar?store.userInfo.avatar:'/static/image/userAvatar.png'" size="30" shape="circle" mode="aspectFill"></up-avatar>
				</template>
			</u-cell>
			<u-cell title="用户名称" @click="handleCell(1)" :isLink="true" arrow-direction="right" :value="store.userInfo.nickname" color="#000"></u-cell>
			<u-cell title="登录手机号" :isLink="true" :value="store.userInfo.phone" color="#000" rightIcon=""></u-cell>
			<u-cell title="邀请码" :isLink="true" color="#000" rightIcon="">
				<template #value>
					<view style="display: flex;">
						<text style="margin-right: 20rpx;" >99</text>
						<up-button type="primary" :plain="true" size="mini" text="复制"></up-button>
					</view>
				</template>
			</u-cell>
		</view>
		
		<up-button type="primary" @click="showModal = true" color="#aaa"  text="退出登录"></up-button>
		
		<up-modal :show="showModal" title="提示" content='您确认要退出登录吗？' showCancelButton @confirm="logOut" @cancel="showModal = false" contentTextAlign="center"></up-modal>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const showModal = ref(false)
	const logOut = () => {
		store.logout().then(res => {
			showModal.value = false
		})
	}
	
	// uni.showModal({
	// 	title:'注销账户',
	// 	content:'您在该平台所有的信息将被清空且无法恢复，请确认是否注销。',
	// 	success(res) {
	// 		if(res.confirm){
	// 			that.surelogOff()
	// 		}
	// 	}
	// })
</script>

<style lang="scss" scoped>
	.page{
		padding: 32rpx;
		box-sizing: border-box;
		position: relative;
		&>.u-button{
			width: 100%;
			margin-top: 100rpx;
		}
	}
</style>