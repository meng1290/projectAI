<template>
	<view class="page">
		<view class="status-bar-bg" :style="{ height: statusBarHeight + 'px' }"></view>
		<up-sticky :offset-top="statusBarHeight" customNavHeight="0" bgColor="#fff">
			<view class="sticky">
				<up-search placeholder="请输入搜索关键词" v-model="queryParams.store_name" :clearabled="true" :showAction="false" @search="resetList()" @clear="resetList()"></up-search>
        <div class="tabs">
          <up-tabs :list="list" @change="handleTabsChange" :itemStyle="{height:'92rpx'}"></up-tabs>
        </div>
			</view>
		</up-sticky>
		
		<view class="swiper">
			<up-swiper :list="bannerList" height="380rpx" radius="0" :autoplay="false"></up-swiper>
			<up-button type="primary" color="#FF9500">开始学习</up-button>
		</view>
		<view class="list">
			<myProductCard :dataList="dataList"></myProductCard>
			<!-- 暂无数据 -->
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
			<!-- 分页加载提示 -->
			<up-loadmore line :status="loadStatus" />
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { getModelList, getCategory } from '@/api/index.js'
	import { useLoginRefresh } from '@/utils/useLoginRefresh.js';
	import myProductCard from "@/components/myProductCard/index.vue"

	import banner from '@/static/image/banner.png';
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight

  const state = reactive({
    list: [],
    bannerList: [
      {url: banner},
    ],
    dataList: [],
    queryParams:{
      page: 1,
      limit: 10,
      store_name:'',
      cid:'',
    },
    loadStatus: 'loading',//loadmore/ loading / nomore
  })
	const { list, bannerList, dataList, queryParams, loadStatus } = toRefs(state)
		
		//
		onLoad(() => {
      getCategoryList()
      getList()
    })
		//下拉刷新
		onPullDownRefresh(() => {
			uni.stopPullDownRefresh()
      resetList()
		})
		//滚动触底
		onReachBottom(() => {
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
				let len = res.records.length
        if(len > 0){
          dataList.value = [...dataList.value,...res.records]
          queryParams.value.page++
          if(len < queryParams.value.limit){
          	loadStatus.value = 'nomore'
          }else{
          	loadStatus.value = 'loadmore'
          }
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
		//监听到登录状态变化触发
		useLoginRefresh(resetList)
</script>

<style lang="scss" scoped>
	.page{
		padding-top: var(--status-bar-height) !important;
		.sticky{
			padding: 30rpx 32rpx 0;
			box-sizing: border-box;
      .tabs{
        height: 92rpx;
      }
		}
		::v-deep .u-tabs__wrapper__nav__line{
			bottom: 12rpx !important;
		}
		.swiper{
			margin: 0 32rpx;
			box-sizing: border-box;
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
			padding: 0rpx 32rpx 32rpx;
			box-sizing: border-box;
		}
	}
	
</style>
