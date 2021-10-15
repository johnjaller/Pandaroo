// Enable HTTPS in express server
const fs = require("fs");
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

// Node packages
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const expressSession = require("express-session");
const https = require("https").Server(options, app);
const io = require("socket.io")(https);

// Set up knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Set up public folder and middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const handlebarHelpers = require("./handlebars-helpers");

// Session
app.use(
  expressSession({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
const passportFunctions = require("./passport/passport");
app.use(passportFunctions.initialize());
app.use(passportFunctions.session());

app.get(
  "/auth/facebook",
  passportFunctions.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

app.get(
  "/auth/facebook/callback",
  passportFunctions.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

// Set up user service and router
const UserService = require("./service/userService");
const UserRouter = require("./router/userRouter");
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);

// Set up restaurant service and router
const RestService = require("./service/restService");
const RestRouter = require("./router/restRouter");
const restService = new RestService(knex);
const restRouter = new RestRouter(restService);

// Route for users
app.use("/user", userRouter.route());
// app.get("/user", (req, res) => {
//   res.render("userInfo", { layout: "user" });
// });

app.get("/", (req, res) => {
  res.render("userHome", { layout: "user" });
});

app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get("/userorder", (req, res) => {
  res.render("userOrder", { layout: "user" });
});

// Route for restaurants
app.get("/bizsignup", (req, res) => {
  res.render("restSignUp", { layout: "restaurantSimple" });
});

app.get("/bizsetupmenu", (req, res) => {
  res.render("restSetUpMenu", { layout: "restaurant" });
});

app.get("/info", restRouter.router());

app.get("/bookings", restRouter.router());

app.get("/orders", restRouter.router());

app.get("/bookingshistory", restRouter.router());

app.get("/ordershistory", restRouter.router());

// Sher: Temporary route set up for testing sign in page
app.get("/login", (req, res) => {
  res.render("user-login");
});

app.get("/loginbiz", (req, res) => {
  res.render("rest-login");
});

https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports = { app, https };
