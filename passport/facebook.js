const passport = require("passport");
const userQueries = require("../database/userQueries.js");
const FacebookStrategy = require("passport-facebook").Strategy;
const facebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://localhost:8080/auth/facebook/callback",
  profileFields: ["id", "email", "name", "displayName"],
};

function facebookCallback(accessToken, refreshToken, profile, done) {
  const user = { username: profile.emails[0].value };

  console.log("SAVING THIS TO FB", profile.emails[0].value, profile.id);
  console.log("user information", profile);

  console.log("access token", accessToken);
  console.log("refresh token", refreshToken);

  userQueries
    .getByFacebookId(profile.id)
    .then((queryRow) => {
      if (queryRow.length === 0) {
        console.log("Create new user");
        return userQueries
          .postFacebook(
            profile.emails[0].value,
            profile.id,
            profile.name.givenName,
            profile.name.familyName
          )
          .then((newId) => {
            user.id = newId[0];
            console.log("User facebook added");
            return done(null, user);
          })
          .catch((error) => {
            done(error, false, {
              message: "Cannot add new user",
            });
          });
      } else {
        user.id = queryRow[0].id;
        console.log("Facebook existing user", user);
        return done(null, user);
      }
    })
    .catch((error) => {
      console.log("Failed to add facebook new user");
      return done(error, false, {
        message: "Cannot check database",
      });
    });
}

const facebook = new FacebookStrategy(facebookConfig, facebookCallback);
module.exports = {
  facebook: facebook,
};
