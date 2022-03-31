const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const counterJsonPath = path.join(__dirname, '../counter-db/counter.json');

const fetchBooksFromLibrary = async () => {
  try {
    return await axios.get(`${process.env.URL || 'http://localhost'}:${process.env.LIBRARY_PORT || '4000'}/api/books`);
  } catch (err) {
    console.error('Запрос в библиотеку произошел с ошибкой', err);
    return null;
  }
};

const clearCounterFromLibrary = (counterMap, booksFromLibrary) => {
  const counterMapCopy = { ...counterMap };
  const existsIDs = Object.keys(counterMapCopy);

  const booksFromLibraryIDs = booksFromLibrary.map((it) => it.id);
  const deletedBooks = existsIDs.filter((it) => !booksFromLibraryIDs.includes(it));

  existsIDs.forEach((it) => {
    if (deletedBooks.includes(it)) {
      delete counterMapCopy[it];
    }
  });

  return counterMapCopy;
};

const updateCounterFromLibrary = async (counterMap) => {
  const data = await fetchBooksFromLibrary();
  if (!data) {
    return;
  }
  const { data: booksFromLibrary } = data;
  const existsIDs = Object.keys(counterMap);

  // Массив недобавленных в counter книг
  const newBooks = booksFromLibrary.filter((it) => !existsIDs.includes(it._id));
  const newBooksMap = newBooks.reduce((acc, item) => ({
    ...acc,
    [`${item._id}`]: 0,
  }), {});

  const clearedCounterMap = clearCounterFromLibrary(counterMap, booksFromLibrary);

  // eslint-disable-next-line consistent-return
  return { ...clearedCounterMap, ...newBooksMap };
};

setTimeout(() => {
  updateCounterFromLibrary(JSON.parse(fs.readFileSync(counterJsonPath, 'utf8'))).then((initialUpdatedCounter) => {
    fs.writeFileSync(counterJsonPath, JSON.stringify(initialUpdatedCounter));
  })  
}, 15000)

app.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params;
  let counterMap = JSON.parse(fs.readFileSync(counterJsonPath, 'utf8'));
  if (counterMap[bookId] === undefined) {
    counterMap = await updateCounterFromLibrary(counterMap);

    if (!counterMap) {
      res.status(404);
      res.json({ error: `Book with id "${bookId}" not found or library unavailable` });
      return;
    }

    if (counterMap[bookId] === undefined) {
      res.status(404);
      res.json({ error: `Book with id "${bookId}" not found` });
      return;
    }
  }

  const counterNewJson = JSON.stringify({ ...counterMap, [`${bookId}`]: counterMap[bookId] + 1 });

  fs.writeFileSync(counterJsonPath, counterNewJson);
  res.status(200);
  res.json(counterNewJson);
});

app.get('/counter/:bookId', (req, res) => {
  const { bookId } = req.params;
  const counterMap = JSON.parse(fs.readFileSync(counterJsonPath, 'utf8'));

  if (counterMap[bookId]) {
    res.status(200);
    res.json({ [`${bookId}`]: counterMap[bookId] });

    return;
  }

  res.status(404);
  res.json({ error: `Book with id "${bookId}" not found` });
});

const PORT = process.env.COUNTER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Counter server is running on port ${PORT}`);
});
