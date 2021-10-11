const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (username, password, done) => {
  console.log("Signing up");
  console.log("E-mail: ", email);
  console.log("Password", password);

  try {
    // Check if the user already exist
    let matchedUser = await knex("account").where({ username: username });
    let matchedRest = await knex("restaurant").where({ username: username });

    if (matchedUser.length > 0 || matchedRest.length > 0) {
      console.log("User already exist.");
      return done(null, false);
    }

    // If user does not exit, hash the pw & create new user object
    let hashedPassword = await hashFunction.hashPassword(password);
    let newUser = {
      username: username,
      password: hashedPassword,
    };
    console.log(`New user: ${newUser}`);

    // Insert new user / restaurant into database correspondingly
    if (username.includes("@")) {
      await knex("account").insert(newUser);
      console.log("New user: ", newUser);
      done(null, newUser);
    } else {
      await knex("restaurant").insert(newUser);
      console.log("New restaurant: ", newUser);
      done(null, newUser);
    }
  } catch (err) {
    throw new Error(err);
  }
});
