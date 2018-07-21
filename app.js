const express = require("express"); // call express to be used by the application
const app = express();
const mysql = require("mysql");

const path = require("path");
const VIEWS = path.join(__dirname, "views");

app.set("view engine", "pug");
app.use(express.static("assets"));
app.use(express.static("images"));


const db = mysql.createConnection({
    host: "den1.mysql5.gear.host",
    user: "recipebook",
    password: "Gz4~?D5lOoF0",
    database: "recipebook"
});


db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");
});


// function to setup a simple hello response
app.get("/", function(req, res) {
    // res.send("Hello, world!");
    res.render("index", {root: VIEWS});
    console.log("Index Page");
});

app.get("/recipes", function(req, res) {
    res.render("recipes", {root: VIEWS});
    console.log("Recipes Page")
});


// 404 route, always keep at the end!
app.get('*', function(req, res){
  res.send('Does not exist.', 404);
  res.status(404).send("Page does not exist.");
});



// We need to set the requirements for the application to run
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("App is running on port " + process.env.PORT || 3000);
});

