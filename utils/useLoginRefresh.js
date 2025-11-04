// hooks/useLoginRefresh.js
import { watch } from 'vue';
import { useUserStore } from '@/stores/index.js';

/**
 * 自定义 Hook：监听登录状态变化，自动执行回调
 * @param {Function} callback 登录状态变为已登录时的回调（如重新加载数据）
 */
export const useLoginRefresh = (callback) => {
  const userStore = useUserStore();
  watch(
    () => userStore.isLogin,
    (newVal, oldVal) => {
      if (newVal && !oldVal) {
        callback(); // 执行页面的刷新逻辑
      }
    }
  );
};