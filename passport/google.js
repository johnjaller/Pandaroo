const GoogleStrategy=require("passport-google-oauth").OAuth2Strategy
const userQueries=require('../database/userQueries.js')
const googleConfig = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "https://localhost:8080/auth/google/callback",
  };
function googleCallback(accessToken,refreshToken,profile,done)
{
    console.log(profile)
 const user={username:profile.emails[0].value}
    userQueries.getGmailById(profile.id).then((queryData)=>{
        if(queryData.length===0)
        {
        return userQueries.postGmail(user.username,profile.id,profile.name.givenName,profile.name.familyName).then((data)=>{
            user.id=data[0]
            console.log(user)
            return done(null,user)
        }).catch((e)=>
        {throw e})
        }
        else{
        user.id=queryData[0].id
        return done(null,user)
        }
    }).catch((e)=>
    {throw e})
}
  const google = new GoogleStrategy(googleConfig, googleCallback);
  module.exports = { google: google };
  