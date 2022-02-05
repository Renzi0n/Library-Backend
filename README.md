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
  fileCover: "string",
  fileName: "string"
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