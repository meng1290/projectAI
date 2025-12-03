<template>
	<view class="page">
<view class="content">
			<view class="list">
				<view class="type" v-for="(item,i) in dataList" :key="i">
					<view class="type_l">{{item.name}}：</view>
					<view class="type_r">
						<view
              class="li"
              :class="{'active':selsectVal[i] === li.code}"
              v-for="(li,j) in item.children"
              :key="j"
              @click="handleSelect(i,li)"
            >
							{{li.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="btns">
				<view class="btn-container">
					<up-button 
						type="primary" 
						@click="handleReset" 
						color="#FF9500" 
						:customStyle="{
							height:'96rpx',
							fontSize:'32rpx',
							flex:'1',
							borderRadius: '48rpx',
							fontWeight: '500',
							boxShadow: '0 8rpx 24rpx rgba(255, 149, 0, 0.3)'
						}"
					>
						重置
					</up-button>
					<up-button 
						type="primary" 
						@click="handleSearch" 
						color="#0166FE" 
						:customStyle="{
							height:'96rpx',
							fontSize:'32rpx',
							flex:'1',
							borderRadius: '48rpx',
							fontWeight: '500',
							boxShadow: '0 8rpx 24rpx rgba(1, 102, 254, 0.3)'
						}"
					>
						开始搜索
					</up-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
  import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
  import { getCategory } from '@/api/index.js'
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()

  const state = reactive({
    dataList: [],
    selsectVal: [],
		selsectName:[],
  })
  const { dataList, selsectVal, selsectName } = toRefs(state)

  onLoad(() => {
    getCategoryList()
  })

  /* 获取分类列表 */
  const getCategoryList = () => {
    getCategory().then(res => {
      dataList.value = res
			store.setCategoryList(res)
    })
  }
	
	onNavigationBarButtonTap(() => {
		console.log('点击了右侧')
	})
	const handleSelect = (i,item) => {
		selsectVal.value[i] = item.code
		selsectName.value[i] = item.name
    console.log(item)
	}
	const handleSearch = () => {
		if(!selsectVal.value.length){
			return uni.$u.toast('请选择类型');
		}
		store.setFilterPageParams({value:selsectVal.value,name:selsectName})
		uni.navigateTo({
			url:'/pages/class/filterList'
		})
	}
	const handleReset = () => {
		selsectVal.value = []
	}
</script>

<style lang="scss" scoped>
	.page {
		font-size: 30rpx;
		color: #1f2937;
		min-height: 100vh;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);

		.content {
			padding-bottom: 240rpx;

			.list {
				padding: 32rpx 24rpx;
				box-sizing: border-box;

				.type {
					width: 100%;
					padding: 32rpx 28rpx;
					box-sizing: border-box;
					border-radius: 24rpx;
					background: #fff;
					box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
					margin-bottom: 24rpx;
					transition: all 0.3s ease;
					border: 1rpx solid rgba(0, 0, 0, 0.04);
					
					&:last-child {
						margin-bottom: 0;
					}

					.type_l {
						font-weight: 600;
						font-size: 30rpx;
						margin-bottom: 20rpx;
						color: #111827;
						line-height: 1.4;
					}

					.type_r {
						display: flex;
						flex-wrap: wrap;
						gap: 16rpx;

						.li {
							padding: 14rpx 24rpx;
							border-radius: 999rpx;
							background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
							color: #4b5563;
							border: 2rpx solid transparent;
							transition: all 0.3s ease;
							font-size: 28rpx;
							font-weight: 400;
							cursor: pointer;
							
							&:active {
								transform: scale(0.95);
							}

							&.active {
								color: #0166FE;
								background: linear-gradient(135deg, rgba(1, 102, 254, 0.1) 0%, rgba(1, 102, 254, 0.08) 100%);
								border-color: #0166FE;
								font-weight: 600;
								box-shadow: 0 4rpx 12rpx rgba(1, 102, 254, 0.15);
							}
						}
					}
				}
			}

			.btns {
				width: 100%;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				padding: 24rpx 32rpx;
				padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
				box-sizing: border-box;
				background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
				backdrop-filter: blur(20rpx);
				box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
				z-index: 100;
				
				.btn-container {
					width: 100%;
					max-width: 750rpx;
					margin: 0 auto;
					display: flex;
					gap: 24rpx;
				}
			}
		}
	}
</style>