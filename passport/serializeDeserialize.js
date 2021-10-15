const development = require("../knexfile").development;
const knex = require("knex")(development);

const serializeUser = (user, done) => {
  console.log(`Serialize user: ${user}`);
  console.log(user)
  return done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    console.log(`Deserialize ID: ${id}`);
    let users = await knex("account").select("id", "username").where("id", id);
    if (users.length === 0) {
      return done(null, false);
    }
    done(null, users[0]);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
