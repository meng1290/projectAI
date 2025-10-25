
import baseUrl from './baseUrl.js'
import Loading from '@/utils/loading.js'

function baseRequest(url, method, data,{needToken=true},params) {
	let HEADER = {
		'content-type': 'application/json',
	}
	if(!uni.getStorageSync('TOKEN') && needToken){
		uni.showToast({
			icon:'none',
			title:'暂未登录，即将跳转登录页'
		})
		setTimeout(()=>{
			uni.reLaunch({
				url:'/pages/login/index'
			})
		},800)
		return Promise.reject({
			msg:'未登录'
		})
	}
	Loading.show()
	if(uni.getStorageSync('TOKEN')) HEADER['Authorization'] = uni.getStorageSync('TOKEN');
	return new Promise((reslove, reject) => {
		uni.request({
			url: baseUrl + '/' + url,
			method: method || 'POST',
			header: HEADER,
			data: data || {},
			success: (data) => {
				Loading.hide()
				let res = data.data
			  if ([200].indexOf(res.code)!=-1) {
					reslove(res.result);
				}else if (res.code == 401 || res.code == 403 ||res.code == 301 || res.code == 302){
					uni.showToast({
						icon:'none',
						title:res.message
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/index/login'
						})
					},
					1000)
					reject(res.message || '暂未登录，即将跳转登录页');
				}else if (res.code == 500){
					uni.showToast({
						icon:'none',
						title:res.message || '系统异常'
					})
					reject(res.message || '系统异常');
				} else{
					uni.showToast({
						icon:'none',
						title:res.message || '系统错误'
					})
					reject(res.message || '系统错误');
				}		
			},
			fail: (msg) => {
				Loading.hide()
        uni.showToast({
          icon:'none',
          title: '请求失败'
        })
				reject('请求失败');
			}
		})
	});
}
const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt, params) => baseRequest(api, method, data, opt || {}, params)
});

export default request;
