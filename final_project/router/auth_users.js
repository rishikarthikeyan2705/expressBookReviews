const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}
const addUser = (username, password)=>{
    console.log(users)
    users.push({"username": username, "password": password})
    console.log(users)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.body.review
    const session = req.session
    console.log("reqSession --> ", session)
    const sessionUser = session.authorization.username
    const bookNums = Object.keys(books)
    bookNums.map((bookNum)=>{
        if(bookNum == isbn){
            books[bookNum]["reviews"][sessionUser] = review
            console.log('Books --> ', books)
            return res.status(200).json({message: "Review added successfully"})
        }
    })
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
    console.log('ENTERED')
    const isbn = req.params.isbn
    const userName = req.session.authorization.username
    const bookDetails = books[isbn]
    if(bookDetails){
        if(bookDetails["reviews"][userName]){
            delete bookDetails["reviews"][userName]
            res.status(200).json({message: "Successfully deleted your review"})
        }else{
            res.status(204).json({message: "No review found for that book"})
        }
    }else{
        res.status(401).send({message: "Invalid ISBN"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.addUser = addUser
