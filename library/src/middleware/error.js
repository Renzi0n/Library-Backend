module.exports = (req, res) => {
  res.render('error/404', {
    title: '404 Cтраница не найдена',
    user: req.user ? req.user : {
      avatar: '',
      username: '',
    },
  });
};
