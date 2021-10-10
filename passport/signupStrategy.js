const development = require("../knexfile").development;
const knex = require("knex")(development);
const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (email, password, done) => {
  console.log("Signing up");
  console.log("E-mail: ", email);
  console.log("Password", password);

  try {
    // Check if the user already exist
    let users = await knex("account").where({ username: email });
    if (users.length > 0) {
      return done(null, false);
    }

    // If user does not exit, hash the pw & create new user
    let hashedPassword = await hashFunction.hashPassword(password);
    let newUser = {
      username: email,
      password: hashedPassword,
    };
    await knex("account").insert(newUser);
    console.log("New user: ", newUser);
    done(null, newUser);
  } catch (err) {
    throw new Error(err);
  }
});
