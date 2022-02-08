const express = require('express');

const router = express.Router();

router.get('/', (_, res) => {
  res.send('<h1>Index<h1>');
});

module.exports = router;
