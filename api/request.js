
import config from '@/config/index.js'
import Loading from '@/utils/loading.js'
import { pinia } from '@/main.js'

const getToken = async () => {
  // 在这里动态导入 useUserStore
  const userModule = await import('@/stores/index')
  const userStore = userModule.useUserStore(pinia)
  return userStore.token
  // return ""
}


async function baseRequest(url, method, data,opt = {needToken:true,isLoading:true}) {
	const { needToken = true, isLoading = true } = opt;
	let HEADER = {
		'content-type': 'application/json',
	}
	const token = await getToken()
	if(!token && needToken){
		uni.showToast({
			icon:'none',
			title:'暂未登录，即将跳转登录页'
		})
		setTimeout(()=>{
			uni.navigateTo({
				url:'/pages/login/index'
			})
		},800)
		return Promise.reject({
			msg:'未登录'
		})
	}
	isLoading?Loading.show():null
	if(token) HEADER['X-Token'] = token;
	return new Promise((reslove, reject) => {
		uni.request({
			url: config.baseUrl + '/' + url,
			method: method || 'POST',
			header: HEADER,
			data: data || {},
			success: (data) => {
				isLoading?Loading.hide():null
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
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});

export default request;
