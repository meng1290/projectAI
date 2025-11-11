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
		formatAmount(num) {
		  // 处理非数字情况
		  if (num === null || num === undefined || isNaN(Number(num))) {
		    return '0.00';
		  }
		  // 转换为数字并保留两位小数，再格式化补零
		  return Number(num).toFixed(2);
		},
		//将 Blob URL 转换为 File 对象
		async blobUrlToFile(blobUrl, filename = 'image.png', options = {}) {
			try {
				// 验证输入
				if (!blobUrl || !blobUrl.startsWith('blob:')) {
					throw new Error('无效的 Blob URL 格式');
				}

				// 1. 通过 fetch 获取 Blob 数据
				const response = await fetch(blobUrl);
				if (!response.ok) {
					throw new Error(`获取 Blob 数据失败: ${response.status}`);
				}

				// 2. 转换为 Blob
				const blob = await response.blob();
				console.log('Blob 信息:', {
					size: blob.size,
					type: blob.type
				});

				if (blob.size === 0) {
					throw new Error('Blob 数据为空');
				}

				// 3. 创建 File 对象
				const file = new File([blob], filename, {
					type: options.type || blob.type,
					lastModified: Date.now()
				});
				return file;

			} catch (error) {
				console.error('Blob URL 转 File 失败:', error);
				throw error;
			}
		},
		async blobUrlToFormData(blobUrl, fieldName = 'file', filename = 'image.png') {
		  const file = await this.blobUrlToFile(blobUrl, filename);
		  const formData = new FormData();
		  formData.append(fieldName, file);
		  return formData;
		}
	}
