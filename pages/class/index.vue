<template>
	<view class="page">
		<view class="status-bar-bg" :style="{ height: statusBarHeight + 'px' }"></view>
		<up-sticky :offset-top="statusBarHeight" customNavHeight="0" bgColor="#fff">
			<view class="sticky">
				<up-search placeholder="请输入搜索关键词" :disabled="true" @click="handleSearch" :inputStyle="{'pointer-events': 'none !important'}" :showAction="false" ></up-search>
        <div class="tabs">
          <up-tabs :list="list"  @change="handleTabsChange" :itemStyle="{height:'92rpx'}"></up-tabs>
        </div>
			</view>
		</up-sticky>
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
  import { getModelList, getCategory } from '@/api/index.js'
	import myProductCard from "@/components/myProductCard/index.vue"

	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight

  const state = reactive({
    list: [],
    dataList: [],
    queryParams:{
      page: 1,
      limit: 10,
      store_name:'',
      cid:'',
    },
    loadStatus: 'loading',//loadmore/ loading / nomore
  })
  const { list, dataList, queryParams, loadStatus } = toRefs(state)

  onLoad(() => {
    getCategoryList()
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

  /* 获取分类列表 */
  const getCategoryList = () => {
    getCategory().then(res => {
      let typeList = []
      res.map(item => {
        if(item.name === '类别'){
          typeList = item.children
        }
      })
      typeList.unshift({name:'全部',code:''})
      list.value = typeList
    })
  }
  /* 切换分类 */
  const handleTabsChange = (e) => {
    console.log(e)
    queryParams.value.cid = e.code
    resetList()
  }
  /* 分页加载列表 */
  const getList = () => {
    loadStatus.value = 'loading'
    getModelList(queryParams.value).then(res => {
      console.log(res)
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

	const handleSearch = () => {
    console.log('123')
    uni.navigateTo({
      url:'/pages/class/filter'
    })
  }
</script>

<style lang="scss" scoped>
	.page{
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		padding-top: var(--status-bar-height) !important;
		.sticky{
			padding-top: 30rpx;
      .tabs{
        height: 92rpx;
      }
		}
		::v-deep .u-tabs__wrapper__nav__line{
			bottom: 12rpx !important;
		}
		.swiper{
			position: relative;
			border-radius: 24rpx;
			overflow: hidden;
			margin-bottom: 30rpx;
			::v-deep .u-button {
				width: 188rpx;
				height: 88rpx;
				padding: 0;
				font-size: 32rpx;
			  position: absolute;
			  right: 32rpx;
			  bottom: 16rpx;
			  border-radius: 18rpx;
			}
		}
		.list{
			width:100%;
			padding: 0 12rpx;
			box-sizing: border-box;
			margin-bottom: 20px;
		}
	}
	
</style>
