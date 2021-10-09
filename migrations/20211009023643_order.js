
exports.up = function(knex) {
    return knex.schema.createTable('order',(table)=>{
        table.increments()
        table.integer('rest_id')
        table.foreign('rest_id').references('restaurant.id')
        table.integer('user_id')
        table.foreign('user_id').references('user.id')
        table.string('order_status')
        table.text('special_request')
        table.integer('discount_id')
        table.foreign('discount_id').references('discount.id')
        table.timestamps(false,true)

    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('order')
  };
  