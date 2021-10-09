
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('order_detail').del()
    .then(function () {
      // Inserts seed entries
      return knex('order_detail').insert([
        {order_id: 1, menu_id:4,quantity:1},
        {order_id: 1, menu_id:3,quantity:1},
        {order_id: 2, menu_id:10,quantity:2},
        {order_id: 2, menu_id:11,quantity:2},
        {order_id: 2, menu_id:8,quantity:1},
        {order_id: 3, menu_id:13,quantity:1},
        {order_id: 3, menu_id:16,quantity:1},
      ]);
    });
};
