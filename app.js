const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption")


mongoose.set("strictQuery", true);

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//MongoDB connection through Mongoose
mongoose.connect(
  "mongodb+srv://Tennis_247:Trx%402407%23@cluster0.uunbpu6.mongodb.net/userDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);



app.get( "/", function (req, res) {
    res.render("home");
} );

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.post( "/register", function(req, res){

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save( function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

app.post( "/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne( {email: username}, function(err, result){
        if(err){
            console.log(err);
        } else {
            if(result){
                if(result.password === password){
                    res.render("secrets");
                }
            }
        }
    } );
} );











app.listen(3000, function(){
    console.log("Server started on port 3000.");
});