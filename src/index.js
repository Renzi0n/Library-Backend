const express = require('express');
const formData = require('express-form-data');
const { Book } = require('./models');
const { booksMock } = require('./mocks');

const app = express();
app.use(formData.parse());
app.use(express.json());

const store = {
  books: [],
};
booksMock.forEach((bookItem) => {
  const BookModel = new Book(bookItem);
  store.books.push(BookModel);
});

app.get('/api/books', (_, res) => {
  const { books } = store;
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    res.json(books[index]);
  } else {
    res.status(404);
    res.json(`Book with id ${id} not found`);
  }
});

app.post('/api/books', (req, res) => {
  const { books } = store;
  const bookData = req.body;

  const NewBook = new Book(bookData);
  books.push(NewBook);

  res.status(201);
  res.json(NewBook);
});

app.put('/api/books/:id', (req, res) => {
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
    res.json(`Book with id ${id} not found`);
  }
});

app.delete('/api/books/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    res.json('ok');
  } else {
    res.status(404);
    res.json(`Book with id ${id} not found`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
