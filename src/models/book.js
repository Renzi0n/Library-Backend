const { generateUniqueId } = require('node-unique-id-generator');

module.exports = class Book {
  constructor({
    id = generateUniqueId(), title = '', description = '', authors = '', favorite = '', fileName = '', book = null, cover = null,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileName = fileName;
    this.book = book;
    this.cover = cover;
  }
};
