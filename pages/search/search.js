// pages/search/search.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    pageload:false
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
      page: 1
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
      showSearchContent: false
    });
  },

  loadmore: function (){
    if (this.data.pageload == false) {
      this.setData({
        pageload: true,
      })
      wx.showLoading({
        title: '加载中',
        mask: true
      });

      //接口搜索
      wx.request({
        url: api.book.bookSearch(this.data.keyword, this.data.page + 1),
        success: res => {
          
          let books = this.data.searchRes
          for (let i = 0; i < res.data.list.length; i++) {
            books.list.push(res.data.list[i])
          }
          console.log(books)
          this.setData({
            showSearchContent: true,
            searchRes: books,
            pageload:false,
            page: this.data.page + 1,
          });
          wx.hideLoading();
        }
      })
    }
  },

  //搜索书籍
  search: function (word) {
    wx.showLoading({
      title: '搜索中',
      mask: true
    });
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
          keyword: indexWord
        });
        wx.hideLoading();
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
    //  高度自适应
    wx.getSystemInfo({
      success: (res) => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 140;
        this.setData({
          STATIC_HOST: api.STATIC_HOST,
          winHeight: calc
        });
      }
    });

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