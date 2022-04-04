const express = require('express');
const UserModel = require('../models/auth-model');
const fileMiddleware = require('../middleware/file');

const router = express.Router();

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const isCurrentUser = username === req.user.username;

  const user = isCurrentUser ? req.user : await UserModel.findOne(
    { username },
    (err, userFromDB) => {
      if (err) return console.log(err);

      return userFromDB;
    },
  );

  res.render('users/profile', {
    title: req.user.username,
    user,
    isCurrentUser,
  });
});

router.get('/edit/:username', async (req, res) => {
  const { username } = req.params;
  const isCurrentUser = req.user ? username === req.user.username : false;

  if (!isCurrentUser) return res.redirect('/404');

  return res.render('users/profile-edit', {
    title: 'Редактирование пользователя',
    user: req.user,
    error: '',
  });
});

router.post('/edit/:username', fileMiddleware.fields([{ name: 'avatar', maxCount: 1 }]), async (req, res) => {
  const { username } = req.params;
  const isCurrentUser = req.user ? username === req.user.username : false;

  if (!isCurrentUser) return res.redirect('/404');

  if (req.body.password.length < 6) {
    return res.render('users/profile-edit', {
      title: 'Редактирование пользователя',
      user: req.user,
      error: 'Длина пароля должна быть больше 6 символов',
    });
  }
  const isUsernameEdited = req.user.username !== req.body.username;
  const isUniqueUser = isUsernameEdited
    ? !await UserModel.find({ username: req.body.username })
    : true;
  if (!isUniqueUser) {
    return res.render('users/profile-edit', {
      title: 'Редактирование пользователя',
      user: req.user,
      error: 'Логин должен быть уникальным',
    });
  }

  await UserModel.findOneAndUpdate({ username: req.user.username }, {
    username: req.body.username,
    password: req.body.password,
    avatar: req.files.avatar ? req.files.avatar[0].path : '',
  });

  return res.redirect(`/profile/${req.body.username}`);
});

module.exports = router;
