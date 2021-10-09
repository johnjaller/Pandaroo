
exports.up = function(knex) {
  return knex.schema.createTable('discount',(table)=>{
      table.increments()
      table.integer('rest_id')
      table.foreign('rest_id').references('restaurant.id')
      table.string('code')
      table.decimal('discount')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('discount')
};
