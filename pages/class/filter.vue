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
				<up-button type="primary" @click="handleReset" color="#FF9500" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">重置</up-button>
				<up-button type="primary" @click="handleSearch" color="#0166FE" shape="circle" :customStyle="{height:'96rpx',fontSize:'32rpx',flex:'1'}">开始搜索</up-button>
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
      console.log(res)
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
	.page{
		font-size: 30rpx;
		color: #1f2937;
		min-height: 100vh;
		background: #f5f7fb;

		.content{
			padding-bottom: 200rpx;

			.list{
				padding: 24rpx;
				box-sizing: border-box;

				.type{
					width: 100%;
					padding: 26rpx 24rpx;
					box-sizing: border-box;
					border-radius: 24rpx;
					background: #fff;
					box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.08);
					margin-bottom: 24rpx;

					.type_l{
						font-weight: 600;
						margin-bottom: 14rpx;
						color: #0f172a;
					}

					.type_r{
						display: flex;
						flex-wrap: wrap;
						gap: 12rpx;

						.li{
							padding: 12rpx 22rpx;
							border-radius: 999rpx;
							background: #f5f6fb;
							color: #4b5563;
							border: 2rpx solid transparent;
							transition: all .2s ease;

							&.active{
								color: #0f70ff;
								background: rgba(15, 112, 255, 0.08);
								border-color: #0f70ff;
								font-weight: 600;
							}
						}
					}
				}
			}

			.btns{
				width: 100%;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				padding: 24rpx 32rpx 36rpx;
				display: flex;
				gap: 32rpx;
				box-sizing: border-box;
				background: #fff;
				box-shadow: 0 -8rpx 30rpx rgba(15, 23, 42, 0.12);
			}
		}
	}
</style>