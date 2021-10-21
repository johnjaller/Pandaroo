const userQueries = require("../database/userQueries");

function serializeUser(user, done) {
  console.log("Serialize:", user);
  return done(null, user);
}

async function deserializeUser(data, done) {
  console.log("desrilaizing user");
  console.log(data);
  let username = data.username;
  console.log(username);
  try {
    if (username.includes("@")) {
      let users = await userQueries.getByUsername(username);
      if (users.length === 0) {
        console.log("User does not exist.");
        return done(null, false);
      }
      return done(null, users[0]);
    } else {
      let rests = await userQueries.getByRestUsername(username);
      if (rests.length === 0) {
        console.log("Restaurant does not exist.");
        return done(null, false);
      }
      return done(null, rests[0]);
    }
  } catch (error) {
    console.log("Fail to deserialize");
    return done(error, false);
  }
}

module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
