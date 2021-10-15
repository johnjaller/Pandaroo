const fs = require("fs");
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

//import package
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

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, path.sep, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route for users
app.use("/user", userRouter.route());
// app.get("/user", (req, res) => {
//   res.render("userInfo", { layout: "user" });
// });

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

app.get("/info", (req, res) => {
  res.render("restInfo", { layout: "restaurant" });
});

app.get("/bookings", (req, res) => {
  res.render("restBooking", { layout: "restaurant" });
});

app.get("/orders", (req, res) => {
  res.render("restOrder", { layout: "restaurant" });
});

app.get("/bookingshistory", (req, res) => {
  res.render("restBookingHistory", { layout: "restaurant" });
});

app.get("/ordershistory", (req, res) => {
  res.render("restOrderHistory", { layout: "restaurant" });
});

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
  "/loginbiz",
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
