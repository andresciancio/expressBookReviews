const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Filter object funtion
Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );


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
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!doesExist(username)){
      users.push({"username": username, "password": password})
      return res.status(200).json({message: "User successfully registered. Now you can login"})
    } else {
      return res.status(404).json({message: "User already exists!"})
    }

  } 
  return res.status(404).json({message: 'Unable to register user'})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  // Get books list with promise
  let get_books_list = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(  res.send(JSON.stringify(books,null,4)))
    },1000)})

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
const isbn = req.params.isbn
 let getBooksByISBN  = new Promise((resolve, reject)=>{
  resolve (res.send(books[isbn]))
 }) 

 getBooksByISBN.then((books) => {
  return books
 })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {


  let getBooksByAuthor  = new Promise((resolve, reject)=>{
    const author = req.params.author
    var filteredbooksbyauthor = Object.filter(books, (book) => book.author === author); 
    resolve (filteredbooksbyauthor)
   }) 
  
   getBooksByAuthor.then((books) => {
    res.send(books)
   })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let getBooksByTitle = new Promise((resolve, reject)=>{
    const title = req.params.title
    var filteredbooksbytitle = Object.filter(books, (book) => book.title === title); 
    resolve (filteredbooksbytitle)
   }) 
  
   getBooksByTitle.then((books) => {
    res.send(books)
   })
 

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
  
});

module.exports.general = public_users;
