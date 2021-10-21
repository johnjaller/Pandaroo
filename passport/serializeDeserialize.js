const userQueries = require("../database/userQueries");

function serializeUser(user, done) {
  console.log("Serialize:", user);
  return done(null, user);
}

function deserializeUser(id, done) {
  console.log('desrilaizing user')
  userQueries
    .getById(id.id)
    .then((users) => {
      if (users.length === 0) {
        return done(null, false);
      }
      done(null, users[0]);
    })
    .catch((error) => {
      console.log("Fail to deserialize");
      done(error, false);
    });
}

module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
