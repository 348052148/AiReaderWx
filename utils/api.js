let apiHost = 'https://api.rbxgg.cn/';
//let apiHost = 'http://127.0.0.1:8000/';
module.exports = {
  assetHost: apiHost,
  user: {
    userInfo: function(openid) {
      return apiHost + 'api/user/'+ openid
    }
  },
  home: {
    hotBooks: function() {
      return apiHost + 'api/hot/books'
    },
    recommendBooks: function() {
      return apiHost + 'api/recommend/books'
    },
    banarList: function() {
      return apiHost + 'api/bannar/list'
    }
  },
  book: {
    relatedRecommendedBooks: function(book_id) {
      return apiHost + 'api/book/' + book_id+'/recommends'
    },
    bookMixedSearch: function(attr, page) {
      return apiHost + 'api/book/search?attr=' + attr + '&page=' + page
    },
    bookSearch: function (indexWord, page) {
      return apiHost+'api/search?keyword=' + indexWord + '&page=' + page
    },
    bookInfo:function(bookid){
      return apiHost +'api/book/' + bookid
    },
    bookSources:function(bookid) {
      return apiHost+'api/book/catalogs/contents?url=' + bookid;
    },
    chapterContent: function (chapter_id) {
      return apiHost+'api/chapter/' + chapter_id +'/contents';
    },
    bookChapters:function(book_id) {
      return apiHost+'api/book/' + book_id +'/chapters';
    }
  },
  wechat: {
    login : function(code) {
      return apiHost+'api/wechat/login/'+code
    },
    register: function() {
      return apiHost+'api/wechat/register'
    }
  }
}
