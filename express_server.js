//UTILITIES
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const port = 8080;

const app  = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

//DATABASE
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

//FUNCTIONS
const emailLookUp = (email) => {
  for (let userid in users) {
    if (users[userid].email === email) {
      return users[userid];
    }
  }
  return null;
};
const generateRandomString = (noOfChars) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < noOfChars; i++) {
    const randomCharacterPosition = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomCharacterPosition);
  }
  return randomString;
};

app.get('/urls', (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = {urls: urlDatabase,  user};
  res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = {user};
  res.render("urls_new", templateVars);
});
app.get('/urls/:shortURL', (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {user, shortURL, longURL};
  res.render('urls_show', templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  const shortURLNew = generateRandomString(6);
  const longURLNew = req.body.longURL;
  urlDatabase[shortURLNew] = longURLNew;
  res.redirect(`/urls/${shortURLNew}`);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});
app.get("/login", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_login", templateVars);
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.send('Please register/login');
    return;
  }
  const user = emailLookUp(email);
  if (!user) {
    res.send('Please check password');
  }

  if (password === user.password) {
    res.cookie('user_id', user.id);
    res.redirect(`/urls`);
  }

});
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_register", templateVars);
});
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.send('Please register/login');
    return;
  }
  if (emailLookUp(email)) {
    return res.send('Existing users. Please login');
  }
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