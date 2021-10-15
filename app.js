const fs=require('fs')
const options = {
    cert: fs.readFileSync("./localhost.crt"),
    key: fs.readFileSync("./localhost.key"),
  };

//import package
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const passportFunction=require('./passport/passport.js')
const expressSession=require('express-session')
const cookieParser=require('cookie-parser')
const app = express();
const stripePayment=require('./stripe/stripePayment.js')
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
app.get("/", async(req,res)=>{
    if(req.query.q===undefined)
    {
        let restTag=await userService.getRestTag()
        let user= await knex('account').select('district','firstname').where('id',req.user.id)
        console.log(user[0].district)
        let featuredRest=await knex('restaurant').select()
        let locationRecommendation
        if(user[0].district!=undefined)
        {
        locationRecommendation= await knex('restaurant').select().where('district',user[0].district)
        }else{
        locationRecommendation=[]
        }

        console.log(locationRecommendation, 'loaded info')
    res.render("userHome", { layout: "user",userInfo:user,recommendation:locationRecommendation,feature:featuredRest,result:'Featured',tag: restTag});
    }else{
        console.log(req.query.q,"this is a query")
        let query=req.query.q.split(" ").join("|")
        let queryResult= await knex('restaurant').select().join('tag_rest_join','restaurant.id','tag_rest_join.rest_id').join('tag','tag.id','tag_rest_join.tag_id').where(knex.raw( `to_tsvector(concat_ws(' ',name,address,district,description,tag.tag_name)::text) @@ to_tsquery('${query}:*')`))
        console.log(queryResult)
        res.render('userHome',{layout:'user',
        result:'Search result:',
        queryString:req.query.q,
        rest:queryResult
    })
    }
});



app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get('/search/:restID',(req,res)=>{

  // console.log(req, 'REQUEST!!!!<><><><>')

    console.log(req.params.restID, 'rest id how many times?')

    return knex('restaurant').select().where({'id':req.params.restID}).then((data)=>{
        console.log(data)
        return res.render('userOrder',{layout:'user',})
    }).catch((e)=> console.log(e))
})

app.get('/test/:testing', (req, res)=>{
  console.log(req.params.testing)
  res.send('tested')
})

app.post('/search/:id',(req,res)=>{
    return knex('bookmark').insert({account_id:req.user.id,rest_id:req.params.id}).then(()=>{
        res.send('success')
    }).catch((e)=> console.log(e))
})

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
//stripe checkout test route
app.get('/checkout',(req,res)=>{
    res.render('checkout',{layout:'user'})
})

app.post('/checkout',stripePayment);
  app.get('/success',(req,res)=>{
      res.render('paymentSuccess',{layout:'user',})
  })
  app.get('/cancel',(req,res)=>{
    res.render('paymentFailed',{layout:'user',})
})
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

