const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (email, password, done) => {
  console.log("Logging in");

  try {
    // Check if the user exist
    let matchedUser = await knex("account").where({ username: email });
    // Return false if user doesnt exist
    if (matchedUser.length == 0) {
      console.log("User does not exist!");
      return done(null, false);
    }
    // Check if the password is correct
    let user = matchedUsers[0];
    console.log(`User: ${user}`);
    console.log(`Password: ${user.password}`);

    let result = await hashFunction.checkPassowrd(password, user.hash);
    console.log(`Result of checkPassword: ${result}`);

    if (result) {
      console.log("Successfully logged in!");
      return done(null, user);
    } else {
      console.log("Wrong password");
      return done(null, false);
    }
  } catch (err) {
    throw new Error(err);
  }
});
