
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('order').del()
    .then(function () {
      // Inserts seed entries
      return knex('order').insert([
        {rest_id: 1, user_id:1,order_status:'processing',special_request:'no tableware needed'},
        {rest_id: 2, user_id:3,order_status:'ready',special_request:'Hang on the door handler'},
        {rest_id: 3, user_id:2,order_status:'delivering',special_request:''},
      ]);
    });
};
