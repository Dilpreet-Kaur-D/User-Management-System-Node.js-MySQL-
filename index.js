const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
// In mysql2 promise version, the Promise is returned directly by methods like createConnection, query, and execute.
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

app.use(methodOverride("_method"));
// If you see _method somewhere, treat request as that method
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

function createRandomUser() {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ]
};

// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let data = [];
// for (let i = 0; i < 100; i++) {
//   data.push(createRandomUser());
// }


app.listen("8080", () => { console.log("server is listening at 8080") });

//Home Route---------------------------------------------------

app.get("/", async (req, res) => {
  // SQL query (no user input, so query() is fine here)
  let q = "SELECT COUNT(*) FROM `user`";

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'dil'
    });
    //destructing because connection.execute returns array and used prepare and execute internally
    /*
    In mysql2 promise version:
    connection.query() returns a Promise
    That Promise resolves to an array: [results, fields]
  */
    const [results, fields] = await connection.query(q);
    //here we are using promise version of mysql if we are using callback version then the syntax of connection.query will be different

    console.log(results);
    let count = results[0]["COUNT(*)"];
    res.render("home.ejs", { count });
    // await connection.end();----no need to write this because connection ends automatically when respose is send
  } catch (err) {
    console.error(err);
    return res.send("some error in DB");
  }
}

);

//Show Route---------------------------------------------------


app.get("/user", async (req, res) => {
  let q = "SELECT * FROM `user`";

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'dil'
    });

    const [results, fields] = await connection.query(q);

    console.log(results);
    res.render("showuser.ejs", { results });
  } catch (err) {
    console.error(err);
    return res.send("some error in DB");
  }

});

// Edit Route----to get edit form--------------------------------------

app.get("/user/:id/edit", async (req, res) => {
  let { id } = req.params;
  let q = "SELECT * FROM `user` WHERE id=?";
  let value = id;
  console.log(id);


  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'dil'
    });

    const [results, fields] = await connection.query(q, value);

    console.log(results);
    let user = results[0];
    res.render("edit.ejs", { user });
  } catch (err) {
    console.error(err);
    return res.send("some error in DB");
  }


});

// Update Router(DB)-----------------------------
app.patch("/user/:id", async (req, res) => {
  let { id } = req.params;
  let { pass: formPass, username: newUsername } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "dil"
    });

    // 1 Get user
    let q1 = "SELECT * FROM user WHERE id = ?";
    const [results] = await connection.query(q1, [id]);

    if (results.length === 0) {
      await connection.end();
      return res.send("User not found");
    }

    let user = results[0];

    // 2️ Check password
    if (formPass !== user.password) {
      await connection.end();
      return res.send("Wrong password");
    }

    // 3️ Update username
    let q2 = "UPDATE user SET username = ? WHERE id = ?";
    await connection.query(q2, [newUsername, id]);

    await connection.end();
    res.redirect("/user");

  } catch (err) {
    console.error(err);
    res.send("Database error");
  }
});
// CREATE FORM TO ADD A NEW USER TO THE DATABASE
//1. form
app.get("/user/new", (req, res) => { res.render("new.ejs"); });
//2.actual addition of user
app.post("/user", async (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();
  let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "dil"
    });

    await connection.query(q, [id, username, email, password]);
    await connection.end();

    res.redirect("/user");

  } catch (err) {
    console.error(err);
    res.send("Error adding user");
  }
}
)
//CREATE FORM TO DELETE A USER FROM DATABASE IF THEY ENTER CORRECT EMAIL ID AND PASSWORD
// Show delete form
app.get("/user/:id/delete", async (req, res) => {
  let { id } = req.params;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "dil"
    });

    let q = "SELECT * FROM user WHERE id = ?";
    const [results] = await connection.query(q, [id]);

    if (results.length === 0) {
      await connection.end();
      return res.send("User not found");
    }

    let user = results[0];
    console.log(user);
    await connection.end();

    res.render("delete.ejs", { user });

  } catch (err) {
    console.error(err);
    res.send("Database error");
  }
});

// Delete user from DB
app.post("/user/:id/delete", async (req, res) => {
  let { id } = req.params;
  let { email, password } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "dil"
    });

    // 1️ Get user by id
    let q1 = "SELECT * FROM user WHERE id = ?";
    const [results] = await connection.query(q1, [id]);

    if (results.length === 0) {
      await connection.end();
      return res.send("User not found");
    }

    let user = results[0];

    // 2️ Verify email + password
    if (user.email !== email || user.password !== password) {
      await connection.end();
      return res.send("Email or password incorrect");
    }

    // 3️ Delete
    let q2 = "DELETE FROM user WHERE id = ?";
    await connection.query(q2, [id]);

    await connection.end();
    res.redirect("/user");
  } catch (err) {
    console.error(err);
    res.send("Database error");
  }
});
