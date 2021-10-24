
exports.up = function(knex) {
    return knex.schema.createTable('booking_detail',(table)=>{
        table.increments()
        table.integer('booking_id')
        table.foreign('booking_id').references('booking.id')
        table.integer('menu_id')
        table.foreign('menu_id').references('menu.id')
        table.integer('quantity')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('booking_detail')
  };