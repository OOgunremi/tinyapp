// UTILITIES
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const {getUserByEmail, generateRandomString, filterDatabase} = require("./helpers");
const port = 8080;
const bcrypt = require('bcryptjs');
const app  = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['LIGHTHOUSELABS']
}));

// DATABASE FOR URLS AND USERS STORAGE
const urlDatabase = {};
const users = {};

// GET ROUTES
app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/login");
  }
});

app.get('/urls', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.send('Please Register or Log in');
  } else {
    const user = users[userId];
    const filteredDatabase = filterDatabase(userId, urlDatabase);
    const templateVars = { urls: filteredDatabase, user };
    res.render('urls_index', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id; ``
  if (!userId) {
    res.redirect(`/login`);
  } else {
    const user = users[userId];
    const templateVars = { user };
    res.render("urls_new", templateVars);
  }
});

// Registration and Login Pages
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_login", templateVars);
});

app.get('/urls/:shortUrl', (req, res) => {
  //renders the details of the shortURL and its linked longURL to authorized users
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401).send('Please Register or Log in');
  } else {
    const user = users[userId];
    const filteredDatabase = filterDatabase(userId, urlDatabase);
    const shortUrl = req.params.shortUrl;
    if (filteredDatabase[shortUrl]) {
      const longUrl = urlDatabase[shortUrl].longUrl;
      const templateVars = { user, shortUrl, longUrl };
      res.render('urls_show', templateVars);
    } else {
      res.status(401).send('Access denied. Not authorized to view this page');
    }
  }
});
app.get("/u/:shortUrl", (req, res) => {
  //renders the longURL page via the shortURL
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl].longUrl;
  if (!longUrl) {
    res.status(404).send('Invalid URL. Please check your URL Input');
  } else {
    res.redirect(longUrl);
  }
});

//POST ROUTES
app.post("/urls", (req, res) => {
  //updates database with new URLs
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401).send("Please log in to create short URLs.");
  } else {
    const shortUrlNew = generateRandomString(6);
    let longUrlNew = req.body.longUrl;
    if (longUrlNew.substring(0, 6) !== 'http://') {
      longUrlNew = 'http://' + longUrlNew;
    }
    urlDatabase[shortUrlNew] = {
      longUrl: longUrlNew,
      userID: userId
    };
    res.redirect(`/urls/${shortUrlNew}`);
  }
});

app.post("/urls/:shortUrl/delete", (req, res) => {
  //deletes URLs from database
  const userId = req.session.user_id;
  const shortUrl = req.params.shortUrl;
  if (Object.keys(filterDatabase(userId, urlDatabase)).includes(shortUrl)) {
    delete urlDatabase[shortUrl];
    res.redirect(`/urls`);
  } else {
    res.status(401).send('operation denied. No authorization to delete');
  }
});

app.post("/urls/:shortUrl/edit", (req, res) => {
  //for editing existing URLs
  const userId = req.session.user_id;
  const shortUrl = req.params.shortUrl;
  const longUrl = req.body.longUrl;
  const filteredDatabase = filterDatabase(userId, urlDatabase);
  if (Object.keys(filteredDatabase).includes(shortUrl)) {
    urlDatabase[shortUrl].longUrl = longUrl;
    res.redirect(`/urls`);
  } else {
    res.status(401).send('operation denied. No authorization to edit');
  }
});

app.post("/register", (req, res) => {
  //for new user registration into database
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.status(400).send('Please register or login');
  } else if (getUserByEmail(email, users)) {
    res.status(400).send('Existing user. Please login');
  } else {
    // Storing users into database
    const userId = generateRandomString(6);
    const user = {
      id: userId,
      email: req.body.email,
      password: hashedPassword
    };
    users[userId] = user;
    req.session.user_id = userId;
    res.redirect(`/urls/`);
  }
});

app.post("/login", (req, res) => {
  //Existing users login
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(403).send('Please enter your email and password and retry');
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    res.status(403).send('This email address is not in the database');
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user_id;
      req.session.user_id = user.id;
      res.redirect(`/urls`);
    } else {
      res.status(403).send('Incorrect password. Please check your password and retry');
    }
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

//SERVER STATUS
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});