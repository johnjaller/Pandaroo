
exports.up = function(knex) {
  return knex.schema.createTable('restaurant',(table)=>{
      table.increments()
      table.string('name')
      table.string('username')
      table.string('password')
      table.string('profile_path')
      table.string('address')
      table.string('district')
      table.integer('phone_no')
      table.time('opening_time')
      table.time('closing_time')
      table.integer('seats')
      table.text('description')
      table.boolean('delivery')
      table.string('code').unique()
      table.decimal('discount')
      table.timestamps(false,true)
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('restaurant')
  
};
