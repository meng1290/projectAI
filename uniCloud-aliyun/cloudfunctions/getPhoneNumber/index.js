// 云函数验证签名，此示例中以接受GET请求为例作演示
const crypto = require('crypto')
exports.main = async(event) => {

  const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
  const hmac = crypto.createHmac('sha256', secret);

  let params = event.queryStringParameters
  const sign = params.sign
  delete params.sign
  const signStr = Object.keys(params).sort().map(key => {
    return `${key}=${params[key]}`
  }).join('&')

  hmac.update(signStr);

  if(sign!==hmac.digest('hex')){
    throw new Error('非法访问')
  }

  const {
    access_token,
    openid
  } = params
  const res = await uniCloud.getPhoneNumber({
  	provider: 'univerify',
    appid: '__UNI__8F2F210', // DCloud appid，不同于callFunction方式调用，使用云函数Url化需要传递DCloud appid参数
  	access_token: access_token,
  	openid: openid
  })
  // 返回手机号给自己服务器
  return res
}
