import request from './request.js'

/* 账号密码登录 */
export function passWordLogin (data){
	return request.post("auth/login",data,{needToken:false});
}
/* ai模型列表 */
export function getModelList (data){
	return request.get("aiproduct/list",data,{needToken:false});
}
/* 分类列表 */
export function getCategory (data){
	return request.get("getCategory",data,{needToken:false});
}