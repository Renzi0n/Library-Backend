const Book = require('./book');

class BooksList {
  constructor() {
    this.booksList = [];
  }

  /** Получить книгу
   * @id - строка с id книги, которую надо получить */
  getBookByID(id) {
    const index = this.booksList.findIndex((book) => book.id === id);

    if (index !== -1) {
      return this.booksList[index];
    }

    return null;
  }

  /** Добавить книги
   * @bookData - объект книги, которую надо добавить */
  addBook(bookData) {
    const NewBook = new Book(bookData);
    this.booksList.push(NewBook);

    return NewBook;
  }

  /** Удалить книгу
   * @id - строка с id книги, которую надо удалить */
  removeBook(id) {
    const index = this.booksList.findIndex((book) => book.id === id);
    if (index !== -1) {
      this.booksList.splice(index, 1);
      return true;
    }

    return false;
  }

  /** Редактировать книгу
   * @id - строка с id книги, которую надо изменить
   * @data - Объект с полями книги, которые надо изменить
   * */
  editBook(id, bookData) {
    const index = this.booksList.findIndex((book) => book.id === id);
    if (index !== -1) {
      this.booksList[index] = {
        ...this.booksList[index],
        ...bookData,
      };

      return this.booksList[index];
    }

    return null;
  }
}

module.exports = new BooksList();
