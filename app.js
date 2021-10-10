//import package
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Set up passport authentication
const passport = require("./passport/passport");
app.use(passport.initialize());
app.use(passport.session());

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up router
const UserRouter = require("./router/userRouter");
const userRouter = new UserRouter();

//middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.render("Hello World");
// });

// Sher: Temporary route set up for testing sign in page
app.get("/login", (req, res) => {
  res.render("user-login");
});

app.get("/loginbiz", (req, res) => {
  res.render("rest-login");
});

app.use("/secret", userRouter.router());

// Set up port
http.listen(8080, () => {
  console.log("app listening to port 8080");
});

module.exports = { http, app };
