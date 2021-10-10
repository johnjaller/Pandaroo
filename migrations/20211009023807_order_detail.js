
exports.up = function(knex) {
    return knex.schema.createTable('order_detail',(table)=>{
        table.increments()
        table.integer('delivery_id')
        table.foreign('delivery_id').references('delivery.id')
        table.integer('menu_id')
        table.foreign('menu_id').references('menu.id')
        table.integer('quantity')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('order_detail')
  };