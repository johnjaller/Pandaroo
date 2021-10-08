//import package
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//route
// app.get("/", (req, res) => {
//   res.render("Hello World");
// });

app.get("/login", (req, res) => {
  res.render("user-login-signup");
});

http.listen(8080, () => {
  console.log("app listening to port 8080");
});

module.exports = { http, app };
