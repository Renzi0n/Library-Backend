const express = require('express');

const router = express.Router();

const BooksList = require('../models/books-list');

router.get('/', (req, res) => {
  res.render('/index', {
    title: 'Books List',
    todos: BooksList.booksList,
  });
});

module.exports = router;
