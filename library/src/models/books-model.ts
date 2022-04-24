const { Schema, model } = require('mongoose');
const { generateUniqueId } = require('node-unique-id-generator');

const commentSchema = new Schema({
  text: {
    type: String,
    default: '',
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    default: '',
  },
  authorAvatar: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: `${new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, -5).split('T')[0]} ${new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, -5).split('T')[1]}`,
  },
  _id: {
    type: String,
    default: generateUniqueId(),
  },
});

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
  favoriteCount: {
    type: Number,
    default: 0,
  },
  book: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
  messages: {
    type: [commentSchema],
    default: [],
  },
});

interface Message {
  text: string;
  likesCount: string;
  author: string;
  authorAvatar: string;
  date: string;
}

export interface Book {
  title: string;
  description: string;
  cover: string;
  book: string;
  favoriteCount: number;
  authors: string;
  messages: Message[];
}

module.exports = model('Book', bookSchema);
