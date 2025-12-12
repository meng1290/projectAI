// 支付提供商类型
const ProviderType = {
  IAP: 'iap'
}

// 订单交易状态
const IapTransactionState = {
  purchasing: "0",
  purchased: "1",
  failed: "2",
  restored: "3",
  deferred: "4"
};

class Iap {
  _channel = null;
  _channelError = null;
  _productIds = [];
  _ready = false;
  _products = [];

  constructor({ products }) {
    this._productIds = products;
  }

  // 初始化支付通道
  init() {
    return new Promise((resolve, reject) => {
      this.getChannels((channel) => {
        this._ready = true;
        resolve(channel);
      }, (err) => {
        reject(err);
      });
    });
  }

  // 获取产品列表
  getProduct(productIds) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }

      const ids = productIds || this._productIds;

      // 检查商品ID是否为空
      if (!ids || ids.length === 0) {
        reject(new Error('商品ID列表为空，请检查配置'));
        return;
      }

      this._channel.requestProduct(ids, (res) => {
        this._products = res;
        resolve(res || []);
      }, (err) => {
        console.error('IAP: 商品获取失败', err);
        reject(err);
      });
    });
  }

  // 发起支付请求
  requestPayment(orderInfo) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }

      uni.showLoading({
        title: '处理中...',
        mask: true
      });

      uni.requestPayment({
        provider: 'appleiap',
        orderInfo: orderInfo,
        success: (res) => {
          uni.hideLoading();
          console.log('IAP: 支付成功', res);
          resolve(res);
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('IAP: 支付失败', err);
          
          if (err.errCode === -2 || err.errMsg?.includes('cancel')) {
            uni.showToast({
              title: '已取消支付',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: `支付失败: ${err.errMsg || '未知错误'}`,
              icon: 'none'
            });
          }
          
          reject(err);
        }
      });
    });
  }

  // 恢复购买
  restoreCompletedTransactions({ username = "" }) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }

      uni.showLoading({
        title: '恢复购买中...',
        mask: true
      });

      this._channel.restoreCompletedTransactions({
        manualFinishTransaction: true,
        username
      }, (res) => {
        uni.hideLoading();
        console.log('IAP: 恢复成功', res);
        
        // 移除这里的toast，让调用方决定如何提示用户
        // 因为可能没有可恢复的购买，这是正常情况
        
        resolve(res || []);
      }, (err) => {
        uni.hideLoading();
        console.error('IAP: 恢复失败', err);
        
        // 提供更友好的错误信息
        let errorMsg = '恢复购买失败';
        if (err.errMsg) {
          if (err.errMsg.includes('cancel')) {
            errorMsg = '已取消恢复购买';
          } else {
            errorMsg = err.errMsg;
          }
        }
        
        reject(new Error(errorMsg));
      });
    });
  }

  // 完成交易
  finishTransaction(transaction) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }
      
      if (!transaction) {
        reject(new Error('交易信息无效'));
        return;
      }
      
      this._channel.finishTransaction(transaction, (res) => {
        console.log('IAP: 交易完成', res);
        resolve(res);
      }, (err) => {
        console.error('IAP: 完成交易失败', err);
        reject(err);
      });
    });
  }

  // 获取支付通道
  getChannels(success, fail) {
    if (this._channel !== null) {
      success(this._channel);
      return;
    }

    if (this._channelError !== null) {
      fail(this._channelError);
      return;
    }

    uni.getProvider({
      service: 'payment',
      success: (res) => {
        this._channel = res.providers.find((channel) => {
          return channel.id === 'appleiap';
        });

        if (this._channel) {
          success(this._channel);
        } else {
          this._channelError = {
            errMsg: 'paymentContext:fail iap service not found'
          };
          fail(this._channelError);
        }
      },
      fail: (err) => {
        this._channelError = err;
        fail(err);
      }
    });
  }

  // 只读属性
  get ready() {
    return this._ready;
  }

  get channel() {
    return this._channel;
  }

  get products() {
    return this._products;
  }
}

export {
  Iap,
  IapTransactionState,
  ProviderType
};