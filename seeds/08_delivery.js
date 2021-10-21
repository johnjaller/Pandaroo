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
          order_status: "Preparing",
          special_request: "no tableware needed",
        },
        {
          rest_id: 1,
          account_id: 2,
          order_status: "Ready",
          special_request: "need additional sauces",
        },
        {
          rest_id: 1,
          account_id: 3,
          order_status: "Delivered",
          special_request: "need two sets of tablewares",
        },
        {
          rest_id: 1,
          account_id: 1,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 1,
          order_status: "Ready",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 2,
          order_status: "Preparing",
          special_request: "Pay cash",
        },
        {
          rest_id: 2,
          account_id: 3,
          order_status: "Delivered",
          special_request: "",
        },
        {
          rest_id: 2,
          account_id: 2,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 1,
          order_status: "Delivered",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 2,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 3,
          order_status: "Cancelled",
          special_request: "",
        },
        {
          rest_id: 3,
          account_id: 3,
          order_status: "Ready",
          special_request: "",
        },
      ]);
    });
};
