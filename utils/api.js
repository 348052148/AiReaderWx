let apiHost = 'https://api.rbxgg.cn/';
//let apiHost = 'http://127.0.0.1:8000/';
module.exports = {
  assetHost: apiHost,
  user: {
    userInfo: function(openid) {
      return apiHost + 'api/user/'+ openid
    }
  },
  bookshelf: {
    addBook:function(userid, bookid) {
      return apiHost + "api/user/" + userid + "/bookshelf/" + bookid
    },
    removeBook:function(userid, bookid) {
      return apiHost + "api/user/" + userid + "/bookshelf/" + bookid
    },
    getBooks:function(userid) {
      return apiHost + "api/user/" + userid + "/bookshelf"
    },
    updateBook: function(userid, bookid) {
      return apiHost + "api/user/" + userid + "/bookshelf/" + bookid
    },
    getUpdateState: function(userid) {
      return apiHost + "api/user/" + userid + "/bookshelf/state"
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
    },
    homeBooks :function() {
      return apiHost + 'api/home/books'
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
    bookChapterContents: function (bookid, index) {
      return apiHost + 'api/book/' + bookid + '/chapter/' + index +'/contents'
    },
    bookChapters:function(book_id) {
      return apiHost+'api/book/' + book_id +'/chapters';
    }
  },
  classify: {
    getClassfiyMenus: function() {
      return apiHost + 'api/classify/menus'
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
