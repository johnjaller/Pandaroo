const express = require("express");
const passport = require("../passport/passport");

class UserRouter {
  constructor() {}

  router() {
    let router = express.Router();
    router.get("/secret", this.get.bind(this));
  }

  // Middleware to check if the user is logged in
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.cookies);
      console.log(req.session.passport.user, "passport USER");
      console.log(req.user, "USER");
      return next();
    }
    res.redirect("/login");
  }
}

module.exports = UserRouter;
