const development = require("../knexfile").development;
const knex = require("knex")(development);
const user = "account";

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

function getByRestId(restId) {
  return knex("restaurant").select("id", "username").where("id", restId);
}

function getByUsername(userName) {
  return knex("account").select("id", "username").where("username", userName);
}

function getByRestUsername(restName) {
  return knex("restaurant")
    .select("id", "username")
    .where("username", restName);
}

module.exports = {
  getByFacebookId: getByFacebookId,
  postFacebook: postFacebook,
  getById: getById,
  getByRestId: getByRestId,
  getByUsername: getByUsername,
  getByRestUsername: getByRestUsername,
  getGmailById: getGmailById,
  postGmail: postGmail,
};
