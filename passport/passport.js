const passport = require("passport");

// const googleStrategy;
// const facebookStrategy;
const loginStrategy = require("./loginStrategy");
const signupStrategy = require("./signupStrategy");
// const serializeUser;
// const deserializeUser;

// passport.use("google", googleStrategy);
// passport.use("facebook", facebookStrategy);
passport.use("local-login", loginStrategy);
passport.use("local-signup", signupStrategy);
// passport.serializeUser(serializeUser);
// passport.deserializeUser(deserializeUser);

module.exports = passport;
