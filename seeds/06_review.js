
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('review').del()
    .then(function () {
      // Inserts seed entries
      return knex('review').insert([
        {account_id: 1, rest_id:1,rating:5},
        {account_id:3,rest_id:2,rating:3},
        {account_id:2,rest_id:3,rating:2},
      ]);
    });
};
