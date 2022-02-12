const express = require('express');
const cors = require('cors');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const bookRouter = require('./routes/book');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/public', express.static(`${__dirname}/public`));

app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/books', bookRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
