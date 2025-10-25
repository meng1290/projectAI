<template>
	<view class="page">
		<view class="cell-box">
			<u-cell title="头像" @click="handleCell(0)" :isLink="true" arrow-direction="right" color="#000">
				<template #value>
					<up-avatar :src="'/static/image/userAvatar.png'" size="30" shape="circle" mode="aspectFill"></up-avatar>
				</template>
			</u-cell>
			<u-cell title="用户名称" @click="handleCell(1)" :isLink="true" arrow-direction="right" value="用户名称" color="#000"></u-cell>
		</view>
		
		<up-button type="primary" @click="showModal = true" color="#aaa"  text="退出登录"></up-button>
		
		<up-modal :show="showModal" title="提示" content='您确认要退出登录吗？' showCancelButton @confirm="logOut" @cancel="showModal = false" contentTextAlign="center"></up-modal>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	const showModal = ref(false)
	const logOut = () => {
		showModal.value = false
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
		.u-button{
			margin-top: 800rpx;
		}
	}
</style>