import { defineStore } from 'pinia'
import { passWordLogin, authSmslogin } from '@/api/index.js'

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
    // 登录方法
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
    // 退出登录
    logout() {
			return new Promise((resolve,reject) => {
				setTimeout(()=>{
					this.token = ''
					this.userInfo = {}
					resolve(true)
				},100)
      })
    },
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