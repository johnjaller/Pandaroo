const fs=require('fs')
const options = {
    cert: fs.readFileSync("./localhost.crt"),
    key: fs.readFileSync("./localhost.key"),
  };

//import package
const express = require("express");
const cors = require("cors");
const passportFunction=require('./passport')
const expressSession=require('express-session')
const cookieParser=require('cookie-parser')
const app = express();
const https = require("https").Server(options,app);
const io = require("socket.io")(https);
const UserService=require('./service/userService')
const UserRouter=require('./router/userRouter')
//initialisation

const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);
const userService=new UserService(knex)
const userRouter=new UserRouter(userService)
//middleware
app.use(cors());
app.use(cookieParser())
app.use(expressSession({secret:'secret',resave:true,saveUninitialized:true}))
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Set up handlebars
const handlebars = require("express-handlebars");
const { profile } = require('console');
const { nextTick } = require('process');
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Route for users
app.use('/user',userRouter.route())
// app.get("/user", (req, res) => {
//   res.render("userInfo", { layout: "user" });
// });
function userLogIn(req,res,next)
{
    if(req.isAuthenticated())
    {
    console.log(req.cookies);
    console.log(req.session.passport.user, "passport USER");
    console.log(req.user, "USER");
    return next()
    }
    else{
        res.redirect('/login')
    }
}
app.get("/", userLogIn);
app.get("/", (req,res)=>{
    res.render("userHome", { layout: "user" });
});

app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get("/userorder", (req, res) => {
  res.render("userOrder", { layout: "user" });
});

// Route for restaurants
app.get("/bizsignup", (req, res) => {
  res.render("restSignUp", { layout: "restaurantSimple" });
});

app.get("/bizsetupmenu", (req, res) => {
  res.render("restSetUpMenu", { layout: "restaurant" });
});

app.get("/info", (req, res) => {
  res.render("restInfo", { layout: "restaurant" });
});

app.get("/bookings", (req, res) => {
  res.render("restBooking", { layout: "restaurant" });
});

app.get("/orders", (req, res) => {
  res.render("restOrder", { layout: "restaurant" });
});

app.get("/bookingshistory", (req, res) => {
  res.render("restBookingHistory", { layout: "restaurant" });
});

app.get("/ordershistory", (req, res) => {
  res.render("restOrderHistory", { layout: "restaurant" });

});


// Sher: Temporary route set up for testing sign in page
app.get("/login", (req, res) => {
  res.render("user-login");
});

app.get("/loginbiz", (req, res) => {
  res.render("rest-login");
});
app.get('/auth/google',passportFunction.authenticate('google',{scope:['email','profile']}))

app.get('/auth/google/callback',passportFunction.authenticate('google',{successRedirect:'/',failureRedirect:'/login'}))
  
app.get("/logout", (req, res) => {
    req.logout();
    res.render("user-login");
  });
https.listen(8080, () => {
    console.log("application listening to port 8080");
  });

module.exports={app,https}

