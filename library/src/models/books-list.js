/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const BookModel = require('./book-model');

class BooksList {
  async getBooksList() {
    return BookModel.find();
  }

  /** Получить книгу
   * @id - строка с id книги, которую надо получить */
  async getBookByID(id) {
    try {
      return await BookModel.findById(id);
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  /** Добавить книги
   * @bookData - объект книги, которую надо добавить */
  async addBook(bookData) {
    const newBook = new BookModel(bookData);

    try {
      const res = await newBook.save();
      this.booksList = await BookModel.find();
      return res;
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  /** Удалить книгу
   * @id - строка с id книги, которую надо удалить */
  async removeBook(id) {
    try {
      const res = await BookModel.deleteOne({ _id: id });
      this.booksList = await BookModel.find();
      return res;
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  /** Редактировать книгу
   * @id - строка с id книги, которую надо изменить
   * @data - Объект с полями книги, которые надо изменить
   * */
  async editBook(id, bookData) {
    try {
      const res = await BookModel.findByIdAndUpdate(id, bookData);
      this.booksList = await BookModel.find();
      return res;
    } catch (e) {
      console.error(e);
    }

    return null;
  }
}

module.exports = new BooksList();
