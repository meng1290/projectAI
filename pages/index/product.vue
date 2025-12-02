<template>
	<view class="page">
		<view class="content">
      <view class="card">
        <view class="media">
          <up-image class="image" width="100%" :src="productDetail.image" mode="widthFix">
            <template #loading><up-loading-icon></up-loading-icon></template>
            <template #error>
              <view class="image-error">加载失败</view>
            </template>
          </up-image>
        </view>
        <view class="info" v-if="productDetail.store_name">
          <view class="store_name">{{productDetail.store_name}}</view>
          <view class="store_info" v-if="productDetail.store_info">{{ productDetail.store_info }}</view>
          <view class="store_tags">
            <view class="store_tag" v-for="(tag, index) in productDetail.cate_id" :key="index">
              <text class="store_tag_text">{{ utils.formatListLabel(store.categoryList,tag,'name','code') }}</text>
            </view>
          </view>
          <view class="sub_title" v-if="productDetail.desc">{{ productDetail.desc }}</view>
          <view class="price-row">
            <text class="price-label">消耗算力</text>
            <text class="price-value">{{ productDetail.price }}</text>
          </view>
        </view>
      </view>
		</view>
		<view class="btns">
			<up-button type="primary" @click="handleCreation(productDetail)" color="#0166FE" :customStyle="{width: '100%',height:'96rpx',fontSize:'32rpx'}">做同款</up-button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, toRefs, unref, inject} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { aiproductDetail } from "@/api/index.js"
	import { useUserStore } from '@/stores/index'
	const store = useUserStore()
	import utils from '@/utils/index.js'
	const productDetail = ref({})
	const id = ref(null)
	onLoad((query) => {
		id.value = query.id
		getAiproductDetail()
	})
	const getAiproductDetail = () => {
		aiproductDetail(id.value).then(res => {
			productDetail.value = res || {}
		})
	}
	const handleCreation = (item) => {
		store.setProductDetailParams(item)
		uni.navigateTo({
			url:`/pages/creation/creation`
		})
	}
</script>

<style lang="scss" scoped>
	.page{
		min-height: 100vh;
		padding-bottom: 180rpx; // 预留底部按钮空间
		box-sizing: border-box;
		position: relative;
		.content{
			width: 100%;
      padding: 24rpx 24rpx 0;
      box-sizing: border-box;

      .card {
        background-color: #fff;
        border-radius: 24rpx;
        overflow: hidden;
        box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.08);
      }

      .media {
        background-color: #f3f4f6;
      }

      .image {
        display: block;
        width: 100%;
        height: auto;
        margin: 0 auto;
      }

      .image-error {
        padding: 40rpx 0;
        text-align: center;
        font-size: 26rpx;
        color: #999;
      }

      .info{
        padding: 32rpx;
        box-sizing: border-box;
      }

      .store_name{
        font-size: 34rpx;
        font-weight: 600;
        color: #111827;
        line-height: 1.4;
      }

      .store_info{
        margin-top: 12rpx;
        font-size: 26rpx;
        color: #4b5563;
        line-height: 1.5;
      }

      .store_tags{
        margin-top: 20rpx;
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx 12rpx;
      }

      .store_tag{
        padding: 6rpx 18rpx;
        border-radius: 999rpx;
        background: #eff6ff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .store_tag_text{
        font-size: 22rpx;
        color: #1d4ed8;
      }

      .sub_title{
        margin-top: 8rpx;
        font-size: 26rpx;
        color: #6b7280;
        line-height: 1.5;
      }

      .price-row{
        margin-top: 32rpx;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }

      .price-label{
        font-size: 26rpx;
        color: #6b7280;
      }

      .price-value{
        font-size: 34rpx;
        font-weight: 600;
        color: #0166FE;
      }
		}
		.btns{
			background-color: #fff;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			padding: 32rpx;
			box-sizing: border-box;
      box-shadow: 0 -4rpx 20rpx rgba(15, 23, 42, 0.06);
		}
	}
</style>