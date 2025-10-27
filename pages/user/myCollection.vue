<template>
	<view class="page">
		<view class="list">
			<myProductCard :dataList="dataList" :isCollectNum="false"></myProductCard>
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
			<up-loadmore line :status="loadStatus" />
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { getCollect } from "@/api/index.js"
	import myProductCard from "@/components/myProductCard/index.vue"
	
	const state = reactive({
	  dataList: [],
	  queryParams:{
	    page: 1,
	    limit: 10,
	    store_name:'',
	    cid:'',
	  },
	  loadStatus: 'loading',//loadmore/ loading / nomore
	})
	const { dataList, queryParams, loadStatus } = toRefs(state)
	
	onLoad(() => {
		getDataLit()
	})
	onPullDownRefresh(() => {
		uni.stopPullDownRefresh()
	  resetList()
	})
	onReachBottom(() => {
	  getDataLit()
	})
	const getDataLit = () => {
		getCollect(queryParams.value).then(res => {
			if(res.records.length > 0){
				res.records.map(item => {
					item.userCollect = true
					item.id = item.product.id
				})
			  dataList.value = [...dataList.value,...res.records]
			  queryParams.value.page++
			  loadStatus.value = 'loadmore'
			}else{
			  loadStatus.value = 'nomore'
			}
			uni.stopPullDownRefresh()
		}).catch(err => {
			loadStatus.value = 'nomore'
		})
	}
	
	/* 重置列表 */
	const resetList = () => {
	  dataList.value = []
	  queryParams.value.page = 1
	  loadStatus.value = 'loading'
	  getList()
	}
</script>

<style lang="scss" scoped>
	.page{
		padding: 32rpx 32rpx;
		box-sizing: border-box;
		.list{
			width:100%;
			padding: 0 12rpx;
			box-sizing: border-box;
			padding-bottom: 20px;
		}
	}
</style>