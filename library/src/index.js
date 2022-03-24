const path = require('path');
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('./middleware/error');

const booksRouter = require('./routes/books');
const loginApiRouter = require('./routes/api/login');
const booksApiRouter = require('./routes/api/books');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/public', express.static(`${__dirname}/../public`));

app.use('/', booksRouter);
app.use('/api/login', loginApiRouter);
app.use('/api/books', booksApiRouter);

app.use(errorMiddleware);

const PORT = process.env.LIBRARY_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Library server is running on port ${PORT}`);
});
