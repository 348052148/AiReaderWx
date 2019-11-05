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
    recommendBookList: [],
    //列表
    scrollTop: 0,
    bookList: [],
    //当前搜索页
    page: 1,
    //分页
    pageload: false,
    isLoad: false,

    clientHeight: 0,
    clientWidth: 0,
    winHeight: 0,
    STATIC_HOST: api.assetHost,
  },

  loadmore: function () {
    if (this.data.pageload == false) {
      this.setData({
        pageload: true,
        isLoad: true,
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
              isLoad: false,
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
    wx.showLoading({
      title: '加载中..',
    })

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
          isLoad: false,
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

  },

  hitInput: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  }
})