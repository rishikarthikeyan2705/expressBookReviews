const express = require('express');
let axios = require('axios')
let circularJson = require('circular-json')
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
let addUser = require("./auth_users.js").addUser;
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password){
      if(!doesExist(username)){
          addUser(username, password)
          return res.status(200).json({message: "User successfully registred. Now you can login"});
      }else{
          return res.status(401).json({message: "User already exists. Proceed to login."})
      }
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const bookListResponse = await axios.get('https://rishikarthi1-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  const bookList = bookListResponse.data
  return res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn
  const bookListResponse = await axios.get('https://rishikarthi1-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  const bookList = bookListResponse.data
  for(let bookNum in bookList){
      if(bookNum== isbn) return res.status(200).json(books[bookNum]);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author
  const bookListResponse = await axios.get('https://rishikarthi1-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  const bookList = bookListResponse.data
  const bookNum = Object.keys(bookList)
  bookNum.map((book)=>{
      if(books[book]['author'] == author){
          res.status(200).json(books[book])
      }
  })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title
    const bookListResponse = await axios.get('https://rishikarthi1-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  const bookList = bookListResponse.data
    const bookNum = Object.keys(bookList)
    bookNum.map((book)=>{
        if(books[book]['title'] == title){
            res.status(200).json(books[book])
        }
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    for(let bookNum in books){
        if(bookNum == isbn) {
            return res.status(200).json(books[bookNum]['reviews']);
        }   
    }
});

module.exports.general = public_users;
