const express = require('express');
//const res = require('express/lib/response');
const app  = express();
const port = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//const templateVars = {urls: urlDatabase};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get('/', (req, res) => {
  res.send('Hello Folks!');
});
//app. get('/urls.json', (req, res) => {
//  res.json(urlDatabase);
//});
//app.get('/hello', (req, res) => {
//  res.send('<html><body>Hello <b>World</b></body></html>\n');
//});
app.get('/urls', (req, res) => {
  res.render('urls_index', {urls: urlDatabase});
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get('/urls/:shortURL', (req, res) => {
  console.log(req.params);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL};
  //console.log(req.url);
  res.render('urls_show', templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});