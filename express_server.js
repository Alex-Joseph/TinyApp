const express = require("express");
const crypto = require("crypto");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

const urlDatabase = {
  "123456": {
    "b2xVn2": "http://www.lighthouselabs.ca"
  },
  "ironMan": {
    "9sm5xK": "http://www.google.com"
  }
};

const users = {
  "ironMan": {
    id: "ironMan",
    email: "iron_man@marvel.com",
    password: "PepperPotts"
  },
  "123456": {
    id: "123456",
    email: "mitchy@mapleLeafs.ca",
    password: "rookieOfTheYear"
  }
}
 //set as global, does current cookie overwrite?

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString(b) {
  return crypto.randomBytes(b).toString('hex');
};
// all app.get routes ----------------------------------------------------------
app.get("/", (req, res) => {
  let user = "guest";
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("urls_register");
})

app.get("/login", (req, res) => {
  res.render("urls_login");
})

app.get("/:shortURL", (req, res) => {
  let tinyURL = req.params.shortURL;
  console.log(tinyURL);
  console.log("urlDB", urlDatabase);
  for (var user in urlDatabase) {
    console.log("user", urlDatabase[user]);
    if (urlDatabase[user][tinyURL]) {
      console.log("in loop", urlDatabase[user][tinyURL]);
      res.redirect(urlDatabase[user][tinyURL]);
    };
  };
});

app.get("/urls", (req, res) => {
  if (req.cookies["userId"]) {
    let user = req.cookies["userId"];
    let templateVars = {
      urls: {},
      userId: user,
      userData: users[user]
    };
    for (let userId in urlDatabase) {
      if (user) {
    templateVars.urls = urlDatabase[userId];
      };
    };
  res.render("urls_index", templateVars);
  };
});

app.get("/urls/new", (req, res) => {
  if (req.cookies["userId"]) {
    let user = req.cookies["userId"];
    let templateVars = {
      urls: urlDatabase,
      userId: user,
      userData: users[user]
    }
  res.render("urls_new", templateVars);
  } else {
  res.redirect("/login")
  }
});

app.get("/urls/:id", (req, res) => {
  if (req.cookies["userId"]) {
    let user = req.cookies["userId"];
    let templateVars = {
      shortURL: req.params.id,
      urls: urlDatabase,
      userId: user,
      userData: users[user]
    }
  }
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// all app.post routes ---------------------------------------------------------
app.post("/login", (req, res) => {
  for (user in users) {
  let email = req.body.email.toLowerCase();
  let savedEmail = users[user].email;
  let passString = req.body.password;
  let savedPass = users[user].password;
  if (email === savedEmail) {
    if (passString === savedPass) {
      let userId = users[user].id; //sets cookies
      res.cookie("userId", userId);
      return res.render('home', {userId: userId});
    }
    return res.status(403).send("password incorrect, please try again");
  }
  }
  res.status(403).send("email does not exist, please try again");
});

app.post("/logout", (req, res) => {
  res.clearCookie('userId');
  res.render('home');
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
    email: email.toLowerCase(), password: password
  };
  res.cookie("userId", String(id));
  res.render("home"); //passed the test, prints the userOBJ
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
