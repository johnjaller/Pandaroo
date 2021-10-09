
exports.up = function(knex) {
  return knex.schema.createTable('user',(table)=>{
    table.increments()
    table.string('username')
    table.string('firstname')
    table.string('surname')
    table.string("gmail_id");
    table.string("facebook_id");
    table.string('password')
    table.string('address')
    table.string('district')
    table.integer('phone_no')
    table.timestamps(false,true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user')
};
