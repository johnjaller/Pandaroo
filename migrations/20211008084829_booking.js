exports.up = function (knex) {
  return knex.schema.createTable("booking", (table) => {
    table.increments();
    table.integer("rest_id");
    table.foreign("rest_id").references("restaurant.id");
    table.integer("account_id");
    table.foreign("account_id").references("account.id");
    table.time("booking_time", { useTz: true });
    table.date("booking_date");
    table.integer("no_of_ppl");
    table.string("booking_status");
    table.text("special_request");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("booking");
};
