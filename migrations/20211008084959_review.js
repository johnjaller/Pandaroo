
exports.up = function(knex) {
  return knex.schema.createTable('review',(table)=>{
    table.increments()
    table.integer('account_id')
    table.integer('rest_id')
    table.foreign('account_id').references('account.id')
    table.foreign('rest_id').references('restaurant.id')
    table.decimal('rating')
    table.timestamps(false,true)

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('review')
};
