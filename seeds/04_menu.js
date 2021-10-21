exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("menu")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("menu").insert([
        {
          item: "Pear and blue cheese salad",
          rest_id: 1,
          price: 60,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Classic wedge salad",
          rest_id: 1,
          price: 50,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Avocado cucumber salad",
          rest_id: 1,
          price: 30,
          category: "soup&salad",
          photo_path: "/menu_gallery/placeholder.png",
        },
        {
          item: "Mushroom soup",
          rest_id: 1,
          price: 40,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Courgette fries with spicy chilli mayonnasie",
          rest_id: 1,
          price: 55,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Greek courgette and feta frittata",
          rest_id: 1,
          price: 45,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Vegetarian chicken",
          rest_id: 1,
          price: 110,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Vegetarian wellington",
          rest_id: 1,
          price: 80,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Mushroom buckwheat risotto",
          rest_id: 1,
          price: 95,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Sticky toffee pear pudding",
          rest_id: 1,
          price: 55,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "orange & rhubarb amaretti pots",
          rest_id: 1,
          price: 50,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Lemon cheesecake",
          rest_id: 1,
          price: 50,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Iced tea",
          rest_id: 1,
          price: 30,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Orange juice",
          rest_id: 1,
          price: 30,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Apple juice",
          rest_id: 1,
          price: 30,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "nuts",
          rest_id: 1,
          price: 5,
          category: "others",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Salad with wafu dressing",
          rest_id: 2,
          price: 20,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Japanese potato salad",
          rest_id: 2,
          price: 30,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Japanese kani salad",
          rest_id: 2,
          price: 40,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Chicken wings",
          rest_id: 2,
          price: 30,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Vegetable tempura",
          rest_id: 2,
          price: 40,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Gyoza",
          rest_id: 2,
          price: 20,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Salmon sushi",
          rest_id: 2,
          price: 15,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Sashimi sets",
          rest_id: 2,
          price: 65,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Tamago sushi",
          rest_id: 2,
          price: 15,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Lemon pie",
          rest_id: 2,
          price: 60,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Wagashi",
          rest_id: 2,
          price: 50,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Crepes",
          rest_id: 2,
          price: 50,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Iced coffee",
          rest_id: 2,
          price: 20,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Green tea",
          rest_id: 2,
          price: 18,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Sake",
          rest_id: 2,
          price: 40,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Creamy chicken mushroom soup",
          rest_id: 3,
          price: 20,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Taco soup",
          rest_id: 3,
          price: 30,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Pumpkin",
          rest_id: 3,
          price: 25,
          category: "soup&salad",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Frozen chicken breast",
          rest_id: 3,
          price: 75,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Unchewable garlic bread",
          rest_id: 3,
          price: 75,
          category: "starter",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Steak",
          rest_id: 3,
          price: 85,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Roasted pork",
          rest_id: 3,
          price: 75,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Fried fish",
          rest_id: 3,
          price: 65,
          category: "main",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Ginger pudding",
          rest_id: 3,
          price: 30,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Apple crumbie",
          rest_id: 3,
          price: 30,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Mango cheesecake",
          rest_id: 3,
          price: 30,
          category: "desserts",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Iced lemon tea",
          rest_id: 3,
          price: 15,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Coca cola",
          rest_id: 3,
          price: 20,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
        {
          item: "Iced coffee",
          rest_id: 3,
          price: 15,
          category: "drinks",
          photo_path: "0fd0befd216541464efdceb382d4442d",
        },
      ]);
    });
};
