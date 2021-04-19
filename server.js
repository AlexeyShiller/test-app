const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const baseUrl = path.join(__dirname, '.');

const app = express();

app.use(express.static(path.join(baseUrl, 'public')));
// app.use(express.static(path.join(baseUrl, 'register')));
// app.use(express.static(path.join(baseUrl, 'login')));

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
  .connect('mongodb+srv://Alex:jawa_59003@cluster0.akygk.mongodb.net/Table_loginPass?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get(['/', '/register', '/login', '/table'], (req, res) => {
  res.send(fs.readFileSync(`${baseUrl}/public/index.html`, 'utf8'));
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
