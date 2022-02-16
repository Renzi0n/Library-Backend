const path = require('path');
const express = require('express');

const router = express.Router();
const fileMiddleware = require('../../middleware/file');
const BooksList = require('../../models/books-list');
const { booksMock } = require('../../mocks');
const { FIELDNAMES } = require('../../constants/files');

booksMock.forEach((bookItem) => BooksList.addBook(bookItem));

router.get('/', (_, res) => {
  res.json(BooksList.booksList);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem) {
    res.json(bookItem);
  } else {
    res.status(404);
    res.json({ error: `Book with id "${id}" not found` });
  }
});

router.post('/', (req, res) => {
  const newBook = BooksList.addBook(req.body);

  res.status(201);
  res.json(newBook);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const editedBook = BooksList.editBook(id, req.body);

  if (editedBook) {
    res.json(editedBook);
  } else {
    res.status(404);
    res.json({ error: `Book with id "${id}" not found` });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const isDelete = BooksList.removeBook(id);

  if (isDelete) {
    res.json('ok');
  } else {
    res.status(404);
    res.json({ error: `Book with id "${id}" not found` });
  }
});

// files
const uploadFile = (req, res, next, fieldName) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem && (!bookItem.book || !bookItem.cover)) {
    res.status(200);
    fileMiddleware.single(fieldName)(req, res, next);
    return;
  }

  res.status(404);
  if (bookItem) {
    res.json({ error: `Book with id "${id}" not found` });
  } else {
    res.json({ error: 'Unknown error' });
  }
};
const uploadResponse = (req, res, fieldName) => {
  if (req.file) {
    const { id } = req.params;
    const editedBook = BooksList.editBook(id, {
      [fieldName]: req.file.path,
    });
    res.json(editedBook);
  } else {
    res.json({ error: 'File upload error' });
  }
};

router.post('/:id/upload-cover', (req, res, next) => uploadFile(req, res, next, FIELDNAMES.cover), (req, res) => uploadResponse(req, res, FIELDNAMES.cover));
router.post('/:id/upload-book', (req, res, next) => uploadFile(req, res, next, FIELDNAMES.book), (req, res) => uploadResponse(req, res, FIELDNAMES.book));

router.get('/:id/download-book', (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem.book) {
    const filePath = path.join(__dirname, '/../../', bookItem.book);
    console.log(path);
    res.download(filePath, `${bookItem.title}${path.extname(filePath)}`, (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }
    });
  } else {
    res.status(404).json({ error: `Book file isn't exists for book with id "${id}"` });
  }
});
router.get('/:id/download-cover', (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem.cover) {
    const filePath = path.join(__dirname, '/../../', bookItem.cover);
    console.log(path);
    res.download(filePath, `${bookItem.title}${path.extname(filePath)}`, (err) => {
      if (err) {
        res.status(404).json({ error: err });
      }
    });
  } else {
    res.status(404).json({ error: `Cover isn't exists for book with id "${id}"` });
  }
});

module.exports = router;
