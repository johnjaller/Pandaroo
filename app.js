// Import package
require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("express-flash");
const cors = require("cors");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const stripePayment = require("./stripe/stripePayment.js");

// Set up HTTPS
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};
const https = require("https").Server(options, app);

// Set up express session
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Set up public files and middleware
app.use(flash());
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

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Set up middleware to check login status
function restLogIn(req, res, next) {
  console.log("REST: ", req.user);
  console.log("SESSION PASSPORT USER: ", req.session.passport.user);
  console.log("REST ID: ", req.user.id);
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("app.js restLogIn failed");
    res.redirect("/bizlogin");
  }
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
app.use("/user", userLogIn, userRouter.route());
app.get("/", userLogIn);

// Set up user service and router
const searchQuery = require("./database/searchQueries").searchQuery;
app.get("/search", searchQuery);

const BookingService = require("./service/bookingService");
const BookingRouter = require("./router/bookingRouter");
const bookingService = new BookingService(knex);
const bookingRouter = new BookingRouter(bookingService);
app.use("/booking", bookingRouter.route());

// OrderService
const OrderRouter = require("./router/orderRouter");
const OrderService = require("./service/orderService");
const orderService = new OrderService(knex);
const orderRouter = new OrderRouter(orderService);
app.use("/order", orderRouter.route());

// Checkout
const CheckoutService = require("./service/checkoutService");
const CheckoutRouter = require("./router/checkoutRouter");
const checkoutService = new CheckoutService(knex);
const checkoutRouter = new CheckoutRouter(checkoutService);

app.post("/review/:restId", (req, res) => {
  console.log(req.body);
  return knex("review")
    .insert({
      account_id: req.user.id,
      rest_id: req.params.restId,
      rating: req.body.rating,
    })
    .then(() => {
      res.send("success");
    })
    .catch((e) => console.log(e));
});

app.get("/", async (req, res) => {
  let restTag = await userService.getRestTag();
  for (let i = 0; i < restTag.length; i++) {
    switch (restTag[i]["tag_name"]) {
      case "hongKongStyle":
        restTag[i]["tag_name"] = "Hong Kong Style";
        break;
      case "chinese":
        restTag[i]["tag_name"] = "Chinese";
        break;
      case "taiwanese":
        restTag[i]["tag_name"] = "Taiwanese";
        break;
      case "japanese":
        restTag[i]["tag_name"] = "Japanese";
        break;
      case "korean":
        restTag[i]["tag_name"] = "Korean";
        break;
      case "western":
        restTag[i]["tag_name"] = "Western";
        break;
      case "petFriendly":
        restTag[i]["tag_name"] = "Pet Friendly";
        break;
      case "liveBroadcast":
        restTag[i]["tag_name"] = "Live Boardcast";
        break;
      default:
        restTag[i]["tag_name"] = "Parking";
    }
  }
  console.log("restTag", restTag);
  let user = await knex("account")
    .select("district", "firstname")
    .where("id", req.user.id);
  console.log(user[0].district);
  let featuredRest = await knex("restaurant").select();
  for (let i = 0; i < featuredRest.length; i++) {
    let rating;
    rating = await knex("review")
      .where("rest_id", featuredRest[i].id)
      .select("rating");
    if (rating.length != 0) {
      rating =
        Math.round(
          (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
            rating.length) *
            2
        ) / 2;
      console.log(rating);
    } else {
      rating = 0;
    }

    featuredRest[i]["rating"] = rating;
  }
  let locationRecommendation;
  if (user[0].district != undefined) {
    locationRecommendation = await knex("restaurant")
      .select()
      .where("district", user[0].district);
    for (let i = 0; i < locationRecommendation.length; i++) {
      let rating;
      rating = await knex("review")
        .where("rest_id", locationRecommendation[i].id)
        .select("rating");
      if (rating.length != 0) {
        rating =
          Math.round(
            (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
              rating.length) *
              2
          ) / 2;
        console.log(rating);
      } else {
        rating = 0;
      }
      locationRecommendation[i]["rating"] = rating;
    }
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
});

app.post("/bookmark/:id", (req, res) => {
  return knex("bookmark")
    .insert({ account_id: req.user.id, rest_id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((e) => console.log(e));
});

app.delete("/bookmark/:id", (req, res) => {
  return knex("bookmark")
    .delete()
    .where({ account_id: req.user.id, rest_id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((e) => console.log(e));
});

app.get("/tag/:tagid", async (req, res) => {
  let tagName = await knex("tag")
    .select("tag_name")
    .where("id", req.params.tagid);
  return knex("restaurant")
    .select(
      "restaurant.id",
      "restaurant.name",
      "restaurant.address",
      "restaurant.district",
      "restaurant.profile_path",
      "restaurant.phone_no",
      "restaurant.seats"
    )
    .join("tag_rest_join", "restaurant.id", "tag_rest_join.rest_id")
    .join("tag", "tag_rest_join.tag_id", "tag.id")
    .where("tag.id", req.params.tagid)
    .then(async (data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let rating;
        rating = await knex("review")
          .where("rest_id", data[i].id)
          .select("rating");
        if (rating.length != 0) {
          rating =
            Math.round(
              (rating
                .map((item) => Number(item.rating))
                .reduce((a, b) => a + b) /
                rating.length) *
                2
            ) / 2;
          console.log(rating);
        } else {
          rating = 0;
        }
        data[i]["rating"] = rating;
      }
      res.render("userHome", {
        layout: "user",
        rest: data,
        result: "Search result: " + tagName[0].tag_name,
      });
    });
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

//stripe checkout
app.use("/checkout", checkoutRouter.route());

app.post("/checkout", stripePayment);

app.get("/success/:restId", (req, res) => {
  res.render("paymentSuccess", { layout: "user" });
});

app.get("/success", (req, res) => {
  res.render("paymentSuccess", { layout: "user" });
});

app.post("/discount", (req, res) => {
  console.log(req.body.code);
  let discountCode = req.body.code;
  knex("restaurant")
    .select("discount")
    .where("code", discountCode)
    .then((data) => {
      if (data.length === 0) {
        console.log("there is no such coupon");
        res.json({ percent_off: null });
      } else {
        res.json({
          discountCode: req.body.code,
          percent_off: Number(data[0].discount),
        });
      }
    });
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

// Sher: Post route for testing local strategy
app.post(
  "/login",
  passportFunction.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post(
  "/signup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/user/setup",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post(
  "/bizlogin",
  passportFunction.authenticate("local-login", {
    successRedirect: "/biz/info",
    failureRedirect: "/bizlogin",
    failureFlash: true,
  })
);

app.post(
  "/bizsignup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/biz/bizsetup",
    failureRedirect: "/bizlogin",
    failureFlash: true,
  })
);

// Handle 404 error
app.use("*", (req, res) => {
  if (!req.user) {
    res.status(404).render("error404", { layout: "userSimple", guest: true });
  } else if (req.user.username.includes("@")) {
    res.status(404).render("error404", { layout: "user", user: true });
  } else {
    res
      .status(404)
      .render("error404", { layout: "restaurant", restaurant: true });
  }
});

// Handle 500 server error
app.use("*", (error, req, res, next) => {
  console.error(error.stack);
  res.status(500).render("error500", { layout: "userSimple" });
});

// Set up port
https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports = { app, https };
