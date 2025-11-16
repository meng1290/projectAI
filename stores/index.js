import { defineStore } from 'pinia'
import { passWordLogin, authSmslogin, authApp, userInfo, authPhoneLogin, appleLoagin, userCancel  } from '@/api/index.js'

// 定义 Store，第一个参数是 Store 的唯一标识
export const useUserStore = defineStore('user', {
  // 状态（类似 Vuex 的 state）
  state: () => ({
    token: '',
    userInfo:{},
		filterPageParams:null,//搜索页面跳转传递参数
  }),

  // 计算属性（类似 Vuex 的 getters）
  getters: {
    isLogin: (state) => !!state.token
  },

  // 方法（类似 Vuex 的 mutations + actions，Pinia 中可直接写异步逻辑）
  actions: {
    // 手机号密码登录
    login(data) {
			return new Promise((resolve,reject) => {
				passWordLogin(data).then(res => {
				  this.token = res.token || ''
				  this.userInfo = res.user || {}
				  resolve(true)
				}).catch(err => {
					reject(false)
				})
			})
    },
		//微信登录
		wechatLogin(data){
			return new Promise((resolve,reject) => {
				authApp(data).then(res => {
				  this.token = res.token || ''
				  this.userInfo = res.user || {}
				  resolve(true)
				}).catch(err => {
					reject(false)
				})
			})
		},
		//短信登录
		smsLogin(data) {
			return new Promise((resolve,reject) => {
				authSmslogin(data).then(res => {
				  this.token = res.token || ''
				  this.userInfo = res.user || {}
				  resolve(true)
				}).catch(err => {
					reject(false)
				})
			})
		},
		//手机号授权登录
		phoneAuthLogin(data) {
			console.log(1234,data)
			return new Promise((resolve,reject) => {
				authPhoneLogin(data).then(res => {
					console.log(res,123)
					this.token = res.token || ''
					this.userInfo = res.user || {}
					resolve(true)
				}).catch(err => {
					console.log(12345,err)
					reject(false)
				})
			})
		},
		//苹果授权登录
		appleAuthLogin(data) {
			console.log('data',data)
			return new Promise((resolve,reject) => {
				appleLoagin(data).then(res => {
					this.token = res.token || ''
					this.userInfo = res.user || {}
					resolve(true)
				}).catch(err => {
					console.log(12345,err)
					reject(false)
				})
			})
		},
		//苹果授权清除
		appleAuthLogout() {
			// #ifdef IOS
			if(typeof plus === 'undefined')return
			plus.oauth.getServices((services) => {
				const appleService = services.find((item) => item.id === 'apple');
				if (!appleService) {
					console.log('未找到苹果授权服务')
					return;
				}
				// 调用退出登录（清除本地授权状态）
				appleService.logout(() => {
					console.log('苹果登录退出成功');
				},(error) => {
					console.log(`苹果登录退出失败：${error.message}`);
				});
			},(error) => {
				console.log(`获取授权服务失败：${error.message}`);
			});
			// #endif
		},
    // 退出登录
    logout() {
			return new Promise((resolve,reject) => {
				setTimeout(()=>{
					this.token = ''
					this.userInfo = {}
					this.appleAuthLogout()
					resolve(true)
				},100)
      })
    },
		// 注销登录
		userLogOff() {
			return new Promise((resolve,reject) => {
				userCancel().then(res => {
					this.token = ''
					this.userInfo = {}
					this.appleAuthLogout()
					resolve(true)
				}).catch(err => {
					reject(false)
				})
		  })
		},
		//获取用户信息
		getUserInfo() {
			return new Promise((resolve,reject) => {
				userInfo().then(res => {
					const userInfo = {
						...this.userInfo,
						...res
					}
					this.userInfo = userInfo
					resolve(true)
				}).catch(err => {
					reject(false)
				})
			})
		},
		//搜索页面存储参数
		setFilterPageParams(params) {
			this.filterPageParams = params;
		}
  },
	persist: {
		key: 'my-pinia-state', // 自定义存储的 key
		paths: ['token', 'userInfo'], // 只持久化 token 和 userInfo
		storage: { // 自定义存储方式（如 UniApp 的存储 API）
			setItem: (key, value) => uni.setStorageSync(key, value),
			getItem: (key) => uni.getStorageSync(key),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	}
})