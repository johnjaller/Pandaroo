//import package
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Route for users
app.get("/user", (req, res) => {
  res.render("userInfo", { layout: "user" });
});

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
  res.render("user-login");
});

app.get("/loginbiz", (req, res) => {
  res.render("rest-login");
});

http.listen(8080, () => {
  console.log("app listening to port 8080");
});

module.exports = { app, http };

