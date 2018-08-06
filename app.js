const express = require("express"); // call express to be used by the application
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fs = require('fs');

const path = require("path");
const VIEWS = path.join(__dirname, "views");

app.set("view engine", "pug");
app.use(bodyParser.json());
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


// Root/Index
app.get("/", function (req, res) {
  const sql = `SELECT * FROM Recipe ORDER BY RAND() LIMIT 1;`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("index", { root: VIEWS, response });
  });
  console.log("Index Page");
});

// GET Recipes
app.get("/recipes", function (req, res) {
  const sql = `SELECT * FROM Recipe;`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("recipes", { root: VIEWS, response });
  });
  console.log("Recipes Page")
});


// GET Single Recipe
app.get("/recipes/:id", function (req, res) {
  const ingredients = ingredientsJson.filter(ingredient => ingredient.recipeId == parseInt(req.params.id));
  console.log(ingredients);
  const sql = `SELECT * FROM Recipe WHERE id = ${req.params.id};
              SELECT * FROM Opinion WHERE recipe_id = ${req.params.id};`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("recipe", { root: VIEWS, response, ingredients });
  });
  console.log("Recipe Page")
});

// GET Add Recipe
app.get("/create", function (req, res) {
  res.render("create", { root: VIEWS });
});

// POST Create new Recipe
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

  // SQL Query
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
    // JSON
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

// GET Update Recipe
app.get("/update/:id", function (req, res) {
  const currentIngredients = ingredientsJson.filter(ingredient => ingredient.recipeId == parseInt(req.params.id));
  console.log(currentIngredients);
  const sql = `SELECT * FROM Recipe WHERE id = ${req.params.id};`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.render("update", { root: VIEWS, recipe: response[0], ingredients: currentIngredients });
  });
  console.log("Update Page")
});

// POST Update Recipe
app.post("/update/:id", function (req, res) {
  function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function (o) {
      return o.id;
    })) + 1);
  }

  const id = req.params.id;
  const newIngredients = [];
  ingredientsJson.forEach((i, n) => {
    if (i.recipeId != id) {
      newIngredients.push(i);
    }
  })

  let newId = getNextId(newIngredients);

  req.body.ingredient.forEach((i, n) => {
    newIngredients.push({
      id: newId,
      name: i.name,
      amount: i.amount,
      recipeId: req.params.id
    })
    newId++;
  });

  const sql = `UPDATE Recipe SET title = "${req.body.title}", 
  description = "${req.body.description}", 
  preptime = ${req.body.preptime},
  cooktime = ${req.body.cooktime},
  instructions = "${req.body.instructions}",
  img_url = "${req.body.imgurl}" WHERE Id = ${req.params.id}`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    // wait for response and then write to the JSON file aswell
    fs.readFile('./models/ingredients.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        throw (err);
      } else {
        json = JSON.stringify(newIngredients, null, 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
        fs.writeFile('./models/ingredients.json', json, 'utf8'); // Write the file back
      }
    });
    res.redirect("/recipes/" + req.params.id);
  });
});

// GET Delete Recipe
app.get("/delete/:id", function (req, res) {
  const sql = `DELETE FROM Recipe WHERE id = ${req.params.id};`
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.redirect("/recipes");
  });
});

// GET Delete ingredient
app.get("/delete-ingredient/:id/:recipe_id", (req, res) => {
  const id = req.params.id;
  ingredientsJson.forEach((i, n) => {
    if (i.id == id) {
      ingredientsJson.splice(n, 1);
    }
  });
  json = JSON.stringify(ingredientsJson, null, 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
  fs.writeFile('./models/ingredients.json', json, 'utf8'); // Write the file back
  res.redirect("/recipes/" + req.params.recipe_id);
});

// POST New Comment
app.post("/newcomment/:id", (req, res) => {
  console.log(req.body);
  const sql = `INSERT INTO Opinion (recipe_id, name, content) VALUES (${req.params.id}, "${req.body.name}", "${req.body.comment}" )`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.redirect("/recipes/" + req.params.id);
  });
});

// GET Individual Comment
app.get("/comment/:id", (req, res) => {
  const sql = `SELECT * FROM Opinion WHERE id = ${req.params.id};`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    const comment = response[0];
    console.log(comment);
    res.render("comment", { root: VIEWS, comment: comment });
  });
});

// POST Update individual comment
app.post("/comment/:id/:recipe_id", (req, res) => {
  const sql = `UPDATE Opinion SET name = "${req.body.name}", 
  content = "${req.body.comment}" WHERE Id = ${req.params.id}`;
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    console.log(response);
    res.redirect("/recipes/" + req.params.recipe_id);
  });
});

// GET Delete Comment
app.get("/delete-comment/:id/:recipe_id", function (req, res) {
  const sql = `DELETE FROM Opinion WHERE id = ${req.params.id};`
  const query = db.query(sql, (err, response) => {
    if (err) throw err;
    res.redirect("/recipes/" + req.params.recipe_id);
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

app.post("/search.json", (req, res) => {
  const sql = `SELECT * FROM Recipe WHERE title LIKE "%${req.body.query}%";`;
  db.query(sql, (err, response) => {
    if (err) throw err;
    console.log(response);
    res.send(response)
  });
})

// I used this to try different queries on the DB
app.get('/querydb', function (req, res) {
  const sql = `select *
  from INFORMATION_SCHEMA.COLUMNS
  where TABLE_NAME='Opinion'`;
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

