// pages/search/search.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    STATIC_HOST:api.assetHost,
    winHeight: "",//窗口高度
    scrollTop: 0,
    //热搜关键词
    hotWords: [],
    //展示关键词
    showHotWords: [],  //随机显示六个热词
    //颜色随机
    hotWordBackgoundColor: ['#FFC0CB', '#7B68EE', '#FF69B4', '#66CDAA', '#FA8072', '#228B22'],
    //是否展示搜索内容
    showSearchContent: false,
    //搜索框值
    searchValue: '',
    //搜索返回结果
    searchRes: {
      list:[]
    },
    //历史输入
    historyWords: [],
    //当前搜索页
    page:1,
    keyword:'',

    //分页
    pageload:false,

    //焦点
    foucsflag:false,

    //issearch
    isLoad: false,
  },

  //获取热搜关键词
  getHotWords: function () {
    // wx.request({
    //   url: api.book.hotWord,
    //   success: res => {
    //     this.setData({
    //       hotWords: res.data.hotWords
    //     });
    //     this.randomHotWord();
    //   }
    // })
    this.setData({
        hotWords:["逆天","求魔"]

    });
    this.randomHotWord();
  },

  randomHotWord: function () {
    this.setData({
      showHotWords: []
    });
    let hotWordLen = this.data.hotWords.length;
    let randomIndex;
    for (let i = 0; i < 6; i++) {
      let newRandom = Math.floor(Math.random() * hotWordLen);
      if (newRandom === randomIndex) {
        i--;
        break;
      }
      randomIndex = newRandom;
      this.data.showHotWords.push(this.data.hotWords[randomIndex])
    }
    this.setData({
      showHotWords: this.data.showHotWords
    });
  },

  //点击热词搜索
  hotWordSearch: function (event) {  //点击热词搜索
    this.setData({
      searchValue: event.target.dataset.word,
      page: 1,
      pageload: false
    });
    this.search(event.target.dataset.word);
  },

  
  searchInput: function (event) {  //手动清空搜索栏关闭搜索容器
    this.setData({
      searchValue: event.detail.value,

    });
    if (event.detail.value.length === 0) {
      this.setData({
        showSearchContent: false
      });
    }
  },

  //清空搜索框
  clearInput: function () { //清空搜索栏关闭搜索容器
    this.setData({
      searchValue: '',
      showSearchContent: false,
      pageload: false
    });
  },

  loadmore: function (){
    if (this.data.pageload == false) {
      this.setData({
        pageload: true,
        isLoad: true,
      })

      //接口搜索
      wx.request({
        url: api.book.bookSearch(this.data.keyword, this.data.page + 1),
        success: res => {
          
          if (res.data.list.length > 0) {
            let books = this.data.searchRes
            for (let i = 0; i < res.data.list.length; i++) {
              books.list.push(res.data.list[i])
            }
            this.setData({
              showSearchContent: true,
              searchRes: books,
              page: this.data.page + 1,
              pageload: false,
              isLoad:false,
            });
          }else {
            this.setData({
              isLoad: false,
            });
            //到底了
          }
        }
      })
    }
  },

  //搜索书籍
  search: function (word) {
    this.setData({
      isLoad:true,
    })
    let indexWord = word.detail ? word.detail.value : word;
    //历史搜索
    wx.getStorage({
      key: 'searchHistory',
      success: res => {
        for (let i = 0; i < res.data.length; i++) {  //已有记录删除重复的
          if (word === res.data[i]) {
            res.data.splice(i,1);
            break;
          }
        }
        res.data.unshift(indexWord);
        wx.setStorage({
          key: 'searchHistory',
          data: res.data,
        });
        this.setData({
          historyWords: res.data
        });
      }
    })

    //接口搜索
    wx.request({
      url: api.book.bookSearch(indexWord, this.data.page),
      success: res => {
        this.setData({
          showSearchContent: true,
          searchRes: res.data,
          scrollTop: 0,
          page:this.data.page,
          keyword: indexWord,
          isLoad: false,
        });

      }
    })
  },

  clearHistory: function () {
    wx.setStorage({
      key: 'searchHistory',
      data: []
    });
    this.setData({
      historyWords: []
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.foucsflag = true

    //设置系统信息
    let systemInfo = wx.getStorageSync('systemInfo');
    this.setData({
      clientHeight: systemInfo.clientHeight,
      clientWidth: systemInfo.clientWidth,
      winHeight: systemInfo.winHeight
    })

    wx.getStorage({
      key: 'searchHistory',
      success: res => {
        this.setData({
          historyWords: res.data
        });
      },
      fail: () => {
        wx.setStorage({
          key: 'searchHistory',
          data: [],
        })
      }
    })

    this.getHotWords();
  }
})