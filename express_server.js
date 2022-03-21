const express = require('express');
const app  = express();
const port = 1982;
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get('/', (req, res) => {
  res.send('Hello Folks!');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});