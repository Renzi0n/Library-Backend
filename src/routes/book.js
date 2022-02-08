const express = require('express');

const router = express.Router();
const { Book } = require('../models');
const { booksMock } = require('../mocks');

const store = {
  books: [],
};
booksMock.forEach((bookItem) => {
  const BookModel = new Book(bookItem);
  store.books.push(BookModel);
});

router.get('/', (_, res) => {
  const { books } = store;
  res.json(books);
});

router.get('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    res.json(books[index]);
  } else {
    res.status(404);
    res.json({ error: `Book with id ${id} not found` });
  }
});

router.post('/', (req, res) => {
  const { books } = store;
  const bookData = req.body;

  const NewBook = new Book(bookData);
  books.push(NewBook);

  res.status(201);
  res.json(NewBook);
});

router.put('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const bookData = req.body;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...bookData,
    };
    res.json(books[index]);
  } else {
    res.status(404);
    res.json({ error: `Book with id ${id} not found` });
  }
});

router.delete('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    res.json('ok');
  } else {
    res.status(404);
    res.json({ error: `Book with id ${id} not found` });
  }
});

module.export = router;
