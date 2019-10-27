//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');
Page({
  data: {
    //用户信息
    userInfo: {},
    //书架信息
    bookShelfData: [],
    //是否有更新
    hasUpdate: [],
    //是否编辑
    isEdit: false,
    STATIC_HOST:api.assetHost,
  },

  //开启编辑模式
  edit: function () {
    this.setData({
      isEdit: !this.data.isEdit
    });
  },

  //删除书架书籍
  delete: function (e) {
    let i = e.target.dataset.id;
    this.data.bookShelfData.splice(i,1);
    wx.getStorage({
      key: 'bookShelfData',
      success: function(res) {
        res.data.splice(i, 1);
        wx.setStorage({
          key: 'bookShelfData',
          data: res.data,
        })
      },
    })
    this.setData({
      bookShelfData: this.data.bookShelfData
    });
  },

  //获取书架
  getShelfInfo: function () {
    wx.getStorage({
      key: 'bookShelfData',
      success: (res) => {
        this.setData({
          bookShelfData: res.data
        });
      },
    })
    wx.hideLoading();
    
  },
  onLoad: function () {
    
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      hasUpdate: []
    });
    this.getShelfInfo();
  }
})