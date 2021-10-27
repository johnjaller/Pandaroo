require("dotenv").config();
const knexConfig = require("../knexfile").development;
const knex = require("knex")(knexConfig);
const UserService = require("../service/userService");
const UserRouter = require("../router/userRouter");
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);
async function searchQuery(req, res) {
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
  for (let i = 0; i < queryResult.length; i++) {
    let rating;
    rating = await knex("review")
      .where("rest_id", queryResult[i].id)
      .select("rating");
    if (rating.length != 0) {
      rating =
        Math.round(
          (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
            rating.length) *
            2
        ) / 2;
      console.log(rating);
    } else {
      rating = 0;
    }

    queryResult[i]["rating"] = rating;
  }
  res.render("userHome", {
    layout: "user",
    result: "Search result:",
    queryString: req.query.q,
    rest: queryResult,
  });
}



async function homepageRecomendation (req, res) {
  let restTag = await userService.getRestTag();
  for (let i = 0; i < restTag.length; i++) {
    switch (restTag[i]["tag_name"]) {
      case "hongKongStyle":
        restTag[i]["tag_name"] = "Hong Kong Style";
        break;
      case "chinese":
        restTag[i]["tag_name"] = "Chinese";
        break;
      case "taiwanese":
        restTag[i]["tag_name"] = "Taiwanese";
        break;
      case "japanese":
        restTag[i]["tag_name"] = "Japanese";
        break;
      case "korean":
        restTag[i]["tag_name"] = "Korean";
        break;
      case "western":
        restTag[i]["tag_name"] = "Western";
        break;
      case "petFriendly":
        restTag[i]["tag_name"] = "Pet Friendly";
        break;
      case "liveBroadcast":
        restTag[i]["tag_name"] = "Live Boardcast";
        break;
      default:
        restTag[i]["tag_name"] = "Parking";
    }
  }
  console.log("restTag", restTag);
  let user = await knex("account")
    .select("district", "firstname")
    .where("id", req.user.id);
  console.log(user[0].district);
  let featuredRest = await knex("restaurant").select();
  for (let i = 0; i < featuredRest.length; i++) {
    let rating;
    rating = await knex("review")
      .where("rest_id", featuredRest[i].id)
      .select("rating");
    if (rating.length != 0) {
      rating =
        Math.round(
          (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
            rating.length) *
            2
        ) / 2;
      console.log(rating);
    } else {
      rating = 0;
    }

    featuredRest[i]["rating"] = rating;
  }
  let locationRecommendation;
  if (user[0].district != undefined) {
    locationRecommendation = await knex("restaurant")
      .select()
      .where("district", user[0].district);
    for (let i = 0; i < locationRecommendation.length; i++) {
      let rating;
      rating = await knex("review")
        .where("rest_id", locationRecommendation[i].id)
        .select("rating");
      if (rating.length != 0) {
        rating =
          Math.round(
            (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
              rating.length) *
              2
          ) / 2;
        console.log(rating);
      } else {
        rating = 0;
      }
      locationRecommendation[i]["rating"] = rating;
    }
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
};

module.exports = {
  searchQuery: searchQuery,
  homepageRecommendation: homepageRecomendation,
};
