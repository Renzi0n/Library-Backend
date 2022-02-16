const express = require('express');

const router = express.Router();

const fileMiddleware = require('../middleware/file');
const BooksList = require('../models/books-list');

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Добавить книгу',
    book: {},
  });
});

router.get('/', (req, res) => {
  res.render('books/index', {
    title: 'BOOKS LIBRARY',
    books: BooksList.booksList,
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem) {
    res.render('books/view', {
      title: bookItem.title,
      book: bookItem,
    });
  } else {
    res.status(404).redirect('/404');
  }
});

const favoriteToggler = (req, res, redirectAdress) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);
  const editedBook = BooksList.editBook(id, {
    favorite: !bookItem.favorite,
  });

  if (editedBook) {
    res.redirect(redirectAdress);
  } else {
    res.status(404).redirect('/404');
  }
};

router.post('/favorite/:id', (req, res) => favoriteToggler(req, res, '/'));
router.post('/favorite/:id/view', (req, res) => favoriteToggler(req, res, `/${req.params.id}`));

router.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);

  if (bookItem) {
    res.render('books/update', {
      title: 'Редактировать книгу',
      book: bookItem,
    });
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.fields([{ name: 'cover', maxCount: 1 }, { name: 'book', maxCount: 1 }]), (req, res) => {
  const { id } = req.params;
  const bookItem = BooksList.getBookByID(id);
  const editedBook = BooksList.editBook(id, {
    ...req.body,
    cover: req.files.cover ? req.files.cover[0].path : bookItem.cover,
    book: req.files.book ? req.files.book[0].path : bookItem.book,
  });

  if (editedBook) {
    res.redirect(`/${id}`);
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/create', fileMiddleware.fields([{ name: 'cover', maxCount: 1 }, { name: 'book', maxCount: 1 }]), (req, res) => {
  const newBook = BooksList.addBook({
    ...req.body,
    cover: req.files.cover ? req.files.cover[0].path : null,
    book: req.files.book ? req.files.book[0].path : null,
  });

  if (newBook) {
    res.redirect(`/${newBook.id}`);
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const isDelete = BooksList.removeBook(id);

  if (isDelete) {
    res.redirect('/');
  } else {
    res.status(404).redirect('/404');
  }
});

module.exports = router;
