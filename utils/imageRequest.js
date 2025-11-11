import config from '@/config/index.js'

/**
 * 上传图片文件（支持 FormData）
 * @param {FormData} formData - FormData 对象
 * @returns {Promise} 上传结果
 */
export function uploadImageFile(formData, blobUrl) {
  return new Promise((resolve, reject) => {
		// 获取额外的表单数据
		const extraFormData = {}
		for (const [key, value] of formData.entries()) {
			if (key !== 'file') {
				extraFormData[key] = value
			}
		}
    // 使用 uni.uploadFile 替代 request.post
    uni.uploadFile({
      url: config.baseUrl + '/upload/image/file', // 拼接完整URL
      filePath: blobUrl, // 获取文件
      name: 'file', // 后端接收的文件字段名
      formData: extraFormData,
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (e) {
            resolve(res.data)
          }
        } else {
          reject(new Error(`上传失败: ${res.statusCode}`))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}