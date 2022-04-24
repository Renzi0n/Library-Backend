// eslint-disable-next-line import/no-import-module-exports
import { Book } from './books-model';

/* eslint-disable max-classes-per-file */
const BookModel = require('./books-model');

class BooksList {
  booksList: Book;

  async getBooksList(): Promise<Book[]> {
    return BookModel.find();
  }

  /** Получить книгу
   * @id - строка с id книги, которую надо получить */
  async getBookByID(id: string): Promise<Book> {
    try {
      return await BookModel.findById(id);
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  /** Добавить книги
   * @bookData - объект книги, которую надо добавить */
  async addBook(bookData: Book): Promise<Book> {
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
  async removeBook(id: string): Promise<Book> {
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
  async editBook(id: string, bookData: Book): Promise<Book> {
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
