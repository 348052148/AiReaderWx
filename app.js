//app.js
const api = require('./utils/api.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: api.wechat.login(res.code),
          success: res => {
            var openid = res.data.openid
            if (res.statusCode == 404) {
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  console.log(res)
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: result => {
                        // 可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = result.userInfo

                        console.log(this.globalData.userInfo)

                        //注册
                        wx.request({
                          url: api.wechat.register(),
                          method: 'POST',
                          data: {
                            openid: openid,
                            data: result.userInfo
                          },
                          success: (res) => {

                          }
                        })

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  } else {
                    // console.log("授权")
                    // wx.authorize({
                    //   scope: 'scope.address',
                    //   success: () => {
                    //       console.log("AUTH01")

                    //   }
                    // })
                    //跳转授权
                    wx.navigateTo({
                      url: '/pages/auth/auth?openid=' + openid,
                    })
                  }
                }
              })
            }
            else {
              //登陆成功
              this.globalData.userInfo = res.data.data
            }
          }
        })
      }
    })
    
  },

  globalData: {
    userInfo: null
  }
})