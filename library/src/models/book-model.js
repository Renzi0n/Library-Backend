const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  authors: {
    type: String,
    default: '',
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  book: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
});

module.exports = model('Book', bookSchema);
