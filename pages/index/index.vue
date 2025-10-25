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
			<up-swiper :list="bannerList" height="380rpx" radius="0"></up-swiper>
			<up-button type="primary" color="#FF9500">开始学习</up-button>
		</view>
		<view class="list">
			<view class="ul">
				<view class="li" v-for="(item,i) in dataList" :key="i" @click="handleDetail(item)">
					<view class="img-box">
						<up-image class="image" width="100%" height="100%" :src="item.image" mode="aspectFill">
              <template #loading><up-loading-icon></up-loading-icon></template>
							<template #error>
								<view style="font-size: 28rpx;">加载失败</view>
							</template>
            </up-image>
					</view>
					<view class="btns">
						<view class="collect">
							<view>
								<up-icon :name="item.collectIcon?'star-fill':'star'" :color="item.collectIcon?'rgb(255, 149, 0)':'#000'"></up-icon>
							</view>
							<view class="collectNum">{{item.collectNum}}</view>
						</view>
						<view class="btn">
							<up-button type="primary" color="#0166FE" shape="circle">画同款</up-button>
						</view>
					</view>
				</view>
			</view>
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

	import banner from '@/static/image/banner.png';
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight

  const state = reactive({
    list: [],
    bannerList: [
      {url: banner},
      {url: banner},
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
      })
    }
    /* 重置列表 */
    const resetList = () => {
      dataList.value = []
      queryParams.value.page = 1
      loadStatus.value = 'loading'
      getList()
    }
    
		const handleDetail = (item) =>{
			uni.navigateTo({
				url:"/pages/index/product"
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
			padding-bottom: 20px;
			.ul{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				// gap: 30rpx 20rpx;
				.li{
					width: calc((100% - 20rpx) / 2);
					margin-bottom: 30rpx;
					&:nth-child(odd) {
						margin-right: 20rpx;
					}
					.img-box{
						width: 100%;
						height: 580rpx;
						background-color: rgb(243, 244, 246);
						border-radius: 16rpx;
						overflow: hidden;
						.image{
							width: 100%;
							height: 100%;
						}
					}
					.btns{
						width: 100%;
						height: 72rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 20rpx;
						.collect{
							flex: 1;
							display: flex;
							align-items: center;
							width: 0;
							::v-deep .u-icon__icon{
								font-size: 48rpx !important;
							}
							.collectNum{
								font-size: 32rpx;
								margin-left: 10rpx;
								white-space:nowrap;
								text-overflow:ellipsis; overflow:hidden;
							}
						}
						.btn{
							flex: 1;
							padding: 0;
						}
					}
				}
			}
		}
	}
	
</style>
