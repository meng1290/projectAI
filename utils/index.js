	export default {
		/* 复制 */
		copy: function(value,text='复制成功') {
			if(typeof(value)!='string'){
				value = value.toString()
			}
			uni.setClipboardData({
				data:value,
				success() {
					uni.showToast({
						icon:'none',
						title:text,
					})
				}
			})
		},
		//时间格式转换
		formatDay(nowDate) {
		  if(!nowDate){
		    return '无'
		  }else{
		    if(typeof(nowDate)=='string'){
		      nowDate = Number(nowDate)
		    }
		    const DateTime = new Date(nowDate)
		    const year = DateTime.getFullYear().toString() //年
		    const month = (DateTime.getMonth() + 1).toString() //月
		    const date = DateTime.getDate().toString() //日
		    return `${year}-${month.padStart(2, 0)}-${date.padStart(2, 0)}`
		  }
		},
	}
