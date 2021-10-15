const development = require("../knexfile").development;
const knex = require("knex")(development);
const user='account'
function getGmailById(gmailID){
    return knex(user).select().where('gmail_id',gmailID)
}
function postGmail(email,gmailID,givenName,familyName)
{
return knex(user).insert({username:email,gmail_id:gmailID,firstname:givenName,surname:familyName}).returning('id')
}


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
  getGmailById:getGmailById
  ,postGmail:postGmail
  
};
