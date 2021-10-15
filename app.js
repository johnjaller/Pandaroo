const fs = require("fs");
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

//import package
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Set up express session
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user, "USER");
    return next();
  }
  console.log("failed");
  res.redirect("/bizsignup");
};

const https = require("https").Server(options, app);
const io = require("socket.io")(https);
const UserService = require("./service/userService");
const UserRouter = require("./router/userRouter");

//initialisation
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);

//middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const handlebarHelpers = require("./handlebars-helpers");

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

// Set up restaurant service and router
const RestService = require("./service/restService");
const RestRouter = require("./router/restRouter");
const restService = new RestService(knex);
const restRouter = new RestRouter(restService);

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, path.sep, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route for users
app.use("/user", userRouter.route());

app.get("/", isLoggedIn, (req, res) => {
  console.log("loading first page ");
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
  res.render("userLogin");
});

app.get("/bizlogin", (req, res) => {
  res.render("restLogin");
});

// app.get("/logout", (req, res) => {
//   req.logout();
//   res.render("/login");
// });

// Sher: Post route for testing local strategy
app.post(
  "/login",
  passportFunction.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post(
  "/signup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post(
  "/bizlogin",
  passportFunction.authenticate("local-login", {
    successRedirect: "/info",
    failureRedirect: "/bizsignup",
  })
);

// Set up port
https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports = { app, https };
