
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('restaurant').del()
    .then(function () {
      // Inserts seed entries
      return knex('restaurant').insert([
        {name: 'Happy restaurant',username:'happyRestaurant',profile_path:'/menu_gallery/placeholder.png',password:'123',phone_no:99843206},
        {name: 'middle sushi',username:'middlesushi',profile_path:'/menu_gallery/placeholder.png',password:'middle',phone_no:94823396},
        {name:'Problematic steakhouse',username:'problem',profile_path:'/menu_gallery/placeholder.png',password:'trouble',phone_no:99420579}
      ]);
    });
};
