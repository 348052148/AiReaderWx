// pages/list/list.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      clientHeight:0,
      clientWidth:0,
      winHeight:0,
      scrollTop: 0,
      bookList:[],
      //当前搜索页
      page: 1,

      //分页
      pageload: false,
      isLoad:false,

      STATIC_HOST: api.assetHost
  },

  loadmore: function () {
    if (this.data.pageload == false) {
      this.setData({
        pageload: true,
        isLoad:true,
      })
      
      //接口搜索
      wx.request({
        url: api.book.bookMixedSearch('hot', this.data.page),
        success: res => {
          if (res.data.list.length > 0) {
            let books = this.data.bookList;
            for (let i = 0; i < res.data.list.length; i++) {
              books.push(res.data.list[i])
            }
            this.setData({
              bookList: books,
              page: this.data.page + 1,
              pageload: false,
              isLoad:false,
            }); 

          } else {
            this.setData({
              isLoad: false,
            });
            //到底了
          }
        }

      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置系统信息
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
    
    //加载中
    this.setData({
      isLoad:true,
    })

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
          pageload: false,
          isLoad:false,
        });
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