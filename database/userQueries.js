const development = require("../knexfile").development;
const knex = require("knex")(development);
const user = "account";

// Set up gmail login
function getGmailById(gmailID) {
  return knex(user).select().where("gmail_id", gmailID);
}

function postGmail(email, gmailID, givenName, familyName) {
  return knex(user)
    .insert({
      username: email,
      gmail_id: gmailID,
      firstname: givenName,
      surname: familyName,
    })
    .returning("id");
}

// Set up facebook login
function getByFacebookId(facebookId) {
  return knex("account").where("facebook_id", facebookId);
}

function postFacebook(username, facebookId, givenName, familyName) {
  return knex("account")
    .insert({
      username: username,
      facebook_id: facebookId,
      firstname: givenName,
      surname: familyName,
    })
    .returning("id");
}

function getById(userId) {
  return knex("account").select("id", "username").where("id", userId);
}

module.exports = {
  getByFacebookId: getByFacebookId,
  postFacebook: postFacebook,
  getGmailById: getGmailById,
  postGmail: postGmail,
  getById: getById,
};
