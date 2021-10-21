exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("booking")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("booking").insert([
        {
          rest_id: 1,
          account_id: 1,
          booking_status: "",
          special_request: "My friend birthday",
          booking_date: "11/2/2021",
          booking_time: "19:00",
          no_of_ppl: 4,
        },
        {
          rest_id: 1,
          account_id: 2,
          booking_status: "",
          special_request: "Window seat",
          booking_date: "11/6/2021",
          booking_time: "18:00",
          no_of_ppl: 5,
        },
        {
          rest_id: 1,
          account_id: 3,
          booking_status: "",
          special_request: "Need a private room",
          booking_date: "11/18/2021",
          booking_time: "20:00",
          no_of_ppl: 2,
        },
        {
          rest_id: 2,
          account_id: 1,
          booking_status: "Confirmed",
          special_request: "Wedding anniversary",
          booking_date: "12/25/2021",
          booking_time: "20:00",
          no_of_ppl: 3,
        },
        {
          rest_id: 2,
          account_id: 2,
          booking_status: "Completed",
          special_request: "",
          booking_date: "12/6/2021",
          booking_time: "20:00",
          no_of_ppl: 2,
        },
        {
          rest_id: 2,
          account_id: 3,
          booking_status: "Cancelled",
          special_request: "",
          booking_date: "12/6/2021",
          booking_time: "20:00",
          no_of_ppl: 2,
        },
        {
          rest_id: 3,
          account_id: 1,
          booking_status: "Completed",
          special_request: "",
          booking_date: "10/29/2021",
          booking_time: "20:30",
          no_of_ppl: 2,
        },
        {
          rest_id: 3,
          account_id: 2,
          booking_status: "Cancelled",
          special_request: "",
          booking_date: "12/11/2021",
          booking_time: "21:30",
          no_of_ppl: 6,
        },
      ]);
    });
};
