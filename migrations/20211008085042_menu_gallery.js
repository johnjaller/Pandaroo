
exports.up = function(knex) {
  return knex.schema.createTable('menu_gallery',(table)=>{
      table.increments()
      table.string('photo_path')
      table.integer('rest_id')
      table.foreign('rest_id').references('restaurant.id')
      table.integer('menu_id')
      table.foreign('menu_id').references('menu.id')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('menu_gallery')
  
};
