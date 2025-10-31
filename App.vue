<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-plus/index.scss";
	@import "@/static/iconfont/iconfont.css"; 
	/*每个页面公共css */
	page{
		background-color: #fff;
		// 状态栏背景层
		.status-bar-bg {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			z-index: 99;
		}
		.u-image__image{
			display: block;
		}
	}
</style>
