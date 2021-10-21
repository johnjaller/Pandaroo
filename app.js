const fs = require("fs");
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

//import package
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripePayment = require("./stripe/stripePayment.js");
const https = require("https").Server(options, app);

// Set up socket.io
const io = require("socket.io")(https);

// Set up express session
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Set up public folder and middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Set up knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const handlebarHelpers = require("./handlebars-helpers");

// Set up restaurant service and router
const UserService = require("./service/userService");
const UserRouter = require("./router/userRouter");
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);

const RestService = require("./service/restService");
const RestRouter = require("./router/restRouter");
const restService = new RestService(knex);
const restRouter = new RestRouter(restService);

// Middleware to check if the user/rest is logged in
function userLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.session.passport.user, "passport USER");
    console.log(req.user, "USER");
    return next();
  } else {
    res.redirect("/login");
  }
}

function restLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user, "REST");
    return next();
  }
  console.log("failed");
  res.redirect("/bizlogin");
}

// Set up facebook login
app.get(
  "/auth/facebook",
  passportFunction.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

app.get(
  "/auth/facebook/callback",
  passportFunction.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

// Set up google login
app.get(
  "/auth/google",
  passportFunction.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passportFunction.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Route for users
app.use("/user", userRouter.route());

app.get("/", userLogIn);

app.get("/", async (req, res) => {
  if (req.query.q === undefined) {
    let restTag = await userService.getRestTag();
    let user = await knex("account")
      .select("district", "firstname")
      .where("id", req.user.id);
    console.log(user[0].district);
    let featuredRest = await knex("restaurant").select();
    let locationRecommendation;
    if (user[0].district != undefined) {
      locationRecommendation = await knex("restaurant")
        .select()
        .where("district", user[0].district);
    } else {
      locationRecommendation = [];
    }

    console.log(locationRecommendation, "loaded info");
    res.render("userHome", {
      layout: "user",
      userInfo: user,
      recommendation: locationRecommendation,
      feature: featuredRest,
      result: "Featured",
      tag: restTag,
    });
  } else {
    console.log(req.query.q, "this is a query");
    let query = req.query.q.split(" ").join("|");
    let queryResult = await knex("restaurant")
      .select()
      .join("tag_rest_join", "restaurant.id", "tag_rest_join.rest_id")
      .join("tag", "tag.id", "tag_rest_join.tag_id")
      .where(
        knex.raw(
          `to_tsvector(concat_ws(' ',name,address,district,description,tag.tag_name)::text) @@ to_tsquery('${query}:*')`
        )
      );
    console.log(queryResult);
    res.render("userHome", {
      layout: "user",
      result: "Search result:",
      queryString: req.query.q,
      rest: queryResult,
    });
  }
});

app.get("/search/:restID", (req, res) => {
  console.log(req.params.restID, "rest id how many times?");

  return knex("restaurant")
    .select()
    .where({ id: req.params.restID })
    .then((data) => {
      console.log(data);
      return res.render("userOrder", { layout: "user" });
    })
    .catch((e) => console.log(e));
});

app.post("/search/:id", (req, res) => {
  return knex("bookmark")
    .insert({ account_id: req.user.id, rest_id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((e) => console.log(e));
});

app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get("/userorder", (req, res) => {
  res.render("userOrder", { layout: "user" });
});

//stripe checkout test route
app.get("/checkout", (req, res) => {
  res.render("checkout", { layout: "user" });
});

app.post("/checkout", stripePayment);

app.get("/success", (req, res) => {
  res.render("paymentSuccess", { layout: "user" });
});

app.get("/cancel", (req, res) => {
  res.render("paymentFailed", { layout: "user" });
});

// Route for restaurants
app.get("/bizsetup", (req, res) => {
  res.render("restSetUp", { layout: "restaurantSimple" });
});

app.use("/biz", restRouter.router());

// Sher: Temporary route set up for testing sign in page
app.get("/login", (req, res) => {
  res.render("userLogin");
});

app.get("/bizlogin", (req, res) => {
  res.render("restLogin");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.render("userLogin");
});

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
