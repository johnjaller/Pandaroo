const passport = require("passport");

const facebookStrategy = require("./facebook").facebook;
const serializeUser = require("./serializeDeserialize").serializeUser;
const deserializeUser = require("./serializeDeserialize").deserializeUser;

passport.use("facebook", facebookStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;
