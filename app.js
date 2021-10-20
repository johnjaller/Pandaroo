const fs = require("fs");
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

//import package
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require("path")
const app = express();
const stripePayment=require('./stripe/stripePayment.js')

// Set up express session
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user, "USER");
    return next();
  }
  console.log("failed");
  res.redirect("/bizsignup");
};

const https = require("https").Server(options, app);
const io = require("socket.io")(https);
//initialisation

const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);
//middleware


// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const handlebarHelpers = require("./handlebars-helpers");




app.get(
  "/auth/facebook",
  passportFunction.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

app.get(
  "/auth/facebook/callback",
  passportFunction.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

// Set up user service and router
const UserService = require("./service/userService");
const UserRouter = require("./router/userRouter");
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);

// Set up restaurant service and router
const RestService = require("./service/restService");
const RestRouter = require("./router/restRouter");
const restService = new RestService(knex);
const restRouter = new RestRouter(restService);


// Route for users
app.use("/user", userRouter.route());
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
});
app.get('/search',async(req,res)=>{
  console.log(req.query.q,"this is a query")
  let query=req.query.q.split(" ").join("|")
  let queryResult= await knex('restaurant').select().join('tag_rest_join','restaurant.id','tag_rest_join.rest_id').join('tag','tag.id','tag_rest_join.tag_id').where(knex.raw( `to_tsvector(concat_ws(' ',name,address,district,description,tag.tag_name)::text) @@ to_tsquery('${query}:*')`))
  console.log(queryResult)
  res.render('userHome',{layout:'user',
  result:'Search result:',
  queryString:req.query.q,
  rest:queryResult
})
})


app.get("/userbooking", (req, res) => {
  res.render("userBooking", { layout: "user" });
});

app.get('/search/:restID',(req,res)=>{

    console.log(req.params.restID, 'rest id how many times?')

    return knex('restaurant').select().where({'id':req.params.restID}).then((data)=>{
        console.log(data)
        return res.render('userOrder',{layout:'user',restaurant:data})
    }).catch((e)=> console.log(e))
})



app.post('/bookmark/:id',(req,res)=>{
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

app.get("/info", restRouter.router());

app.get("/bookings", restRouter.router());

app.get("/orders", restRouter.router());

app.get("/ordershistory", (req, res) => {
  res.render("restOrderHistory", { layout: "restaurant" });

});
//stripe checkout test route
app.get('/checkout',(req,res)=>{
    res.render('checkout',{layout:'user'})
})

app.post('/checkout',stripePayment);
const endPointSecret='whsec_G2nJNMFVmpCn275FSbScXynzCytZxtJX'

app.post('/webhook', (request, response) => {
  console.log(request.body)
  let webhookResult=request.body
  
  // const payload = request.body;
  // const sig = request.headers['stripe-signature'];
  // let event

  // try {
  //   event = stripe.webhooks.constructEvent(payload, sig, endPointSecret);
  // } catch (err) {
  //   return response.status(400).send(`Webhook Error: ${err.message}`);
  // }
  // console.log(event)
  // if (event.type === 'checkout.session.completed') {
  //   console.log("It is a success payment")
  // }
  response.status(200);
});

  app.get('/success',(req,res)=>{
      res.render('paymentSuccess',{layout:'user',})
  })
  app.get('/cancel',(req,res)=>{
    res.render('paymentFailed',{layout:'user',})
})
app.get("/bookingshistory", restRouter.router());

app.get("/ordershistory", restRouter.router());

// Sher: Temporary route set up for testing sign in page
app.get("/login", (req, res) => {
  res.render("userLogin");
});

app.get("/bizlogin", (req, res) => {
  res.render("restLogin");
});
app.get('/auth/google',passportFunction.authenticate('google',{scope:['email','profile']}))

app.get('/auth/google/callback',passportFunction.authenticate('google',{successRedirect:'/',failureRedirect:'/login'}))
  
app.get("/logout", (req, res) => {
    req.logout();
    res.render("userLogin");
  });
// app.get("/logout", (req, res) => {
//   req.logout();
//   res.render("/login");
// });
app.post('/discount',(req,res)=>{
  console.log(req.body.code)
  let discountCode=req.body.code
  knex('restaurant').select('discount').where('discount_code',discountCode).then((data)=>{
  if(data.length===0)
  {
    console.log("there is no such coupon")
    res.json({percent_off:null})
  }else{
    res.json({discountCode:req.body.code,percent_off:Number(data[0].discount)})
  }
}
  )
})
// Sher: Post route for testing local strategy
app.post(
  "/login",
  passportFunction.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post(
  "/signup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post(
  "/bizlogin",
  passportFunction.authenticate("local-login", {
    successRedirect: "/info",
    failureRedirect: "/bizsignup",
  })
);

// Set up port
https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports={app,https}

