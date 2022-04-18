const express = require('express');
const axios = require('axios');

const router = express.Router();

const fileMiddleware = require('../middleware/file');
const BooksList = require('../models/books-adapter');
const UserModel = require('../models/auth-model');

const externalCounterPort = process.env.COUNTER_PORT || 3000;
const externalURL = process.env.URL || 'http://localhost';

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Добавить книгу',
    book: {},
    user: req.user,
  });
});

router.get('/', async (req, res) => {
  res.render('books/index', {
    title: 'BOOKS LIBRARY',
    books: await BooksList.getBooksList(),
    user: req.user,
  });
});

router.get('/view/:id', async (req, res) => {
  const { id } = req.params;
  const bookItem = await BooksList.getBookByID(id);
  if (bookItem) {
    console.log(bookItem);
    try {
      await axios.post(`${externalURL}:${externalCounterPort}/counter/${id}/incr`);
      const { data } = await axios.get(`${externalURL}:${externalCounterPort}/counter/${id}`);

      res.render('books/view', {
        title: bookItem.title,
        book: bookItem,
        views: data[id],
        user: req.user,
      });
    } catch (err) {
      console.error(err);
      res.render('books/view', {
        title: bookItem.title,
        book: bookItem,
        views: 'неизвестно',
        user: req.user,
      });
    }
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/like-message/:bookID/:msgID', async (req, res) => {
  const { bookID, msgID } = req.params;
  const bookItem = await BooksList.getBookByID(bookID);
  const user = await UserModel.findOne({ username: req.user.username });

  const favIndex = user.likedMessages.indexOf(msgID);

  const newLikedMessages = favIndex === -1
    ? [...user.likedMessages, msgID]
    : user.likedMessages.filter((_, i) => i !== favIndex);
  const newBookMessages = bookItem.messages.map((it) => {
    // eslint-disable-next-line no-underscore-dangle
    if (it._id === msgID) {
      const newCount = favIndex === -1 ? it.likesCount + 1 : it.likesCount - 1;
      return {
        text: it.text,
        author: it.author,
        authorAvatar: it.authorAvatar,
        // eslint-disable-next-line no-underscore-dangle
        _id: it._id,
        likesCount: newCount < 0 ? 0 : newCount,
      };
    }

    return it;
  });

  const editedBook = await BooksList.editBook(bookID, {
    messages: newBookMessages,
  });
  await UserModel.updateOne({ username: req.user.username }, {
    likedMessages: newLikedMessages,
  });

  if (editedBook) {
    res.redirect(`/view/${bookID}`);
  } else {
    res.status(404).redirect('/404');
  }
});

const favoriteToggler = async (req, res, redirectAdress) => {
  const { id } = req.params;
  const bookItem = await BooksList.getBookByID(id);
  const user = await UserModel.findOne({ username: req.user.username });

  const favIndex = user.favoriteBooks.indexOf(id);

  const newFavoriteBooks = favIndex === -1
    ? [...user.favoriteBooks, id]
    : user.favoriteBooks.filter((_, i) => i !== favIndex);
  const newCount = favIndex === -1 ? bookItem.favoriteCount + 1 : bookItem.favoriteCount - 1;

  const editedBook = await BooksList.editBook(id, {
    favoriteCount: newCount < 0 ? 0 : newCount,
  });
  await UserModel.updateOne({ username: req.user.username }, {
    favoriteBooks: newFavoriteBooks,
  });

  if (editedBook) {
    res.redirect(redirectAdress);
  } else {
    res.status(404).redirect('/404');
  }
};

router.post('/favorite/:id', (req, res) => favoriteToggler(req, res, '/'));
router.post('/favorite/:id/view', (req, res) => favoriteToggler(req, res, `/view/${req.params.id}`));

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;
  const bookItem = await BooksList.getBookByID(id);

  if (bookItem) {
    res.render('books/update', {
      title: 'Редактировать книгу',
      book: bookItem,
      user: req.user,
    });
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.fields([{ name: 'cover', maxCount: 1 }, { name: 'book', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const bookItem = await BooksList.getBookByID(id);
  const editedBook = await BooksList.editBook(id, {
    ...req.body,
    cover: req.files.cover ? req.files.cover[0].path : bookItem.cover,
    book: req.files.book ? req.files.book[0].path : bookItem.book,
  });

  if (editedBook) {
    res.redirect(`/view/${id}`);
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/create', fileMiddleware.fields([{ name: 'cover', maxCount: 1 }, { name: 'book', maxCount: 1 }]), async (req, res) => {
  const newBook = await BooksList.addBook({
    ...req.body,
    cover: req.files.cover ? req.files.cover[0].path : '',
    book: req.files.book ? req.files.book[0].path : '',
  });

  if (newBook) {
    res.redirect(`/view/${newBook.id}`);
  } else {
    res.status(404).redirect('/404');
  }
});

router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const isDelete = await BooksList.removeBook(id);

  if (isDelete) {
    res.redirect('/');
  } else {
    res.status(404).redirect('/404');
  }
});

module.exports = router;
