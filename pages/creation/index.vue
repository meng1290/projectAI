<template>
	<view class="page">
		<view class="list">
			<view class="box" v-for="(item,index) in dataList" :key="index">
				<view class="list-time">生成时间：{{item.create_time}}</view>
				<view class="grid" v-for="(baseListItem,baseListIndex) in  item.baseList" :key="baseListIndex">
					<view class="grid-title">{{baseListItem.title}}</view>
					<view class="img-box">
						<image class="image" :src="baseListItem.imgUrl" mode="aspectFill"></image>
					</view>
				</view>
				<view class="border" v-show="index + 1 !== dataList.length" ></view>
			</view>
			<up-empty v-if="!dataList.length" text=" " mode="data" :icon="'/static/image/data.png'" />
		</view>	
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import picture from "@/static/image/banner.png"
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { zuopinlist } from '@/api/index.js'
	import { useLoginRefresh } from '@/utils/useLoginRefresh.js';
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
		/* 分页加载列表 */
		const getList = () => {
		  loadStatus.value = 'loading'
		  zuopinlist(queryParams.value).then(res => {
				let len = res.records.length
		    if(len > 0){
		      dataList.value = [...dataList.value,...res.records]
					dataList.value = dataList.value.map(item =>({
						...item,
						baseList:[
							{
								title:'参考图',
								imgUrl: item.submitimgs
							},{
								title:'生成图',
								imgUrl: item.images?item.images[0]:''
							}
						]
					}))
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
		padding: 0 32rpx;
		box-sizing: border-box;
		.list{
			.box{
				padding: 20rpx 0;
				box-sizing: border-box;
				.list-time{
					font-size: 28rpx;
					color: #000;
					padding: 10rpx 0 40rpx;
					box-sizing: border-box;
				}
				.grid{
					display:inline-block;
					width:calc((100% - 80rpx) / 2);
					padding: 0 20rpx;
					text-align: center;
					.grid-title{
						font-size: 28rpx;
						padding: 10rpx 0;
						box-sizing: border-box;
					}
					.img-box{
						width: 100%;
						height: 580rpx;
						.image{
							width:100%;
							height: 100%;
						}
					}
				}
				.border{
					border-top: 2rpx solid #000;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>