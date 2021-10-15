const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (username, password, done) => {
  console.log("Signing up");
  console.log("E-mail: ", username);
  console.log("Password", password);

  try {
    // Check if the user already exist
    let matchedUser = await knex("account").where({ username: username });
    let matchedRest = await knex("restaurant").where({
      username: username,
    });

    if (matchedUser.length > 0 || matchedRest.length > 0) {
      console.log("User already exist.");
      return done(null, false);
    }

    // If user does not exit, hash the pw & create new user object
    let hashedPassword = await hashFunction.hashPassword(password);
    let newUser = {
      username: username,
      // firstname: data.fname,
      // surname: data.lname,
      password: hashedPassword,
      // phone_no: data.phone,
    };

    // Insert new user / restaurant into database correspondingly
    if (username.includes("@")) {
      // get user id and update the newuser object
      let userID = await knex("account").insert(newUser).returning("id");
      newUser.id = userID[0];
      console.log("New user: ", newUser);
      done(null, newUser);
    } else {
      let restID = await knex("restaurant").insert(newUser).returning("id");
      newUser.id = restID[0];
      console.log("New restaurant: ", newUser);
      done(null, newUser);
    }
  } catch (err) {
    throw new Error(err);
  }
});
