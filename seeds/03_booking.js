
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('booking').del()
    .then(function () {
      // Inserts seed entries
      return knex('booking').insert([
        {rest_id:1,account_id:1,booking_status:'ready',special_request:'My friend birthday'},
        {rest_id:2,account_id:3,booking_status:'pending',special_request:''},
        {rest_id:3,account_id:2,booking_status:'denied',special_request:''}
      ]);
    });
};