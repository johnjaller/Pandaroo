
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('discount').del()
    .then(function () {
      // Inserts seed entries
      return knex('discount').insert([
        {rest_id:1, code:'BIBEK',discount:0.6},
        {rest_id:2, code:'BIBEK',discount:0.6},
        {rest_id:3, code:'BIBEK',discount:0.6},
        {rest_id:1, code:'NEW',discount:0.5},
        {rest_id:2, code:'NEW',discount:0.9},
        {rest_id:3, code:'NEW',discount:0.8},
      ]);
    });
};
