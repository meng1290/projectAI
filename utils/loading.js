

class Loading {
  constructor(){
	  this.requestCount = 0
  }
	show(text = "加载中") {
		uni.showLoading({ title: text });
		// 显示loading效果的逻辑
		this.requestCount++;
	}
	hide() {
		this.requestCount--;
		if (this.requestCount <= 0) {
			this.requestCount = 0;
			uni.hideLoading()
			// 隐藏loading效果的逻辑
		}
	}
}
export default new Loading();