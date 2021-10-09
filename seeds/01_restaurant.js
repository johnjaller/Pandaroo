
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('restaurant').del()
    .then(function () {
      // Inserts seed entries
      return knex('restaurant').insert([
        {name: 'Happy restaurant',username:'happyRestaurant',password:'123',phone_no:99843206},
        {name: 'middle sushi',username:'middlesushi',password:'middle',phone_no:94823396},
        {name:'Problematic steakhouse',username:'problem',password:'trouble',phone_no:99420579}
      ]);
    });
};
