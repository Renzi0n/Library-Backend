/* MODULES */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

/* MIDDLEWARES */
const errorMiddleware = require('./middleware/error');

/* ROUTERS */
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

/* ENVIROMENT VARIABLES */
const SERVER_PORT = process.env.LIBRARY_PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'BOOKS';
async function start() {
  try {
    await mongoose.connect(`${MONGO_URL}:${MONGO_PORT}/${DB_NAME}`);
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
