const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "customer successfully registred. Now you can login",
      });
    } else {
      return res.status(404).json({ message: "customer already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register customer." });
});

// Get the book list available in the shop

// public_users.get("/", function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify({ books: books }, null, 4));
// });

let booksPromis = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(books);
  }, 0);
});

public_users.get("/", function (req, res) {
  //Write your code here
  let result = "";
  booksPromis.then((data) => {
    result = JSON.stringify({ books: data }, null, 4);
    return res.send(result);
  });
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   return res.send(books[isbn]);
// });

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  booksPromis.then((data) => {
    return res.send(data[isbn]);
  });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   let result = [];
//   for (key in books) {
//     if (books[key].author == author) {
//       let obj = {
//         isbn: key,
//         title: books[key].title,
//         reviews: books[key].reviews,
//       };
//       result.push(obj);
//     }
//   }
//   return res.json({ booksbyauthor: result });
// });

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let result = [];
  booksPromis.then((data) => {
    for (key in data) {
      if (data[key].author == author) {
        let obj = {
          isbn: key,
          title: data[key].title,
          reviews: data[key].reviews,
        };
        result.push(obj);
      }
    }
    return res.send(result);
  });
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   let result = [];
//   for (key in books) {
//     if (books[key].title == title) {
//       let obj = {
//         isbn: key,
//         author: books[key].author,
//         reviews: books[key].reviews,
//       };
//       result.push(obj);
//     }
//   }
//   return res.json({ booksbytitle: result });
// });

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let result = [];
  booksPromis.then((data) => {
    for (key in data) {
      if (data[key].title == title) {
        let obj = {
          isbn: key,
          author: data[key].author,
          reviews: data[key].reviews,
        };
        result.push(obj);
      }
    }
    return res.send(result);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
