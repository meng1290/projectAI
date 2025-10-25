<template>
	<view class="page">
		<view class="content">
			<view class="list">
				<view class="type" v-for="(item,i) in dataList" :key="i">
					<view class="type_l">{{item.name}}：</view>
					<view class="type_r">
						<view class="li" :class="{'active':selsectVal[i] === li.code}" v-for="(li,j) in item.children" :key="j" @click="handleSelect(i,li)">{{li.name}}</view>
					</view>
				</view>
			</view>
			<view class="btns">
				<up-button type="primary" @click="handleReset" color="#FF9500" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">重置</up-button>
				<up-button type="primary" color="#0166FE" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">开始搜索</up-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
  import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
  import { getCategory } from '@/api/index.js'

  const state = reactive({
    dataList: [],
    selsectVal: []
  })
  const { dataList, selsectVal } = toRefs(state)

  onLoad(() => {
    getCategoryList()
  })

  /* 获取分类列表 */
  const getCategoryList = () => {
    getCategory().then(res => {
      dataList.value = res
      console.log(res)
    })
  }
	
	onNavigationBarButtonTap(() => {
		console.log('点击了右侧')
	})
	const handleSelect = (i,item) => {
		selsectVal.value[i] = item.code
    console.log(selsectVal.value)
	}
	const handleReset = () => {
		selsectVal.value = []
	}
</script>

<style lang="scss" scoped>
	.page{
		font-size: 32rpx;
		color: #333;
		.content{
			.list{
				padding: 32rpx;
				box-sizing: border-box;
				.type{
					width: 100%;
					display: flex;
					justify-content: flex-start;
					margin-bottom: 60rpx;
					.type_l{
						margin-right: 10rpx;
					}
					.type_r{
						flex: 1;
						display: flex;
						flex-wrap: wrap;
						.li{
							margin-bottom: 10rpx;
							margin-right: 28rpx;
						}
						.active{
							color: #0166FE;
						}
					}
				}
			}
			.btns{
				width: 100%;
				padding: 100rpx 32rpx 80rpx;
				box-sizing: border-box;
				display: flex;
				.u-button:nth-child(odd) {
					margin-right: 40rpx;
				}
			}
		}
	}
</style>