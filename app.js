//import package
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const stripePayment = require("./stripe/stripePayment.js");

// Set up HTTPS
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};
const https = require("https").Server(options, app);

// Set up socket.io
const io = require("socket.io")(https);

// Set up express session
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Set up public files and middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Set up knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Set up handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const handlebarHelpers = require("./handlebars-helpers");

// Set up multer and S3 bucket
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, downloadFile } = require("./s3Bucket/s3");

// // Set up user service and router
// const UserService = require("./service/userService");
// const UserRouter = require("./router/userRouter");
// const userService = new UserService(knex);
// const userRouter = new UserRouter(userService);

// // Set up restaurant service and router
// const RestService = require("./service/restService");
// const RestRouter = require("./router/restRouter");
// const restService = new RestService(knex);
// const restRouter = new RestRouter(restService);

// Set up passport authentication
const passportFunction = require("./passport/passport");
app.use(passportFunction.initialize());
app.use(passportFunction.session());

// Set up middleware to check login status
function restLogIn(req, res, next) {
  console.log("REST: ", req.user);
  console.log("SESSION PASSPORT USER: ", req.session.passport.user);
  console.log("REST ID: ", req.user.id);
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("app.js restLogIn failed");
    res.redirect("/bizlogin");
  }
}

function userLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.cookies);
    console.log(req.session.passport.user, "passport USER");
    console.log(req.user, "USER");
    return next();
  } else {
    res.redirect("/login");
  }
}

// Set up facebook authentication
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
const stripe=require('stripe')(process.env.stripe_secret)
const path = require("path");
const restService = new RestService(knex);
const restRouter = new RestRouter(restService);

// Set up google authentication
app.get(
  "/auth/google",
  passportFunction.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passportFunction.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Route for users
app.use("/user", userRouter.route());

app.get("/", userLogIn);

app.get("/", async (req, res) => {
  let restTag = await userService.getRestTag();
  let user = await knex("account")
    .select("district", "firstname")
    .where("id", req.user.id);
  console.log(user[0].district);
  let featuredRest = await knex("restaurant").select();
  let locationRecommendation;
  if (user[0].district != undefined) {
    locationRecommendation = await knex("restaurant")
      .select()
      .where("district", user[0].district);
  } else {
    locationRecommendation = [];
  }

  console.log(locationRecommendation, "loaded info");
  res.render("userHome", {
    layout: "user",
    userInfo: user,
    recommendation: locationRecommendation,
    feature: featuredRest,
    result: "Featured",
    tag: restTag,
  });
});

app.get("/search", async (req, res) => {
  console.log(req.query.q, "this is a query");
  let query = req.query.q.split(" ").join("|");
  let queryResult = await knex("restaurant")
    .select()
    .join("tag_rest_join", "restaurant.id", "tag_rest_join.rest_id")
    .join("tag", "tag.id", "tag_rest_join.tag_id")
    .where(
      knex.raw(
        `to_tsvector(concat_ws(' ',name,address,district,description,tag.tag_name)::text) @@ to_tsquery('${query}:*')`
      )
    );
  console.log(queryResult);
  res.render("userHome", {
    layout: "user",
    result: "Search result:",
    queryString: req.query.q,
    rest: queryResult,
  });
});

app.get("/booking/:restId", async(req, res) => {
  let restDetail=await  knex('restaurant').select().where('restaurant.id',req.params.restId)
    let bookmark=await knex('bookmark').select().where({account_id:req.user.id,rest_id:req.params.restId})
    let bookmarkClass
  let dish=await knex('restaurant').select().join('menu','restaurant.id','menu.rest_id').where({'restaurant.id':req.params.restId,'category':"soup&salad"})
    console.log(dish)
    console.log(bookmark)
    if(bookmark.length!=0)
    {
  bookmarkClass='fas'
    }else{
      bookmarkClass='far'
    }
    let dishItems=[]
    dish.forEach(i => {
      dishItems.push({id:i.id,name:i.item,price:i.price,photoPath:i.photo_path})
    })
    return res.render('userBooking',{layout:'user',restaurant:restDetail[0],dish:dishItems,bookmark:bookmarkClass
})
});

app.get('/booking/:restId/:category',async(req,res)=>{
  let restDetail=await  knex('restaurant').select().where('restaurant.id',req.params.restId)
  let dish=await knex('restaurant').select().join('menu','restaurant.id','menu.rest_id').where({'restaurant.id':req.params.restId,'category':req.params.category})
  let bookmark=await knex('bookmark').select().where({account_id:req.user.id,rest_id:req.params.restId})
  let bookmarkClass
  if(bookmark.length!=0)
  {
bookmarkClass='fas'
  }else{
    bookmarkClass='far'
  }
    console.log(dish)
    let dishItems=[]
    for(let i=0;i<dish.length;i++)
    {
      dishItems.push({id:dish[i].id,name:dish[i].item,price:dish[i].price,photoPath:dish[i].photo_path})

    }
  
    console.log(dishItems)
    return res.render('userBooking',{layout:'user',restaurant:restDetail[0],dish:dishItems,bookmark:bookmarkClass
})
})

app.get('/order/:restId',async(req,res)=>{
  let deliverySwitch=await knex('restaurant').select('delivery').where('id',req.params.restId)
  console.log(deliverySwitch)
  if(deliverySwitch[0].delivery===true)
  {
    console.log(req.params.restId, 'rest id how many times?')
 
    let restDetail=await  knex('restaurant').select().where('restaurant.id',req.params.restId)
    let bookmark=await knex('bookmark').select().where({account_id:req.user.id,rest_id:req.params.restId})
    let bookmarkClass
  let dish=await knex('restaurant').select().join('menu','restaurant.id','menu.rest_id').where({'restaurant.id':req.params.restId,'category':"soup&salad"})
    console.log(dish)
    console.log(bookmark)
    if(bookmark.length!=0)
    {
  bookmarkClass='fas'
    }else{
      bookmarkClass='far'
    }
    let dishItems=[]
    dish.forEach(i => {
      dishItems.push({id:i.id,name:i.item,price:i.price,photoPath:i.photo_path})
    })
    return res.render('userOrder',{layout:'user',restaurant:restDetail[0],dish:dishItems,bookmark:bookmarkClass
})
}else{
  res.redirect(`/booking/${req.params.restId}`)
}
})

app.delete('/userOrder/:orderId',(req,res)=>{
  return knex('order_detail').delete().where('delivery_id',req.params.orderId).then(()=>{
    knex('delivery').delete().where('delivery.id',req.params.orderId)
  })
})
app.delete('/userBooking/:orderId',(req,res)=>{
  return knex('order_detail').delete().where('delivery_id',req.params.orderId).then(()=>{
    knex('delivery').delete().where('delivery.id',req.params.orderId)
  })
})
app.get('/order/:restId/:category',async(req,res)=>{
  let restDetail=await  knex('restaurant').select().where('restaurant.id',req.params.restId)
  let dish=await knex('restaurant').select().join('menu','restaurant.id','menu.rest_id').where({'restaurant.id':req.params.restId,'category':req.params.category})
  let bookmark=await knex('bookmark').select().where({account_id:req.user.id,rest_id:req.params.restId})
  let bookmarkClass
  if(bookmark.length!=0)
  {
bookmarkClass='fas'
  }else{
    bookmarkClass='far'
  }
    console.log(dish)
    let dishItems=[]
    for(let i=0;i<dish.length;i++)
    {
      dishItems.push({id:dish[i].id,name:dish[i].item,price:dish[i].price,photoPath:dish[i].photo_path})

    }
  
    console.log(dishItems)
    return res.render('userOrder',{layout:'user',restaurant:restDetail[0],dish:dishItems,bookmark:bookmarkClass
})
})



app.post("/bookmark/:id", (req, res) => {
  return knex("bookmark")
    .insert({ account_id: req.user.id, rest_id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((e) => console.log(e));
});

app.delete('/bookmark/:id',(req,res)=>{
  return knex('bookmark').delete().where({account_id:req.user.id,rest_id:req.params.id}).then(()=>{
      res.send('success')
  }).catch((e)=> console.log(e))
})

app.get("/userorder", (req, res) => {
  res.render("userOrder", { layout: "user" });
});

app.get("/setup", userLogIn, (req, res) => {
  res.render("userSetUp", { layout: "user" });
});

// Route for restaurants
app.use("/biz", restLogIn, restRouter.router());

// app.get("/bizinit", restLogIn, (req, res) => {
//   console.log("First login from a restaurant user");
//   res.render("restSetUp", { layout: "restaurant" });
// });

// Upload restaurant menu pic
app.post("/bizaddmenu", upload.single("uploadedPhoto"), async (req, res) => {
  console.log("Receiving rest set menu req..");
  try {
    console.log("restRouter req.file: ", req.file);
    const file = req.file;
    let result = await uploadFile(file);
    console.log(result);

    await knex("menu")
      .insert({
        item: req.body.restMenuItem,
        rest_id: req.user.id,
        price: req.body.restMenuPrice,
        category: req.body.restMenuCategory,
        photo_path: result.Key,
      })
      .then(() => {
        console.log("Inserting path done");
      });

    // Unlink imagefile at /uploads
    await unlinkFile(file.path);
    console.log("Update menu done");
    res.redirect("/biz/bizsetupmenu");
  } catch (err) {
    throw new Error(err);
  }
});

// Upload restaurant profile pic
app.post("/bizsetuppropic", upload.single("uploadedFile"), async (req, res) => {
  try {
    console.log("app.js req.file: ", req.file);
    const file = req.file;
    let result = await uploadFile(file);
    console.log(result);

    await knex("restaurant")
      .update({
        profile_path: result.Key,
      })
      .where("id", req.user.id)
      .then(() => {
        console.log("Inserting path done");
      });
    await unlinkFile(file.path);
    res.redirect("/biz/bizinit");
  } catch (err) {
    throw new Error(err);
  }
});

// Route for loading images from S3
app.get("/image/:key", (req, res) => {
  const key = req.params.key;
  const readStream = downloadFile(key);
  readStream.pipe(res);
});
//stripe checkout

app.post('/checkout',stripePayment);
const endPointSecret='whsec_G2nJNMFVmpCn275FSbScXynzCytZxtJX'

app.post('/webhook', async(request, response) => {
  console.log(request.body)
  let event=request.body
  if(event.type==='checkout.session.completed')
  {
    console.log('it is a successful payment')
    console.log(event.data.object.metadata)
    let specialRequest=event.data.object.metadata.specialRequest
    let restId=event.data.object.metadata.rest_id
    let userId=event.data.object.metadata.user_id;
    let sessionId=event.data.object.id
    let totalAmount=event.data.object.amount_total/100
    let products=[]
    stripe.checkout.sessions.listLineItems(
      sessionId,
      { limit: 10 },
      async function(err, lineItems) {
   console.log(lineItems)
   for(let i=0;i<lineItems.data.length;i++)
   {
     let menuId=await knex('menu').select('id').where('item',lineItems.data[i].description)
     console.log(menuId)
     products.push({quantity:lineItems.data[i].quantity,menu_id:menuId[i].id})

   }
  
   console.log(products)
   knex('delivery').insert({rest_id:restId,account_id:userId,order_status:'Preparing',special_request:specialRequest,total_amount:totalAmount}).returning('id').then(async(deliveryId)=>{
     console.log(deliveryId)
     for(let i=0;i<products.length;i++)
     {
      await knex('order_detail').insert({delivery_id:deliveryId[0],menu_id:products[i].menu_id,quantity:products[i].quantity})
     }
   })
   
  
      
    
    //return knex('order_detail').insert({delivery_id:deliveryId,menu_id:,quantity:}))
  
  
  response.status(200);
})
  }
});

  app.get('/success/:restId',(req,res)=>{
      res.render('paymentSuccess',{layout:'user',})
  })
  app.get('/cancel',(req,res)=>{
    res.render('paymentFailed',{layout:'user',})
})
app.get("/bookingshistory", restRouter.router());

app.post("/checkout", stripePayment);
app.get("/success", (req, res) => {
  res.render("paymentSuccess", { layout: "user" });
});
app.get("/cancel", (req, res) => {
  res.render("paymentFailed", { layout: "user" });
});

app.post("/discount", (req, res) => {
  console.log(req.body.code);
  let discountCode = req.body.code;
  knex("restaurant")
    .select("discount")
    .where("code", discountCode)
    .then((data) => {
      if (data.length === 0) {
        console.log("there is no such coupon");
        res.json({ percent_off: null });
      } else {
        res.json({
          discountCode: req.body.code,
          percent_off: Number(data[0].discount),
        });
      }
    });
});

// Route for local login & signup
app.get("/login", (req, res) => {
  res.render("userLogin");
});

app.get("/bizlogin", (req, res) => {
  res.render("restLogin");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.render("userLogin");
  });

app.post('/discount',(req,res)=>{
  console.log(req.body.code)
  let discountCode=req.body.code
  knex('restaurant').select('discount').where('code',discountCode).then((data)=>{
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

app.get('/tag/:tagid',async (req,res)=>{
  let tagName=await knex('tag').select('tag_name').where('id',req.params.tagid)
  return  knex('restaurant').select('restaurant.id','restaurant.name','restaurant.address','restaurant.district','restaurant.profile_path','restaurant.phone_no','restaurant.seats').join('tag_rest_join','restaurant.id','tag_rest_join.rest_id').join('tag','tag_rest_join.tag_id','tag.id').where('tag.id',req.params.tagid).then((data)=>{
    console.log(data)
    res.render('userHome',{layout:'user',rest:data,result:'search result: '+tagName[0].tag_name})
  })
})
// Sher: Post route for testing local strategy
app.post(
  "/login",
  passportFunction.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Submit user signup form
app.post(
  "/signup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/setup",
    failureRedirect: "/login",
  })
);

// Submit rest login form
app.post(
  "/bizlogin",
  passportFunction.authenticate("local-login", {
    successRedirect: "/biz/info",
    failureRedirect: "/bizlogin",
  })
);

// Submit rest signup form
app.post(
  "/bizsignup",
  passportFunction.authenticate("local-signup", {
    successRedirect: "/biz/bizinit",
    failureRedirect: "/bizlogin",
  })
);

// Submit user info setup form
app.put("/setup", userLogIn, async (req, res) => {
  console.log("app.js 281 ID: ", req.user.id);
  knex("account")
    .where("id", req.user.id)
    .update({
      firstname: req.body.fname,
      surname: req.body.lname,
      address: req.body.address,
      district: req.body.district,
      phone_no: req.body.phone,
    })
    .catch((e) => console.log(e));
  res.send("OKAY");
});

// Set up port
https.listen(8080, () => {
  console.log("application listening to port 8080");
});

module.exports = { app, https };
