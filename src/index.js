const path = require('path');
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const loginApiRouter = require('./routes/api/login');
const bookApiRouter = require('./routes/api/books');

const app = express();

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/public', express.static(`${__dirname}/public`));

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/api/login', loginApiRouter);
app.use('/api/books', bookApiRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
