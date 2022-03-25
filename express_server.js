//UTILITIES
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const {getUserByEmail, generateRandomString} = require("./helpers");
const port = 8080;
const bcrypt = require('bcryptjs');
const app  = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['LIGHTHOUSELABS']
}));
app.set('view engine', 'ejs');

//DATABASE FOR TESTING
const urlDatabase = {
  b6UTxQ: {
    longUrl: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longUrl: "https://www.google.ca",
    userID: "aJ48lW"
  },
  i3BoGs: {
    longUrl: "https://www.google.ca",
    userID: "user2ID"
  }
};
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "OOgunremi@yahoo.com",
    password: bcrypt.hashSync("123", 10)
  },
  "user2ID": {
    id: "user2ID",
    email: "b@c.com",
    password: bcrypt.hashSync("124", 10)
  }
};

//FUNCTIONS
const filterDatabase = (userID) => {
  const filteredByUserId = {};
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === userID) {
      filteredByUserId[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return filteredByUserId;
};

//ROUTES
app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
app.get('/urls', (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.send('Please Register or Log in');
  } else {
    const user = users[userId];
    const urlDatabase = filterDatabase(userId);
    const templateVars = { urls: urlDatabase, user };
    res.render('urls_index', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.redirect(`/login`);
  }
  const user = users[userId];
  const templateVars = {user};
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortUrl', (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.status(401).send('Please Register or Log in');
  } else {
    const user = users[userId];
    const shortUrl = req.params.shortUrl;
    const longUrl = urlDatabase[shortUrl].longUrl;
    const templateVars = { user, shortUrl, longUrl };
    res.render('urls_show', templateVars);
  }
});
app.get("/u/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl].longUrl;
  console.log(urlDatabase[shortUrl].longUrl);
  if (!longUrl) {
    res.status(404).send('Invalid URL. Please check your URL Input');
  }
  res.redirect(longUrl);
});

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (userId === undefined) {
    res.status(401).send("Please log in to create short URLs.");
  }
  const shortUrlNew = generateRandomString(6);
  const longUrlNew = req.body.longUrl;
  urlDatabase[shortUrlNew] = {
    longUrl: longUrlNew,
    userID: userId
  };
  res.redirect(`/urls/${shortUrlNew}`);
});
app.post("/urls/:shortUrl/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.shortUrl;
  if (Object.keys(filterDatabase(userId)).includes(shortUrl)) {
    delete urlDatabase[shortUrl];
    res.redirect(`/urls`);
  } else {
    res.status(401).send('operation denied. No authorization to delete');
  }
});

app.post("/urls/:shortUrl/edit", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.shortUrl;
  const longUrl = req.body.longUrl;
  const urlDatabase = filterDatabase(userId);
  if (Object.keys(urlDatabase).includes(shortUrl)) {
    urlDatabase[shortUrl].longUrl = longUrl;
    res.redirect(`/urls`);
  } else {
    res.status(401).send('operation denied. No authorization to edit');
    return;
  }
});

app.get("/login", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.status(403).send('Please enter your email and password and retry');
    return;
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
  res.clearCookie('user_id');
  res.redirect(`/login`);
});
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === '' || password === '') {
    res.status(400).send('Please register or login');
  }
  if (getUserByEmail(email, users)) {
    res.status(400).send('Existing user. Please login');
  }
  const userId = generateRandomString(6);
  const user = {
    id: userId,
    email: req.body.email,
    password: hashedPassword
  };
  users[userId] = user;
  req.session.user_id = userId;
  res.redirect(`/urls/`);
});
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});