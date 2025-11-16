import request from './request.js'

/* 账号密码登录 */
export function passWordLogin(data) {
	return request.post("auth/login",data,{needToken:false});
}
/* ai模型列表 */
export function getModelList(data) {
	return request.get("aiproduct/list",data,{needToken:false});
}
/* 分类列表 */
export function getCategory(data) {
	return request.get("getCategory",data,{needToken:false});
}
/* 收藏列表 */
export function getCollect(data) {
	return request.get('collect/user',data)
}
/* 添加收藏 */
export function addCollect(data) {
	return request.post('collect/add',data)
}
/* 取消收藏 */
export function delCollect(data) {
	return request.post('collect/del',data)
}
/* 创建生成任务 */
export function createTask(data) {
	return request.post('aitask/create',data)
}
/* 获取执行结果 */
export function getTaskResult(data) {
	return request.get('aitask/getresult',data,{isLoading:false})
}
/* 会员权益 */
export function memberRight(data) {
	return request.get('user/member/right',data)
}
/* 会员卡 */
export function memberShip(data) {
	return request.get('user/member/ship',data)
}
/* 获取图形验证码 */
export function getCaptcha(data) {
	return request.get('getCaptcha',data,{needToken:false})
}
/* 发送短信验证码 */
export function authVerify(data) {
	return request.post('auth/verify',data,{needToken:false})
}
/* 短信登录 */
export function authSmslogin(data) {
	return request.post('auth/smslogin',data,{needToken:false})
}
/* 微信登录 */
export function authApp(data) {
	return request.post('auth/app',data,{needToken:false})
}
/* 获取支付参数 */
export function svipPay(id,data) {
	return request.post(`svip/pay/${id}`,data)
}
/* 获取用户信息 */
export function userInfo(data) {
	return request.get('user/userinfo',data)
}
/* 我的创作记录 */
export function zuopinlist(data) {
	return request.get('aitask/zuopinlist',data)
}
/* 算力明细 */
export function billList(data) {
	return request.get('user/bill/lst',data)
}
/* 更改头像昵称 */
export function changeUserInfo(data) {
	return request.post('user/change/info',data)
}
/* 手机号一键登录 */
export function authPhoneLogin(data) {
	return request.post('auth/local_phone_login',data,{needToken:false})
}
/* 苹果一键登录 */ 
export function appleLoagin(data) {
	return request.post('auth/appleLogin',data,{needToken:false})
}
/* 注销账户 */
export function userCancel(dat) {
	return request.post('user/cancel',data)
}