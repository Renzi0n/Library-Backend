const path = require('path');
const express = require('express');

const router = express.Router();
const fileMiddleware = require('../middleware/file');
const { Book } = require('../models');
const { booksMock } = require('../mocks');
const { FIELDNAMES } = require('../constants/files');

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
    res.json({ error: `Book with id "${id}" not found` });
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
    res.json({ error: `Book with id '${id}" not found` });
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
    res.json({ error: `Book with id "${id}" not found` });
  }
});

// files
const uploadFile = (req, res, next, fieldName) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1 && (!books[index].book || !books[index].cover)) {
    res.status(200);
    fileMiddleware.single(fieldName)(req, res, next);
    return;
  }

  res.status(404);
  if (index === -1) {
    res.json({ error: `Book with id "${id}" not found` });
  } else if (fieldName === FIELDNAMES.book && books[index].book) {
    res.json({ error: `Book file exists for book with id "${id}"` });
  } else if (fieldName === FIELDNAMES.cover && books[index].cover) {
    res.json({ error: `Cover fileexists for book with id "${id}"` });
  } else {
    res.json({ error: 'Unknown error' });
  }
};
const uploadResponse = (req, res, fieldName) => {
  if (req.file) {
    const { books } = store;
    const { id } = req.params;
    const index = books.findIndex((book) => book.id === id);
    books[index] = {
      ...books[index],
      ...{
        [fieldName]: req.file.path,
      },
    };
    res.json(books[index]);
  } else {
    res.json({ error: 'File upload error' });
  }
};

router.post('/:id/upload-cover', (req, res, next) => uploadFile(req, res, next, FIELDNAMES.cover), (req, res) => uploadResponse(req, res, FIELDNAMES.cover));
router.post('/:id/upload-book', (req, res, next) => uploadFile(req, res, next, FIELDNAMES.book), (req, res) => uploadResponse(req, res, FIELDNAMES.book));

router.get('/:id/download-book', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (books[index].book) {
    const filePath = path.join(__dirname, '/../../', books[index].book);
    console.log(path);
    res.download(filePath, `${books[index].title}${path.extname(filePath)}`, (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }
    });
  } else {
    res.status(404).json({ error: `Book file isn't exists for book with id "${id}"` });
  }
});
router.get('/:id/download-cover', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (books[index].cover) {
    const filePath = path.join(__dirname, '/../../', books[index].cover);
    console.log(path);
    res.download(filePath, `${books[index].title}${path.extname(filePath)}`, (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }
    });
  } else {
    res.status(404).json({ error: `Cover isn't exists for book with id "${id}"` });
  }
});

module.exports = router;
