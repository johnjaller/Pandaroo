const passport = require("passport");

const googleStrategy = require("./google").google;
const serializeUser=require('./serializeDeserialize').serializeUser
const deserializeUser=require('./serializeDeserialize').deserializeUser
passport.use("google", googleStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;
