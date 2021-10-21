exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("delivery")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("delivery").insert([
        {
          rest_id: 1,
          account_id: 1,
          total_amount: 100.0,
          order_status: "",
          special_request: "no tableware needed",
        },
        {
          rest_id: 1,
          account_id: 2,
          total_amount: 180.0,
          order_status: "Ready",
          special_request: "need additional sauces",
        },
        {
          rest_id: 1,
          account_id: 3,
          total_amount: 150.0,
          order_status: "Preparing",
          special_request: "need two sets of tablewares",
        },
        {
          rest_id: 1,
          account_id: 1,
          total_amount: 160.0,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 1,
          total_amount: 80.0,
          order_status: "Ready",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 2,
          total_amount: 105.0,
          order_status: "Preparing",
          special_request: "Pay cash",
        },
        {
          rest_id: 2,
          account_id: 3,
          total_amount: 140.0,
          order_status: "Delivered",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 2,
          total_amount: 90.0,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 1,
          total_amount: 200.0,
          order_status: "Delivered",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 2,
          total_amount: 80.0,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 3,
          total_amount: 175.0,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 3,
          total_amount: 135.0,
          order_status: "Ready",
          special_request: "",
        },
      ]);
    });
};
