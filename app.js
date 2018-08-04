const express = require("express"); // call express to be used by the application
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fs = require('fs');

const path = require("path");
const VIEWS = path.join(__dirname, "views");

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(express.static("images"));
app.use(express.static("models"));

let ingredientsJson = require('./models/ingredients.json');


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
  const sql = `SELECT * FROM Recipe ORDER BY RAND() LIMIT 1;`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("index", { root: VIEWS, response });
  });
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
  const ingredients = ingredientsJson.filter(ingredient => ingredient.recipeId === parseInt(req.params.id));

  const sql = `SELECT * FROM Recipe WHERE id = ${req.params.id};
              SELECT * FROM Opinion WHERE recipe_id = ${req.params.id};`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    console.log(response);
    res.render("recipe", { root: VIEWS, response, ingredients });
  });
  console.log("Recipe Page")
});

// Add Recipe
app.get("/create", function (req, res) {
  res.render("create", { root: VIEWS });
});

app.post("/create", function (req, res) {
  /// JSON
  // get the highest ID number form the JSON and add 1 to it to get the next ID to be used
  // taken from the following stackoverflow respone:
  // https://stackoverflow.com/questions/38854230/search-for-the-biggest-id-and-add-new-biggest-id-in-json-file-nodejs

  function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function (o) {
      return o.id;
    })) + 1);
  }



  //SQL
  const sql = `INSERT INTO Recipe (title, description, instructions, preptime, cooktime, img_url) VALUES
  ("${req.body.title}", "${req.body.description}", "${req.body.instructions}", ${req.body.preptime}, ${req.body.cooktime}, "${req.body.imgurl}");`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;

    // save the ingredients
    // write to JSON file with the response.insertId as the recipe id
    let newId = getNextId(ingredientsJson);
    const newIngredients = [];
    req.body.ingredient.forEach(i => {
      newIngredients.push({
        "id": newId,
        "name": i.name,
        "amount": i.amount,
        "recipeId": response.insertId
      })
      console.log(newId);
      newId++;
    });

    fs.readFile('./models/ingredients.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        throw (err);
      } else {
        ingredientsJson.push(...newIngredients); // add the information from the above variable
        json = JSON.stringify(ingredientsJson, null, 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
        fs.writeFile('./models/ingredients.json', json, 'utf8'); // Write the file back
      }
    });
    res.redirect("/recipes");
  });
});

app.get("/update/:id", function (req, res) {
  const sql = `SELECT * FROM Recipe WHERE id = ${req.params.id};`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("update", { root: VIEWS, recipe: response[0] });
  });
  console.log("Update Page")
});

app.post("/update/:id", function (req, res) {
  const sql = `UPDATE Recipe SET title = "${req.body.title}", 
                                  description = "${req.body.description}", 
                                  preptime = ${req.body.preptime},
                                  cooktime = ${req.body.cooktime},
                                  instructions = "${req.body.instructions}",
                                  img_url = "${req.body.imgurl}" WHERE Id = ${req.params.id}`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.redirect("/recipes/" + req.params.id);
  });
});

app.get("/delete/:id", function (req, res) {
  const sql = `DELETE FROM Recipe WHERE id = ${req.params.id};`
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.redirect("/recipes");
  });
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

