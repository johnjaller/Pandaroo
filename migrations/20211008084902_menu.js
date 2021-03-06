exports.up = function (knex) {
  return knex.schema.createTable("menu", (table) => {
    table.increments();
    table.string("item");
    table.integer("rest_id");
    table.foreign("rest_id").references("restaurant.id");
    table.decimal("price");
    table.string("photo_path");
    table.string("category");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("menu");
};
