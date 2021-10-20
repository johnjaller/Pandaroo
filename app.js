//import package
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// Set up HTTPS
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};
const https = require("https").Server(options, app);

// Set up socket.io
const io = require("socket.io")(https);

// Set up express session
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Set up public files and middleware
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

// Set up multer and S3 bucket
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, downloadFile } = require("./s3Bucket/s3");

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

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Set up middleware to check login status
function restLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("REST ID: ", req.user.id);
    return next();
  }
  console.log("app.js restLogIn failed");
  res.redirect("/bizlogin");
}
function userLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.cookies);
    console.log(req.session.passport.user, "passport USER");
    console.log(req.user, "USER");
    return next();
  } else {
    res.redirect("/login");
  }
}

// Set up facebook authentication
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

// Set up google authentication
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

app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get("/search/:restID", (req, res) => {
  // console.log(req, 'REQUEST!!!!<><><><>')

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

app.get("/userorder", (req, res) => {
  res.render("userOrder", { layout: "user" });
});

app.get("/setup", userLogIn, (req, res) => {
  res.render("userSetUp", { layout: "user" });
});

// Route for restaurants
app.use("/biz", restLogIn, restRouter.router());

// Upload restaurant menu pic
app.post("/bizaddmenu", upload.single("uploadedPhoto"), async (req, res) => {
  console.log("Receiving rest set menu req..");
  try {
    console.log("restRouter req.file: ", req.file);
    const file = req.file;
    let result = await uploadFile(file);
    console.log(result);

    await knex("menu")
      .insert({
        item: req.body.restMenuItem,
        rest_id: req.user.id,
        price: req.body.restMenuPrice,
        category: req.body.restMenuCategory,
        photo_path: result.Key,
      })
      .then(() => {
        console.log("Inserting path done");
      });

    // Unlink imagefile at /uploads
    await unlinkFile(file.path);
    console.log("Update menu done");
    res.redirect("/biz/bizsetupmenu");
  } catch (err) {
    throw new Error(err);
  }
});

// Upload restaurant profile pic
app.post("/bizsetuppropic", upload.single("uploadedFile"), async (req, res) => {
  try {
    console.log("app.js req.file: ", req.file);
    const file = req.file;
    let result = await uploadFile(file);
    console.log(result);

    await knex("restaurant")
      .update({
        profile_path: result.Key,
      })
      .where("id", req.user.id)
      .then(() => {
        console.log("Inserting path done");
      });
    await unlinkFile(file.path);
    res.redirect("/biz/bizsetup");
  } catch (err) {
    throw new Error(err);
  }
});

// Route for loading images from S3
app.get("/image/:key", (req, res) => {
  const key = req.params.key;
  const readStream = downloadFile(key);
  readStream.pipe(res);
});

//stripe checkout test route
const stripePayment = require("./stripe/stripePayment.js");
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

// Route for local login & signup
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

// Submit user login form
app.post(
  "/login",
  passportFunction.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Submit user signup form
app.post(
  "/signup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/setup",
    failureRedirect: "/login",
  })
);

// Submit rest login form
app.post(
  "/bizlogin",
  passportFunction.authenticate("local-login", {
    successRedirect: "/biz/info",
    failureRedirect: "/bizlogin",
  })
);

// Submit rest signup form
app.post(
  "/bizsignup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/biz/bizsetup",
    failureRedirect: "/bizlogin",
  })
);

// Submit user info setup form
app.put("/setup", userLogIn, async (req, res) => {
  console.log("app.js 281 ID: ", req.user.id);
  knex("account")
    .where("id", req.user.id)
    .update({
      firstname: req.body.fname,
      surname: req.body.lname,
      address: req.body.address,
      district: req.body.district,
      phone_no: req.body.phone,
    })
    .catch((e) => console.log(e));
  res.send("OKAY");
});

// Set up port
https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports = { app, https };
