
exports.up = function(knex) {
  return knex.schema.createTable('tag_rest_join',(table)=>{
      table.increments()
      table.integer('rest_id')
      table.foreign('rest_id').references('restaurant.id')
      table.integer('tag_id')
      table.foreign('tag_id').references('tag.id')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tag_rest_join')
  
};
