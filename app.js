//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, });

const userSchema = new mongoose.Schema({
    email: 'string',
    password: 'string',
});


const User = mongoose.model('User', userSchema);


app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const newUser = new User({
        email: req.body.username,
        password: hash
    });

    newUser.save()
    .then(() => { res.render('secrets')})
    .catch(err => { console.error(err) });


    

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
    .then((foundUser) => { 
        if(foundUser){
           if(bcrypt.compareSync(password, foundUser.password)){
            res.render('secrets');
           } else {
            res.send('Your password is incorrect');
           }
        }
    })
    .catch(err => { console.error(err) });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
