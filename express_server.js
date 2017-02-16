const express = require("express");
const crypto = require("crypto");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "ironMan": {
    id: "Tony Stark",
    email: "ironMan@marvel.com",
    password: "PepperPotts"
  },
  "mitchMarner": {
    id: "16",
    email: "mitchy@mapleLeafs.ca",
    password: "rookieOfTheYear"
  }
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString(b) {
  return crypto.randomBytes(b).toString('hex');
};
// all app.get routes ----------------------------------------------------------
app.get("/", (req, res) => {
  let user = "guest";
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL); //redirects to the website
});

app.get("/register", (req, res) => {
  res.render("urls_register"); //working
})
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase, username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]
};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id, urls: urlDatabase, username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// all app.post routes ---------------------------------------------------------

app.post("/login", (req, res) => {
  let userName = req.body.username;
  res.cookie('username', String(userName));
  res.redirect('/');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

app.post("/register", (req, res) => { //email and password are correct
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Oops! Check your email and password");
  };
  for (let user in users) { //user.email undefined!!!
    let savedEmail = users[user].email;
    if (savedEmail === email) {
      res.status(400).send("Oops! That email is taken already!");
    }
  };
  let id = generateRandomString(3);
  users[id] = {
    email:email, password:password
  };
  res.cookie("user", String(id));
  res.redirect("/"); //passed the test, prints the userOBJ
});

app.post("/urls", (req, res) => {
  let id = generateRandomString(4);
  urlDatabase[id] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
