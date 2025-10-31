<template>
	<view class="page">
		<view class="list">
			<myProductCard :dataList="dataList"></myProductCard>
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
		  <up-loadmore line :status="loadStatus" />
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { getModelList } from '@/api/index.js'
	import myProductCard from "@/components/myProductCard/index.vue"
	
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	
	const state = reactive({
	  dataList: [],
	  queryParams:{
	    page: 1,
	    limit: 10,
	    cid:'',
	  },
	  loadStatus: 'loading',//loadmore/ loading / nomore
	})
	const { dataList, queryParams, loadStatus } = toRefs(state)
	
	onLoad(() => {
		const filterPageParams = store.filterPageParams;
		if(filterPageParams && filterPageParams.value){
			queryParams.value.cid = filterPageParams.value.filter(item => item || (item === 0 && item !== '')).join(',')
		}
	  getList()
	})
	onPullDownRefresh(() => {
	  console.log('下拉刷新')
	  uni.stopPullDownRefresh()
	  resetList()
	})
	onReachBottom(() => {
	  console.log('滚动触底')
	  getList()
	})
	/* 分页加载列表 */
	const getList = () => {
	  loadStatus.value = 'loading'
	  getModelList(queryParams.value).then(res => {
	    if(res.records.length > 0){
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
		padding: 20rpx 32rpx;
		.list{
			box-sizing: border-box;
			margin-bottom: 20px;
		}
	}
</style>