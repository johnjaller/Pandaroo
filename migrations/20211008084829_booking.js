
exports.up = function(knex) {
    return knex.schema.createTable('booking',(table)=>{
        table.increments()
        table.integer('rest_id')
        table.foreign('rest_id').references('restaurant.id')
        table.integer('user_id')
        table.foreign('user_id').references('user.id')
        table.string('booking_status')
        table.text('special_request')
        table.timestamps(false,true)
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('booking')
};
