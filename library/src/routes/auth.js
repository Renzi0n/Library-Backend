const express = require('express');
const passport = require('passport');
const UserModel = require('../models/auth-model');
const fileMiddleware = require('../middleware/file');

const router = express.Router();

router.get('/unauthorized', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/unauthorized', {
    title: 'Авторизация',
  });
});
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/login', {
    title: 'Вход',
    error: '',
  });
});
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/reg', {
    title: 'Регистрация',
    error: '',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate(
      'local',
      {
        session: true,
      },
      (err, user) => {
        if (err) return next(err);
        if (user) {
          req.logIn(user, (errLog) => (errLog
            ? next(errLog)
            : res.redirect('/')));
        }

        return res.render('auth/login', {
          title: 'Вход',
          error: 'Неверный логин или пароль',
        });
      },
    )(req, res, next);
  },
);
router.post('/register', fileMiddleware.fields([{ name: 'avatar', maxCount: 1 }]), async (req, res, next) => {
  if (req.body.password.length < 6) {
    return res.render('auth/reg', {
      title: 'Регистрация',
      error: 'Длина пароля должна быть больше 6 символов',
    });
  }
  const isUniqueLogin = !!await UserModel.findOne({ username: req.body.username });
  if (isUniqueLogin) {
    return res.render('auth/reg', {
      title: 'Регистрация',
      error: 'Логин должен быть уникальным',
    });
  }

  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
    avatar: req.files.avatar ? req.files.avatar[0].path : '',
  });
  return user.save((err) => {
    if (err) {
      next(err);
    } else {
      req.logIn(user, (errLog) => {
        if (errLog) {
          next(errLog);
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
