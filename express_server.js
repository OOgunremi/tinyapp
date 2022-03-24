/* eslint-disable func-style */
const express = require('express');
//const res = require('express/lib/response');
const app  = express();
const port = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "user1": {
    id: "user1ID",
    email: "a@b.com",
    password: "abc"
  },
  "user2ID": {
    id: "user2ID",
    email: "b@c.com",
    password: "123"
  }
};

app.set('view engine', 'ejs');
function generateRandomString(noOfChars) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let output = '';
  for (let i = 0; i < noOfChars; i++) {
    output += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return output;
}

app.get('/', (req, res) => {
  res.send('Hello');
});
app.get('/urls', (req, res) => {
  //console.log('req.cookies =',req.cookies);
  res.render('urls_index', {urls: urlDatabase,  username: req.cookies["username"]});
  //res.redirect('/urls/:shortURL');
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
  //console.log(req.params);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL};
  res.render('urls_show', templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  const shortURLNew = generateRandomString(6);
  const longURLNew = req.body.longURL;
  //console.log(shortURLNew);
  //console.log(longURLNew);
  urlDatabase[shortURLNew] = longURLNew;
  res.redirect(`/urls/${shortURLNew}`);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  //delete (req.params.shortURL);
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});
app.post("/urls/:shortURL/edit", (req, res) => {
  //console.log(req.params.shortURL);
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});
app.post("/login", (req, res) => {
  //console.log('body = ',req.body);
  //console.log(res.cookie);
  res.cookie('username', req.body.username);
  res.redirect(`/urls/`);
});
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect(`/urls/`);
});
app.get("/register", (req, res) => {
  //console.log(res.statuscode);
  //response.writeHead()
  const templateVars = {username: null};
  res.render("urls_register", templateVars);
  //const email = req.body.email;
  //const password = req.body.password;
});
app.post("/register", (req, res) => {
  console.log('body = ', req.body);
  console.log('params = ', req.params);
  const userId = generateRandomString(6);
  const user = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  users[userId] = user;
  console.log(users);
  res.cookie('user_id', userId);
  res.redirect(`/urls/`);

});
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});