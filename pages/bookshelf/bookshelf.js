//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
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

    //删除书籍
    let userInfo = util.getUserInfo();
    wx.request({
      url: api.bookshelf.removeBook(userInfo.user_id, e.target.dataset.bookid),
      method:'delete',
      success:(res) => {
        console.log(res);
      }
    })
  },

  //获取书籍更新状态
  getUpdateState: function() {
    let userInfo = util.getUserInfo();
      wx.request({
        url: api.bookshelf.getUpdateState(userInfo.user_id),
        success: (res) => {
            console.log(res)

            this.setData({
              hasUpdate:res.data
            });
        }
      })
  },

  //获取书架
  getShelfInfo: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    
    let shelfData = wx.getStorageSync('bookShelfData') || []

    let bookMaps = {};
    for (let i = 0; i < shelfData.length; i++) {
      bookMaps[shelfData[i].bookInfo.id] = shelfData[i];
    }
    console.log(bookMaps)

    let userInfo = util.getUserInfo();
    wx.request({
      url: api.bookshelf.getBooks(userInfo.user_id),
      success: (res) => {
        let bookshelfs = [];
        for (let i = 0; i < res.data.length; i++) {
          let book = {};
          if (bookMaps[res.data[i].book_id]) {
            book = {
              bookInfo: {
                id: res.data[i].book_id,
                title: res.data[i].title,
                chapterTitle: bookMaps[res.data[i].book_id].bookInfo.chapterTitle
              },
              readNum: bookMaps[res.data[i].book_id].readNum,
              laterScrollTop: bookMaps[res.data[i].book_id].laterScrollTop
            }
          }else {
            book = {
              bookInfo: {
                id: res.data[i].book_id,
                title: res.data[i].title,
                chapterTitle: res.data[i].chapter_title
              },
              readNum: res.data[i].read_num,
              laterScrollTop: res.data[i].read_offset
            }
          }

          bookshelfs.push(book);
        }
        
        this.setData({
          bookShelfData: bookshelfs
        });

        wx.setStorageSync('bookShelfData', bookshelfs)

        wx.hideLoading();

      }
    })

    //如果书籍为空
   
   
    
  },
  onLoad: function () {
  },
  onShow: function () {
    this.setData({
      hasUpdate: []
    });
    this.getShelfInfo();

    this.getUpdateState();
  }
})