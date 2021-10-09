
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('delivery').del()
    .then(function () {
      // Inserts seed entries
      return knex('delivery').insert([
        {rest_id: 1, account_id:1,order_status:'processing',special_request:'no tableware needed'},
        {rest_id: 2, account_id:3,order_status:'ready',special_request:'Hang on the door handler'},
        {rest_id: 3, account_id:2,order_status:'delivering',special_request:''},
      ]);
    });
};
