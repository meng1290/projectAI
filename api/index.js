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
	return request.get('aitask/getresult',data)
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