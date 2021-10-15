const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (username, password, done) => {
  console.log("Logging in");

  try {
    // Check if the user exist
    let matchedUser = await knex("account").where({ username: username });
    let matchedRest = await knex("restaurant").where({ username: username });

    // Return false if user doesnt exist
    if (matchedUser.length == 0 && matchedRest.length == 0) {
      console.log("User does not exist!");
      return done(null, false, { message: "User does not exist" });
    }

    // Check password for a non-business user
    if (matchedUser.length > 0 && matchedRest.length == 0) {
      let user = matchedUser[0];
      console.log(user);

      let result = await hashFunction.checkPassowrd(password, user.password);
      console.log(`Result of checkPassword: ${result}`);

      if (result) {
        console.log("Successfully logged in!");
        return done(null, user);
      } else {
        console.log("Wrong password");
        return done(null, false, { message: "Incorrect password" });
      }
    }

    // Check password for a business user
    if (matchedUser.length == 0 && matchedRest.length > 0) {
      let rest = matchedRest[0];
      console.log(`Restaurant: ${rest}`);
      console.log(`Password: ${rest.password}`);

      let result = await hashFunction.checkPassowrd(password, rest.password);
      console.log(`Result of checkPassword: ${result}`);

      if (result) {
        console.log("Successfully logged in!");
        return done(null, rest);
      } else {
        console.log("Wrong password");
        return done(null, false);
      }
    }

    // Return if error occur in server side
    else {
      return done(err);
    }
  } catch (err) {
    throw new Error(err);
  }
});
