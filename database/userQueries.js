const development = require("../knexfile").development;
const knex = require("knex")(development);

function getByFacebookId(facebookId) {
  return knex("account").where("facebook_id", facebookId);
}

function postFacebook(username, facebookId) {
  return knex("account")
    .insert({
      username: username,
      facebook_id: facebookId,
    })
    .returning("id");
}

function getById(id) {
  return knex("account").select("id", "username").where("id", id);
}

module.exports = {
  getByFacebookId: getByFacebookId,
  postFacebook: postFacebook,
  getById: getById,
};
