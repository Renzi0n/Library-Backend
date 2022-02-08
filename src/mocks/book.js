const { generateUniqueId } = require('node-unique-id-generator');

const booksMock = [
  {
    id: generateUniqueId(),
    title: 'First',
    description: 'First book',
    authors: 'No Name',
    favorite: 'unknown',
    fileCover: 'dir',
    fileName: 'First',
    fileBook: 'book.jpg',
  },
  {
    id: generateUniqueId(),
    title: 'Second',
    description: 'Second book',
    authors: 'No Name 2',
    favorite: 'unknown',
    fileCover: 'dir',
    fileName: 'Second',
    fileBook: 'book.jpg',
  },
  {
    id: generateUniqueId(),
    title: 'Third',
    description: 'Third book',
    authors: 'No Name 3',
    favorite: 'unknown',
    fileCover: 'dir',
    fileName: 'Third',
    fileBook: 'book.jpg',
  },
];

module.exports = {
  booksMock,
};
