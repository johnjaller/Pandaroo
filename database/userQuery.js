const knexConfig = require("../knexfile").development;
const knex = require("knex")(knexConfig);
const user='account'
function getGmailById(gmailID){
    return knex(user).select().where('gmail_id',gmailID)
}
function postGmail(email,gmailID,givenName,familyName)
{
return knex(user).insert({username:email,gmail_id:gmailID,firstname:givenName,surname:familyName}).returning('id')
}
function getidByid(userId)
{
    return knex(user).select().where('id',userId)
}
module.exports={getGmailById,postGmail,getidByid}