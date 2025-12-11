// 支付提供商类型
const ProviderType = {
  IAP: 'iap'
}

// 订单交易状态
const IapTransactionState = {
  purchasing: "0", // 交易处理中
  purchased: "1", // 交易成功
  failed: "2", // 交易失败
  restored: "3", // 交易恢复（已购买过）
  deferred: "4" // 交易等待中（如家长控制）
};

class Iap {
  _channel = null;
  _channelError = null;
  _productIds = [];
  _ready = false;

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

  // 获取产品列表（从苹果服务器）
  getProduct(productIds) {
		console.log(1)
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }
      console.log(2,JSON.stringify(this._productIds))
      this._channel.requestProduct(productIds || this._productIds, (res) => {
				console.log(3)
        resolve(res);
      }, (err) => {
				console.log(4)
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
      
      uni.requestPayment({
        provider: 'appleiap',
        orderInfo: orderInfo,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  // 恢复已完成的交易（检测未关闭订单）
  restoreCompletedTransactions({ username = "" }) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }
      
      this._channel.restoreCompletedTransactions({
        manualFinishTransaction: true,
        username
      }, (res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  // 完成交易（验证成功后调用）
  finishTransaction(transaction) {
    return new Promise((resolve, reject) => {
      if (!this._channel) {
        reject(new Error('支付通道未初始化'));
        return;
      }
      
      this._channel.finishTransaction(transaction, (res) => {
        resolve(res);
      }, (err) => {
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

  // 只读属性：是否准备就绪
  get ready() {
    return this._ready;
  }

  // 只读属性：支付通道
  get channel() {
    return this._channel;
  }
}

export {
  Iap,
  IapTransactionState,
  ProviderType
};