
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('menu').del()
    .then(function () {
      // Inserts seed entries
      return knex('menu').insert([
        {item:'iced lemon tea',rest_id:1,price:10,category:'beverage'},
        {item:'iced milk tea',rest_id:1,price:10,category:'beverage'},
        {item:'hot coffee',rest_id:1,price:10,category:'beverage'},
        {item:'vegetarian chicken',rest_id:1,price:55,category:'food'},
        {item:'tofu',rest_id:1,price:55,category:'food'},
        {item:'vegetarian pork',rest_id:1,price:55,category:'food'},
        {item:'sake',rest_id:2,price:10,category:'beverage'},
        {item:'Ramune',rest_id:2,price:10,category:'beverage'},
        {item:'hot coffee',rest_id:2,price:10,category:'beverage'},
        {item:'Salmon sushi',rest_id:2,price:15,category:'food'},
        {item:'tamago sushi',rest_id:2,price:15,category:'food'},
        {item:'sashimi sets',rest_id:2,price:65,category:'food'},
        {item:'iced lemon tea',rest_id:3,price:15,category:'beverage'},
        {item:'coccola',rest_id:3,price:20,category:'beverage'},
        {item:'iced coffee',rest_id:3,price:15,category:'beverage'},
        {item:'Very raw steak',rest_id:3,price:85,category:'food'},
        {item:'frozen chicken breast',rest_id:3,price:75,category:'food'},
        {item:'unchewable garlic bread',rest_id:3,price:75,category:'food'},
      ]);
    });
};
