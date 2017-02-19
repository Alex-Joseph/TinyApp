const users = {
  "ironMan": {
    id: "ironMan",
    email: "iron_man@marvel.com",
    password: "$2a$10$mU.fPcM7LDvwU6gPVuF15ugsLOjv04ys6P0MLDjvfvgJoJnnczQia"
  }, //unHashedPassword = PepperPotts
  "123456": {
    id: "123456",
    email: "mitchy@mapleLeafs.ca",
    password: "rookieOfTheYear"
  }
};
const urlDatabase = {
  "123456": {
    "b2xVn2": "http://www.lighthouselabs.ca"
  },
  "ironMan": {
    "9sm5xK": "http://www.google.com"
  }
};
// ------------------------------------------------------
function getUserId (email) { //working
  for (var user in users) {
    if (users[user].email) {
      return users[user].id;
    }
  }
}
// console.log(getUserId("iron_man@marvel.com"));
// -------------------------------------------------------
function verifySUrl (sUrl) { //working
  for (var user in urlDatabase) {
    if (urlDatabase[user][sUrl]) {
      return urlDatabase[user][sUrl]
    };
  };
};
//--------------------------------------------------------
let a = "b2xVn2";
console.log(verifySUrl(a));
