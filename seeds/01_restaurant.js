
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('restaurant').del()
    .then(function () {
      // Inserts seed entries
      return knex('restaurant').insert([
        {name: 'Happy restaurant',username:'happyRestaurant',profile_path:'/menu_gallery/placeholder.png',password:'123',phone_no:99843206,opening_time:'11:00',closing_time:'22:00',description:'A vegetarian restaurant',seats:40,delivery:true},
        {name: 'middle sushi',username:'middlesushi',profile_path:'/menu_gallery/placeholder.png',password:'middle',phone_no:94823396,opening_time:'12:00',closing_time:'22:00',description:'A middle-class japanese sushi restaurant',seats:50,delivery:true},
        {name:'Problematic steakhouse',username:'problem',profile_path:'/menu_gallery/placeholder.png',password:'trouble',phone_no:99420579,opening_time:'13:00',closing_time:'22:00',description:'A very problematic steak house',seats:40,delivery:true}
      ]);
    });
};
