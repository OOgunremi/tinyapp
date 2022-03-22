const express = require('express');
const res = require('express/lib/response');
const app  = express();
const port = 1982;
app.set('view engine', 'ejs');
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get('/', (req, res) => {
  res.send('Hello Folks!');
});
app. get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});
app.get('/set', (req, res) => {

  const a = 1;
  res.send(`a = ${a}`);
});
app.get('/fetch', (res, req) => {
  res.send(`a = ${a}`);
});
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});