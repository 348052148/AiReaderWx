
module.exports = {
  book: {
    bookSearch: function (indexWord, page) {
      return 'http://127.0.0.1:8000/api/search?keyword=' + indexWord + '&page=' + page
    },
    bookInfo:function(bookid){
      return 'http://127.0.0.1:8000/api/book/' + bookid
    },
    bookSources:function(bookid) {
      return 'http://127.0.0.1:8000/api/book/catalogs/contents?url=' + bookid;
    },
    chapterContent: function (chapter_id) {
      return 'http://127.0.0.1:8000/api/chapter/' + chapter_id +'/contents';
    },
    bookChapters:function(book_id) {
      return 'http://127.0.0.1:8000/api/book/' + book_id +'/chapters';
    }
  }
}
