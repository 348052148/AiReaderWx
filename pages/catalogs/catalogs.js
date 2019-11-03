// pages/catalogs/catalogs.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientWidth: "",
    clientHeight: "",
    winHeight: "",//窗口高度
    book_id: '',
    title:'',
    author:'',
    chapterList:[]
  },

  //获取书的章节
  getBookChapters: function (book_id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: api.book.bookChapters(book_id),
      success: res => {
        wx.hideLoading();
        this.setData({
          chapterList: res.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      book_id: options.book_id,
      title:options.title,
      author:options.author,
    });

    //获取系统高度
    wx.getSystemInfo({
      success: (res) => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        this.setData({
          clientHeight: clientHeight,
          clientWidth: clientWidth,
          winHeight: calc
        })
      }
    });
    
    this.getBookChapters(options.book_id);
    
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