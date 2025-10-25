<template>
	<view class="page">
		<view class="list">
			<view class="box" v-for="(item,index) in list" :key="index">
				<view class="list-time">生成时间：10分钟时间</view>
				<view class="grid" v-for="(baseListItem,baseListIndex) in  item.baseList" :key="baseListIndex">
					<view class="grid-title">{{baseListItem.title}}</view>
					<view class="img-box">
						<image class="image" :src="baseListItem.imgUrl" mode="aspectFill"></image>
					</view>
				</view>
				<view class="border" v-show="index + 1 !== list.length" ></view>
			</view>
			<up-empty v-if="!list.length" text=" " mode="data" :icon="'/static/image/data.png'" />
		</view>	
	</view>
</template>

<script setup>
	import { reactive, ref, unref, inject} from 'vue'
	import picture from "@/static/image/picture.png"
	const list = [
					{
						time:'10分钟时间',
						baseList:[
							{
								title:'参考图',
								imgUrl: picture
							},{
								title:'生成图',
								imgUrl: picture
							},
						]
					},
					{
						time:'100分钟时间',
						baseList:[
							{
								title:'参考图',
								imgUrl: picture
							},{
								title:'生成图',
								imgUrl: picture
							},
						]
					},
					{
						time:'10分钟时间',
						baseList:[
							{
								title:'参考图',
								imgUrl: picture
							},{
								title:'生成图',
								imgUrl: picture
							},
						]
					},
					{
						time:'10分钟时间',
						baseList:[
							{
								title:'参考图',
								imgUrl: picture
							},{
								title:'生成图',
								imgUrl: picture
							},
						]
					}
				]
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