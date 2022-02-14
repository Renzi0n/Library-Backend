const express = require('express');

const router = express.Router();
const { loginMock } = require('../../mocks');

router.post('/login', (_, res) => {
  res.status(201);
  res.json(loginMock);
});

module.exports = router;
