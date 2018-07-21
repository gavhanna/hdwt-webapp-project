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
  database: "recipebook",
  multipleStatements: true
});


db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database.");
});


// function to setup a simple hello response
app.get("/", function (req, res) {
  // res.send("Hello, world!");
  res.render("index", { root: VIEWS });
  console.log("Index Page");
});

app.get("/recipes", function (req, res) {
  const sql = `SELECT * FROM Recipe;`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("recipes", { root: VIEWS, response });
  });
  console.log("Recipes Page")
});

app.get("/recipes/:id", function (req, res) {
  const sql = `SELECT * FROM Recipe WHERE id = ${req.params.id};
              SELECT * FROM Ingredient WHERE recipe_id = ${req.params.id};
              SELECT * FROM Opinion WHERE recipe_id = ${req.params.id}`;
  const query = db.query(sql, (err, response) => {
    console.log(response);
    if (err) throw err;
    res.render("recipe", { root: VIEWS, response });
  });
  console.log("Recipe Page")
});

// create db table
app.get("/createtables", (req, res) => {
  const sql = `
  UPDATE Recipe
SET img_url = "http://pngimg.com/uploads/chocolate_cake/chocolate_cake_PNG40.png"
WHERE id = 2 ;
  `;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res);
  });

  res.send("Created table.")
});

app.get('/querydb', function (req, res) {
  const sql = `SELECT * FROM Recipe;`;
  db.query(sql, (err, response) => {
    if (err) throw err;
    console.log(response);
  });
});


// 404 route, always keep at the end!
app.get('*', function (req, res) {
  res.status(404).send("Page does not exist.");
});



// We need to set the requirements for the application to run
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  console.log("App is running on port " + process.env.PORT || 3000);
});

