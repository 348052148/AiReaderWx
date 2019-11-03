// pages/user/user.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},
      isLogin:false,
  },

  login: function(e)
  {
    console.log(e.detail.userInfo)
    let openid = wx.getStorageSync("openid");
    let userInfo = e.detail.userInfo;
    //注册
    wx.request({
      url: api.wechat.register(),
      method: 'POST',
      data: {
        openid: openid,
        data: userInfo
      },
      success: (res) => {
        //设置用户信息
        wx.setStorageSync('loginInfo', res.data);
        this.setData({
          userInfo: res.data,
          isLogin: true,
        });
      }
    })
  },

  callPhone: function()
  {
    wx.makePhoneCall({
      phoneNumber: '18003771800' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('loginInfo') || false
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLogin: true,
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})