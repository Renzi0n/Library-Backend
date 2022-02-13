# NDSE10-Express-
For homeworks on Express framework
#### Структура данных
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: "string",
  fileName: "string",
  cover: "string",
  book: "string"
}
``` 

### методы
метод | url | действие | комментарий
--- | --- | ---  | ---
`POST` | `/api/user/login` | авторизация пользователя | метод всегда возвращает **Code: 201** и статичный объект: `{ id: 1, mail: "test@mail.ru" }`
`GET` | `/api/books` | получить все книги | получаем массив всех книг
`GET` | `/api/books/:id` | получить книгу по **id** | получаем объект книги, если запись не найдено вернем **Code: 404** 
`POST` | `/api/books` | создать книгу | создаем книги и возврашаем ее же вместе с присвоенным **id**
`PUT` | `/api/books/:id` | редактировать книгу по **id** |  редактируем объект книги, если запись не найдено вернем **Code: 404**
`DELETE` | `/api/books/:id` | удалить книгу по **id** | удаляем книгу и возвращаем ответ: **'ok'** 
`POST` | `/api/books/:id/upload-cover` | form-data: { cover: file} | присвоить книге путь до файла обложки и создать файл | создаем файл и возвращаем книгу с путем **id**
`POST` | `/api/books/:id/upload-book` | form-data: { book: file} | присвоить книге путь до файла книги и создать файл | создаем файл и возвращаем книгу с путем **id**
`GET` | `/api/books/:id/download-cover` | получить обложку по **id** | вернуть файл по **id**
`GET` | `/api/books/:id/download-book` | получить файл книги по **id** | вернуть файл по **id**