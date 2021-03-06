const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (username, password, done) => {
  console.log("Signing up");
  console.log("Username: ", username);
  console.log("Password: ", password);

  try {
    // Check if the user already exist
    let matchedUser = await knex("account").where({ username: username });
    let matchedRest = await knex("restaurant").where({
      username: username,
    });

    if (matchedUser.length > 0 || matchedRest.length > 0) {
      console.log("User already exist.");
      return done(null, false, { message: "User already exist" });
    }

    // If user does not exit, hash the pw & create new user object
    let hashedPassword = await hashFunction.hashPassword(password);
    let newUser = {
      username: username,
      password: hashedPassword,
    };

    // Insert new user / restaurant into database correspondingly
    if (username.includes("@")) {
      let userID = await knex("account").insert(newUser).returning("id");
      newUser.id = userID[0];
      newUser.type = "user";
      console.log("New user: ", newUser);
      done(null, newUser);
    } else {
      let restID = await knex("restaurant").insert(newUser).returning("id");
      newUser.id = restID[0];
      newUser.type = "rest";
      console.log("New restaurant: ", newUser);
      done(null, newUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});
