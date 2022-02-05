const { generateUniqueId } = require('node-unique-id-generator');

module.exports = class Book {
  constructor({
    id = generateUniqueId(), title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '',
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
};
