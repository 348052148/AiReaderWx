// pages/reader/reader.js
const api = require('../../utils/api.js')
const WxParse = require('../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPage: true,//请求到数据显示界面
    clientWidth: "",
    clientHeight: "",
    winHeight: "",//窗口高度
    //书籍id
    book_id: '',
    //书籍名称
    title: '',
    //作者
    author: '',
    //封面
    cover:'',
    //阅读位置
    scrollTop: 0,

    //章节目录
    bookChapters: false,
    //章节名称
    chapterTitle:'',
    //当前章节
    indexPage: 0, 
    //当前内容
    indexChapterContent: '', //当前阅读的内容

    chapterScrollTop:0,

    //格式设置
    readerCss: {
      titleSize: 20,
      contentSize: 16,
      color: '#333', //夜间 #424952
      lineHeight: 60,
      backgroundColor: '#fff' //#C7EDCC 护眼色  #080C10 黑夜
    },
    showMenu: false,
    showChapter: false,
    isDark: false,
    isHuyan: false
  },

  //开启晚上
  toggleDark: function () {
    this.setData({
      isDark: !this.data.isDark
    });
    if (this.data.isDark) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#080C10'
      });
      this.data.readerCss.color = '#696969';
      this.data.readerCss.backgroundColor = '#080C10';
      this.setData({
        isHuyan: false,
        readerCss: this.data.readerCss
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#cb1c36'
      });
      this.data.readerCss.color = '#333';
      this.data.readerCss.backgroundColor = '#fff';
      this.setData({
        isHuyan: false,
        readerCss: this.data.readerCss
      });
    }
  },
  //开启护眼
  toggleHuyan: function () {
    this.setData({
      isHuyan: !this.data.isHuyan
    });
    if (this.data.isHuyan) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000'
      });
      this.data.readerCss.color = '#333';
      this.data.readerCss.backgroundColor = '#C7EDCC';
      this.setData({
        isDark: false,
        readerCss: this.data.readerCss
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#cb1c36'
      });
      this.data.readerCss.color = '#333';
      this.data.readerCss.backgroundColor = '#fff';
      this.setData({
        isDark: false,
        readerCss: this.data.readerCss
      });
    }
  },
  //增加字体大小
  incSize: function () {
    if (this.data.readerCss.titleSize === 30) {
      return
    }
    this.data.readerCss.titleSize = this.data.readerCss.titleSize + 5;
    this.data.readerCss.lineHeight = this.data.readerCss.lineHeight + 10;
    this.data.readerCss.contentSize = this.data.readerCss.contentSize + 5;
    this.setData({
      readerCss: this.data.readerCss
    });
  },
  //减小字体大小
  decSize: function () {
    if (this.data.readerCss.titleSize === 20) {
      return
    }
    this.data.readerCss.titleSize = this.data.readerCss.titleSize - 5;
    this.data.readerCss.contentSize = this.data.readerCss.contentSize - 5;
    this.data.readerCss.lineHeight = this.data.readerCss.lineHeight - 10;
    this.setData({
      readerCss: this.data.readerCss
    });
  },

  //上一章
  goPrev: function () {
    if (this.data.indexPage === 0) {
      wx.showToast({
        title: '已到第一章',
        icon: 'loading',
        mask: true
      });
    }
    this.setData({
      indexPage: this.data.indexPage - 1,
      scrollTop: 0
    });
    //获取内容
    this.getBookChapters(this.data.book_id);
  },

  //下一章
  goNext: function () {
    if (this.data.indexPage === this.data.bookChapters.length - 1) {  //当前在最后一章
      wx.showToast({
        title: '已到最新章节',
        icon: 'loading',
        mask: true
      });
      return;
    }
    this.setData({
      indexPage: this.data.indexPage + 1,
      scrollTop: 0
    });
    //获取内容
    this.getBookChapters(this.data.book_id);
  },

  //点击中央打开菜单
  openMenu: function (event) {
    let xMid = this.data.clientWidth / 2;
    let yMid = this.data.clientHeight / 2;
    let x = event.detail.x;
    let y = event.detail.y;
    if ((x > xMid - 100 && x < xMid + 100) && (y < yMid + 100 && y > yMid - 100)) {
      this.setData({
        showMenu: !this.data.showMenu
      });
    }
  },

  getScrollTop: function (event) {  //设置读取到文章的具体什么位置

    // this.setData({
    //   scrollTop: event.detail.scrollTop
    // });
    //存储读到章节的什么位置
    wx.getStorage({
      key: 'bookShelfData',
      success: res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          if (this.data.book_id === data[i].bookInfo.id) {
            data[i].laterScrollTop = event.detail.scrollTop;
            wx.setStorage({
              key: 'bookShelfData',
              data: data,
            })
          }
        }
      },
    });
    //存储阅读记录
    this.storeReadRecord(event.detail.scrollTop);
  },

  //显示目录
  showChapter: function () {
    this.setData({
      showChapter: !this.data.showChapter
    });

    if (!this.data.bookChapters) {
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: api.book.bookChapters(this.data.book_id),
        success: res => {
          this.setData({
            bookChapters: res.data
          });

          var query = wx.createSelectorQuery();
          query.select(".chapter_item").boundingClientRect((rect) => {
            this.setData({
              chapterScrollTop: this.data.indexPage * rect.height
            });
          }).exec();

          wx.hideLoading();
        }
      })
    }else {
      var query = wx.createSelectorQuery();
      query.select(".chapter_item").boundingClientRect((rect) => {
        this.setData({
          chapterScrollTop: this.data.indexPage * rect.height
        });
      }).exec();
      
    }
    
  },

  //点击目录章节
  pickChapter: function (event) {
    this.setData({
      indexPage: event.target.dataset.indexpage,
      scrollTop: 0
    });
    this.getBookChapters(this.data.book_id);
  },


  storeReadRecord: function (scrollTop) {
    //存储当前读到哪一章
    let record = wx.getStorageSync('bookReadRecord') || []
    let exists = false;
    for (let i = 0; i < record.length; i++) {
      if (this.data.book_id === record[i].id) {
        exists = true;
        record[i].readNum = this.data.indexPage + 1;
        record[i].laterScrollTop = scrollTop
        record[i].chapterTitle = this.data.chapterTitle,
        wx.setStorage({
          key: 'bookReadRecord',
          data: record,
        })
      }
    }
    if (!exists) {
      record.push({
        id: this.data.book_id,
        title: this.data.title,
        cover: this.data.cover,
        author: this.data.author,
        readNum: this.data.indexPage + 1,
        chapterTitle: this.data.chapterTitle,
        laterScrollTop: scrollTop
      });
      wx.setStorage({
        key: 'bookReadRecord',
        data: record,
      })
    }
  },


  //获取书的章节
  getBookChapters: function (book_id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: api.book.bookChapterContents(book_id, this.data.indexPage),
      success: res => {
        wx.hideLoading();
        this.setData({
          showPage: true,
          showChapter: false,  //关闭目录
          indexChapterContent: res.data.contents,
          chapterTitle: res.data.title,
        });

        //存储当前读到哪一章
        wx.getStorage({
          key: 'bookShelfData',
          success: res => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              if (this.data.book_id === data[i].bookInfo.id) {
                data[i].readNum = this.data.indexPage + 1;
                data[i].laterScrollTop = this.data.scrollTop;
                data[i].bookInfo.chapterTitle = this.data.chapterTitle;
                wx.setStorage({
                  key: 'bookShelfData',
                  data: data,
                })
              }
            }
          },
        });

        //存储阅读记录
        this.storeReadRecord(this.data.scrollTop);

        //使用Wxparse格式化小说内容   对收费的显示文字   后期换接口处理
        WxParse.wxParse('article', 'html', !this.data.indexChapterContent ? '小轻还没有给主人搬到此书，去看看别的吧' : this.data.indexChapterContent, this);

        //等到渲染页面后调节scrollTop
        this.setData({
          scrollTop: this.data.scrollTop
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      book_id: options.book_id,
      indexPage: options.index | 0,
      title: options.title,
      cover: options.cover,
      author:options.author,
    });
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

    //设置标题
    wx.setNavigationBarTitle({
      title: options.book_title,
    });

    //获取读取章节和内容
    let shlfBooks = wx.getStorageSync('bookShelfData');
    for (let i = 0; i < shlfBooks.length; i++) {
      if (this.data.book_id === shlfBooks[i].bookInfo.id) {
        this.setData({
          indexPage: shlfBooks[i].readNum - 1,
          scrollTop: shlfBooks[i].laterScrollTop
        });
      }
    }

    //是否呼出菜单
    wx.getStorage({
      key: 'isAlerted',
      success: (res) => {
        let data = res.data;
        if (!data) {
          wx.showModal({
            title: '提示',
            content: '点击呼出菜单',
            success: (res) => {
              if (res.confirm) {
                wx.setStorage({
                  key: 'isAlerted',
                  value: true
                });
              }
            }
          });
        }
      }
    });
    //获取章节内容
    this.getBookChapters(options.book_id);
  }
});
