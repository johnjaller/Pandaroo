
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('booking').del()
    .then(function () {
      // Inserts seed entries
      return knex('booking').insert([
        {rest_id:1,account_id:1,booking_status:'ready',special_request:'My friend birthday',booking_date:'2/11/2021',booking_time:'1900',no_of_ppl:4},
        {rest_id:2,account_id:3,booking_status:'pending',special_request:'',booking_date:'2/11/2021',booking_time:'2000',no_of_ppl:3},
        {rest_id:3,account_id:2,booking_status:'denied',special_request:'',booking_date:'2/11/2021',booking_time:'2030',no_of_ppl:2}
      ]);
    });
};
