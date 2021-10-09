
exports.up = function(knex) {
    return knex.schema.createTable('delivery',(table)=>{
        table.increments()
        table.integer('rest_id')
        table.foreign('rest_id').references('restaurant.id')
        table.integer('account_id')
        table.foreign('account_id').references('account.id')
        table.string('order_status')
        table.text('special_request')
        table.integer('discount_id')
        table.foreign('discount_id').references('discount.id')
        table.timestamps(false,true)

    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('delivery')
  };
  