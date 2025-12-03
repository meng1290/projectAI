<template>
	<view class="page">
		<view class="content">
      <view class="card">
        <view class="media">
          <up-image class="image" width="100%" :src="productDetail.image" mode="widthFix">
            <template #loading>
              <view class="loading-wrapper">
                <up-loading-icon></up-loading-icon>
              </view>
            </template>
            <template #error>
              <view class="image-error">
                <view class="error-icon">⚠️</view>
                <view class="error-text">加载失败</view>
              </view>
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
			<view class="btn-container">
				<up-button 
					type="primary" 
					@click="handleCreation(productDetail)" 
					color="#0166FE" 
					:customStyle="{
						width: '100%',
						height:'96rpx',
						fontSize:'32rpx',
						borderRadius: '48rpx',
						fontWeight: '500',
						boxShadow: '0 8rpx 24rpx rgba(1, 102, 254, 0.3)'
					}"
				>
					做同款
				</up-button>
			</view>
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
	.page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		box-sizing: border-box;
		position: relative;
		background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
		
		.content {
			width: 100%;
			padding: 32rpx 24rpx;
			box-sizing: border-box;

			.card {
				background-color: #fff;
				border-radius: 24rpx;
				overflow: hidden;
				box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
				transition: all 0.3s ease;
			}

			.media {
				background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
				overflow: hidden;
			}

			.image {
				display: block;
				width: 100%;
				height: auto;
				margin: 0 auto;
				
				:deep(img) {
					border-radius: 24rpx 24rpx 0 0;
				}
			}

			.loading-wrapper {
				display: flex;
				align-items: center;
				justify-content: center;
				min-height: 400rpx;
				background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
			}

			.image-error {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 80rpx 40rpx;
				background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
				
				.error-icon {
					font-size: 64rpx;
					margin-bottom: 16rpx;
					opacity: 0.7;
				}
				
				.error-text {
					font-size: 28rpx;
					color: #909399;
					font-weight: 400;
				}
			}

			.info {
				padding: 32rpx;
				box-sizing: border-box;
			}

			.store_name {
				font-size: 34rpx;
				font-weight: 600;
				color: #111827;
				line-height: 1.4;
			}

			.store_info {
				margin-top: 12rpx;
				font-size: 26rpx;
				color: #4b5563;
				line-height: 1.5;
			}

			.store_tags {
				margin-top: 20rpx;
				display: flex;
				flex-wrap: wrap;
				gap: 12rpx 12rpx;
			}

			.store_tag {
				padding: 6rpx 18rpx;
				border-radius: 999rpx;
				background: #eff6ff;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				transition: all 0.2s ease;
				
				&:active {
					transform: scale(0.95);
					background: #dbeafe;
				}
			}

			.store_tag_text {
				font-size: 22rpx;
				color: #1d4ed8;
				font-weight: 500;
			}

			.sub_title {
				margin-top: 16rpx;
				font-size: 26rpx;
				color: #6b7280;
				line-height: 1.6;
			}

			.price-row {
				margin-top: 32rpx;
				padding-top: 24rpx;
				border-top: 1rpx solid #f3f4f6;
				display: flex;
				align-items: baseline;
				justify-content: space-between;
			}

			.price-label {
				font-size: 28rpx;
				color: #6b7280;
				font-weight: 400;
			}

			.price-value {
				font-size: 36rpx;
				font-weight: 600;
				color: #0166FE;
			}
		}
		
		.btns {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 24rpx 32rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
			box-sizing: border-box;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, #ffffff 100%);
			backdrop-filter: blur(20rpx);
			box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
			z-index: 100;
			
			.btn-container {
				width: 100%;
				max-width: 750rpx;
				margin: 0 auto;
			}
		}
	}
</style>