const multer = require('multer');
const { COVERS_TYPES, BOOKS_TYPES, FIELDNAMES } = require('../constants/files');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === FIELDNAMES.cover) {
      cb(null, 'public/covers');
    } else if (file.fieldname === FIELDNAMES.book) {
      cb(null, 'public/books');
    }
  },
  filename(req, file, cb) {
    const extArray = file.mimetype.split('/');
    const ext = extArray[extArray.length - 1];
    cb(null, `${req.params.id}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === FIELDNAMES.cover) {
    if (COVERS_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === FIELDNAMES.book) {
    if (BOOKS_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

module.exports = multer({
  storage,
  fileFilter,
});