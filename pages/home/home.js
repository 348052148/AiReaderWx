// pages/home/home.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    STATIC_HOST: api.assetHost,
    bannarInfo: {
      list: [
        'https://sta-op.douyucdn.cn/nggsys/2019/10/16/e5e1d8fdac31df37f638d678903410be.jpg',
        'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=1200',
        'https://images.unsplash.com/photo-1551446591-142875a901a1?w=1200'
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    //热门
    hotBookList:[],
    //推荐
    recommendBookList: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中..',
    })
 
    //聚合数据
    wx.request({
      url: api.home.homeBooks(),
      success: res => {
        this.setData({
          hotBookList: res.data.hot,
          recommendBookList: res.data.recommend,
          bannarInfo: {
            list: res.data.bannars
          },
        });
        wx.hideLoading();
      }
    })
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

  },

  hitInput: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  }
})