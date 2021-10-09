
exports.up = function(knex) {
  return knex.schema.createTable('review',(table)=>{
    table.increments()
    table.integer('user_id')
    table.integer('rest_id')
    table.foreign('user_id').references('user.id')
    table.foreign('rest_id').references('restaurant.id')
    table.decimal('rating')
    table.timestamps(false,true)

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('review')
};
