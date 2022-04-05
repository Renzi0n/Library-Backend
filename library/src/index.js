/* MODULES */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const UserModel = require('./models/auth-model');

/* MIDDLEWARES */
const errorMiddleware = require('./middleware/error');

const app = express();

/* PARSERS AND OTHERS MIDDLEWARES */
app.use(session({
  secret: 'mysecretkey',
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 24 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('mysecretkey'));
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/** CONFIG PASSPORT */
passport.use('local', new LocalStrategy((username, password, done) => {
  try {
    UserModel.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, false, { message: 'Incorrect username.' });
    });
  } catch (err) {
    done(err);
  }
}));
passport.serializeUser((user, done) => {
  console.log(`Serialized: ${user}`);
  done(null, user);
});
passport.deserializeUser((it, done) => {
  console.log(`Deserializing: ${it}`);
  UserModel.findOne({ username: it.username }, (err, user) => {
    if (err) {
      console.log(`error: ${err}`);
      done(null, false, { error: err });
    } else {
      console.log(`User: ${user}`);
      done(null, user);
    }
  });
});

/* ROUTES */
const booksRouter = require('./routes/books');
const booksApiRouter = require('./routes/api/books');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

app.use('/public', express.static(`${__dirname}/../public`));
app.use('/', authRouter);

app.use('/', (req, res, next) => {
  if (req.headers.host === 'library:4000') return next();

  console.log('FROM REDIRECT: ', req.user, req.username, req.isAuthenticated());
  if (!req.isAuthenticated()) {
    if (req.session) {
      req.session.returnTo = req.originalUrl || req.url;
    }
    return res.redirect('/unauthorized');
  }
  return next();
});
app.use('/', booksRouter);
app.use('/profile', usersRouter);
app.use('/api/books', booksApiRouter);

app.use(errorMiddleware);

/* ENVIROMENT VARIABLES */
const SERVER_PORT = process.env.LIBRARY_PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'BOOKS';
/* START APP */
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
