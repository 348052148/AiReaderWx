// pages/list/list.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      winHeight:0,
      scrollTop: 0,
      bookList:[],
      //当前搜索页
      page: 1,

      //分页
      pageload: false,
  },

  loadmore: function () {
    if (this.data.pageload == false) {
      this.setData({
        pageload: true,
      })
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      console.log("load more")
      //接口搜索
      wx.request({
        url: api.book.bookMixedSearch('hot', this.data.page),
        success: res => {
          let books = this.data.bookList;
          for (let i = 0; i < res.data.list.length; i++) {
            books.push(res.data.list[i])
          }
          this.setData({
            bookList: books,
            page: this.data.page + 1,
            pageload: false
          });

          wx.hideLoading();
        }

      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取设置窗口高度
    wx.getSystemInfo({
      success: (res) => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 140;
        this.setData({
          winHeight: calc
        });
      }
    });

    wx.request({
      url: api.book.bookMixedSearch('hot', this.data.page),
      success: res => {
        let books = this.data.bookList;
        for (let i = 0; i < res.data.list.length; i++) {
          books.push(res.data.list[i])
        }
        this.setData({
          bookList: books,
          page: this.data.page + 1,
          pageload: false
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

  }
})