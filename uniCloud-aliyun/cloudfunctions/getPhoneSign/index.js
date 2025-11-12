
const crypto = require('crypto')
// 云函数入口函数
exports.main = async (event) => {
  const { access_token, openid } = event // 接收前端传递的参数
  
  // 1. 生成签名（核心逻辑）
  const secret = 'your-secret-string' // 安全存储在云函数中，不要暴露
  const params = { access_token, openid }
	
	
	const hmac = crypto.createHmac('sha256', secret);
	 
	
	// 字母顺序排序后拼接签名串
	const signStr = Object.keys(params).sort().map(key => {
		return `${key}=${params[key]}`
	}).join('&')
	hmac.update(signStr);
	//获取sign值
	const sign = hmac.digest('hex')
	console.log('sign',sign)
	
	const url = `access_token=${access_token}&openid=${openid}&sign=${sign}`
  
	return {url}
}