const userQueries=require('../database/userQueries.js')
function serializeUser(user, done) {
    console.log(
      "Serialize: Passport generates token, puts it in cookie and sends to browser:",
      user
    );
  
    return done(null, user);
  }

  function deserializeUser(user, done) {
    console.log(user, "<<< from serialise ");
    console.log(
      "Deserialize: server will take token from your browser, and run this function to check if user exists"
    );
    userQueries
      .getidByid(user.id)
      .then((users) => {
        if (users.length === 0) {
          return done(null, false);
        }
        done(null, users[0]);
      })
      .catch((err) => {
        console.log("DESERIALSE FAIL");
        done(err, false);
      });
  }
  module.exports = {
    serializeUser: serializeUser,
    deserializeUser: deserializeUser,
  };