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